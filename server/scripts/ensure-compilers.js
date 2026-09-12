/**
 * ensure-compilers.js
 * Automatically verifies and installs portable JDK (Temurin 21) and portable
 * C/C++ compiler (Zig / Clang / GCC) on Linux cloud environments (Render / AWS).
 * Runs during `postinstall` and on server boot.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const os = require('os');

const SERVER_DIR = path.resolve(__dirname, '..');
const JDK_DIR = path.join(SERVER_DIR, '.jdk');
const COMPILERS_DIR = path.join(SERVER_DIR, '.compilers');

const isLinux = os.platform() === 'linux';
const isX64 = os.arch() === 'x64' || os.arch() === 'amd64';

function run(cmd, options = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...options }).trim();
  } catch (err) {
    return null;
  }
}

async function ensureCompilers() {
  console.log(`[COMPILERS] Platform: ${os.platform()}/${os.arch()}`);

  if (!isLinux || !isX64) {
    console.log('[COMPILERS] Non-Linux x64 environment. Using system-installed compilers from PATH.');
    return;
  }

  fs.mkdirSync(JDK_DIR, { recursive: true });
  fs.mkdirSync(COMPILERS_DIR, { recursive: true });

  // ── 1. Ensure Portable JDK (Temurin 21) ──
  const javacBin = path.join(JDK_DIR, 'bin', 'javac');
  if (fs.existsSync(javacBin)) {
    console.log('[JDK] Portable JDK already installed at', JDK_DIR);
  } else {
    console.log('[JDK] Downloading Temurin JDK 21 (Linux x64)...');
    try {
      const jdkTar = path.join(SERVER_DIR, 'jdk.tar.gz');
      execSync(`curl -fsSL "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse" -o "${jdkTar}"`, { stdio: 'inherit' });
      execSync(`tar -xzf "${jdkTar}" -C "${JDK_DIR}" --strip-components=1`, { stdio: 'inherit' });
      fs.unlinkSync(jdkTar);
      console.log('[JDK] ✅ JDK 21 installed successfully at', JDK_DIR);
    } catch (err) {
      console.error('[JDK] ⚠️ Failed to download JDK:', err.message);
    }
  }

  // ── 2. Ensure C/C++ Compiler ──
  // Check if system g++ or clang++ exists
  const systemGpp = run('command -v g++') || run('command -v clang++');
  if (systemGpp) {
    console.log(`[C++] ✅ System C++ compiler detected at: ${systemGpp}`);
    return;
  }

  // Check if bundled zig exists
  const zigBin = path.join(COMPILERS_DIR, 'zig');
  if (fs.existsSync(zigBin)) {
    try {
      const ver = execSync(`"${zigBin}" version`, { encoding: 'utf8' }).trim();
      console.log(`[C++] ✅ Bundled C++ compiler (Zig ${ver}) ready at: ${zigBin}`);
      return;
    } catch (_) {}
  }

  // Check if bundled GCC exists
  const gppBin = path.join(COMPILERS_DIR, 'bin', 'g++');
  if (fs.existsSync(gppBin)) {
    console.log(`[C++] ✅ Bundled GCC/G++ ready at: ${gppBin}`);
    return;
  }

  console.log('[C++] Downloading portable C/C++ toolchain (Zig Linux x64)...');
  try {
    const zigTar = path.join(SERVER_DIR, 'zig.tar.xz');
    // Official CloudFront CDN fast mirror
    execSync(`curl -fsSL "https://ziglang.org/download/0.11.0/zig-linux-x86_64-0.11.0.tar.xz" -o "${zigTar}"`, { stdio: 'inherit' });
    execSync(`tar -xf "${zigTar}" -C "${COMPILERS_DIR}" --strip-components=1`, { stdio: 'inherit' });
    if (fs.existsSync(zigTar)) fs.unlinkSync(zigTar);

    if (fs.existsSync(zigBin)) {
      const ver = execSync(`"${zigBin}" version`, { encoding: 'utf8' }).trim();
      console.log(`[C++] ✅ Portable C++ compiler (Zig ${ver}) installed successfully at: ${zigBin}`);
    }
  } catch (zigErr) {
    console.warn('[C++] Zig download failed, trying static Musl GCC fallback:', zigErr.message);
    try {
      const gccTar = path.join(SERVER_DIR, 'gcc.tgz');
      execSync(`curl -fsSL "https://musl.cc/x86_64-linux-musl-native.tgz" -o "${gccTar}"`, { stdio: 'inherit' });
      execSync(`tar -xzf "${gccTar}" -C "${COMPILERS_DIR}" --strip-components=1`, { stdio: 'inherit' });
      if (fs.existsSync(gccTar)) fs.unlinkSync(gccTar);
      console.log('[C++] ✅ Portable Musl GCC installed successfully at:', COMPILERS_DIR);
    } catch (gccErr) {
      console.error('[C++] ❌ All C++ compiler installations failed:', gccErr.message);
    }
  }
}

if (require.main === module) {
  ensureCompilers()
    .then(() => console.log('[COMPILERS] Setup check completed.'))
    .catch((err) => console.error('[COMPILERS] Setup error:', err));
}

module.exports = { ensureCompilers };
