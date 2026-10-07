export const SESSION_COOKIE = 'attil_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'attil-local-dev-secret';

function base64UrlEncode(value) {
  return value
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(normalized + pad);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToBase64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export async function verifySessionEdge(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, bodyB64, signature] = parts;
  if (!headerB64 || !bodyB64 || !signature) return null;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    const signed = encoder.encode(`${headerB64}.${bodyB64}`);
    const expectedBuffer = await crypto.subtle.sign('HMAC', key, signed);
    const expectedSignature = bytesToBase64Url(new Uint8Array(expectedBuffer));

    if (!crypto.subtle && expectedSignature !== signature) {
      return null;
    }

    if (expectedSignature !== signature) {
      return null;
    }

    const payloadBytes = base64UrlDecode(bodyB64);
    const payloadText = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadText);

    if (!payload || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}
