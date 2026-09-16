import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, ArrowRight, RotateCcw, CheckCircle2,
  ShieldCheck, Calendar, Clock, Award, Flame, Lightbulb,
} from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

const DAILY_PRO_TIPS = [
  'Before coding, dry-run your logic with at least one base case and one edge case.',
  'Always check constraints: If N <= 10^5, aim for O(n) or O(n log n). If N <= 20, 2^N backtracking is expected.',
  'When you see "subarray with target sum", immediately consider Prefix Sum + Hash Map or Sliding Window.',
  'Monotonic Stacks give you the Next Greater / Smaller element in O(1) amortized per item.',
  'Two Pointers technique eliminates O(n^2) brute force whenever the data is sorted or partitioned.',
  'Binary Search is not just for arrays: use Binary Search on the Answer Space whenever a monotonic predicate exists.',
  'For Tree questions, try postorder traversal if the answer depends on subtree returns.',
];

/**
 * Problem of the Day (POTD) Card
 * Featuring countdown to reset, daily tip, streak multipliers, and instant solver.
 */
export default function POTDCard({ doors = [], user }) {
  const navigate = useNavigate();
  const isLight = useThemeStore((state) => state.theme) === 'light';

  // Live countdown timer until next UTC midnight reset
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const diff = Math.max(0, tomorrow.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const { potdDoor, isRevision, completedCount, dailyTip } = useMemo(() => {
    const completed = doors.filter((d) => d.status === 'COMPLETED');
    const todayStr = new Date().toISOString().slice(0, 10);
    const dayHash = todayStr.split('-').reduce((acc, val) => (acc * 37 + Number(val)) % 10007, 7);

    const tip = DAILY_PRO_TIPS[Math.abs(dayHash) % DAILY_PRO_TIPS.length];

    if (completed.length > 0) {
      const selected = completed[Math.abs(dayHash) % completed.length];
      return {
        potdDoor: selected,
        isRevision: true,
        completedCount: completed.length,
        dailyTip: tip,
      };
    }

    const firstDoor = doors.find((d) => d.doorNumber === 1) || doors[0] || null;
    return {
      potdDoor: firstDoor,
      isRevision: false,
      completedCount: 0,
      dailyTip: tip,
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
      className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all mb-6 ${
        isLight
          ? 'bg-gradient-to-r from-orange-50/95 via-amber-50/60 to-white border-[#ff9500]/40 shadow-[0_8px_30px_rgba(255,149,0,0.12)]'
          : 'bg-gradient-to-r from-[#24170a] via-[#1c1c1e] to-[#141416] border-[#ff9500]/40 shadow-[0_8px_32px_rgba(255,149,0,0.16)]'
      }`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#ff9500]/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Side: Badges & Problem Details */}
        <div className="space-y-3 flex-1">
          
          {/* Header Badge Pill Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ff9500] text-black shadow-md shadow-[#ff9500]/25">
              <Sparkles size={12} /> POTD · Daily Challenge
            </span>

            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border ${
              isLight ? 'bg-white/80 border-black/10 text-slate-700 font-medium' : 'bg-white/5 border-white/10 text-slate-300'
            }`}>
              <Calendar size={11} /> {todayFormatted}
            </span>

            {timeLeft && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono border ${
                isLight ? 'bg-amber-100/70 border-amber-300 text-amber-900 font-semibold' : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}>
                <Clock size={11} className="animate-pulse" /> Resets in: {timeLeft}
              </span>
            )}

            {isRevision ? (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                isLight ? 'bg-violet-50 border-violet-200 text-violet-700 font-semibold' : 'bg-violet-950/40 border-violet-500/30 text-violet-300'
              }`}>
                <RotateCcw size={11} /> Spaced Revision ({completedCount} Solved Pool)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                <ShieldCheck size={11} /> Starter Quest
              </span>
            )}
          </div>

          {/* Problem Title & Number */}
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2 flex-wrap">
              <span className="text-[#ff9500]">Door {potdDoor.doorNumber}:</span>
              <span>{potdDoor.title}</span>
            </h3>
            
            {/* Daily Wisdom Tip */}
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-start gap-1.5 italic">
              <Lightbulb size={13} className="text-[#ff9500] shrink-0 mt-0.5" />
              <span><strong className="not-italic text-slate-700 dark:text-slate-200">Daily Pro-Tip:</strong> {dailyTip}</span>
            </p>
          </div>

          {/* Badges & Rewards */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono pt-1">
            <span className={`px-2.5 py-0.5 rounded-md border capitalize font-semibold ${difficultyColors[diffKey] || difficultyColors.medium}`}>
              {potdDoor.difficulty}
            </span>

            {potdDoor.topic && (
              <span className={`px-2.5 py-0.5 rounded-md border ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-700 font-medium' : 'bg-white/5 border-white/10 text-slate-300'
              }`}>
                {potdDoor.topic}
              </span>
            )}

            <span className="flex items-center gap-1 text-[#ff9500] font-bold">
              <Zap size={13} /> +{potdDoor.xp || 50} XP Base
            </span>

            {user?.streak > 0 && (
              <span className="flex items-center gap-1 text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                <Flame size={12} /> {user.streak}x Streak Combo
              </span>
            )}
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => navigate(`/door/${potdDoor.doorNumber}`)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-display font-bold text-sm text-black bg-gradient-to-r from-[#ff9500] to-amber-400 hover:brightness-110 shadow-lg shadow-[#ff9500]/30 transition-all flex items-center justify-center gap-2.5 group hover:-translate-y-0.5"
          >
            <span>{isRevision ? 'Re-Solve Today’s Quest' : 'Unlock Today’s POTD'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
