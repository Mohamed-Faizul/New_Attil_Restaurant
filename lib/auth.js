import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE = 'attil_admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'attil-local-dev-secret';

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64').toString('utf8');
}

export function signSession(payload) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  return `${header}.${body}.${signature}`;
}

export function verifySession(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  if (signature.length !== expectedSignature.length) return null;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    try {
      const payload = JSON.parse(base64UrlDecode(body));
      if (!payload || !payload.email) return null;
      return payload;
    } catch {
      return null;
    }
  }

  return null;
}

export function getSessionFromRequestCookies(cookieStore = cookies()) {
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return verifySession(value);
}

export function setSessionCookie(response, payload) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: signSession(payload),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export function clearSessionCookie(response) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

export async function requireAdminSession() {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) redirect('/admin');
  return session;
}
