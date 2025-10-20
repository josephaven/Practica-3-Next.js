import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export const dynamic = "force-dynamic";

function validate(body: any) {
    if (!body || typeof body !== "object") return "Body inválido";
    const req = ["nombre", "apellido", "matricula", "carrera"] as const;
    const missing = req.filter((k) => !body?.[k]);
    if (missing.length) return `Campos requeridos: ${missing.join(", ")}`;
    return null;
}

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const s = await db.get(params.id);
    return s
        ? NextResponse.json(s, { headers: { "Cache-Control": "no-store" } })
        : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const body = await req.json().catch(() => null);
    const error = validate(body);
    if (error) return NextResponse.json({ error }, { status: 400 });

    const updated = await db.update(params.id, {
        nombre: String(body.nombre),
        apellido: String(body.apellido),
        matricula: String(body.matricula),
        carrera: String(body.carrera),
    });

    return updated
        ? NextResponse.json(updated, { headers: { "Cache-Control": "no-store" } })
        : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const ok = await db.remove(params.id);
    // 204 es el status HTTP más apropiado cuando no devuelves body
    return ok
        ? new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } })
        : NextResponse.json({ error: "No encontrado" }, { status: 404 });
}
