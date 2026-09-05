import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  ListOrdered,
  Sparkles,
  ChevronRight,
  Clock,
  HardDrive,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { getAlgorithmGuide } from '../utils/algorithmSteps';

export default function HintPanel({ hints = [], hintsUsed = 0, onUseHint, problem }) {
  const [activeTab, setActiveTab] = useState('hints'); // 'hints' | 'algorithm'
  const [revealedCount, setRevealedCount] = useState(hintsUsed || 0);
  const [algoMode, setAlgoMode] = useState('problem'); // 'problem' | 'blueprint'

  // Generate structured algorithm steps
  const algoGuide = useMemo(() => {
    return getAlgorithmGuide({
      ...problem,
      hints,
    });
  }, [problem, hints]);

  const handleRevealNext = () => {
    if (revealedCount < hints.length) {
      const next = revealedCount + 1;
      setRevealedCount(next);
      if (onUseHint) onUseHint(next);
    }
  };

  const hasBlueprint = Boolean(algoGuide?.blueprintSteps && algoGuide.blueprintSteps.length > 0);

  return (
    <div className="door-panel space-y-3.5 border border-dungeon-600/80 bg-dungeon-950/70 shadow-lg">
      {/* ── Top Header & Tab Switcher ── */}
      <div className="flex items-center justify-between border-b border-dungeon-700/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#ff9500]/10 text-[#ff9500] shrink-0">
            {activeTab === 'hints' ? <Lightbulb size={16} /> : <ListOrdered size={16} />}
          </div>
          <div>
            <h3 className="font-display text-sm text-glow-gold">
              {activeTab === 'hints' ? 'Hints & Guidance' : 'Step-by-Step Algorithm'}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              {activeTab === 'hints'
                ? `${revealedCount} of ${hints.length} hints unlocked`
                : `${algoGuide?.pattern || 'DSA'} · Easy Step-by-Step Guide`}
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-dungeon-900 p-1 rounded-xl border border-dungeon-700 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('hints')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'hints'
                ? 'bg-[#ff9500]/20 text-[#ff9500] font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb size={12} />
            Hints
          </button>
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'algorithm'
                ? 'bg-[#ff9500]/20 text-[#ff9500] font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListOrdered size={12} />
            Algorithm
            <span className="text-[9px] px-1 py-0.2 rounded bg-[#ff9500]/30 text-[#ff9500] font-mono">
              EASY
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── TAB 1: PROGRESSIVE HINTS ── */}
        {activeTab === 'hints' && (
          <motion.div
            key="tab-hints"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="space-y-2">
              {hints.slice(0, revealedCount).map((hint, idx) => (
                <div
                  key={hint.order || idx}
                  className="text-xs bg-dungeon-900/70 border border-dungeon-700/80 rounded-xl px-3.5 py-2.5 transition-all"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ff9500]/15 text-[#ff9500] border border-[#ff9500]/30">
                      Hint {hint.order || idx + 1}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{hint.text}</p>
                </div>
              ))}

              {revealedCount === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-dungeon-700 text-center bg-dungeon-900/30">
                  <p className="text-slate-400 text-xs">
                    Stuck or looking for a push in the right direction?
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Reveal progressive hints one by one without spoiling the complete solution.
                  </p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              {revealedCount < hints.length ? (
                <button
                  onClick={handleRevealNext}
                  className="btn-primary text-xs w-full sm:flex-1 py-2 flex items-center justify-center gap-1.5"
                >
                  <Lightbulb size={13} />
                  Reveal Hint {revealedCount + 1} of {hints.length}
                </button>
              ) : (
                <div className="w-full sm:flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={13} />
                  All hints revealed
                </div>
              )}

              {/* Shortcut to Algorithm */}
              <button
                onClick={() => setActiveTab('algorithm')}
                className="btn-secondary text-xs w-full sm:w-auto py-2 px-3 flex items-center justify-center gap-1 text-[#ff9500] hover:text-[#ff9500]"
                title="View full step-by-step algorithm"
              >
                <span>View Step-by-Step Algorithm</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── TAB 2: EASY STEP-BY-STEP ALGORITHM ── */}
        {activeTab === 'algorithm' && (
          <motion.div
            key="tab-algorithm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Pattern & Complexity Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-dungeon-900/80 border border-dungeon-700/80">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">Pattern:</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#ff9500]/15 text-[#ff9500] border border-[#ff9500]/30 flex items-center gap-1">
                  <Sparkles size={11} />
                  {algoGuide?.pattern || 'Core Algorithm'}
                </span>
              </div>

              {algoGuide?.complexity && (
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock size={11} className="text-[#34c759]" />
                    {algoGuide.complexity.time}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <HardDrive size={11} className="text-[#ff9500]" />
                    {algoGuide.complexity.space}
                  </span>
                </div>
              )}
            </div>

            {/* Sub-toggle: Problem Steps vs Pattern Blueprint */}
            {hasBlueprint && (
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-[11px] text-slate-400 font-mono">View Mode:</span>
                <div className="flex items-center gap-1 bg-dungeon-900/60 p-0.5 rounded-lg border border-dungeon-700/60">
                  <button
                    onClick={() => setAlgoMode('problem')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      algoMode === 'problem'
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Problem Steps
                  </button>
                  <button
                    onClick={() => setAlgoMode('blueprint')}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      algoMode === 'blueprint'
                        ? 'bg-white/10 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Pattern Blueprint
                  </button>
                </div>
              </div>
            )}

            {/* Step-by-Step List */}
            <div className="space-y-2">
              {algoMode === 'problem' ? (
                // Problem-Specific Steps
                algoGuide?.customSteps?.length ? (
                  algoGuide.customSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="group p-3 rounded-xl bg-dungeon-900/60 hover:bg-dungeon-900/90 border border-dungeon-700/80 hover:border-[#ff9500]/40 transition-all"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#ff9500]/20 text-[#ff9500] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#ff9500]/30">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-semibold text-white group-hover:text-[#ff9500] transition-colors">
                              {step.phase || `Step ${idx + 1}`}
                            </span>
                            {step.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                                {step.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{step.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-dungeon-900/60 border border-dungeon-700 text-xs text-slate-300">
                    {algoGuide?.summary || 'Follow optimal linear scan or two-pointer logic.'}
                  </div>
                )
              ) : (
                // Canonical Pattern Blueprint Steps
                algoGuide?.blueprintSteps?.map((item) => (
                  <div
                    key={item.step}
                    className="p-3 rounded-xl bg-dungeon-900/60 hover:bg-dungeon-900/90 border border-dungeon-700/80 hover:border-[#ff9500]/40 transition-all"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        {item.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white mb-0.5">{item.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Complexity & Strategy Insight Card */}
            {algoGuide?.complexity?.note && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-dungeon-900 to-black border border-white/[0.06] text-[11px] flex items-start gap-2">
                <BookOpen size={13} className="text-[#ff9500] shrink-0 mt-0.5" />
                <div className="text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-200">Key Takeaway: </span>
                  {algoGuide.complexity.note}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
