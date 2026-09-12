import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Terminal, Bug, Clock } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

/**
 * LeetCode-style Test Results Panel
 * Shows tabbed test cases with input/expected/actual/status for each key.
 */
export default function TestResultsPanel({ keyResults, compileError, showDebug, onToggleDebug }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const isLight = useThemeStore((s) => s.theme) === 'light';

  const hasResults = Array.isArray(keyResults) && keyResults.length > 0;
  const hasError = Boolean(compileError);

  if (!hasResults && !hasError) return null;

  const passedCount = hasResults ? keyResults.filter((k) => k.passed).length : 0;
  const totalCount = hasResults ? keyResults.length : 0;
  const allPassed = passedCount === totalCount && totalCount > 0;
  const selected = hasResults ? keyResults[selectedIdx] || keyResults[0] : null;

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-black/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#1c1c1e] border-white/[0.08] shadow-[0_2px_32px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* ── Header ── */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b ${
          isLight ? 'bg-[#f5f5f7] border-black/[0.06]' : 'bg-black/40 border-white/[0.08]'
        }`}
      >
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle size={16} className="text-[#34c759]" />
          ) : hasError ? (
            <XCircle size={16} className="text-[#ff3b30]" />
          ) : (
            <XCircle size={16} className="text-[#ff9500]" />
          )}
          <span
            className={`text-sm font-semibold ${
              allPassed
                ? 'text-[#34c759]'
                : hasError
                ? 'text-[#ff3b30]'
                : 'text-[#ff9500]'
            }`}
          >
            {hasError
              ? 'Compile Error'
              : allPassed
              ? 'Accepted'
              : `${passedCount}/${totalCount} Passed`}
          </span>
        </div>

        {/* Debug toggle */}
        <button
          onClick={onToggleDebug}
          className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all border ${
            showDebug
              ? isLight
                ? 'bg-rose-100 border-rose-300 text-rose-700'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : isLight
              ? 'bg-transparent border-black/[0.08] text-[#6e6e73] hover:bg-black/[0.04]'
              : 'bg-transparent border-white/[0.08] text-white/50 hover:bg-white/[0.06]'
          }`}
          title="Toggle debug output"
        >
          <Bug size={11} />
          Debug
        </button>
      </div>

      {/* ── Compile Error ── */}
      {hasError && (
        <div className={`p-4 ${isLight ? 'bg-rose-50' : 'bg-rose-950/40'}`}>
          <div className="flex items-start gap-2">
            <Terminal size={14} className="text-rose-500 mt-0.5 shrink-0" />
            <pre
              className={`text-xs font-mono whitespace-pre-wrap break-all leading-relaxed max-h-48 overflow-y-auto ${
                isLight ? 'text-rose-800' : 'text-rose-300'
              }`}
            >
              {compileError}
            </pre>
          </div>
        </div>
      )}

      {/* ── Test Case Tabs ── */}
      {hasResults && (
        <>
          <div
            className={`flex items-center gap-1 px-3 py-2 border-b overflow-x-auto ${
              isLight ? 'border-black/[0.06]' : 'border-white/[0.06]'
            }`}
          >
            {keyResults.map((kr, idx) => {
              const isSel = selectedIdx === idx;
              return (
                <button
                  key={kr.keyId || idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                    isSel
                      ? kr.passed
                        ? isLight
                          ? 'bg-emerald-100 text-emerald-800 font-semibold'
                          : 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : isLight
                        ? 'bg-rose-100 text-rose-800 font-semibold'
                        : 'bg-rose-500/20 text-rose-400 font-semibold'
                      : isLight
                      ? 'text-[#6e6e73] hover:bg-black/[0.04]'
                      : 'text-white/50 hover:bg-white/[0.06]'
                  }`}
                >
                  {kr.passed ? (
                    <CheckCircle size={12} className={isSel ? '' : 'text-emerald-500'} />
                  ) : (
                    <XCircle size={12} className={isSel ? '' : 'text-rose-500'} />
                  )}
                  {kr.isHidden ? `Hidden ${idx + 1}` : `Case ${idx + 1}`}
                </button>
              );
            })}
          </div>

          {/* ── Selected Test Case Detail ── */}
          {selected && (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="p-4 space-y-3"
              >
                {/* Hidden key – no details */}
                {selected.isHidden && !selected.input ? (
                  <div className={`text-xs font-mono ${isLight ? 'text-[#6e6e73]' : 'text-white/40'}`}>
                    <span className="italic">Hidden test case — input and expected output are not shown.</span>
                    <div className="mt-2 flex items-center gap-1.5">
                      Status:{' '}
                      {selected.passed ? (
                        <span className="text-[#34c759] font-semibold flex items-center gap-1">
                          <CheckCircle size={12} /> Passed
                        </span>
                      ) : (
                        <span className="text-[#ff3b30] font-semibold flex items-center gap-1">
                          <XCircle size={12} /> Failed
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Input */}
                    {selected.input && (
                      <div>
                        <label className={`text-[10px] font-mono uppercase tracking-wider font-semibold mb-1 block ${isLight ? 'text-[#6e6e73]' : 'text-white/40'}`}>
                          Input
                        </label>
                        <div
                          className={`rounded-lg p-2.5 font-mono text-xs break-all ${
                            isLight ? 'bg-[#f5f5f7] text-[#1d1d1f]' : 'bg-black/30 text-white/80'
                          }`}
                        >
                          {selected.input}
                        </div>
                      </div>
                    )}

                    {/* Expected vs Actual — side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      {selected.expectedOutput !== null && selected.expectedOutput !== undefined && (
                        <div>
                          <label className={`text-[10px] font-mono uppercase tracking-wider font-semibold mb-1 block ${isLight ? 'text-[#6e6e73]' : 'text-white/40'}`}>
                            Expected
                          </label>
                          <div
                            className={`rounded-lg p-2.5 font-mono text-xs break-all border ${
                              isLight
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                            }`}
                          >
                            {String(selected.expectedOutput)}
                          </div>
                        </div>
                      )}

                      {selected.actualOutput !== null && selected.actualOutput !== undefined && (
                        <div>
                          <label className={`text-[10px] font-mono uppercase tracking-wider font-semibold mb-1 block ${isLight ? 'text-[#6e6e73]' : 'text-white/40'}`}>
                            Output
                          </label>
                          <div
                            className={`rounded-lg p-2.5 font-mono text-xs break-all border ${
                              selected.passed
                                ? isLight
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                                : isLight
                                ? 'bg-rose-50 border-rose-200 text-rose-900'
                                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                            }`}
                          >
                            {String(selected.actualOutput)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Runtime */}
                    {selected.runtimeMs > 0 && (
                      <div className={`flex items-center gap-1.5 text-[11px] font-mono ${isLight ? 'text-[#6e6e73]' : 'text-white/40'}`}>
                        <Clock size={11} />
                        Runtime: {selected.runtimeMs} ms
                      </div>
                    )}
                  </>
                )}

                {/* ── Debug Section ── */}
                {showDebug && (selected.error || selected.stderr) && (
                  <div
                    className={`rounded-lg border p-3 mt-2 ${
                      isLight
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-amber-950/30 border-amber-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Bug size={12} className="text-amber-500" />
                      <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                        Debug Output
                      </span>
                    </div>
                    <pre
                      className={`text-xs font-mono whitespace-pre-wrap break-all leading-relaxed max-h-40 overflow-y-auto ${
                        isLight ? 'text-amber-900' : 'text-amber-200'
                      }`}
                    >
                      {selected.error || selected.stderr}
                    </pre>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
}
