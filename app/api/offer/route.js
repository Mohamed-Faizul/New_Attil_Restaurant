import { NextResponse } from 'next/server';
import { getOffer } from '@/lib/db';

export async function GET() {
  const offer = await getOffer();
  return NextResponse.json({ offer });
}
