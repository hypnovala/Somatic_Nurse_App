import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RESEND_API_URL = 'https://api.resend.com/emails';

interface ContactRequestBody {
  name?: string;
  email?: string;
  message?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitize = (value: string) => value.trim().replace(/\s+/g, ' ');

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.SUPPORT_CONTACT_FROM_EMAIL;
  const toEmail = process.env.SUPPORT_CONTACT_TO_EMAIL;

  if (!resendApiKey || !fromEmail || !toEmail) {
    return NextResponse.json(
      {
        error: 'Support contact service is not configured.',
      },
      { status: 503 },
    );
  }

  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const name = body.name ? sanitize(body.name) : '';
  const email = body.email ? sanitize(body.email).toLowerCase() : '';
  const message = body.message ? body.message.trim().replace(/\r\n/g, '\n').slice(0, 2000) : '';
  const fieldErrors: Partial<Record<'name' | 'email' | 'message', string>> = {};

  if (name.length < 2) {
    fieldErrors.name = 'Please enter your name.';
  }

  if (!emailPattern.test(email)) {
    fieldErrors.email = 'Please enter a valid email address.';
  }

  if (message.length < 20) {
    fieldErrors.message = 'Please share a few details so support can respond helpfully.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        fieldErrors,
      },
      { status: 400 },
    );
  }

  const text = [
    'Immediate support request from Somatic Reset for Nurses',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">Immediate support request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${message}</p>
    </div>
  `;

  const resendResponse = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Somatic Nurse support request from ${name}`,
      text,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const detail = await resendResponse.text();

    return NextResponse.json(
      {
        error: 'Resend request failed.',
        detail,
      },
      { status: resendResponse.status || 502 },
    );
  }

  return NextResponse.json({ success: true });
}
