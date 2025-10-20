import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export const dynamic = "force-dynamic"; // evita cacheo de rutas

function validate(body: any) {
    if (!body || typeof body !== "object") return "Body inválido";
    const req = ["nombre", "apellido", "matricula", "carrera"] as const;
    const missing = req.filter((k) => !body?.[k]);
    if (missing.length) return `Campos requeridos: ${missing.join(", ")}`;
    return null;
}

export async function GET() {
    const list = await db.list();
    return NextResponse.json(list, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const error = validate(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const created = await db.create({
        nombre: String(body.nombre),
        apellido: String(body.apellido),
        matricula: String(body.matricula),
        carrera: String(body.carrera),
    });

    return NextResponse.json(created, {
        status: 201,
        headers: { "Cache-Control": "no-store" },
    });
}
