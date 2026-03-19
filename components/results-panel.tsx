'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AudioLines, HeartHandshake, PauseCircle, PlayCircle, RefreshCw, Sparkles } from 'lucide-react';
import { ExerciseVisual } from '@/components/exercise-visual';
import type { SomaticResult } from '@/lib/types';
import { SomaticResult } from '@/lib/types';

interface ResultsPanelProps {
  result: SomaticResult;
  onReset: () => void;
}

export function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const encouragementTitle = useMemo(() => {
    if (result.averageLoad >= 8) return 'A deeper exhale and less pressure.';
    if (result.averageLoad >= 6) return 'A steady way back into your body.';
    return 'A brief reset to help you stay connected.';
  }, [result.averageLoad]);

  const handleAudioToggle = () => {
    if (!speechSupported || typeof window === 'undefined') return;

    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(result.audioScript);
    utterance.rate = 0.94;
    utterance.pitch = 0.96;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    synth.speak(utterance);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="space-y-6">
        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center gap-3 text-cyan-100">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">Your Somatic Reset</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{encouragementTitle}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 md:text-lg">{result.supportMessage}</p>
          {result.noteSummary ? (
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
              <span className="font-medium text-white">What you noted:</span> {result.noteSummary}
            </div>
          ) : null}
        </div>

        <div className="glass-panel p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/70">Recommended Exercise</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{result.exercise.name}</h3>
              <p className="mt-2 text-sm text-slate-300">Duration: {result.exercise.duration}</p>
            </div>
            <button
              type="button"
              onClick={handleAudioToggle}
              disabled={!speechSupported}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPlaying ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              {isPlaying ? 'Stop encouragement audio' : 'Play 10-second encouragement'}
            </button>
          </div>

          {!speechSupported ? (
            <p className="mt-4 text-sm text-amber-200/80">
              Browser speech synthesis is not available in this environment, but the audio script is ready for supported browsers.
            </p>
          ) : null}

          <div className="mt-6">
            <ExerciseVisual exercise={result.exercise} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center gap-3 text-cyan-100">
            <AudioLines className="h-5 w-5" />
            <h3 className="section-title">Step-by-step guidance</h3>
          </div>
          <ol className="mt-5 space-y-4">
            {result.exercise.steps.map((step, index) => (
              <li key={step} className="flex gap-4 rounded-3xl border border-white/8 bg-white/5 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                  {index + 1}
                </div>
                <p className="subtle-copy">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="glass-panel p-6 md:p-8">
          <div className="flex items-center gap-3 text-cyan-100">
            <HeartHandshake className="h-5 w-5" />
            <h3 className="section-title">Why this helps</h3>
          </div>
          <p className="mt-4 subtle-copy">{result.whyThisHelps}</p>
          <p className="mt-4 rounded-3xl border border-cyan-200/10 bg-cyan-100/5 p-4 text-sm leading-6 text-cyan-50/90">
            {result.exercise.why}
          </p>
        </div>

        <div className="glass-panel p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/70">Next Step Placeholder</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Continue your care beyond the shift.</h3>
          <p className="mt-3 subtle-copy">
            Future CTA space for a free guide, restorative membership, or Houston bodywork offering.
          </p>
          <div className="mt-5 rounded-3xl border border-dashed border-cyan-200/20 bg-white/5 p-4 text-sm text-slate-300">
            Placeholder card ready for email capture, OpenAI-powered personalization, or a Vercel-backed conversion flow.
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
          Start Over
        </button>
      </div>
    </motion.section>
  );
}
