'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AudioLines,
  HeartHandshake,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { ExerciseVisual } from '@/components/exercise-visual';
import { TTS_VOICE_OPTIONS } from '@/lib/somatic';
import type { SomaticResult, TtsVoice } from '@/lib/types';

interface ResultsPanelProps {
  result: SomaticResult;
  onReset: () => void;
}

export function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<TtsVoice>(TTS_VOICE_OPTIONS[0].id);
  const [audioStatus, setAudioStatus] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const cleanupAudioElement = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const stopAllPlayback = () => {
    cleanupAudioElement();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
    setIsLoadingAudio(false);
  };

  const playBrowserFallback = () => {
    if (!speechSupported || typeof window === 'undefined') {
      setAudioStatus('AI voice was unavailable and browser speech is not supported on this device.');
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(result.audioScript);
    utterance.rate = 0.94;
    utterance.pitch = 0.96;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      setAudioStatus('Browser speech synthesis also failed to play.');
    };

    setAudioStatus('Using browser speech fallback because the AI voice request was unavailable.');
    setIsPlaying(true);
    synth.speak(utterance);
  };

  useEffect(() => {
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);

    return () => {
      stopAllPlayback();
    };
  }, []);

  useEffect(() => {
    setAudioStatus('');
    stopAllPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.audioScript]);

  const encouragementTitle = useMemo(() => {
    if (result.averageLoad >= 8) return 'A deeper exhale and less pressure.';
    if (result.averageLoad >= 6) return 'A steady way back into your body.';
    return 'A brief reset to help you stay connected.';
  }, [result.averageLoad]);

  const handleAudioToggle = async () => {
    if (isPlaying || isLoadingAudio) {
      stopAllPlayback();
      setAudioStatus('');
      return;
    }

    setIsLoadingAudio(true);
    setAudioStatus('Generating your OpenAI voice encouragement...');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: result.audioScript,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed with status ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;
      audioUrlRef.current = audioUrl;
      audio.onended = () => {
        cleanupAudioElement();
        setIsPlaying(false);
      };
      audio.onerror = () => {
        cleanupAudioElement();
        setIsPlaying(false);
        playBrowserFallback();
      };

      setAudioStatus(`Playing AI voice with ${selectedVoice} on the server-generated audio route.`);
      setIsPlaying(true);
      await audio.play();
    } catch {
      playBrowserFallback();
    } finally {
      setIsLoadingAudio(false);
    }
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
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/70">Recommended Exercise</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{result.exercise.name}</h3>
              <p className="mt-2 text-sm text-slate-300">Duration: {result.exercise.duration}</p>
            </div>

            <div className="w-full max-w-sm space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <WandSparkles className="h-4 w-4" />
                <p className="text-sm font-medium text-white">AI voice encouragement</p>
              </div>
              <label className="block text-sm text-slate-300" htmlFor="voice-select">
                Voice
              </label>
              <select
                id="voice-select"
                value={selectedVoice}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setSelectedVoice(event.target.value as TtsVoice)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-200/30 focus:ring-2 focus:ring-cyan-300/20"
              >
                {TTS_VOICE_OPTIONS.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.label}
                  </option>
                ))}
              </select>
              <p className="text-xs leading-5 text-slate-400">
                {TTS_VOICE_OPTIONS.find((voice) => voice.id === selectedVoice)?.description}
              </p>
              <button
                type="button"
                onClick={() => void handleAudioToggle()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/15"
              >
                {isPlaying || isLoadingAudio ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                {isLoadingAudio ? 'Preparing AI audio…' : isPlaying ? 'Stop audio' : 'Play AI encouragement'}
              </button>
              <div className="rounded-2xl border border-cyan-200/10 bg-cyan-100/5 p-3 text-xs leading-5 text-cyan-50/90">
                Uses `/api/tts` with OpenAI TTS when `OPENAI_API_KEY` is configured, then falls back to browser speech if the request fails.
              </div>
            </div>
          </div>

          {audioStatus ? (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm leading-6 text-slate-300">
              <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-cyan-100" />
              <p>{audioStatus}</p>
            </div>
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
