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
              className={`flex items-center justify-between text-sm rounded-lg border px-3.5 py-2.5 transition-all ${
                collected
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : attempted
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-dungeon-900/60 border-dungeon-700/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {collected ? (
                  <CheckCircle2 size={15} className="text-[#34c759] shrink-0" />
                ) : attempted ? (
                  <XCircle size={15} className="text-[#ff3b30] shrink-0" />
                ) : key.isHidden ? (
                  <Lock size={14} className="text-slate-500 shrink-0" />
                ) : (
                  <KeyRound size={14} className="text-glow-gold/70 shrink-0" />
                )}
                <div>
                  <span className={key.isHidden && !collected ? 'text-slate-400 font-medium' : 'text-slate-200 font-medium'}>
                    {key.type}
                  </span>
                  {key.isHidden && (
                    <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {attempted ? (
                  <motion.span
                    key={collected ? 'collected' : 'failed'}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-xs font-semibold tracking-wide flex items-center gap-1 ${
                      collected ? 'text-[#34c759]' : 'text-[#ff3b30]'
                    }`}
                  >
                    {collected ? '✓ KEY COLLECTED' : '✗ KEY LOCKED'}
                  </motion.span>
                ) : key.isHidden ? (
                  <span className="text-slate-500 text-[11px] font-mono">
                    Tests on Submit
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px] font-mono">
                    Public Key
                  </span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
