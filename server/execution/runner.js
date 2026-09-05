/**
 * runner.js
 * ---------
 * Wrapper around process execution for compiling and running the
 * generated per-language harness programs.
 *
 * No Docker here (this app deploys to Render, which doesn't expose a
 * Docker socket to native-runtime services — see README "Deployment").
 * Every compile/run step shells out directly via child_process, hardened
 * with what's available without a container:
 *
 *   - a wall-clock timeout (SIGKILL on expiry) — always applied
 *   - a 1MB output cap per process — always applied
 *   - on Linux/macOS, the child additionally runs under a `ulimit`-capped
 *     shell: capped CPU time, capped process/thread count (fork-bomb
 *     guard), and a capped virtual-memory ceiling generous enough for the
 *     JVM to start (see LIMITS below) but not unlimited.
 *
 * This is defense-in-depth, not a real sandbox: there's still no network
 * isolation, no filesystem jail, and no non-root user separation the way
 * a locked-down container would give you. It's the same tradeoff called
 * out in the project README — fine for a personal/portfolio deployment
 * with a handful of trusted users, not a substitute for a real sandbox
 * (gVisor, Firecracker, a dedicated judge service like Piston/Judge0, or
 * yes, Docker on a host you control) before opening this up to the public
 * internet at scale.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

const MAX_OUTPUT_BYTES = 1024 * 1024; // 1MB cap per process

// ulimit values for the hardened shell wrapper. Deliberately generous on
// memory: the JVM reserves a lot of virtual address space just to start
// (it failed to launch at all under a 2GB cap in testing — "Could not
// allocate compressed class space" — well before touching heap/thread
// memory), and a too-tight -v ulimit makes `java`/`javac` fail to launch
// entirely rather than fail the *submission* — which would look like a
// platform bug, not a bad solution. 4GB was verified (empirically, not
// just estimated) to let a stock OpenJDK 21 javac/java start reliably;
// 3GB was the measured minimum, so this keeps headroom. -u and -f exist
// mainly to blunt fork bombs and runaway disk writes, not to bound
// "normal" usage.
const ULIMIT_VIRTUAL_MEM_KB = 4 * 1024 * 1024; // 4GB virtual memory
const ULIMIT_MAX_PROCS = 64; // max processes/threads for this user session
const ULIMIT_MAX_FILE_SIZE_BLOCKS = 20000; // ~10MB, in 512-byte blocks
const HARDENING_SUPPORTED = os.platform() !== 'win32';

/**
 * Runs `cmd args...`, with `input` written to stdin, killing it after
 * timeoutMs. Never rejects — always resolves with a result object so
 * callers can distinguish compile/runtime/timeout failures cleanly.
 */
function runProcess(cmd, args, { input = '', timeoutMs = 5000, cwd } = {}) {
  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    let timedOut = false;
    let truncated = false;

    let child;
    try {
      if (HARDENING_SUPPORTED) {
        // Pass cmd/args as bash's $0/$@ (not string-interpolated into the
        // script) so nothing about the submitted code's file paths or
        // arguments can break out of the ulimit prelude.
        const cpuSeconds = Math.max(1, Math.ceil(timeoutMs / 1000) + 1);
        const prelude = [
          `ulimit -v ${ULIMIT_VIRTUAL_MEM_KB} 2>/dev/null || true`,
          `ulimit -u ${ULIMIT_MAX_PROCS} 2>/dev/null || true`,
          `ulimit -f ${ULIMIT_MAX_FILE_SIZE_BLOCKS} 2>/dev/null || true`,
          `ulimit -t ${cpuSeconds} 2>/dev/null || true`,
          'exec "$0" "$@"',
        ].join('; ');
        child = spawn('bash', ['-c', prelude, cmd, ...args], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
      } else {
        child = spawn(cmd, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
      }
    } catch (err) {
      resolve({ code: -1, stdout: '', stderr: String(err && err.message), timedOut: false });
      return;
    }

    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill('SIGKILL'); } catch (_) { /* already dead */ }
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      if (stdout.length < MAX_OUTPUT_BYTES) stdout += chunk.toString('utf8');
      else truncated = true;
    });
    child.stderr.on('data', (chunk) => {
      if (stderr.length < MAX_OUTPUT_BYTES) stderr += chunk.toString('utf8');
    });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: stderr || String(err && err.message), timedOut });
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, truncated });
    });

    try {
      child.stdin.write(input);
      child.stdin.end();
    } catch (_) {
      // process may have already exited (e.g. bad exec) — 'close' will still fire
    }
  });
}

function makeTempDir() {
  const dir = path.join(os.tmpdir(), `judge-${crypto.randomBytes(8).toString('hex')}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (_) {
    // best-effort cleanup
  }
}

module.exports = { runProcess, makeTempDir, cleanupDir, MAX_OUTPUT_BYTES, HARDENING_SUPPORTED };
