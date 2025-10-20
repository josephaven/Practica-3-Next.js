// app/api/students/[id]/route.ts
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Student } from "@/model/Student";
import { Types } from "mongoose";

function errMsg(e: unknown, fallback = "Error interno") {
    return e instanceof Error ? e.message : fallback;
}

function isValidId(id: string) {
    return Types.ObjectId.isValid(id);
}

type StudentPatch = Partial<{
    nombre: string;
    apellido: string;
    matricula: string;
    carrera: string;
}>;

function sanitizePatch(b: unknown): StudentPatch | null {
    if (!b || typeof b !== "object") return null;
    const o = b as Record<string, unknown>;
    const out: StudentPatch = {};
    if (typeof o.nombre === "string") out.nombre = o.nombre;
    if (typeof o.apellido === "string") out.apellido = o.apellido;
    if (typeof o.matricula === "string") out.matricula = o.matricula;
    if (typeof o.carrera === "string") out.carrera = o.carrera;
    return Object.keys(out).length ? out : null;
}

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectMongo();
        const { id } = params;
        if (!isValidId(id)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }
        const doc = await Student.findById(id);
        if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        return NextResponse.json(doc.toJSON(), {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (e: unknown) {
        return NextResponse.json({ error: errMsg(e) }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectMongo();
        const { id } = params;
        if (!isValidId(id)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const body = await req.json().catch(() => null);
        const patch = sanitizePatch(body);
        if (!patch) {
            return NextResponse.json({ error: "Body inválido" }, { status: 400 });
        }

        const updated = await Student.findByIdAndUpdate(id, patch, { new: true });
        if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

        return NextResponse.json(updated.toJSON(), {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (e: unknown) {
        return NextResponse.json({ error: errMsg(e, "Error al actualizar") }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectMongo();
        const { id } = params;
        if (!isValidId(id)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const deleted = await Student.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e: unknown) {
        return NextResponse.json({ error: errMsg(e, "Error al eliminar") }, { status: 500 });
    }
}
