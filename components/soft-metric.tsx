'use client';

import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface SoftMetricProps {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}

export function SoftMetric({ label, hint, value, onChange }: SoftMetricProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-panel p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-medium text-white md:text-lg">{label}</p>
          <p className="mt-1 text-sm text-slate-400">{hint}</p>
        </div>
        <div className="rounded-full border border-cyan-200/20 bg-cyan-100/10 px-3 py-1 text-sm font-medium text-cyan-100">
          {value}/10
        </div>
      </div>

      <div className="mt-5">
        <input
          aria-label={label}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-300"
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value))}
        />
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>1</span>
          <span>10</span>
        </div>
      </div>
    </motion.div>
  );
}
