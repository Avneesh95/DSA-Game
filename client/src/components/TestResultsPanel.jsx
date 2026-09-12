import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Terminal, Bug, Clock, Layers, Sparkles, AlertTriangle } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

/**
 * Parses a single value or expression into a structured diagram descriptor
 */
function parseSingleStructure(label, rawVal) {
  if (rawVal === undefined || rawVal === null) return null;
  const str = String(rawVal).trim();

  // Try direct JSON
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && Array.isArray(parsed[0])) {
        return { label, type: 'grid', data: parsed };
      }
      return { label, type: 'array', data: parsed };
    }
  } catch (_) {}

  // 2D Grid [[...],[...]]
  const gridIdx = str.indexOf('[[');
  if (gridIdx !== -1) {
    try {
      const sub = str.slice(gridIdx, str.lastIndexOf(']]') + 2).replace(/'/g, '"');
      const g = JSON.parse(sub);
      if (Array.isArray(g) && Array.isArray(g[0])) return { label, type: 'grid', data: g };
    } catch (_) {}
  }

  // Linked list: 1 -> 2 -> 3
  if (str.includes('->')) {
    const parts = str.split('->').map((s) => s.trim()).filter(Boolean);
    return { label, type: 'linked-list', data: parts };
  }

  // 1D Array [ ... ]
  const arrMatch = str.match(/\[([^\]]*)\]/);
  if (arrMatch) {
    const items = arrMatch[1]
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
      .map((s) => (isNaN(Number(s)) ? s : Number(s)));
    if (items.length > 0) return { label, type: 'array', data: items };
  }

  // String "..."
  const strMatch = str.match(/^"([^"]*)"|'([^']*)'$/);
  if (strMatch) {
    const s = strMatch[1] || strMatch[2] || '';
    if (s.length > 0 && s.length <= 40) return { label, type: 'string', data: s.split('') };
  }

  // Scalar number / bool
  if (/^-?\d+(\.\d+)?$/.test(str) || str === 'true' || str === 'false') {
    return { label, type: 'scalar', data: str };
  }

  return null;
}

/**
 * Parses full raw input string, extracting multiple named parameters if present
 */
function parseInputStructures(rawInput) {
  if (!rawInput) return [];
  const str = String(rawInput).trim();

  // Check if input contains named params e.g. "nums = [2, 7, 11], target = 9"
  if (str.includes('=')) {
    const params = [];
    const regex = /(?:^|,\s*)([a-zA-Z_]\w*)\s*=\s*(\[\[[\s\S]*?\]\]|\[[\s\S]*?\]|"[^"]*"|'[^']*'|[^,]+)/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      const name = match[1].trim();
      const val = match[2].trim();
      const parsed = parseSingleStructure(name, val);
      if (parsed) params.push(parsed);
    }
    if (params.length > 0) return params;
  }

  // Single anonymous input
  const single = parseSingleStructure(null, str);
  return single ? [single] : [];
}

/**
 * Diagram visualizer for input data structures
 */
function TestcaseDiagram({ inputStr, isLight }) {
  const structures = parseInputStructures(inputStr);
  if (!structures || structures.length === 0) return null;

  return (
    <div className="mt-2 mb-1 space-y-2">
      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
        <Layers size={11} className="text-violet-500" /> Structure Visualizer
      </div>

      <div className="space-y-2">
        {structures.map((struct, idx) => (
          <div key={idx} className="space-y-1">
            {struct.label && (
              <span className="text-[11px] font-mono font-bold text-[#ff9500]">
                {struct.label} =
              </span>
            )}

            {/* 1D Array */}
            {struct.type === 'array' && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto max-w-full">
                {struct.data.slice(0, 25).map((val, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`min-w-[34px] h-[34px] px-2 flex items-center justify-center rounded-lg border font-mono text-xs font-semibold shadow-sm ${
                        isLight
                          ? 'bg-white border-violet-200 text-violet-900 shadow-violet-500/5'
                          : 'bg-violet-950/40 border-violet-500/40 text-violet-200 shadow-violet-500/10'
                      }`}
                    >
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      {i}
                    </span>
                  </div>
                ))}
                {struct.data.length > 25 && (
                  <div className="flex items-center text-xs font-mono text-slate-400 px-2">
                    +{struct.data.length - 25} more
                  </div>
                )}
              </div>
            )}

            {/* Grid / 2D Matrix */}
            {struct.type === 'grid' && (
              <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto max-w-full">
                {struct.data.slice(0, 8).map((row, r) => (
                  <div key={r} className="flex gap-1.5">
                    {Array.isArray(row) &&
                      row.slice(0, 12).map((cell, c) => (
                        <div
                          key={c}
                          className={`w-8 h-8 flex items-center justify-center rounded-md border font-mono text-xs font-semibold ${
                            isLight
                              ? 'bg-white border-violet-200 text-violet-900'
                              : 'bg-violet-950/40 border-violet-500/40 text-violet-200'
                          }`}
                        >
                          {String(cell)}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}

            {/* Linked List */}
            {struct.type === 'linked-list' && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto max-w-full">
                {struct.data.slice(0, 15).map((val, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className={`min-w-[32px] h-[32px] px-2 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                        isLight
                          ? 'bg-white border-violet-300 text-violet-900'
                          : 'bg-violet-950/60 border-violet-500/50 text-violet-200'
                      }`}
                    >
                      {val}
                    </div>
                    {i < struct.data.length - 1 && (
                      <span className="text-violet-400 font-bold text-xs font-mono">→</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* String */}
            {struct.type === 'string' && (
              <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-black/5 dark:bg-black/40 border border-black/[0.06] dark:border-white/[0.08] overflow-x-auto max-w-full">
                {struct.data.slice(0, 30).map((char, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-md border font-mono text-xs font-semibold ${
                        isLight
                          ? 'bg-white border-sky-200 text-sky-900'
                          : 'bg-sky-950/40 border-sky-500/40 text-sky-200'
                      }`}
                    >
                      {char === ' ' ? '␣' : char}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                      {i}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Scalar */}
            {struct.type === 'scalar' && (
              <span className={`inline-block px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${
                isLight ? 'bg-white border-amber-300 text-amber-900' : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}>
                {struct.data}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * LeetCode-style Test Results & Debugger Panel
 */
export default function TestResultsPanel({ keyResults, compileError, showDebug, onToggleDebug, mode = 'run' }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeView, setActiveView] = useState(() => (mode === 'debug' || showDebug ? 'console' : 'testcases'));
  const isLight = useThemeStore((s) => s.theme) === 'light';

  useEffect(() => {
    if (mode === 'debug' || showDebug) {
      setActiveView('console');
    }
  }, [mode, showDebug]);

  const hasResults = Array.isArray(keyResults) && keyResults.length > 0;
  const hasError = Boolean(compileError);

  if (!hasResults && !hasError) return null;

  const passedCount = hasResults ? keyResults.filter((k) => k.passed).length : 0;
  const totalCount = hasResults ? keyResults.length : 0;
  const allPassed = passedCount === totalCount && totalCount > 0;
  const selected = hasResults ? keyResults[selectedIdx] || keyResults[0] : null;

  // Collect any debug stdout or stderr across all cases
  const debugLogs = hasResults
    ? keyResults
        .map((k, i) => {
          const out = [];
          if (k.error) out.push(`[Case ${i + 1} Error] ${k.error}`);
          if (k.stderr) out.push(`[Case ${i + 1} Stderr] ${k.stderr}`);
          return out.join('\n');
        })
        .filter(Boolean)
        .join('\n\n')
    : '';

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
        isLight
          ? 'bg-white border-black/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#1c1c1e] border-white/[0.08] shadow-[0_2px_32px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* ── Top Bar with Status and Tab Buttons ── */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b gap-3 ${
          isLight ? 'bg-[#f5f5f7] border-black/[0.06]' : 'bg-black/40 border-white/[0.08]'
        }`}
      >
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle size={17} className="text-[#34c759]" />
          ) : hasError ? (
            <AlertTriangle size={17} className="text-[#ff3b30]" />
          ) : (
            <XCircle size={17} className="text-[#ff3b30]" />
          )}
          <span
            className={`text-sm font-display font-semibold ${
              allPassed
                ? 'text-[#34c759]'
                : hasError
                ? 'text-[#ff3b30]'
                : 'text-[#ff3b30]'
            }`}
          >
            {hasError
              ? 'Compile Error'
              : allPassed
              ? 'Accepted'
              : `${passedCount}/${totalCount} Testcases Passed`}
          </span>
        </div>

        {/* View switcher tabs: Testcases vs Console */}
        <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-lg border border-black/[0.04] dark:border-white/[0.06]">
          <button
            onClick={() => setActiveView('testcases')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'testcases'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/[0.15] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Layers size={12} /> Testcases
          </button>
          <button
            onClick={() => setActiveView('console')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeView === 'console'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/[0.15] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Bug size={12} /> Debug Console
          </button>
        </div>
      </div>

      {/* ── Compile Error View ── */}
      {hasError && (
        <div className={`p-4 ${isLight ? 'bg-rose-50' : 'bg-rose-950/30'}`}>
          <div className="flex items-start gap-2.5">
            <Terminal size={15} className="text-rose-500 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-1">
                Compilation Output
              </div>
              <pre
                className={`text-xs font-mono whitespace-pre-wrap break-all leading-relaxed max-h-56 overflow-y-auto rounded-lg p-3 border ${
                  isLight
                    ? 'bg-white/80 border-rose-200 text-rose-800'
                    : 'bg-black/40 border-rose-500/30 text-rose-300'
                }`}
              >
                {compileError}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ── Testcases View ── */}
      {hasResults && activeView === 'testcases' && (
        <>
          {/* Case Pills */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-2 border-b overflow-x-auto ${
              isLight ? 'border-black/[0.06] bg-slate-50/50' : 'border-white/[0.06] bg-black/20'
            }`}
          >
            {keyResults.map((kr, idx) => {
              const isSel = selectedIdx === idx;
              return (
                <button
                  key={kr.keyId || idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
                    isSel
                      ? kr.passed
                        ? isLight
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-sm'
                          : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                        : isLight
                        ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold shadow-sm'
                        : 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold shadow-sm'
                      : isLight
                      ? 'border-transparent text-slate-600 hover:bg-black/[0.04]'
                      : 'border-transparent text-slate-400 hover:bg-white/[0.06]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      kr.passed ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  {kr.isHidden ? `Hidden ${idx + 1}` : `Case ${idx + 1}`}
                </button>
              );
            })}
          </div>

          {/* Selected Case Body */}
          {selected && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="p-4 space-y-3.5"
              >
                {selected.isHidden && !selected.input ? (
                  <div className="py-4 text-center">
                    <p className={`text-xs font-mono italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      🔒 Hidden testcase evaluated on Submit — input and expected values are kept secret.
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-400">Result:</span>
                      {selected.passed ? (
                        <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle size={13} /> Passed
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-rose-500 flex items-center gap-1">
                          <XCircle size={13} /> Failed
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Visual Diagram if structure recognized */}
                    {selected.input && (
                      <TestcaseDiagram inputStr={selected.input} isLight={isLight} />
                    )}

                    {/* Raw Input String */}
                    {selected.input && (
                      <div>
                        <label
                          className={`text-[10px] font-mono uppercase tracking-wider font-semibold mb-1 block ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          Input
                        </label>
                        <div
                          className={`rounded-lg p-2.5 font-mono text-xs break-all border ${
                            isLight
                              ? 'bg-slate-50 border-slate-200 text-slate-900'
                              : 'bg-black/30 border-white/[0.06] text-slate-200'
                          }`}
                        >
                          {selected.input}
                        </div>
                      </div>
                    )}

                    {/* Expected vs Your Output Side by Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selected.expectedOutput !== null && selected.expectedOutput !== undefined && (
                        <div>
                          <label
                            className={`text-[10px] font-mono uppercase tracking-wider font-semibold mb-1 block ${
                              isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            Expected Output
                          </label>
                          <div
                            className={`rounded-lg p-2.5 font-mono text-xs break-all border ${
                              isLight
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                            }`}
                          >
                            {String(selected.expectedOutput)}
                          </div>
                        </div>
                      )}

                      {selected.actualOutput !== null && selected.actualOutput !== undefined && (
                        <div>
                          <label
                            className={`text-[10px] font-mono uppercase tracking-wider font-semibold mb-1 block ${
                              isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            Your Output
                          </label>
                          <div
                            className={`rounded-lg p-2.5 font-mono text-xs break-all border ${
                              selected.passed
                                ? isLight
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                                : isLight
                                ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                            }`}
                          >
                            {String(selected.actualOutput)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Runtime pill */}
                    {selected.runtimeMs > 0 && (
                      <div
                        className={`flex items-center gap-1.5 text-[11px] font-mono ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        <Clock size={11} />
                        Execution Time: {selected.runtimeMs} ms
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}

      {/* ── Debug Console View ── */}
      {activeView === 'console' && (
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Terminal size={14} className="text-glow-purple" />
            <span
              className={`text-xs font-mono font-semibold uppercase tracking-wider ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              Standard Output & Debugging Logs
            </span>
          </div>

          {debugLogs || compileError ? (
            <pre
              className={`text-xs font-mono whitespace-pre-wrap break-all leading-relaxed max-h-56 overflow-y-auto rounded-lg p-3 border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-black/40 border-white/[0.08] text-slate-200'
              }`}
            >
              {debugLogs || compileError}
            </pre>
          ) : (
            <div
              className={`p-6 text-center text-xs font-mono rounded-lg border ${
                isLight
                  ? 'bg-slate-50/50 border-slate-200 text-slate-400'
                  : 'bg-black/20 border-white/[0.04] text-slate-500'
              }`}
            >
              No print/debug logs emitted. Use <code className="text-glow-gold">System.out.println()</code>,{' '}
              <code className="text-glow-gold">print()</code>, or <code className="text-glow-gold">cout &lt;&lt;</code> to output debug statements.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
