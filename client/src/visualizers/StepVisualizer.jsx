import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw,
  Zap, Eye, Code2, CheckCircle, XCircle, Sparkles,
} from 'lucide-react';
import { interpretUserCode } from './codeInterpreter';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const POINTER_FIELDS = [
  'left','right','mid','i','j','low','high',
  'p1','p2','write','insertPos','index',
  'head','curr','prev','next','slow','fast',
  'r','c','row','col',
];

const NON_VAR_FIELDS = [
  'action','result','algorithm','line','step',
  'keyType','passed','actualOutput','expectedOutput',
  'runtimeMs','keyInput','_declaredVars','updatedVar',
];

/* ─────────────────────────────────────────────────────────────
   1. EXTRACT DATA STRUCTURE from raw input string
───────────────────────────────────────────────────────────── */
function extractStructure(rawInput, topic = '', algorithm = '') {
  if (!rawInput) return { type: 'array', data: [1, 2, 3, 4, 5] };
  const str = String(
    typeof rawInput === 'object' ? JSON.stringify(rawInput) : rawInput
  ).trim();

  // Grid / 2-D matrix  [[...],[...]]
  const gridIdx = str.indexOf('[[');
  if (gridIdx !== -1) {
    try {
      const jsonSub = str.slice(gridIdx, str.lastIndexOf(']]') + 2).replace(/'/g, '"');
      const grid = JSON.parse(jsonSub);
      if (Array.isArray(grid) && Array.isArray(grid[0]))
        return { type: 'grid', data: grid };
    } catch (_) {}
  }

  // Linked-list  1 -> 2 -> 3
  if (str.includes('->')) {
    return { type: 'linked-list', data: str.split('->').map(s => s.trim()) };
  }

  // Tree topic or root=
  if (
    topic.toLowerCase().includes('tree') ||
    algorithm.toLowerCase().includes('tree') ||
    str.toLowerCase().includes('root=')
  ) {
    const m = str.match(/\[([^\]]*)\]/);
    if (m) {
      const items = m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      return { type: 'tree', data: items };
    }
  }

  // 1-D Array  [2, 7, 11, 15]
  const arrM = str.match(/\[([^\]]*)\]/);
  if (arrM) {
    const items = arrM[1]
      .split(',')
      .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
      .map(s => (isNaN(Number(s)) ? s : Number(s)));
    if (items.length > 0) return { type: 'array', data: items };
  }

  // String  "abcabcbb"
  const strM = str.match(/"([^"]+)"|'([^']+)'/);
  if (strM) {
    const s = strM[1] || strM[2];
    if (s && s.length <= 40) return { type: 'string', data: s.split('') };
  }

  return { type: 'array', data: [1, 2, 3, 4, 5] };
}

/* ─────────────────────────────────────────────────────────────
   2. EXTRACT DECLARED VARIABLES from user/solution code
   Returns  [{ name, initVal, lineNum }]
───────────────────────────────────────────────────────────── */
function extractDeclaredVariables(code = '') {
  if (!code) return [];
  const lines = code.split('\n');
  const vars = [];
  const seen = new Set();

  const declPatterns = [
    /^(?:int|long|double|float|bool|boolean|char|auto|string|String)\s+(\w+)\s*=\s*([^;{]+)/,
    /^(\w+)\s*=\s*(\S[^#]*?)(?:\s*#.*)?$/,
    /^(?:let|const|var)\s+(\w+)\s*=\s*([^;{]+)/,
  ];

  const skipNames = new Set([
    'i','j','k','n','m','l','t','x','y','z',
    'return','if','else','for','while','def','class','import',
    'True','False','None','true','false','null','undefined',
    'self','this',
  ]);

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (
      !line ||
      line.startsWith('//') || line.startsWith('#') ||
      line.startsWith('/*') || line.startsWith('*') ||
      line.startsWith('def ') || line.startsWith('class ') ||
      (line.includes('(') && line.includes(')') && line.includes('{'))
    ) return;

    for (const pat of declPatterns) {
      const m = line.match(pat);
      if (m) {
        const name = m[1].trim();
        let initRaw = (m[2] || '').trim().replace(/[;,{}]/g, '').trim();

        if (seen.has(name) || skipNames.has(name) || name.length > 20) continue;
        seen.add(name);

        let initVal = null;
        if (initRaw !== '' && initRaw !== 'null' && initRaw !== 'None') {
          initVal = initRaw.length > 18 ? null : initRaw;
        }

        vars.push({ name, initVal, lineNum: idx + 1 });
        break;
      }
    }
  });

  return vars;
}

/* ─────────────────────────────────────────────────────────────
   3. MAP STEP ACTION → CODE LINE
───────────────────────────────────────────────────────────── */
function mapStepToCodeLine(step, code, stepIdx, total) {
  if (!code) return 1;
  const lines = code.split('\n');
  const totalLines = lines.length;

  let initLine = null, loopLine = null, condLine = null, actionLine = null, retLine = null;
  lines.forEach((l, i) => {
    const lnum = i + 1;
    const lo = l.toLowerCase();
    if (!retLine && lo.includes('return ')) retLine = lnum;
    if (!loopLine && (lo.includes('for ') || lo.includes('while ') || lo.includes('for('))) loopLine = lnum;
    if (!condLine && (lo.includes('if ') || lo.includes('if('))) condLine = lnum;
    if (!initLine && !loopLine && lo.includes('=') &&
        (lo.includes('int ') || lo.includes('let ') || lo.includes('const ') ||
         lo.includes('var ') || lo.includes('auto '))) initLine = lnum;
    if (!actionLine && condLine && lo.includes('=') && !lo.includes('==')) actionLine = lnum;
  });

  const action = ((step && step.action) || '').toLowerCase();
  if (action === 'init' && initLine) return initLine;
  if ((action.includes('loop') || action.includes('check') || action.includes('inspect') || action.includes('scan')) && loopLine)
    return condLine || loopLine;
  if ((action.includes('update') || action.includes('swap') || action.includes('set') || action.includes('add')) && actionLine)
    return actionLine || condLine;
  if ((action.includes('return') || action.includes('result') || action.includes('done') || action.includes('complete')) && retLine)
    return retLine;
  if (step && step.line && step.line <= totalLines) return step.line;

  const ratio = stepIdx / Math.max(1, total - 1);
  const valids = lines
    .map((l, i) => ({ lnum: i+1, l }))
    .filter(({ l }) => {
      const t = l.trim();
      return t && !t.startsWith('//') && !t.startsWith('#') && t !== '{' && t !== '}';
    })
    .map(({ lnum }) => lnum);
  return valids[Math.min(Math.floor(ratio * valids.length), valids.length - 1)] || 1;
}


/* ─────────────────────────────────────────────────────────────
   4. GENERATE GRANULAR LINE-BY-LINE STEPS & VARIABLE VALUES
───────────────────────────────────────────────────────────── */
function generateSteps(rawInput, topic, algorithm, staticSteps, code, traceMode = 'user') {
  const struct = extractStructure(rawInput, topic, algorithm);
  const data   = struct.data || [1, 2, 3, 4, 5];
  const declaredVars = extractDeclaredVariables(code);

  // 1. Real line-by-line execution trace of the user's written code
  if (traceMode === 'user' && code && typeof code === 'string' && code.trim().length > 20) {
    try {
      const interpreted = interpretUserCode(code, rawInput, topic);
      if (interpreted && interpreted.length > 1) {
        return interpreted;
      }
    } catch (e) {
      console.warn("Could not interpret user code:", e);
    }
  }

  // 2. Authentic verified problem steps
  if (Array.isArray(staticSteps) && staticSteps.length > 1) {
    return staticSteps.map((s, idx) => ({
      ...s,
      step  : idx + 1,
      index : s.index ?? s.i ?? (idx % data.length),
      line  : s.line || mapStepToCodeLine(s, code, idx, staticSteps.length),
    }));
  }

  const steps = [];
  const n = data.length;

  if (struct.type === 'array' || struct.type === 'string') {
    // Determine which variables are actually declared in user's code
    const hasMax = declaredVars.some(v => v.name.toLowerCase().includes('max') || v.name === 'largest');
    const hasSecond = declaredVars.some(v => v.name.toLowerCase().includes('second'));
    const hasSum = declaredVars.some(v => v.name.toLowerCase().includes('sum'));
    const hasCount = declaredVars.some(v => v.name.toLowerCase().includes('count'));

    let curMax = typeof data[0] === 'number' ? data[0] : null;
    let curSecond = -1;
    let sum = 0;

    // Step 0: Declare variables
    const initVarMap = {};
    declaredVars.forEach(v => {
      initVarMap[v.name] = v.initVal ?? '?';
    });

    steps.push({
      step    : 1,
      index   : -1,
      i       : -1,
      val     : null,
      ...initVarMap,
      action  : `Initialize variables → ${declaredVars.map(v => `${v.name}=${v.initVal ?? '?'}`).join(', ') || 'state'}`,
      line    : mapStepToCodeLine({ action: 'init' }, code, 0, n + 2),
      updatedVar: declaredVars[0]?.name || null,
    });

    // Steps 1..n: element traversal
    for (let i = 0; i < n; i++) {
      const item = data[i];
      let updatedVarName = null;

      if (typeof item === 'number') {
        sum += item;
        if (curMax === null || item > curMax) {
          curSecond = curMax !== null ? curMax : curSecond;
          curMax = item;
          updatedVarName = hasMax ? 'max' : null;
        } else if (item < curMax && (curSecond === -1 || item > curSecond)) {
          curSecond = item;
          updatedVarName = hasSecond ? 'second' : null;
        }
      }

      const stepVarState = {
        i: i,
        index: i,
      };

      if (hasMax) stepVarState.max = curMax;
      if (hasSecond) stepVarState.second = curSecond;
      if (hasSum) stepVarState.sum = sum;
      if (hasCount) stepVarState.count = i + 1;

      // Match exact declared variable names
      declaredVars.forEach(v => {
        const vLower = v.name.toLowerCase();
        if (vLower.includes('max') || vLower === 'largest') stepVarState[v.name] = curMax;
        else if (vLower.includes('second')) stepVarState[v.name] = curSecond;
        else if (vLower.includes('sum')) stepVarState[v.name] = sum;
        else if (vLower.includes('count')) stepVarState[v.name] = i + 1;
        else if (vLower === 'val' || vLower === 'curr') stepVarState[v.name] = item;
        else if (v.initVal !== null && stepVarState[v.name] === undefined) stepVarState[v.name] = v.initVal;
      });

      steps.push({
        step       : steps.length + 1,
        index      : i,
        i,
        val        : item,
        value      : item,
        ...stepVarState,
        updatedVar : updatedVarName,
        action     : `Inspect index [${i}] → val = ${JSON.stringify(item)}${hasMax && curMax !== null ? ` | max = ${curMax}` : ''}${hasSecond && curSecond !== -1 ? ` | second = ${curSecond}` : ''}`,
        line       : mapStepToCodeLine({ action: 'loop' }, code, i + 1, n + 2),
      });
    }

    // Final step – return
    const finalVarState = {
      i: n - 1,
      index: n - 1,
    };
    if (hasMax) finalVarState.max = curMax;
    if (hasSecond) finalVarState.second = curSecond;
    if (hasSum) finalVarState.sum = sum;
    if (hasCount) finalVarState.count = n;

    declaredVars.forEach(v => {
      const vLower = v.name.toLowerCase();
      if (vLower.includes('second')) finalVarState[v.name] = curSecond;
      else if (vLower.includes('max') || vLower === 'largest') finalVarState[v.name] = curMax;
      else if (vLower.includes('sum')) finalVarState[v.name] = sum;
      else if (v.initVal !== null && finalVarState[v.name] === undefined) finalVarState[v.name] = v.initVal;
    });

    const resultVal = hasSecond ? (curSecond !== -1 ? curSecond : -1) : (curMax ?? data);

    steps.push({
      step       : steps.length + 1,
      index      : n - 1,
      i          : n - 1,
      val        : data[n - 1],
      ...finalVarState,
      result     : resultVal,
      action     : `Scan complete → Result = ${JSON.stringify(resultVal)}`,
      line       : mapStepToCodeLine({ action: 'return' }, code, n + 1, n + 2),
      updatedVar : 'result',
    });

  } else if (struct.type === 'linked-list') {
    steps.push({ step: 1, index: -1, i: -1, val: null, curr: -1, action: 'Initialize curr = head', line: 1 });
    for (let i = 0; i < n; i++) {
      steps.push({
        step  : steps.length + 1,
        index : i,
        i,
        curr  : i,
        val   : data[i],
        action: `Traverse Node ${i + 1}/${n} → val = ${data[i]}`,
        line  : mapStepToCodeLine({ action: 'loop' }, code, i, n),
      });
    }
  } else if (struct.type === 'grid') {
    const rows = data.length, cols = data[0].length;
    steps.push({ step: 1, index: -1, r: -1, c: -1, val: null, action: 'Initialize grid traversal', line: 1 });
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        steps.push({
          step  : steps.length + 1,
          r, c, row: r, col: c,
          val   : data[r][c],
          action: `Cell [${r}][${c}] = ${data[r][c]}`,
          line  : mapStepToCodeLine({ action: 'loop' }, code, r * cols + c, rows * cols),
        });
      }
    }
  } else {
    steps.push({ step: 1, index: -1, i: -1, val: null, action: 'Initialize tree traversal', line: 1 });
    data.filter(v => v !== 'null').forEach((val, idx) => {
      steps.push({
        step  : steps.length + 1,
        index : idx,
        i     : idx,
        val,
        action: `Visit node ${val} (index ${idx})`,
        line  : mapStepToCodeLine({ action: 'loop' }, code, idx, n),
      });
    });
  }

  return steps;
}

/* ─────────────────────────────────────────────────────────────
   5. VARIABLE DECK PANEL — Displays accurate declared variables
───────────────────────────────────────────────────────────── */
function VariableDeck({ declaredVars, currentStep, prevStep }) {
  if (!declaredVars || declaredVars.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1 pb-1">
      {declaredVars.map(({ name, initVal }) => {
        const liveVal = currentStep[name] !== undefined
          ? currentStep[name]
          : (currentStep[name.toLowerCase()] !== undefined ? currentStep[name.toLowerCase()] : null);

        const prevVal = prevStep
          ? (prevStep[name] !== undefined ? prevStep[name] : prevStep[name.toLowerCase()])
          : null;

        const isInit  = currentStep.index === -1 || currentStep.i === -1;
        const isEmpty = isInit && (liveVal === null || liveVal === '?' || liveVal === undefined);
        const changed = !isInit && liveVal !== null && liveVal !== undefined && String(liveVal) !== String(prevVal);
        const isTarget = currentStep.updatedVar === name || currentStep.updatedVar === name.toLowerCase();

        // Clean display value
        let displayVal = '?';
        if (liveVal !== null && liveVal !== undefined && liveVal !== '?') {
          displayVal = typeof liveVal === 'object' ? JSON.stringify(liveVal) : String(liveVal);
        } else if (initVal !== null) {
          displayVal = String(initVal);
        }

        return (
          <motion.div
            key={name}
            layout
            animate={changed || isTarget ? { scale: [1, 1.12, 1], borderColor: ['#a78bfa', '#fbbf24', '#a78bfa'] } : {}}
            transition={{ duration: 0.4 }}
            className={`flex flex-col items-center px-3.5 py-2 rounded-xl border-2 min-w-[70px] shadow-sm transition-all
              ${isEmpty
                ? 'border-dungeon-600 bg-dungeon-900/60'
                : changed || isTarget
                  ? 'border-glow-gold bg-glow-gold/15 shadow-glow-gold/30 ring-2 ring-glow-gold/40'
                  : 'border-glow-purple/50 bg-dungeon-900/80'
              }`}
          >
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide font-semibold">{name}</span>

            <AnimatePresence mode="wait">
              <motion.span
                key={displayVal}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className={`text-base font-mono font-bold mt-0.5 ${
                  isEmpty
                    ? 'text-slate-500 italic text-xs'
                    : changed || isTarget
                      ? 'text-glow-gold'
                      : 'text-glow-cyan'
                }`}
              >
                {displayVal}
              </motion.span>
            </AnimatePresence>

            {isEmpty && initVal !== null && (
              <span className="text-[9px] text-slate-500 font-mono">(init)</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function StepVisualizer({
  visualizationSteps,
  exampleInput,
  topic,
  runResult,
  userCode,
  onLineChange,
  autoPlay = false,
}) {
  const [stepIndex,      setStepIndex]      = useState(0);
  const [isPlaying,      setIsPlaying]      = useState(autoPlay);
  const [speed,          setSpeed]          = useState(1);
  const [activeTab,      setActiveTab]      = useState('visualizer');
  const [selectedKeyIdx, setSelectedKeyIdx] = useState(0);
  const [debouncedCode, setDebouncedCode]   = useState(userCode);
  const [traceMode, setTraceMode]           = useState(autoPlay ? 'user' : 'reference');

  const prevStepRef = useRef(null);

  // Debounce user code to prevent lag on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(userCode);
    }, 500);
    return () => clearTimeout(handler);
  }, [userCode]);

  const algorithm   = visualizationSteps?.algorithm || '';
  const hasRunKeys  = runResult && Array.isArray(runResult.keyResults) && runResult.keyResults.length > 0;

  // Determine active input — always fall back to exampleInput
  let activeInput     = exampleInput || '[1, 2, 3, 4, 5]';
  let activeKeyResult = null;
  if (hasRunKeys) {
    activeKeyResult = runResult.keyResults[selectedKeyIdx] || runResult.keyResults[0];
    if (activeKeyResult) {
      let resolvedInput = null;
      if (activeKeyResult.input && String(activeKeyResult.input).trim()) {
        resolvedInput = activeKeyResult.input;
      } else if (activeKeyResult.argsJson) {
        try {
          const parsed = JSON.parse(activeKeyResult.argsJson);
          resolvedInput = Array.isArray(parsed)
            ? JSON.stringify(parsed[0])
            : String(parsed);
        } catch (_) {}
      }
      if (resolvedInput) activeInput = resolvedInput;
    }
  }

  // Always pass problem's authentic visualizationSteps to generateSteps
  let steps = generateSteps(
    activeInput,
    topic,
    algorithm,
    visualizationSteps?.steps,
    debouncedCode,
    traceMode,
  );
  if (!steps || !steps.length) {
    steps = generateSteps(exampleInput || '[1,2,3,4,5]', topic, algorithm, null, debouncedCode, traceMode);
  }
  if (!steps || !steps.length) {
    steps = [{ step: 1, action: "Ready...", line: 1, index: -1 }];
  }

  const currentStep = steps[stepIndex] || {};
  const prevStep    = prevStepRef.current;
  const structure   = extractStructure(activeInput, topic, algorithm);

  // Extract declared variables from user code or solution code
  const declaredVars = extractDeclaredVariables(debouncedCode || visualizationSteps?.solution || '');

  /* ── Effects ── */
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(autoPlay);
    prevStepRef.current = null;
  }, [visualizationSteps, runResult, topic, selectedKeyIdx, autoPlay]);

  useEffect(() => {
    if (!isPlaying || !steps.length) return;
    if (stepIndex >= steps.length - 1) { setIsPlaying(false); return; }
    const ms = Math.max(300, 1000 / speed);
    const t  = setTimeout(() => {
      prevStepRef.current = currentStep;
      setStepIndex(i => Math.min(i + 1, steps.length - 1));
    }, ms);
    return () => clearTimeout(t);
  }, [isPlaying, stepIndex, steps.length, speed]);

  // Only trigger onLineChange when actively playing to prevent typing jumps
  useEffect(() => {
    if (onLineChange && currentStep && isPlaying) {
      onLineChange(mapStepToCodeLine(currentStep, userCode, stepIndex, steps.length), currentStep);
    }
  }, [stepIndex, isPlaying, onLineChange]);

  if (!steps.length) {
    return (
      <div className="door-panel py-6 text-center text-slate-400 text-sm italic">
        No visualization available for this problem.
      </div>
    );
  }

  const activePointers = POINTER_FIELDS.filter(f => typeof currentStep[f] === 'number' && currentStep[f] >= 0);

  const stateVars = Object.entries(currentStep).filter(
    ([k]) => !NON_VAR_FIELDS.includes(k) && !POINTER_FIELDS.includes(k)
  );

  const isElemActive = (idx) =>
    activePointers.some(f => currentStep[f] === idx) ||
    currentStep.index === idx ||
    currentStep.i === idx;

  return (
    <div className="door-panel space-y-4 border border-dungeon-600/80 bg-dungeon-950/70 shadow-lg">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-dungeon-700/60 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-glow-purple/10 text-glow-purple shrink-0">
            <Zap size={16} />
          </div>
          <div>
            <h3 className="font-display text-sm text-glow-gold">Interactive Execution Visualizer</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Mode:{' '}
              <span className="text-glow-cyan uppercase font-semibold">
                {traceMode === 'reference' ? 'How to Solve' : hasRunKeys ? 'Your Execution' : 'Your Code'}
              </span>
              {hasRunKeys ? ` · Key ${selectedKeyIdx + 1}` : ' · Line-by-line'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Trace Mode Toggle */}
          <div className="flex items-center gap-0.5 bg-dungeon-900 p-0.5 rounded-lg border border-dungeon-700 text-[11px]">
            <button
              onClick={() => { setTraceMode('reference'); setStepIndex(0); setIsPlaying(false); prevStepRef.current = null; }}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                traceMode === 'reference'
                  ? 'bg-glow-purple/20 text-glow-purple font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye size={11} /> How to Solve
            </button>
            <button
              onClick={() => { setTraceMode('user'); setStepIndex(0); setIsPlaying(false); prevStepRef.current = null; }}
              className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
                traceMode === 'user'
                  ? 'bg-glow-purple/20 text-glow-purple font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 size={11} /> My Code
            </button>
          </div>

          {/* Visual / State Toggle */}
          <div className="flex items-center gap-0.5 bg-dungeon-900 p-0.5 rounded-lg border border-dungeon-700 text-[11px]">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'visualizer' ? 'bg-glow-purple/20 text-glow-purple font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye size={11} /> Visual
            </button>
            <button
              onClick={() => setActiveTab('variables')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                activeTab === 'variables' ? 'bg-glow-purple/20 text-glow-purple font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 size={11} /> State ({stateVars.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── Test Key Pills ── */}
      {hasRunKeys && (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-dungeon-900/60 rounded-lg border border-dungeon-700/60">
          <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles size={11} className="text-glow-gold" /> Test Cases:
          </span>
          {runResult.keyResults.map((kr, kIdx) => {
            const sel = selectedKeyIdx === kIdx;
            return (
              <button
                key={kIdx}
                onClick={() => { setSelectedKeyIdx(kIdx); setStepIndex(0); setIsPlaying(false); prevStepRef.current = null; }}
                className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-all flex items-center gap-1 ${
                  sel
                    ? kr.passed
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-rose-500/25 border-rose-400 text-rose-300 font-bold'
                    : kr.passed
                      ? 'bg-dungeon-800 border-dungeon-600 text-emerald-400/80 hover:text-emerald-300'
                      : 'bg-dungeon-800 border-dungeon-600 text-rose-400/80 hover:text-rose-300'
                }`}
              >
                {kr.passed ? <CheckCircle size={12} /> : <XCircle size={12} />}
                Key {kIdx + 1}
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'visualizer' ? (
          <motion.div
            key={`visual-${selectedKeyIdx}-${stepIndex}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >

            {/* ══ VARIABLE DECK ══ */}
            {declaredVars.length > 0 && (
              <div className="bg-dungeon-900/50 border border-dungeon-700/70 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-glow-gold" /> Declared Variables (Line-by-Line State):
                </p>
                <VariableDeck
                  declaredVars={declaredVars}
                  currentStep={currentStep}
                  prevStep={prevStep}
                />
              </div>
            )}

            {/* ══ DATA STRUCTURE ══ */}

            {/* GRID */}
            {structure.type === 'grid' && (
              <div className="flex flex-col items-center gap-1.5 py-3 px-2 bg-dungeon-900/40 rounded-xl border border-dungeon-800/80 overflow-x-auto">
                {structure.data.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1.5">
                    {row.map((cell, cIdx) => {
                      const activeR = currentStep.r ?? currentStep.row;
                      const activeC = currentStep.c ?? currentStep.col;
                      const active  = activeR === rIdx && activeC === cIdx;
                      return (
                        <motion.div
                          key={cIdx}
                          animate={{
                            scale           : active ? 1.15 : 1,
                            borderColor     : active ? '#fbbf24' : '#332a5c',
                            backgroundColor : active ? 'rgba(251,191,36,0.2)' : 'rgba(15,23,42,0.8)',
                            boxShadow       : active ? '0 0 12px rgba(251,191,36,0.4)' : 'none',
                          }}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border-2 font-mono text-xs text-slate-100 font-semibold"
                        >
                          {cell}
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* LINKED LIST */}
            {structure.type === 'linked-list' && (
              <div className="flex flex-wrap gap-2 justify-center py-4 px-2 min-h-[90px] items-center bg-dungeon-900/40 rounded-xl border border-dungeon-800/80">
                {structure.data.map((val, idx) => {
                  const ptrs    = POINTER_FIELDS.filter(f => currentStep[f] === idx);
                  const active  = ptrs.length > 0 || isElemActive(idx);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-5">
                          {active && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-glow-gold/20 border border-glow-gold/50 text-glow-gold font-mono font-bold">
                              {ptrs.length > 0 ? ptrs.join('/') : `i=${idx}`}
                            </span>
                          )}
                        </div>
                        <motion.div
                          animate={{
                            scale       : active ? 1.12 : 1,
                            borderColor : active ? '#fbbf24' : '#a78bfa',
                            boxShadow   : active ? '0 0 12px rgba(251,191,36,0.3)' : 'none',
                          }}
                          className="w-10 h-10 rounded-full border-2 bg-dungeon-900 flex items-center justify-center font-mono text-sm text-slate-100 font-bold"
                        >
                          {val}
                        </motion.div>
                      </div>
                      {idx < structure.data.length - 1 && (
                        <span className="text-glow-purple font-mono font-bold">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TREE */}
            {structure.type === 'tree' && (
              <div className="flex flex-wrap gap-3 justify-center py-4 px-2 min-h-[90px] items-center bg-dungeon-900/40 rounded-xl border border-dungeon-800/80">
                {structure.data.filter(v => v !== 'null').map((val, idx) => {
                  const active = isElemActive(idx) || currentStep.val === val;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <motion.div
                        animate={{
                          scale           : active ? 1.15 : 1,
                          borderColor     : active ? '#fbbf24' : '#332a5c',
                          backgroundColor : active ? 'rgba(251,191,36,0.2)' : 'rgba(15,23,42,0.8)',
                          boxShadow       : active ? '0 0 12px rgba(251,191,36,0.4)' : 'none',
                        }}
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-sm text-slate-100 font-semibold"
                      >
                        {val}
                      </motion.div>
                      <span className="text-[10px] text-slate-500 font-mono">Node</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ARRAY / STRING */}
            {(structure.type === 'array' || structure.type === 'string') && (
              <div className="flex flex-wrap gap-2.5 justify-center py-4 px-2 min-h-[100px] items-end bg-dungeon-900/40 rounded-xl border border-dungeon-800/80">
                {structure.data.map((value, idx) => {
                  const ptrs   = POINTER_FIELDS.filter(f => currentStep[f] === idx);
                  const active = ptrs.length > 0 || isElemActive(idx);
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div className="h-5 flex items-end">
                        {active && (
                          <motion.span
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-glow-purple/20 border border-glow-purple/50 text-glow-purple font-mono font-bold"
                          >
                            {ptrs.length > 0 ? ptrs.join('/') : `i=${idx}`}
                          </motion.span>
                        )}
                      </div>

                      <motion.div
                        animate={{
                          scale           : active ? 1.14 : 1,
                          borderColor     : active ? '#a78bfa' : '#332a5c',
                          backgroundColor : active ? 'rgba(167,139,250,0.22)' : 'rgba(15,23,42,0.8)',
                          boxShadow       : active ? '0 0 14px rgba(167,139,250,0.4)' : 'none',
                        }}
                        transition={{ duration: 0.2 }}
                        className="w-11 h-11 flex items-center justify-center rounded-lg border-2 font-mono text-sm text-slate-100 font-bold"
                      >
                        {value}
                      </motion.div>

                      <span className="text-[10px] text-slate-500 font-mono">[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ══ ACTION BANNER ══ */}
            <div className="bg-dungeon-900/80 border border-dungeon-700/60 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {activeKeyResult && (
                  activeKeyResult.passed
                    ? <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                    : <XCircle    size={14} className="text-rose-400 shrink-0" />
                )}
                <span className="text-[11px] font-mono text-glow-cyan uppercase tracking-wider">
                  {hasRunKeys ? `Test Key ${selectedKeyIdx + 1}` : `Step ${stepIndex + 1} / ${steps.length}`}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-200">
                {(currentStep.action || 'Processing…').replace(/-/g, ' ')}
              </p>

              {activeKeyResult && (
                <div className="mt-2 pt-2 border-t border-dungeon-700/50 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
                  <span>Input: <strong className="text-glow-gold">{activeInput}</strong></span>
                  {activeKeyResult.expectedOutput && (
                    <span>Expected: <strong className="text-glow-cyan">{activeKeyResult.expectedOutput}</strong></span>
                  )}
                  <span>
                    Actual:{' '}
                    <strong className={activeKeyResult.passed ? 'text-emerald-400' : 'text-rose-400'}>
                      {activeKeyResult.actualOutput || '(no output)'}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </motion.div>

        ) : (
          /* ── STATE TAB ── */
          <motion.div
            key="vars"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="grid grid-cols-2 xs:grid-cols-3 gap-2.5 p-3 bg-dungeon-900/40 rounded-xl border border-dungeon-800"
          >
            {stateVars.map(([k, v]) => (
              <div key={k} className="p-2.5 rounded-lg bg-dungeon-900 border border-dungeon-700/70">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">{k}</span>
                <span className="text-sm font-mono text-glow-gold font-bold">
                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                </span>
              </div>
            ))}
            {activePointers.map(pf => (
              <div key={pf} className="p-2.5 rounded-lg bg-dungeon-900 border border-glow-purple/40">
                <span className="text-[10px] text-glow-purple font-mono block uppercase">↳ {pf}</span>
                <span className="text-sm font-mono text-glow-cyan font-bold">idx {currentStep[pf]}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTROLS ── */}
      <div className="flex flex-col xs:flex-row items-center justify-between gap-3 border-t border-dungeon-700/60 pt-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setStepIndex(0); setIsPlaying(false); prevStepRef.current = null; }}
            title="Reset"
            className="p-1.5 rounded-lg bg-dungeon-800 hover:bg-dungeon-700 text-slate-300 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => {
              prevStepRef.current = steps[stepIndex - 1] || null;
              setStepIndex(i => Math.max(0, i - 1));
              setIsPlaying(false);
            }}
            disabled={stepIndex === 0}
            className="p-1.5 rounded-lg bg-dungeon-800 hover:bg-dungeon-700 text-slate-300 disabled:opacity-40 transition-colors"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => {
              prevStepRef.current = currentStep;
              setStepIndex(i => Math.min(steps.length - 1, i + 1));
              setIsPlaying(false);
            }}
            disabled={stepIndex === steps.length - 1}
            className="p-1.5 rounded-lg bg-dungeon-800 hover:bg-dungeon-700 text-slate-300 disabled:opacity-40 transition-colors"
          >
            <SkipForward size={14} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Speed:</span>
            {[0.5, 1, 2].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                  speed === s ? 'bg-glow-gold/20 text-glow-gold font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <span className="font-mono text-slate-400">
            <span className="text-glow-gold font-semibold">{stepIndex + 1}</span> / {steps.length}
          </span>
        </div>
      </div>
    </div>
  );
}
