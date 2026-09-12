const fs = require('fs');
const path = require('path');
const os = require('os');
const { runProcess } = require('./runner');

const VENDOR_JSON_HPP = path.join(__dirname, 'vendor', 'json.hpp');
const COMPILE_TIMEOUT_MS = 25000;

const isWin = os.platform() === 'win32';
const exeSuffix = isWin ? '.exe' : '';
const BUNDLED_JDK_DIR = path.join(__dirname, '..', '.jdk');
const BUNDLED_ZIG_BIN = path.join(__dirname, '..', '.compilers', 'zig' + exeSuffix);

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
    const javacCmd = getJavacCmd();
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

    // Build candidate compiler list: system g++ candidates, then portable zig c++
    const candidates = [];
    if (isWin) {
      candidates.push({ cmd: 'g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
      candidates.push({ cmd: 'clang++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
    } else {
      candidates.push({ cmd: 'g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
      candidates.push({ cmd: '/usr/bin/g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
      candidates.push({ cmd: '/usr/local/bin/g++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
      candidates.push({ cmd: 'clang++', args: ['-std=c++17', '-O0', '-o', outFile, file] });
    }
    if (fs.existsSync(BUNDLED_ZIG_BIN)) {
      candidates.push({ cmd: BUNDLED_ZIG_BIN, args: ['c++', '-std=c++17', '-O0', '-o', outFile, file] });
    }

    let compileResult = null;
    for (const cand of candidates) {
      compileResult = await runProcess(cand.cmd, cand.args, { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
      // If the process actually ran (even with compile errors), use this result
      if (compileResult && compileResult.code !== -1) {
        break;
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

    const candidates = [];
    if (isWin) {
      candidates.push({ cmd: 'gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
      candidates.push({ cmd: 'clang', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
    } else {
      candidates.push({ cmd: 'gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
      candidates.push({ cmd: '/usr/bin/gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
      candidates.push({ cmd: '/usr/local/bin/gcc', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
      candidates.push({ cmd: 'clang', args: ['-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
    }
    if (fs.existsSync(BUNDLED_ZIG_BIN)) {
      candidates.push({ cmd: BUNDLED_ZIG_BIN, args: ['cc', '-std=gnu11', '-O0', '-o', outFile, file, '-lm'] });
    }

    let compileResult = null;
    for (const cand of candidates) {
      compileResult = await runProcess(cand.cmd, cand.args, { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
      if (compileResult && compileResult.code !== -1) {
        break;
      }
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
