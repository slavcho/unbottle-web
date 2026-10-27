// unbottle. — contact form handler (Vercel function).
// Validates a submission from contact.html and emails it to us through
// Resend's HTTP API, so there are no dependencies to install.
//
// Env vars (Vercel project settings):
//   RESEND_API_KEY  required
//   CONTACT_TO      where submissions go      (default hello@unbottle.ai)
//   CONTACT_FROM    verified Resend sender    (default website@unbottle.ai)
//
// The page posts with fetch and gets JSON back. Without JS the browser posts
// the form directly; then we redirect back to the page, and #sent or #error
// shows the matching message through CSS :target.

const LIMITS = { name: 120, email: 200, company: 160, message: 5000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(fields) {
  const clean = {};
  for (const key of Object.keys(LIMITS)) {
    clean[key] = String(fields[key] ?? '').trim();
  }

  const errors = {};
  if (!clean.name) errors.name = 'Please tell us your name.';
  if (!EMAIL.test(clean.email)) errors.email = 'Please enter a valid email address.';
  if (!clean.message) errors.message = 'Please describe the process that drags.';
  for (const [key, max] of Object.entries(LIMITS)) {
    if (clean[key].length > max) errors[key] = `Please keep this under ${max} characters.`;
  }

  return { clean, errors };
}

async function readFields(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return request.json();
  return Object.fromEntries(await request.formData());
}

function reply(request, status, body) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  if (wantsJson) return Response.json(body, { status });
  const result = status === 200 ? 'sent' : 'error';
  return new Response(null, { status: 303, headers: { Location: `/contact#${result}` } });
}

export async function POST(request) {
  let fields;
  try {
    fields = await readFields(request);
  } catch {
    return reply(request, 400, { ok: false, error: 'Could not read the form.' });
  }

  // Honeypot: people never see the "website" field, bots fill it in.
  // Pretend it worked so they don't retry.
  if (fields.website) return reply(request, 200, { ok: true });

  const { clean, errors } = validate(fields);
  if (Object.keys(errors).length) {
    return reply(request, 422, { ok: false, error: 'Please check the highlighted fields.', fields: errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('contact: RESEND_API_KEY is not set');
    return reply(request, 500, { ok: false, error: 'The form is not available right now.' });
  }

  const text = [
    `Name:    ${clean.name}`,
    `Email:   ${clean.email}`,
    `Company: ${clean.company || '-'}`,
    '',
    clean.message,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'unbottle. website <website@unbottle.ai>',
        to: [process.env.CONTACT_TO || 'hello@unbottle.ai'],
        reply_to: clean.email,
        subject: `Bottleneck audit: ${clean.name}${clean.company ? `, ${clean.company}` : ''}`,
        text,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error('contact: send failed', err);
    return reply(request, 502, { ok: false, error: 'We could not send your message. Please email us instead.' });
  }

  return reply(request, 200, { ok: true });
}
