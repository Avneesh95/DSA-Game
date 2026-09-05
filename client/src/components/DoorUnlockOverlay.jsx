import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, Sparkles } from 'lucide-react';

export default function DoorUnlockOverlay({ visible, result, onWatchAgain, onNextDoor, hasNextDoor }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-dungeon-950/90 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="door-panel max-w-md w-full text-center border-glow-emerald/70 shadow-glow"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.8, repeat: 1 }}
              className="flex justify-center mb-3"
            >
              <DoorOpen size={48} className="text-glow-emerald" />
            </motion.div>
            <h2 className="font-display text-xl text-glow-emerald mb-1 flex items-center justify-center gap-2">
              <Sparkles size={18} /> DOOR CLEARED
            </h2>
            {result && (
              <div className="grid grid-cols-2 gap-2 text-sm text-left mt-4 mb-5">
                <StatRow label="Pattern" value={result.pattern} />
                <StatRow label="Difficulty" value={result.difficulty} />
                <StatRow label="Time Complexity" value={result.timeComplexity} />
                <StatRow label="Space Complexity" value={result.spaceComplexity} />
                <StatRow label="Attempts" value={result.attempts} />
                <StatRow label="Hints Used" value={result.hintsUsed} />
                <StatRow label="XP Earned" value={`+${result.xp}`} highlight />
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={onWatchAgain} className="btn-secondary flex-1">
                Watch Again
              </button>
              {hasNextDoor && (
                <button onClick={onNextDoor} className="btn-primary flex-1">
                  Next Door
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div className="bg-dungeon-900/60 rounded-lg px-3 py-2 border border-dungeon-700">
      <div className="text-slate-500 text-xs">{label}</div>
      <div className={highlight ? 'text-glow-gold font-semibold' : 'text-slate-200 font-medium'}>{value}</div>
    </div>
  );
}
