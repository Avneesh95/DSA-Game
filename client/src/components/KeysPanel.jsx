import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Lock, CheckCircle2, XCircle } from 'lucide-react';

export default function KeysPanel({ keys, keyResults }) {
  // Merge key metadata with the latest run/submit results, if any
  const resultsById = new Map((keyResults || []).map((r) => [String(r.keyId), r]));

  return (
    <div className="door-panel">
      <h3 className="font-display text-sm text-glow-gold mb-3 flex items-center gap-2">
        <KeyRound size={16} /> Keys to Unlock
      </h3>
      <div className="space-y-2">
        {keys.map((key) => {
          const result = resultsById.get(String(key._id));
          const collected = result?.passed;
          const attempted = Boolean(result);

          return (
            <div
              key={key._id}
              className="flex items-center justify-between text-sm rounded-lg bg-dungeon-900/60 border border-dungeon-700 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                {key.isHidden && !collected ? (
                  <Lock size={14} className="text-slate-500" />
                ) : collected ? (
                  <CheckCircle2 size={14} className="text-glow-emerald" />
                ) : attempted ? (
                  <XCircle size={14} className="text-glow-rose" />
                ) : (
                  <KeyRound size={14} className="text-slate-500" />
                )}
                <span className={key.isHidden ? 'text-slate-500 italic' : 'text-slate-200'}>
                  {key.type}
                  {key.isHidden ? ' (hidden)' : ''}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {attempted && (
                  <motion.span
                    key={collected ? 'collected' : 'locked'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={collected ? 'text-glow-emerald text-xs font-semibold' : 'text-glow-rose text-xs font-semibold'}
                  >
                    {collected ? '✓ KEY COLLECTED' : '✗ KEY STILL LOCKED'}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
