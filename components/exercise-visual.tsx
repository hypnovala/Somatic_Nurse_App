'use client';

import { motion } from 'framer-motion';
import { SomaticExercise } from '@/lib/types';

interface ExerciseVisualProps {
  exercise: SomaticExercise;
}

const Ring = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute inset-10 rounded-full border border-cyan-200/20"
    animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.35, 0.8, 0.35] }}
    transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay }}
  />
);

export function ExerciseVisual({ exercise }: ExerciseVisualProps) {
  if (exercise.id === 'grounding') {
    return (
      <div className="relative h-[280px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 via-cyan-400/5 to-blue-500/10 p-6">
        <motion.div
          className="absolute inset-x-8 bottom-8 h-16 rounded-full bg-cyan-300/10 blur-2xl"
          animate={{ opacity: [0.35, 0.75, 0.35], scaleX: [0.95, 1.08, 0.95] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-10 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl"
          animate={{ y: [0, 8, 0], opacity: [0.45, 0.72, 0.45] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-x-10 bottom-10 flex items-end justify-center gap-8">
          {[0, 1].map((leg) => (
            <motion.div
              key={leg}
              className="h-28 w-14 rounded-t-[30px] rounded-b-[22px] bg-gradient-to-b from-cyan-200/40 to-blue-500/20 shadow-[0_0_30px_rgba(110,231,249,0.15)]"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: leg * 0.3 }}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cyan-100/10 to-transparent" />
      </div>
    );
  }

  if (exercise.id === 'unwind') {
    return (
      <div className="relative h-[280px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 via-teal-400/5 to-blue-500/10 p-6">
        <motion.div
          className="absolute left-1/2 top-10 h-24 w-24 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-md"
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.04, 0.98, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-24 h-28 w-40 -translate-x-1/2 rounded-[40px] border border-white/10 bg-white/10"
          animate={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-[110px] h-10 w-56 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent blur-sm"
          animate={{ x: [-8, 8, -8] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[18%] top-[108px] h-4 w-28 rounded-full bg-cyan-200/15"
          animate={{ rotate: [10, -6, 10], transformOrigin: 'right center' }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[18%] top-[108px] h-4 w-28 rounded-full bg-cyan-200/15"
          animate={{ rotate: [-10, 6, -10], transformOrigin: 'left center' }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-[154px] h-24 w-20 -translate-x-1/2 rounded-b-[28px] rounded-t-[22px] bg-gradient-to-b from-cyan-200/35 to-blue-500/10"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-[280px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 via-cyan-400/5 to-blue-500/10 p-6">
      <Ring />
      <Ring delay={1.2} />
      <motion.div
        className="absolute inset-[22%] rounded-full bg-cyan-200/12 blur-2xl"
        animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-200/60 to-blue-500/30 shadow-[0_0_40px_rgba(110,231,249,0.24)]"
        animate={{ scale: [0.95, 1.08, 0.95], y: [0, 4, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-16 bottom-10 h-12 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
