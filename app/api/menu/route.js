import { NextResponse } from 'next/server';
import { getDishes } from '@/lib/db';

export async function GET() {
  const dishes = await getDishes();
  return NextResponse.json({ dishes: dishes.filter((dish) => dish.available) });
}
