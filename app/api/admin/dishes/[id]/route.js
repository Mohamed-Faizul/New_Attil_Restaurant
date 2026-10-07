import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionFromRequestCookies } from '@/lib/auth';
import { deleteDish, updateDish } from '@/lib/db';

export async function PUT(request, { params }) {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const dish = await updateDish(params.id, body);

  if (!dish) {
    return NextResponse.json({ message: 'Dish not found.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Dish updated.', dish });
}

export async function DELETE(_, { params }) {
  const session = getSessionFromRequestCookies(cookies());
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const removed = await deleteDish(params.id);
  if (!removed) {
    return NextResponse.json({ message: 'Dish not found.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Dish deleted.' });
}
