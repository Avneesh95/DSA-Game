const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { runProcess } = require('./runner');
const { ensureCompilers } = require('../scripts/ensure-compilers');

const VENDOR_JSON_HPP = path.join(__dirname, 'vendor', 'json.hpp');
const COMPILE_TIMEOUT_MS = 25000;

const isWin = os.platform() === 'win32';
const exeSuffix = isWin ? '.exe' : '';
const BUNDLED_JDK_DIR = path.join(__dirname, '..', '.jdk');
const BUNDLED_COMPILERS_DIR = path.join(__dirname, '..', '.compilers');

const BUNDLED_GPP = path.join(BUNDLED_COMPILERS_DIR, 'bin', 'g++' + exeSuffix);
const BUNDLED_MUSL_GPP = path.join(BUNDLED_COMPILERS_DIR, 'bin', 'x86_64-linux-musl-g++' + exeSuffix);
const BUNDLED_GCC = path.join(BUNDLED_COMPILERS_DIR, 'bin', 'gcc' + exeSuffix);
const BUNDLED_MUSL_GCC = path.join(BUNDLED_COMPILERS_DIR, 'bin', 'x86_64-linux-musl-gcc' + exeSuffix);
const BUNDLED_ZIG_BIN = path.join(BUNDLED_COMPILERS_DIR, 'zig' + exeSuffix);

function getJavacCmd() {
  const bundled = path.join(BUNDLED_JDK_DIR, 'bin', 'javac' + exeSuffix);
  if (fs.existsSync(bundled)) return bundled;
  return 'javac';
}

function getJavaCmd() {
  const bundled = path.join(BUNDLED_JDK_DIR, 'bin', 'java' + exeSuffix);
  if (fs.existsSync(bundled)) return bundled;
  return 'java';
}

const PYTHON_CMD = isWin ? 'python' : 'python3';

/**
 * Prepares a runnable program for one language in `dir`.
 * Returns { compileError: string|null, run }.
 */
async function prepare(language, dir, harnessSource) {
  if (language === 'python') {
    const file = path.join(dir, 'run.py');
    fs.writeFileSync(file, harnessSource);
    return {
      compileError: null,
      run: (input, timeoutMs) => runProcess(PYTHON_CMD, [file], { input, timeoutMs, cwd: dir }),
    };
  }

  if (language === 'java') {
    const file = path.join(dir, 'Main.java');
    fs.writeFileSync(file, harnessSource);
    let javacCmd = getJavacCmd();

    // If javac doesn't exist on Linux, try provisioning on-demand
    if (!isWin && !fs.existsSync(javacCmd)) {
      try { await ensureCompilers(); } catch (_) {}
      javacCmd = getJavacCmd();
    }

    const compile = await runProcess(javacCmd, ['-J-Xmx256m', '-encoding', 'UTF-8', 'Main.java'], { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
    if (compile.code !== 0) {
      return { compileError: compile.stderr || 'javac compilation failed. Please check your syntax or imports.', run: null };
    }
    const javaCmd = getJavaCmd();
    return {
      compileError: null,
      run: (input, timeoutMs) => runProcess(javaCmd, ['-Xmx256m', '-Xss4m', '-cp', dir, 'Main'], { input, timeoutMs, cwd: dir }),
    };
  }

  if (language === 'cpp') {
    const file = path.join(dir, 'main.cpp');
    fs.writeFileSync(file, harnessSource);
    fs.copyFileSync(VENDOR_JSON_HPP, path.join(dir, 'json.hpp'));
    const outFile = path.join(dir, isWin ? 'a.exe' : 'a.out');

    const getCandidates = () => {
      const list = [];
      if (isWin) {
        list.push({ cmd: 'g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
        list.push({ cmd: 'clang++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
      } else {
        if (fs.existsSync(BUNDLED_ZIG_BIN)) {
          list.push({ cmd: BUNDLED_ZIG_BIN, args: ['c++', '-std=c++17', '-O0', '-o', outFile, file] });
        }
        if (fs.existsSync(BUNDLED_GPP)) {
          list.push({ cmd: BUNDLED_GPP, args: ['-std=c++17', '-O0', '-o', outFile, file] });
        }
        if (fs.existsSync(BUNDLED_MUSL_GPP)) {
          list.push({ cmd: BUNDLED_MUSL_GPP, args: ['-std=c++17', '-O0', '-o', outFile, file] });
        }
        list.push({ cmd: 'g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
        list.push({ cmd: '/usr/bin/g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
        list.push({ cmd: '/usr/local/bin/g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
        list.push({ cmd: 'clang++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
      }
      return list;
    };

    let candidates = getCandidates();
    let compileResult = null;

    for (const cand of candidates) {
      compileResult = await runProcess(cand.cmd, cand.args, { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
      if (compileResult && compileResult.code !== -1) {
        break;
      }
    }

    // If all candidates failed with ENOENT on Linux, provision compiler on-demand and retry
    if ((!compileResult || compileResult.code === -1) && !isWin) {
      console.log('[C++] No working C++ compiler found. Running on-demand toolchain provisioning...');
      try {
        await ensureCompilers();
        candidates = getCandidates();
        for (const cand of candidates) {
          compileResult = await runProcess(cand.cmd, cand.args, { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
          if (compileResult && compileResult.code !== -1) {
            break;
          }
        }
      } catch (provErr) {
        console.warn('[C++] On-demand provisioning error:', provErr.message);
      }
    }

    if (!compileResult || compileResult.code !== 0) {
      const errDetail = compileResult?.stderr || compileResult?.stdout || '';
      if (!errDetail || compileResult?.code === -1) {
        return { compileError: 'C++ compiler (g++) is not available on this server. Please use Java or Python.', run: null };
      }
      return { compileError: errDetail, run: null };
    }

    return {
      compileError: null,
      run: (input, timeoutMs) => runProcess(outFile, [], { input, timeoutMs, cwd: dir }),
    };
  }

  if (language === 'c') {
    const file = path.join(dir, 'main.c');
    fs.writeFileSync(file, harnessSource);
    const outFile = path.join(dir, isWin ? 'a.exe' : 'a.out');

    const getCandidates = () => {
      const list = [];
      if (isWin) {
        list.push({ cmd: 'gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
        list.push({ cmd: 'clang', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
      } else {
        if (fs.existsSync(BUNDLED_ZIG_BIN)) {
          list.push({ cmd: BUNDLED_ZIG_BIN, args: ['cc', '-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
        }
        if (fs.existsSync(BUNDLED_GCC)) {
          list.push({ cmd: BUNDLED_GCC, args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
        }
        if (fs.existsSync(BUNDLED_MUSL_GCC)) {
          list.push({ cmd: BUNDLED_MUSL_GCC, args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
        }
        list.push({ cmd: 'gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
        list.push({ cmd: '/usr/bin/gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
        list.push({ cmd: '/usr/local/bin/gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
        list.push({ cmd: 'clang', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
      }
      return list;
    };

    let candidates = getCandidates();
    let compileResult = null;

    for (const cand of candidates) {
      compileResult = await runProcess(cand.cmd, cand.args, { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
      if (compileResult && compileResult.code !== -1) {
        break;
      }
    }

    if ((!compileResult || compileResult.code === -1) && !isWin) {
      try {
        await ensureCompilers();
        candidates = getCandidates();
        for (const cand of candidates) {
          compileResult = await runProcess(cand.cmd, cand.args, { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
          if (compileResult && compileResult.code !== -1) {
            break;
          }
        }
      } catch (_) {}
    }

    if (!compileResult || compileResult.code !== 0) {
      const errDetail = compileResult?.stderr || compileResult?.stdout || '';
      if (!errDetail || compileResult?.code === -1) {
        return { compileError: 'C compiler (gcc) is not available on this server. Please use Java or Python.', run: null };
      }
      return { compileError: errDetail, run: null };
    }

    return {
      compileError: null,
      run: (input, timeoutMs) => runProcess(outFile, [], { input, timeoutMs, cwd: dir }),
    };
  }

  return { compileError: `Unsupported language: ${language}`, run: null };
}

module.exports = { prepare };
