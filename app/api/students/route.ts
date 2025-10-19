import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await db.list());
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.nombre || !body?.apellido || !body?.matricula || !body?.carrera) {
    return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
  }
  const created = await db.create({
    nombre: String(body.nombre),
    apellido: String(body.apellido),
    matricula: String(body.matricula),
    carrera: String(body.carrera),
  });
  return NextResponse.json(created, { status: 201 });
}
