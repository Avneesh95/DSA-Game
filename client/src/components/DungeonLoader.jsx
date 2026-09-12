import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, Sparkles, Key, Cpu, Zap, Compass } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

const DSA_TIPS = [
  {
    title: 'Two Pointers Technique',
    body: 'Converting an O(N²) nested search on a sorted array into O(N) by moving left and right inward.',
    icon: '⚡',
  },
  {
    title: 'Sliding Window Pattern',
    body: 'Great for contiguous subarrays/substrings. Expand right to satisfy constraints, contract left to minimize.',
    icon: '🪟',
  },
  {
    title: 'Fast & Slow Pointers',
    body: 'Floyd\'s Cycle Finding algorithm detects loops in linked lists using O(1) extra space.',
    icon: '🐇',
  },
  {
    title: 'Prefix Sums',
    body: 'Precomputing prefix sums allows answering range sum queries in instant O(1) time.',
    icon: '📊',
  },
  {
    title: 'Binary Search Mastery',
    body: 'Binary search applies to any monotonic search space, not just sorted arrays (e.g. search on answers).',
    icon: '🎯',
  },
  {
    title: 'Dynamic Programming Principle',
    body: 'Identify overlapping subproblems and optimal substructure. State definition is 80% of the solution.',
    icon: '🧠',
  },
  {
    title: 'Bit Manipulation Trick',
    body: 'x & (x - 1) clears the lowest set bit. Great for counting set bits in O(k) where k is the number of 1s.',
    icon: '💡',
  },
  {
    title: 'Tree Traversals',
    body: 'Inorder on a Binary Search Tree (BST) visits nodes in strictly sorted ascending order.',
    icon: '🌲',
  },
];

export default function DungeonLoader({ message = 'Waking up dungeon servers...' }) {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * DSA_TIPS.length));
  const isLight = useThemeStore((state) => state.theme) === 'light';

  // Rotate tips every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % DSA_TIPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentTip = DSA_TIPS[tipIndex];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-96 h-96 rounded-full bg-[#ff9500]/10 dark:bg-[#ff9500]/15 blur-3xl animate-pulse" />
        <div className="w-80 h-80 rounded-full bg-violet-600/10 dark:bg-violet-600/20 blur-3xl -translate-y-12 animate-pulse delay-700" />
      </div>

      {/* Main Animated Portal / Door */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        <div className="relative mb-6">
          {/* Glowing ring */}
          <motion.div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-dashed border-[#ff9500]/40 flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />

          {/* Floating Key */}
          <motion.div
            className="absolute -top-2 -right-2 p-2 rounded-xl bg-[#ff9500] text-black shadow-lg shadow-[#ff9500]/40"
            animate={{ y: [-4, 4, -4], rotate: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Key size={18} />
          </motion.div>

          {/* Center Glowing Door Icon */}
          <motion.div
            className={`absolute inset-2 rounded-2xl flex items-center justify-center shadow-2xl border ${
              isLight
                ? 'bg-gradient-to-b from-white to-orange-50/50 border-[#ff9500]/30 text-[#ff9500]'
                : 'bg-gradient-to-b from-slate-900 to-black border-white/10 text-[#ff9500]'
            }`}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <DoorOpen size={44} className="drop-shadow-[0_0_15px_rgba(255,149,0,0.5)]" />
          </motion.div>
        </div>

        {/* Title and Status */}
        <h2 className="font-display text-lg sm:text-xl font-bold mb-1 tracking-wide">
          <span className="text-[#ff9500]">DSA</span> 100 DOORS
        </h2>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-6 border bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.08] dark:border-white/[0.1] text-slate-600 dark:text-slate-300">
          <Cpu size={13} className="animate-pulse text-[#ff9500]" />
          <span>{message}</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9500] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff9500]" />
          </span>
        </div>

        {/* Smooth Loading Bar */}
        <div className="w-64 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-8 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff9500] via-amber-400 to-violet-500 rounded-full"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Dynamic DSA Pro-Tip Card */}
        <div
          className={`w-full rounded-2xl p-4 border text-left transition-all duration-300 ${
            isLight
              ? 'bg-white/80 border-slate-200 shadow-sm'
              : 'bg-[#1c1c1e]/80 border-white/[0.08] shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-[#ff9500]">
              <Sparkles size={13} /> Algorithmic Tip
            </span>
            <span className="flex items-center gap-1">
              <Compass size={12} /> Pro Tip
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <h4 className="text-sm font-semibold mb-1 flex items-center gap-1.5">
                <span>{currentTip.icon}</span>
                <span>{currentTip.title}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {currentTip.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
