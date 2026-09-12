import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight, RotateCcw, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

/**
 * Problem of the Day (POTD) Card
 * Selects a daily spaced repetition problem from the user's previously solved doors.
 * If no doors are completed yet, falls back to Door 1.
 */
export default function POTDCard({ doors = [], user }) {
  const navigate = useNavigate();
  const isLight = useThemeStore((state) => state.theme) === 'light';

  const { potdDoor, isRevision, completedCount } = useMemo(() => {
    const completed = doors.filter((d) => d.status === 'COMPLETED');
    const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    
    // Simple deterministic hash for consistent daily selection
    const dayHash = todayStr.split('-').reduce((acc, val) => (acc * 37 + Number(val)) % 10007, 7);

    if (completed.length > 0) {
      const selected = completed[Math.abs(dayHash) % completed.length];
      return {
        potdDoor: selected,
        isRevision: true,
        completedCount: completed.length,
      };
    }

    const firstDoor = doors.find((d) => d.doorNumber === 1) || doors[0] || null;
    return {
      potdDoor: firstDoor,
      isRevision: false,
      completedCount: 0,
    };
  }, [doors]);

  if (!potdDoor) return null;

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date());

  const difficultyColors = {
    easy: isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30',
    medium: isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-950/50 text-amber-400 border-amber-500/30',
    hard: isLight ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-rose-950/50 text-rose-400 border-rose-500/30',
  };

  const diffKey = (potdDoor.difficulty || 'medium').toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all mb-6 ${
        isLight
          ? 'bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-white border-[#ff9500]/30 shadow-[0_4px_24px_rgba(255,149,0,0.08)]'
          : 'bg-gradient-to-r from-[#241a10] via-[#1c1c1e] to-[#161618] border-[#ff9500]/30 shadow-[0_4px_30px_rgba(255,149,0,0.12)]'
      }`}
    >
      {/* Glow orb */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9500]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="space-y-2">
          {/* Header pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ff9500] text-black shadow-sm">
              <Sparkles size={12} /> POTD · Daily Quest
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border ${
              isLight ? 'bg-white/80 border-black/10 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
            }`}>
              <Calendar size={11} /> {todayFormatted}
            </span>

            {isRevision ? (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono border ${
                isLight ? 'bg-violet-50 border-violet-200 text-violet-700 font-semibold' : 'bg-violet-950/40 border-violet-500/30 text-violet-300'
              }`}>
                <RotateCcw size={11} /> Spaced Revision ({completedCount} Solved Pool)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldCheck size={11} /> Starter Challenge
              </span>
            )}
          </div>

          {/* Problem title */}
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold flex items-center gap-2 flex-wrap">
              <span className="text-[#ff9500]">Door {potdDoor.doorNumber}:</span>
              <span>{potdDoor.title}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isRevision
                ? 'Daily spaced repetition keeps your algorithm patterns fresh in memory.'
                : 'Solve your first dungeon door today to start your daily streak!'}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded-md border capitalize font-medium ${difficultyColors[diffKey] || difficultyColors.medium}`}>
              {potdDoor.difficulty}
            </span>

            {potdDoor.topic && (
              <span className={`px-2 py-0.5 rounded-md border ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
              }`}>
                {potdDoor.topic}
              </span>
            )}

            <span className="flex items-center gap-1 text-[#ff9500] font-semibold">
              <Zap size={13} /> +{potdDoor.xp || 50} XP + Daily Streak Bonus
            </span>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => navigate(`/door/${potdDoor.doorNumber}`)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-display font-semibold text-xs sm:text-sm text-black bg-gradient-to-r from-[#ff9500] to-amber-400 hover:brightness-110 shadow-lg shadow-[#ff9500]/25 transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5"
          >
            <span>{isRevision ? 'Re-Solve Today’s POTD' : 'Start Today’s Quest'}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
