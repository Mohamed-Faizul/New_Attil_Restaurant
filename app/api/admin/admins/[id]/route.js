import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionFromRequestCookies } from '@/lib/auth';
import { removeAdminAccount, toggleAdminAccount } from '@/lib/db';

export async function PATCH(request, { params }) {
  const session = getSessionFromRequestCookies(cookies());
  if (!session || session.role !== 'super') {
    return NextResponse.json({ message: 'Only the super-admin can change admin status.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const updated = await toggleAdminAccount(params.id, body.active);

  if (!updated) {
    return NextResponse.json({ message: 'Admin not found.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Admin updated.', admin: updated });
}

export async function DELETE(_, { params }) {
  const session = getSessionFromRequestCookies(cookies());
  if (!session || session.role !== 'super') {
    return NextResponse.json({ message: 'Only the super-admin can remove admins.' }, { status: 403 });
  }

  const removed = await removeAdminAccount(params.id);
  if (!removed) {
    return NextResponse.json({ message: 'Admin not found.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Admin removed.' });
}
