import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const s = await db.get(id);
  return s
    ? NextResponse.json(s)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  const updated = await db.update(id, body);
  return updated
    ? NextResponse.json(updated)
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const ok = await db.remove(id);
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}
