/**
 * testDataNormalizer.js
 * ---------------------
 * Upgrades each problem's authored `keys` (test cases) into the canonical,
 * machine-executable format the judge needs (see signatureUtil.js for the
 * wire format). Two paths:
 *
 *   1. LITERAL: the authored `input`/`expectedOutput` text is already a
 *      concrete value (e.g. `nums=[1,2,3], k=2` / `[2,3,1]`) — parse it
 *      directly into argsJson/expectedJson.
 *
 *   2. SYNTHESIZED: a lot of the original content is descriptive rather
 *      than a literal test case (e.g. input `"10^5 elements, large k"`,
 *      output `"rotated array"` — never meant to be executed). For these
 *      we generate a concrete random input matching the key's declared
 *      category (Edge Case / Duplicate Case / Large Input / ...) and the
 *      parameter types, then RUN THE REFERENCE SOLUTION on it to obtain a
 *      verified ground-truth output. The reference solution is real,
 *      correct code, so this is self-verifying: we never have to "guess"
 *      an expected value by hand.
 *
 * Any key that can't be resolved either way (unparseable AND the
 * reference solution errors on synthesized input, or the signature isn't
 * one the harnesses support) is dropped rather than stored with fake or
 * unverified data — see the stats returned by normalizeProblem().
 */

const { classifySignature, parseJavaSignature, isGenericallySupported } = require('../execution/signatureUtil');
const { prepare } = require('../execution/languages');
const { buildJavaHarness } = require('../execution/harnesses/java');
const { makeTempDir, cleanupDir } = require('../execution/runner');
const { SPECIAL_CASE_DOORS, normalizeSpecialCaseProblem } = require('./specialCaseTestData');

// ---------- literal parsing ----------

function splitTopLevel(str, sep) {
  const parts = [];
  let depth = 0;
  let cur = '';
  let inStr = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (inStr) {
      cur += c;
      if (c === '"' && str[i - 1] !== '\\') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; cur += c; continue; }
    if (c === '[' || c === '(') depth++;
    if (c === ']' || c === ')') depth--;
    if (c === sep && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += c;
  }
  parts.push(cur);
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

function tryJsonParse(s) {
  try {
    return { ok: true, value: JSON.parse(s) };
  } catch (e) {
    return { ok: false };
  }
}

// Strips a leading descriptive word ("tree ", "list:", "grid =", ...)
// that sometimes prefixes an otherwise-literal bracketed value.
const DESCRIPTIVE_PREFIX = /^(tree|list|grid|matrix|root|array|board)\s*[:=]?\s*(?=[[{])/i;
function stripDescriptivePrefix(s) {
  return s.replace(DESCRIPTIVE_PREFIX, '');
}

// "1->2->3->4->5" -> "[1,2,3,4,5]" (LeetCode-style arrow notation for a list)
const ARROW_LIST = /^-?\d+(\s*->\s*-?\d+)+$/;
function arrowToArrayText(s) {
  if (!ARROW_LIST.test(s.trim())) return null;
  return `[${s.split('->').map((x) => x.trim()).join(',')}]`;
}

const EMPTY_WORDS = /^(empty (list|array|tree)|\[\]|none)$/i;
const VALUE_MENTION = /\bvalue\s+(-?\d+)\b/i;

function tryParseValueForParam(raw, param) {
  let s = stripDescriptivePrefix(raw.trim());
  if (EMPTY_WORDS.test(s.trim())) {
    if (param && (param.kind === 'listnode' || param.depth >= 1)) return { ok: true, value: [] };
  }
  if (param && param.kind === 'listnode' && param.depth === 0) {
    const arr = arrowToArrayText(s);
    if (arr) s = arr;
  }
  const direct = tryJsonParse(s);
  if (direct.ok) return direct;
  // "node with value 3" / "that node has value -1" -> a bare int/char scalar
  if (param && param.depth === 0 && (param.kind === 'int' || param.kind === 'long')) {
    const m = s.match(VALUE_MENTION);
    if (m) return { ok: true, value: Number(m[1]) };
  }
  return { ok: false };
}

function parseLiteralArgs(inputStr, params) {
  const s = (inputStr || '').trim();
  if (!s) return null;

  const parts = splitTopLevel(s, ',');
  // Every part must be either `name=value` or a bare positional value —
  // otherwise this input isn't a literal test case at all.
  const named = {};
  const positional = [];
  for (const part of parts) {
    const m = part.match(/^(\w+)\s*=\s*(.+)$/s);
    if (m && params.some((p) => p.name === m[1])) {
      named[m[1]] = m[2];
    } else {
      positional.push(part);
    }
  }

  const unnamedParams = params.filter((p) => !(p.name in named));
  if (positional.length !== unnamedParams.length) return null;

  const args = new Array(params.length);
  let posIdx = 0;
  for (let i = 0; i < params.length; i++) {
    const p = params[i];
    const raw = p.name in named ? named[p.name] : positional[posIdx++];
    const parsed = tryParseValueForParam(raw, p);
    if (!parsed.ok) return null;
    args[i] = parsed.value;
  }
  return args;
}

function parseLiteralOutput(outputStr, returnType) {
  const s = (outputStr || '').trim();
  const parsed = tryParseValueForParam(s, returnType);
  return parsed.ok ? { ok: true, value: parsed.value } : { ok: false };
}

// ---------- synthesis ----------

function makeRng(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (Math.imul(h, 31) + seedStr.charCodeAt(i)) | 0;
  let state = h >>> 0 || 1;
  return () => {
    state ^= state << 13; state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5; state >>>= 0;
    return state / 4294967296;
  };
}

function sizeForCategory(category, rng) {
  switch (category) {
    case 'Edge Case Key': return Math.random() < 0 ? 0 : (rng() < 0.5 ? 0 : 1);
    case 'Boundary Key': return 1 + Math.floor(rng() * 2);
    case 'Duplicate Case Key': return 6 + Math.floor(rng() * 6);
    case 'Large Input Key':
    case 'Performance Key': return 300 + Math.floor(rng() * 400);
    default: return 4 + Math.floor(rng() * 8);
  }
}

function randInt(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }

function randArray(rng, n, category, lo = -50, hi = 50) {
  if (category === 'Duplicate Case Key') {
    const pool = Array.from({ length: Math.max(1, Math.floor(n / 3)) }, () => randInt(rng, lo, hi));
    return Array.from({ length: n }, () => pool[Math.floor(rng() * pool.length)]);
  }
  return Array.from({ length: n }, () => randInt(rng, lo, hi));
}

function randString(rng, len) {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let s = '';
  for (let i = 0; i < len; i++) s += letters[Math.floor(rng() * letters.length)];
  return s;
}

function randTree(rng, n) {
  // Level-order array with occasional nulls, valid shape for _build_treenode.
  const out = [];
  const nodeCount = Math.max(1, n);
  for (let i = 0; i < nodeCount; i++) out.push(randInt(rng, -50, 50));
  return out;
}

/** Synthesizes one concrete args array (canonical wire values) for a signature + key category. */
function synthesizeArgsForParams(params, category, seedStr) {
  const rng = makeRng(seedStr);
  const baseN = sizeForCategory(category, rng);
  let arrayParamLen = null; // remembers the size used for the "main" array, so a `k`-like param can respect it

  const args = params.map((p) => {
    if (p.kind === 'listnode') {
      const n = p.depth === 1 ? 2 + Math.floor(rng() * 2) : baseN;
      if (p.depth === 1) return Array.from({ length: n }, () => randArray(rng, sizeForCategory(category, rng), category));
      arrayParamLen = arrayParamLen || n;
      return randArray(rng, n, category);
    }
    if (p.kind === 'treenode') {
      if (p.isTreeRef) return randInt(rng, -50, 50); // resolved against the built tree at run time; may miss, that's fine for a synthetic smoke test
      return randTree(rng, baseN);
    }
    if (p.depth === 0) {
      if (p.kind === 'boolean') return rng() < 0.5;
      if (p.kind === 'string') return randString(rng, 3 + Math.floor(rng() * 6));
      if (p.kind === 'char') return randString(rng, 1);
      if (p.kind === 'double' || p.kind === 'float') return Math.round(rng() * 1000) / 10;
      // int/long — if this looks like a "k"/"target"/count param, keep it modest & in-range
      if (arrayParamLen && /^(k|target|amount|w|n|h)$/i.test(p.name)) return randInt(rng, 1, Math.max(1, arrayParamLen));
      return randInt(rng, -50, 50);
    }
    // depth >= 1 arrays/lists
    const n = baseN;
    if (p.depth === 1) {
      if (!arrayParamLen) arrayParamLen = n;
      if (p.kind === 'string') return Array.from({ length: n }, () => randString(rng, 2 + Math.floor(rng() * 5)));
      if (p.kind === 'boolean') return Array.from({ length: n }, () => rng() < 0.5);
      if (p.kind === 'char') return Array.from({ length: n }, () => randString(rng, 1));
      return randArray(rng, n, category);
    }
    // depth 2
    const rows = Math.max(1, Math.min(n, 8));
    const cols = Math.max(1, Math.min(n, 8));
    if (p.kind === 'string') return Array.from({ length: rows }, () => Array.from({ length: cols }, () => randString(rng, 3)));
    if (p.kind === 'char') return Array.from({ length: rows }, () => Array.from({ length: cols }, () => randString(rng, 1)));
    return Array.from({ length: rows }, () => randArray(rng, cols, category, 0, 9));
  });

  return args;
}

// ---------- reference-solution ground truth ----------

/**
 * Runs the (trusted) Java reference solution against a concrete args array
 * using the same Java harness the real judge uses, returning the parsed
 * JSON result or {ok:false} if it errors/times out.
 */
async function computeGroundTruth(referenceJavaCode, classified, argsArray) {
  const dir = makeTempDir();
  try {
    const harnessSource = buildJavaHarness(referenceJavaCode, classified);
    const prepared = await prepare('java', dir, harnessSource);
    if (prepared.compileError) return { ok: false, reason: `compile_error: ${prepared.compileError.slice(0, 300)}` };
    const result = await prepared.run(JSON.stringify(argsArray) + '\n', 8000);
    if (result.timedOut || result.code !== 0) {
      return { ok: false, reason: `runtime_error: ${(result.stderr || '').slice(0, 300)}` };
    }
    const line = result.stdout.trim().split('\n').pop();
    const parsed = tryJsonParse(line);
    if (!parsed.ok) return { ok: false, reason: 'unparseable reference output' };
    return { ok: true, value: parsed.value };
  } finally {
    cleanupDir(dir);
  }
}

/**
 * Normalizes one problem's `keys` array in place (returns a new array).
 * Requires the *reference* Java solution to be correct — it is executed
 * as ground truth for any key whose authored text isn't already a literal
 * value.
 */
async function normalizeProblem(problem) {
  const stats = { doorNumber: problem.doorNumber, literal: 0, synthesized: 0, dropped: 0, reasons: [] };

  if (SPECIAL_CASE_DOORS.has(problem.doorNumber)) {
    return normalizeSpecialCaseProblem(problem, stats);
  }

  const javaEntry = problem.starterCode.find((s) => s.language === 'java');
  const sig = javaEntry && parseJavaSignature(javaEntry.code);
  if (!sig) {
    stats.reasons.push('could not parse Java signature');
    return { keys: [], stats };
  }
  const classified = classifySignature(sig);
  if (!isGenericallySupported(classified)) {
    stats.reasons.push(`signature not generically supported (uses Node/unknown type)`);
    return { keys: [], stats };
  }

  const refCode = problem.referenceSolution && problem.referenceSolution.code;

  const outKeys = [];
  for (let idx = 0; idx < problem.keys.length; idx++) {
    const key = problem.keys[idx];
    const literalArgs = parseLiteralArgs(key.input, classified.params);
    const literalOut = parseLiteralOutput(key.expectedOutput, classified.returnType);

    if (literalArgs && literalOut.ok) {
      outKeys.push({ ...key.toObject ? key.toObject() : key, argsJson: JSON.stringify(literalArgs), expectedJson: JSON.stringify(literalOut.value) });
      stats.literal += 1;
      continue;
    }

    if (!refCode) {
      stats.dropped += 1;
      stats.reasons.push(`door ${problem.doorNumber} key ${idx}: no reference solution to synthesize against`);
      continue;
    }

    const seed = `${problem.doorNumber}:${idx}:${key.type}`;
    const synthArgs = synthesizeArgsForParams(classified.params, key.type, seed);
    const truth = await computeGroundTruth(refCode, classified, synthArgs);
    if (!truth.ok) {
      stats.dropped += 1;
      stats.reasons.push(`door ${problem.doorNumber} key ${idx} (${key.type}): ${truth.reason}`);
      continue;
    }
    outKeys.push({
      ...(key.toObject ? key.toObject() : key),
      argsJson: JSON.stringify(synthArgs),
      expectedJson: JSON.stringify(truth.value),
    });
    stats.synthesized += 1;
  }

  return { keys: outKeys, stats };
}

module.exports = {
  parseLiteralArgs,
  parseLiteralOutput,
  synthesizeArgsForParams,
  computeGroundTruth,
  normalizeProblem,
};
