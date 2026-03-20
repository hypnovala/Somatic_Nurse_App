'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, NotebookPen, RotateCcw } from 'lucide-react';
import { ResultsPanel } from '@/components/results-panel';
import { SoftMetric } from '@/components/soft-metric';
import { QUESTIONS, generateSomaticReset } from '@/lib/somatic';
import type { CheckInValues, SomaticResult } from '@/lib/types';

const initialValues: CheckInValues = {
  activation: 5,
  fatigue: 5,
  tension: 5,
  breathRestriction: 5,
  support: 5,
};

export function NurseCheckinForm() {
  const [values, setValues] = useState<CheckInValues>(initialValues);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<SomaticResult | null>(null);

  const averageLabel = useMemo(() => {
    const average = Object.values(values).reduce((sum, value) => sum + value, 0) / 5;
    if (average >= 7.5) return 'High load';
    if (average >= 5.5) return 'Moderate load';
    return 'Lower load';
  }, [values]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(generateSomaticReset({ values, notes }));
  };

  const handleReset = () => {
    setValues(initialValues);
    setNotes('');
    setResult(null);
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel overflow-hidden p-6 md:p-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-healingCyan/20 bg-healingCyan/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-healingCyan">
            Somatic Reset for Nurses
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-mist md:text-6xl">
            A calming post-shift reset designed for the body you carried through care.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-mistMuted md:text-lg">
            Check in with your nervous system, receive a grounded supportive response, and follow one brief somatic practice to help you decompress after a difficult shift.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['5 gentle questions', 'Simple 1–10 sliders built for tired minds.'],
              ['Supportive guidance', 'A tailored response based on stress, fatigue, and breath.'],
              ['Audio + visual reset', 'Speech synthesis encouragement with a premium animated cue.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-mist">{title}</p>
                <p className="mt-2 text-sm leading-6 text-mistMuted/80">{copy}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="glass-panel p-6 md:p-8"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-healingCyan/80">Current Check-In</p>
          <h2 className="mt-3 text-2xl font-semibold text-mist">Notice what your body is signaling.</h2>
          <p className="mt-4 subtle-copy">
            There is no right score here. This is simply a quieter way to see what your body needs most right now.
          </p>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-mistMuted/80">Average nervous system load</p>
                <p className="mt-2 text-3xl font-semibold text-mist">{averageLabel}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-healingCyan/20 bg-healingCyan/10 text-lg font-semibold text-healingCyan">
                {Math.round(Object.values(values).reduce((sum, value) => sum + value, 0) / 5)}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {[
              'Built so it can later connect to OpenAI for deeper reflection.',
              'Structured for real TTS, saved sessions, and Supabase histories.',
              'Simple deployment path for GitHub + Vercel workflows.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-mistMuted">
                <span className="mt-1 h-2 w-2 rounded-full bg-softTeal" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.aside>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="grid gap-4">
          {QUESTIONS.map((question) => (
            <SoftMetric
              key={question.key}
              label={question.label}
              hint={question.hint}
              value={values[question.key]}
              onChange={(value) =>
                setValues((current) => ({
                  ...current,
                  [question.key]: value,
                }))
              }
            />
          ))}
        </section>

        <section className="glass-panel p-6 md:p-8">
          <div className="flex items-center gap-3 text-healingCyan">
            <NotebookPen className="h-5 w-5" />
            <h2 className="section-title">Optional notes</h2>
          </div>
          <p className="mt-3 subtle-copy">
            If it helps, leave a few words about what your shift or body feels like right now.
          </p>
          <textarea
            value={notes}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setNotes(event.target.value)}
            placeholder="Example: I feel wired, my jaw is tight, and I haven’t fully exhaled since report."
            className="mt-5 min-h-[8rem] w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-mist placeholder:text-mistMuted/60 focus:border-healingCyan/30 focus:outline-none focus:ring-2 focus:ring-healingCyan/20"
          />
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-healingCyan via-softTeal to-mistMuted px-6 py-3 text-sm font-semibold text-deepNavy transition hover:scale-[1.01]"
          >
            Generate My Reset
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-mist transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </button>
        </div>
      </form>

      {result ? <ResultsPanel result={result} onReset={handleReset} /> : null}
    </div>
  );
}
