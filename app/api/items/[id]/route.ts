import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;          
  const item = await db.get(id);
  return item
    ? NextResponse.json(item)
    : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;          
  const body = await req.json();
  const updated = await db.update(id, body);
  return updated
    ? NextResponse.json(updated)
    : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;          
  await db.remove(id);
  return NextResponse.json({ ok: true });
}
