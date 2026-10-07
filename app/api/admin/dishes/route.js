import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionFromRequestCookies } from '@/lib/auth';
import { createDish, getDishes, seedStore } from '@/lib/db';

export async function GET() {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await seedStore();
  return NextResponse.json({ dishes: await getDishes() });
}

export async function POST(request) {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  try {
    const dish = await createDish(body);
    return NextResponse.json({ message: 'Dish saved.', dish });
  } catch (error) {
    return NextResponse.json({ message: error.message || 'Unable to save dish.' }, { status: 400 });
  }
}
