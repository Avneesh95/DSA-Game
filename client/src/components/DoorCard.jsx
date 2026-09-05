import { motion } from 'framer-motion';
import { Lock, DoorOpen, CheckCircle2, Swords, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATE_CONFIG = {
  LOCKED: {
    icon: Lock,
    label: 'Locked',
    classes: 'border-dungeon-700 bg-dungeon-800/40 text-slate-500 grayscale',
  },
  AVAILABLE: {
    icon: DoorOpen,
    label: 'Available',
    classes: 'border-glow-purple/60 bg-dungeon-800 text-slate-100 hover:shadow-glow',
  },
  IN_PROGRESS: {
    icon: Loader2,
    label: 'In Progress',
    classes: 'border-glow-cyan/70 bg-dungeon-800 text-slate-100 hover:shadow-glow-cyan',
  },
  COMPLETED: {
    icon: CheckCircle2,
    label: 'Completed',
    classes: 'border-glow-emerald/70 bg-dungeon-800 text-slate-100',
  },
};

export default function DoorCard({ door }) {
  const config = STATE_CONFIG[door.status] || STATE_CONFIG.LOCKED;
  const Icon = door.isBossDoor ? Swords : config.icon;
  const isClickable = door.status !== 'LOCKED';
  const invitesAttention = door.status === 'AVAILABLE';

  const cardContent = (
    <motion.div
      whileHover={isClickable ? { scale: 1.05, y: -2 } : {}}
      whileTap={isClickable ? { scale: 0.97 } : {}}
      title={`Door ${door.doorNumber}: ${door.title || config.label}`}
      className={`door-panel flex flex-col items-center gap-1.5 py-3 sm:py-4 border transition-shadow ${config.classes} ${
        door.isBossDoor ? 'ring-1 ring-glow-gold/60' : ''
      } ${invitesAttention ? 'animate-pulse-glow' : ''} ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
    >
      <Icon size={20} className={`sm:w-[22px] sm:h-[22px] ${door.isBossDoor ? 'text-glow-gold' : ''}`} />
      <span className="font-display text-xs sm:text-sm">Door {door.doorNumber}</span>
      {door.status !== 'LOCKED' && (
        <span className="text-[10px] sm:text-[11px] text-slate-400 text-center leading-tight px-1 line-clamp-2">
          {door.title}
        </span>
      )}
      {door.isBossDoor && <span className="text-[9px] sm:text-[10px] uppercase tracking-wide text-glow-gold">Boss</span>}
    </motion.div>
  );

  if (!isClickable) {
    return <div title="Complete the previous door to unlock">{cardContent}</div>;
  }

  return <Link to={`/door/${door.doorNumber}`}>{cardContent}</Link>;
}
