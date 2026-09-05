import { motion } from 'framer-motion';

export default function XPBar({ xp, level }) {
  const xpIntoLevel = xp % 1000;
  const percent = (xpIntoLevel / 1000) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Level {level}</span>
        <span>{xpIntoLevel} / 1000 XP</span>
      </div>
      <div className="h-2 rounded-full bg-dungeon-700 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-glow-purple to-glow-cyan"
        />
      </div>
    </div>
  );
}
