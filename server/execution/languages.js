const fs = require('fs');
const path = require('path');
const os = require('os');
const { runProcess } = require('./runner');

const VENDOR_JSON_HPP = path.join(__dirname, 'vendor', 'json.hpp');
const COMPILE_TIMEOUT_MS = 20000;

// Resolve javac/java: prefer a portable JDK installed by
// server/scripts/install-jdk.sh (see that file for why — Render's native
// Node runtime has no JVM and no apt/root access to install one). Falls
// back to whatever's on PATH, which is what local dev normally uses.
const isWin = os.platform() === 'win32';
const exeSuffix = isWin ? '.exe' : '';
const BUNDLED_JDK_DIR = path.join(__dirname, '..', '.jdk');

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

/**
 * Prepares a runnable program for one language in `dir` (already written:
 * the harness source file). Returns { compileError: string|null, run }.
 * `run(argsLine, timeoutMs)` executes the program once against one line
 * of JSON args and resolves to { code, stdout, stderr, timedOut }.
 */
const PYTHON_CMD = os.platform() === 'win32' ? 'python' : 'python3';

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
    const compile = await runProcess(javacCmd, ['-encoding', 'UTF-8', 'Main.java'], { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
    if (compile.code !== 0) {
      return { compileError: compile.stderr || 'javac compilation failed. Please check your syntax or imports.', run: null };
    }
    const javaCmd = getJavaCmd();
    return {
      compileError: null,
      run: (input, timeoutMs) => runProcess(javaCmd, ['-Xss16m', '-cp', dir, 'Main'], { input, timeoutMs, cwd: dir }),
    };
  }

  if (language === 'cpp') {
    const file = path.join(dir, 'main.cpp');
    fs.writeFileSync(file, harnessSource);
    fs.copyFileSync(VENDOR_JSON_HPP, path.join(dir, 'json.hpp'));
    const outFile = path.join(dir, isWin ? 'a.exe' : 'a.out');
    const compile = await runProcess('g++', ['-std=c++17', '-O2', '-o', outFile, file], { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
    if (compile.code !== 0) {
      return { compileError: compile.stderr || 'g++ failed', run: null };
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
    const compile = await runProcess('gcc', ['-std=gnu11', '-O2', '-o', outFile, file, '-lm'], { cwd: dir, timeoutMs: COMPILE_TIMEOUT_MS });
    if (compile.code !== 0) {
      return { compileError: compile.stderr || 'gcc failed', run: null };
    }
    return {
      compileError: null,
      run: (input, timeoutMs) => runProcess(outFile, [], { input, timeoutMs, cwd: dir }),
    };
  }

  return { compileError: `Unsupported language: ${language}`, run: null };
}

module.exports = { prepare };
