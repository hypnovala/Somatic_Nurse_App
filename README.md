# Somatic Reset for Nurses

A production-ready Next.js 15 app for helping nurses decompress after difficult shifts with a short somatic check-in, supportive guidance, browser-based encouragement audio, and an animated exercise visual.

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Features

- Premium nurse-focused dark UI with cyan, teal, and blue glow gradients
- Five slider-based check-in questions and optional notes
- Somatic support message generation based on stress, fatigue, breath, tension, and perceived support
- Exercise recommendation logic with three somatic exercises
- Browser speech synthesis encouragement audio
- Distinct premium animated exercise visuals without external 3D libraries
- Future-ready CTA placeholder for guide, membership, or Houston bodywork offer
- Clean separation between UI components, domain types, and business logic

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  exercise-visual.tsx
  nurse-checkin-form.tsx
  results-panel.tsx
  soft-metric.tsx
lib/
  somatic.ts
  types.ts
```


## Environment Variables

Create a local `.env.local` file (or add the variable in Vercel project settings):

```bash
OPENAI_API_KEY=your_openai_api_key_here
RESEND_API_KEY=your_resend_api_key_here
SUPPORT_CONTACT_FROM_EMAIL=Somatic Nurse Support <support@yourdomain.com>
SUPPORT_CONTACT_TO_EMAIL=support@yourdomain.com
```

The app uses `app/api/tts/route.ts` to generate server-side audio with OpenAI TTS (`gpt-4o-mini-tts`) and falls back to browser speech synthesis if the API request fails. It also uses `app/api/contact/route.ts` to validate and forward immediate support requests through Resend.

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production Checks

```bash
npm run build
npm run typecheck
```

## Future Extensions

This app is structured to make it easy to add:

- OpenAI API personalization
- Real text-to-speech services
- Supabase persistence and auth
- Vercel deployment workflows


## Vercel Deployment

- Use Node.js 20+ (the repo includes `.nvmrc` and an `engines` field in `package.json`).
- Vercel is configured explicitly via `vercel.json` to use `npm install` and `npm run build`, and the server routes expect `OPENAI_API_KEY`, `RESEND_API_KEY`, `SUPPORT_CONTACT_FROM_EMAIL`, and `SUPPORT_CONTACT_TO_EMAIL` in your Vercel environment variables.
- If you connect this repo to Vercel, the project should be detected as a Next.js application automatically.

## Git Conflict Memory

To make this repo remember repeated conflict resolutions in your local clone, run:

```bash
npm run git:setup
```

That configures repo-local Git settings for:

- `rerere.enabled=true`
- `rerere.autoupdate=true`
- `merge.conflictstyle=zdiff3`
- `merge.ours.driver=true`

The repo also includes `.gitattributes` rules so `package-lock.json`, `next-env.d.ts`, and `*.tsbuildinfo` prefer the repo's `ours` merge driver instead of forcing manual conflict cleanup each time.
