'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { CheckCircle2, LoaderCircle, SendHorizonal } from 'lucide-react';

interface ContactFieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const initialForm = {
  name: '',
  email: '',
  message: '',
};

export function ImmediateSupportForm() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
    setStatus('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('');
    setSubmitted(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as {
        error?: string;
        success?: boolean;
        fieldErrors?: ContactFieldErrors;
      };

      if (!response.ok) {
        setFieldErrors(payload.fieldErrors ?? {});
        setStatus(payload.error ?? 'We could not send your request right now. Please try again.');
        return;
      }

      setFieldErrors({});
      setSubmitted(true);
      setStatus('Your message has been sent. Someone can follow up from the support inbox shortly.');
      setForm(initialForm);
    } catch {
      setStatus('We could not send your request right now. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8">
      <p className="text-sm uppercase tracking-[0.24em] text-healingCyan/80">Immediate Support Contact</p>
      <h3 className="mt-3 text-2xl font-semibold text-mist">Need a human follow-up?</h3>
      <p className="mt-3 subtle-copy">
        Send a message directly from the app and route it to your support inbox through Resend.
      </p>
      <p className="mt-3 rounded-2xl border border-healingCyan/10 bg-healingCyan/5 p-4 text-sm leading-6 text-mistMuted">
        If this is an immediate emergency or you feel unsafe, please contact local emergency services or your local crisis resources right away.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-mistMuted" htmlFor="support-name">
              Name
            </label>
            <input
              id="support-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist outline-none transition focus:border-healingCyan/30 focus:ring-2 focus:ring-healingCyan/20"
              placeholder="Your name"
            />
            {fieldErrors.name ? <p className="mt-2 text-xs text-rose-200">{fieldErrors.name}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-mistMuted" htmlFor="support-email">
              Email
            </label>
            <input
              id="support-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist outline-none transition focus:border-healingCyan/30 focus:ring-2 focus:ring-healingCyan/20"
              placeholder="you@example.com"
            />
            {fieldErrors.email ? <p className="mt-2 text-xs text-rose-200">{fieldErrors.email}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-mistMuted" htmlFor="support-message">
            Message
          </label>
          <textarea
            id="support-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            className="min-h-[9rem] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist outline-none transition focus:border-healingCyan/30 focus:ring-2 focus:ring-healingCyan/20"
            placeholder="Share what kind of support or follow-up you need right now."
          />
          {fieldErrors.message ? <p className="mt-2 text-xs text-rose-200">{fieldErrors.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-healingCyan/20 bg-healingCyan/10 px-5 py-3 text-sm font-medium text-healingCyan transition hover:bg-healingCyan/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
          {isSubmitting ? 'Sending request…' : 'Send support request'}
        </button>
      </form>

      {status ? (
        <div
          className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${
            submitted
              ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100'
              : 'border-rose-300/20 bg-rose-400/10 text-rose-100'
          }`}
        >
          <div className="flex items-start gap-2">
            {submitted ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <SendHorizonal className="mt-0.5 h-4 w-4 shrink-0" />}
            <p>{status}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
