import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionFromRequestCookies } from '@/lib/auth';
import { createAdminAccount, getAdmins, seedStore } from '@/lib/db';

export async function GET() {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await seedStore();
  return NextResponse.json({ admins: await getAdmins() });
}

export async function POST(request) {
  const session = getSessionFromRequestCookies(cookies());
  if (!session || session.role !== 'super') {
    return NextResponse.json({ message: 'Only the super-admin can add admins.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  try {
    const admin = await createAdminAccount(body);
    return NextResponse.json({ message: 'Admin created.', admin });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Unable to create admin.' }, { status: 400 });
  }
}
