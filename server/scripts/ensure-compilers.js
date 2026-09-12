/**
 * ensure-compilers.js
 * Automatically verifies and installs portable JDK (Temurin 21) and portable
 * C/C++ compiler (Zig / Musl GCC) on Linux cloud environments (Render / Netlify).
 * Runs during `postinstall` and on server boot.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const SERVER_DIR = path.resolve(__dirname, '..');
const JDK_DIR = path.join(SERVER_DIR, '.jdk');
const COMPILERS_DIR = path.join(SERVER_DIR, '.compilers');

const isLinux = os.platform() === 'linux';
const isX64 = os.arch() === 'x64' || os.arch() === 'amd64';

function run(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch (_) {
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
    console.log('[JDK] Portable JDK already present at', JDK_DIR);
  } else {
    console.log('[JDK] Downloading Temurin JDK 21 (Linux x64)...');
    try {
      const jdkTar = path.join(SERVER_DIR, 'jdk.tar.gz');
      execSync(`curl -fsSL "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse" -o "${jdkTar}"`, { stdio: 'inherit' });
      execSync(`tar -xzf "${jdkTar}" -C "${JDK_DIR}" --strip-components=1`, { stdio: 'inherit' });
      if (fs.existsSync(jdkTar)) fs.unlinkSync(jdkTar);
      execSync(`chmod -R 755 "${JDK_DIR}"`, { stdio: 'pipe' });
      console.log('[JDK] ✅ JDK 21 installed successfully at', JDK_DIR);
    } catch (err) {
      console.error('[JDK] ⚠️ Failed to download JDK:', err.message);
    }
  }

  // ── 2. Ensure C/C++ Compiler ──
  // Check system g++ or clang++
  const systemGpp = run('command -v g++') || run('command -v clang++');
  if (systemGpp) {
    console.log(`[C++] ✅ System C++ compiler detected at: ${systemGpp}`);
    return;
  }

  // Check bundled zig
  const zigBin = path.join(COMPILERS_DIR, 'zig');
  if (fs.existsSync(zigBin)) {
    try {
      execSync(`chmod +x "${zigBin}"`, { stdio: 'pipe' });
      const ver = execSync(`"${zigBin}" version`, { encoding: 'utf8' }).trim();
      console.log(`[C++] ✅ Bundled C++ compiler (Zig ${ver}) ready at: ${zigBin}`);
      return;
    } catch (_) {}
  }

  // Check bundled GCC
  const gppBin = path.join(COMPILERS_DIR, 'bin', 'g++');
  const muslGppBin = path.join(COMPILERS_DIR, 'bin', 'x86_64-linux-musl-g++');
  if (fs.existsSync(gppBin) || fs.existsSync(muslGppBin)) {
    try {
      execSync(`chmod -R 755 "${COMPILERS_DIR}"`, { stdio: 'pipe' });
      console.log(`[C++] ✅ Bundled GCC/G++ ready at: ${COMPILERS_DIR}`);
      return;
    } catch (_) {}
  }

  // Download Zig C++ (CloudFront CDN)
  console.log('[C++] Downloading portable C/C++ toolchain (Zig Linux x64)...');
  let installed = false;

  try {
    const zigTar = path.join(SERVER_DIR, 'zig.tar.xz');
    execSync(`curl -fsSL "https://ziglang.org/download/0.11.0/zig-linux-x86_64-0.11.0.tar.xz" -o "${zigTar}"`, { stdio: 'inherit' });
    execSync(`tar -xf "${zigTar}" -C "${COMPILERS_DIR}" --strip-components=1`, { stdio: 'inherit' });
    if (fs.existsSync(zigTar)) fs.unlinkSync(zigTar);
    if (fs.existsSync(zigBin)) {
      execSync(`chmod -R 755 "${COMPILERS_DIR}"`, { stdio: 'pipe' });
      installed = true;
      console.log(`[C++] ✅ Zig C++ toolchain extracted successfully.`);
    }
  } catch (zigErr) {
    console.warn('[C++] Zig download/extract error, falling back to Musl GCC:', zigErr.message);
  }

  if (!installed) {
    try {
      const gccTar = path.join(SERVER_DIR, 'gcc.tgz');
      execSync(`curl -fsSL "https://more.musl.cc/10.2.1/x86_64-linux-musl/x86_64-linux-musl-native.tgz" -o "${gccTar}"`, { stdio: 'inherit' });
      execSync(`tar -xzf "${gccTar}" -C "${COMPILERS_DIR}" --strip-components=1`, { stdio: 'inherit' });
      if (fs.existsSync(gccTar)) fs.unlinkSync(gccTar);
      execSync(`chmod -R 755 "${COMPILERS_DIR}"`, { stdio: 'pipe' });
      installed = true;
      console.log('[C++] ✅ Portable Musl GCC installed at:', COMPILERS_DIR);
    } catch (gccErr) {
      console.error('[C++] ❌ Fallback Musl GCC failed:', gccErr.message);
    }
  }

  // Final verification test
  if (fs.existsSync(zigBin)) {
    try {
      execSync(`chmod +x "${zigBin}"`, { stdio: 'pipe' });
      const testCpp = path.join(os.tmpdir(), 'verify.cpp');
      const testOut = path.join(os.tmpdir(), 'verify.out');
      fs.writeFileSync(testCpp, '#include <iostream>\nint main(){ std::cout << "OK"; return 0; }\n');
      execSync(`"${zigBin}" c++ -std=c++17 -O0 -o "${testOut}" "${testCpp}"`, { stdio: 'pipe' });
      const testResult = execSync(`"${testOut}"`, { encoding: 'utf8' }).trim();
      if (testResult === 'OK') {
        console.log('[C++] 🚀 C++ verification test PASSED on live container!');
      }
      try { fs.unlinkSync(testCpp); fs.unlinkSync(testOut); } catch (_) {}
    } catch (verErr) {
      console.warn('[C++] Verification test note:', verErr.message);
    }
  }
}

if (require.main === module) {
  ensureCompilers()
    .then(() => console.log('[COMPILERS] Setup check completed.'))
    .catch((err) => console.error('[COMPILERS] Setup error:', err));
}

module.exports = { ensureCompilers };
