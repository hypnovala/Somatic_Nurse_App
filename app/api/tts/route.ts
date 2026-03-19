import { NextResponse } from 'next/server';
import { TTS_VOICE_OPTIONS } from '@/lib/somatic';
import type { TtsVoice } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';
const FALLBACK_VOICE: TtsVoice = 'alloy';
const ALLOWED_VOICES = new Set(TTS_VOICE_OPTIONS.map((voice) => voice.id));

interface TtsRequestBody {
  text?: string;
  voice?: TtsVoice;
}

const sanitizeText = (value: string) => value.trim().replace(/\s+/g, ' ').slice(0, 1200);

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: 'OPENAI_API_KEY is not configured for server-generated voice.',
      },
      { status: 503 },
    );
  }

  let body: TtsRequestBody;

  try {
    body = (await request.json()) as TtsRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const text = body.text ? sanitizeText(body.text) : '';
  const voice = body.voice && ALLOWED_VOICES.has(body.voice) ? body.voice : FALLBACK_VOICE;

  if (!text) {
    return NextResponse.json({ error: 'Text is required to generate audio.' }, { status: 400 });
  }

  const upstreamResponse = await fetch(OPENAI_TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      response_format: 'mp3',
    }),
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    const detail = await upstreamResponse.text();

    return NextResponse.json(
      {
        error: 'OpenAI TTS request failed.',
        detail,
      },
      { status: upstreamResponse.status || 502 },
    );
  }

  return new Response(upstreamResponse.body, {
    status: 200,
    headers: {
      'Content-Type': upstreamResponse.headers.get('content-type') ?? 'audio/mpeg',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
