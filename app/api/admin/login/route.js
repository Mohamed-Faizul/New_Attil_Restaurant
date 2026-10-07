import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';
import { findAdminByEmail, seedStore } from '@/lib/db';

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  await seedStore();
  const user = await findAdminByEmail(email);

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash || ''))) {
    return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  return setSessionCookie(response, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
