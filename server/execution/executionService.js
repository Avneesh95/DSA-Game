/**
 * Code Execution Service — Hardened runner & robust key evaluator.
 */

const { classifySignature, parseJavaSignature, isGenericallySupported } = require('./signatureUtil');
const { buildPythonHarness } = require('./harnesses/python');
const { buildJavaHarness } = require('./harnesses/java');
const { buildCppHarness } = require('./harnesses/cpp');
const { buildCHarness } = require('./harnesses/c');
const { SPECIAL_CASE_DOORS, buildSpecialCaseHarness } = require('./specialCases');
const { prepare } = require('./languages');
const { makeTempDir, cleanupDir } = require('./runner');

const SUPPORTED_LANGUAGES = new Set(['java', 'python', 'cpp', 'c']);
const RUN_TIMEOUT_MS = 6000;

/** Deep-equal for JSON values, numbers, strings, booleans, and arrays (including unordered collections). */
function jsonValuesEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return a === b;
  
  // Handle numbers
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isInteger(a) && Number.isInteger(b)) return a === b;
    return Math.abs(a - b) < 1e-4;
  }

  // Handle boolean to string equality (e.g. true vs "true", false vs "false")
  if (typeof a === 'boolean' || typeof b === 'boolean') {
    const boolA = typeof a === 'boolean' ? a : (String(a).toLowerCase() === 'true' ? true : String(a).toLowerCase() === 'false' ? false : null);
    const boolB = typeof b === 'boolean' ? b : (String(b).toLowerCase() === 'true' ? true : String(b).toLowerCase() === 'false' ? false : null);
    if (boolA !== null && boolB !== null) {
      return boolA === boolB;
    }
  }

  // Handle number to string representation equality (e.g. -1 vs "-1", 2.0 vs "2")
  if ((typeof a === 'number' && typeof b === 'string') || (typeof a === 'string' && typeof b === 'number')) {
    const numA = Number(a);
    const numB = Number(b);
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return numA === numB || Math.abs(numA - numB) < 1e-4;
    }
    return String(a).trim() === String(b).trim();
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    // 1. Direct ordered check
    const exactMatch = a.every((v, i) => jsonValuesEqual(v, b[i]));
    if (exactMatch) return true;

    // 2. Unordered 2D array matching (e.g. 3Sum, Group Anagrams, Subsets, Permutations, Combination Sum)
    const is2DA = a.every(item => Array.isArray(item));
    const is2DB = b.every(item => Array.isArray(item));

    if (is2DA && is2DB) {
      const canonicalizeRow = (row) => {
        return [...row].map(x => typeof x === 'object' && x !== null ? JSON.stringify(x) : x).sort((x, y) => {
          if (typeof x === 'number' && typeof y === 'number') return x - y;
          return String(x).localeCompare(String(y));
        });
      };

      const sortedA = a.map(canonicalizeRow).sort((r1, r2) => JSON.stringify(r1).localeCompare(JSON.stringify(r2)));
      const sortedB = b.map(canonicalizeRow).sort((r1, r2) => JSON.stringify(r1).localeCompare(JSON.stringify(r2)));

      if (sortedA.every((rowA, i) => jsonValuesEqual(rowA, sortedB[i]))) {
        return true;
      }
    }

    // 3. For 2-element index pair (like Two Sum [0, 1] vs [1, 0])
    if (a.length === 2 && typeof a[0] === 'number' && typeof a[1] === 'number' && typeof b[0] === 'number' && typeof b[1] === 'number') {
      const sortedA = [...a].sort((x, y) => x - y);
      const sortedB = [...b].sort((x, y) => x - y);
      if (sortedA[0] === sortedB[0] && sortedA[1] === sortedB[1]) {
        return true;
      }
    }

    return false;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  return String(a).trim() === String(b).trim();
}

function buildHarnessSource(language, code, classified, javaStarterCode, doorNumber) {
  if (SPECIAL_CASE_DOORS.has(doorNumber)) {
    return buildSpecialCaseHarness(doorNumber, language, code);
  }
  if (language === 'python') return buildPythonHarness(code, classified);
  if (language === 'java') return buildJavaHarness(code, classified);
  if (language === 'cpp') return buildCppHarness(code, classified);
  if (language === 'c') return buildCHarness(code, classified, javaStarterCode);
  return null;
}

/**
 * Runs submitted code against all test keys for a problem.
 */
async function runAgainstKeys({ code, language, keys, problem }) {
  const start = Date.now();

  if (!code || !code.trim()) {
    return { status: 'compile_error', keyResults: keys.map((k) => errorResult(k, 'Empty submission')), executionTime: 0, memory: 0 };
  }
  if (!SUPPORTED_LANGUAGES.has(language)) {
    return { status: 'compile_error', keyResults: keys.map((k) => errorResult(k, `Unsupported language: ${language}`)), executionTime: 0, memory: 0 };
  }
  if (!problem || !problem.starterCode) {
    return { status: 'compile_error', keyResults: keys.map((k) => errorResult(k, 'Problem signature unavailable')), executionTime: 0, memory: 0 };
  }

  const javaEntry = problem.starterCode.find((s) => s.language === 'java');
  const sig = javaEntry && parseJavaSignature(javaEntry.code);
  const isSpecial = SPECIAL_CASE_DOORS.has(problem.doorNumber);

  if (!isSpecial) {
    if (!sig) {
      return { status: 'compile_error', keyResults: keys.map((k) => errorResult(k, 'Could not parse problem signature')), executionTime: 0, memory: 0 };
    }
    const classified = classifySignature(sig);
    if (!isGenericallySupported(classified)) {
      return { status: 'compile_error', keyResults: keys.map((k) => errorResult(k, 'This problem type is not yet supported by the judge')), executionTime: 0, memory: 0 };
    }
  }

  const classified = sig ? classifySignature(sig) : null;
  const harnessSource = buildHarnessSource(language, code, classified, javaEntry && javaEntry.code, problem.doorNumber);

  if (!harnessSource) {
    return {
      status: 'compile_error',
      keyResults: keys.map((k) => errorResult(k, `${language} judging isn't available for this problem yet`)),
      executionTime: 0,
      memory: 0,
    };
  }

  const dir = makeTempDir();
  try {
    const prepared = await prepare(language, dir, harnessSource);
    if (prepared.compileError) {
      return {
        status: 'compile_error',
        compileError: prepared.compileError,
        keyResults: keys.map((k) => errorResult(k, null, prepared.compileError)),
        executionTime: Date.now() - start,
        memory: 0,
      };
    }

    const keyResults = [];
    for (const key of keys) {
      keyResults.push(await runOneKey(prepared, key));
    }

    const allPassed = keyResults.every((r) => r.passed);
    const anyCrash = keyResults.some((r) => r._internalStatus === 'runtime_error' || r._internalStatus === 'timeout');
    const status = allPassed ? 'accepted' : anyCrash ? (keyResults.find((r) => r._internalStatus === 'timeout') ? 'timeout' : 'runtime_error') : 'wrong_answer';

    return {
      status,
      keyResults: keyResults.map(stripInternal),
      executionTime: Date.now() - start,
      memory: 0,
    };
  } finally {
    cleanupDir(dir);
  }
}

async function runOneKey(prepared, key) {
  // Normalize argsJson and expectedJson dynamically if missing from DB
  let argsJson = key.argsJson;
  let expectedJson = key.expectedJson;

  if (!argsJson && key.input) {
    const rawInput = key.input.trim();
    try {
      const parsed = JSON.parse(rawInput);
      argsJson = JSON.stringify([parsed]);
    } catch (_) {
      try {
        const parts = rawInput.split('=').pop().trim();
        argsJson = JSON.stringify([JSON.parse(parts)]);
      } catch (_) {
        argsJson = JSON.stringify([rawInput]);
      }
    }
  }

  if (!expectedJson && key.expectedOutput !== undefined) {
    const rawOut = String(key.expectedOutput).trim();
    try {
      const parsed = JSON.parse(rawOut);
      expectedJson = JSON.stringify(parsed);
    } catch (_) {
      expectedJson = JSON.stringify(rawOut);
    }
  }

  if (!argsJson) {
    return {
      keyId: key._id,
      keyType: key.type,
      passed: false,
      isHidden: key.isHidden,
      actualOutput: key.isHidden ? null : '(test data unavailable for this key)',
      runtimeMs: 0,
      _internalStatus: 'no_data',
    };
  }

  const t0 = Date.now();
  const result = await prepared.run(argsJson + '\n', RUN_TIMEOUT_MS);
  const runtimeMs = Date.now() - t0;

  if (result.timedOut) {
    return {
      keyId: key._id,
      keyType: key.type,
      passed: false,
      isHidden: key.isHidden,
      actualOutput: key.isHidden ? null : 'Time limit exceeded',
      runtimeMs,
      _internalStatus: 'timeout',
    };
  }
  if (result.code !== 0) {
    return {
      keyId: key._id,
      keyType: key.type,
      passed: false,
      isHidden: key.isHidden,
      actualOutput: key.isHidden ? null : `Runtime error: ${(result.stderr || '').split('\n')[0].slice(0, 200)}`,
      runtimeMs,
      _internalStatus: 'runtime_error',
    };
  }

  // Parse output from stdout lines (look for valid JSON output from last line backwards)
  const stdoutLines = (result.stdout || '').trim().split('\n').map((l) => l.trim()).filter(Boolean);
  let actual;
  let parseOk = false;

  for (let i = stdoutLines.length - 1; i >= 0; i--) {
    let line = stdoutLines[i];
    try {
      actual = JSON.parse(line);
      parseOk = true;
      break;
    } catch (_) {
      // If it's a bare scalar (e.g. number or boolean or string), parse it
      if (/^-?\d+(\.\d+)?$/.test(line)) {
        actual = Number(line);
        parseOk = true;
        break;
      }
    }
  }

  let expected;
  try {
    expected = JSON.parse(expectedJson);
  } catch (_) {
    expected = expectedJson;
  }

  const passed = parseOk && jsonValuesEqual(actual, expected);

  return {
    keyId: key._id,
    keyType: key.type,
    passed,
    isHidden: key.isHidden,
    actualOutput: key.isHidden ? null : (parseOk ? JSON.stringify(actual) : (result.stdout ? result.stdout.slice(0, 100) : '(no output produced)')),
    expectedOutput: key.isHidden ? null : (key.expectedOutput || expectedJson),
    input: key.isHidden ? null : key.input,
    runtimeMs,
    _internalStatus: passed ? 'ok' : 'wrong_answer',
  };
}

function errorResult(key, message, detail) {
  const errMsg = detail || message || 'Compilation or execution error';
  return {
    keyId: key._id,
    keyType: key.type,
    passed: false,
    isHidden: key.isHidden,
    actualOutput: key.isHidden ? null : (message || (detail ? detail.split('\n')[0].slice(0, 200) : 'Error')),
    error: errMsg,
    stderr: detail || message || null,
    runtimeMs: 0,
    _internalStatus: 'compile_error',
  };
}

function stripInternal({ _internalStatus, ...rest }) {
  return rest;
}

module.exports = { runAgainstKeys };
