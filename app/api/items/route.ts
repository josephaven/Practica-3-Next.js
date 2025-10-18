import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() { return NextResponse.json(await db.list()); }
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(await db.create({ title: body.title ?? 'Sin título', done: false }), { status: 201 });
}
