'use client';

import { motion } from 'framer-motion';

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>Paso {current + 1} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
