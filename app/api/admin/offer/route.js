import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionFromRequestCookies } from '@/lib/auth';
import { getOffer, saveOffer } from '@/lib/db';

export async function GET() {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ offer: await getOffer() });
}

export async function POST(request) {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const offer = await saveOffer(body);
  return NextResponse.json({ message: 'Offer saved.', offer });
}
