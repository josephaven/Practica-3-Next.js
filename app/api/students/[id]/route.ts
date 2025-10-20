import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Student } from "@/model/Student";

export const dynamic = "force-dynamic";

function validate(b: any) {
    const req = ["nombre","apellido","matricula","carrera"] as const;
    if (!b || typeof b !== "object") return "Body inválido";
    const miss = req.filter(k => !b?.[k]);
    return miss.length ? `Campos requeridos: ${miss.join(", ")}` : null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();
        const s = await Student.findById(params.id).lean({ getters: true, virtuals: true });
        return s
            ? NextResponse.json(s, { headers: { "Cache-Control": "no-store" } })
            : NextResponse.json({ error: "No encontrado" }, { status: 404 });
    } catch (e:any) {
        console.error("GET /api/students/:id error:", e);
        return NextResponse.json({ error: e?.message ?? "Error interno" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();
        const body = await req.json().catch(() => null);
        const error = validate(body);
        if (error) return NextResponse.json({ error }, { status: 400 });

        const updated = await Student.findByIdAndUpdate(
            params.id,
            {
                nombre: String(body.nombre),
                apellido: String(body.apellido),
                matricula: String(body.matricula),
                carrera: String(body.carrera),
            },
            { new: true, runValidators: true }
        );
        return updated
            ? NextResponse.json(updated.toJSON(), { headers: { "Cache-Control": "no-store" } })
            : NextResponse.json({ error: "No encontrado" }, { status: 404 });
    } catch (e:any) {
        console.error("PUT /api/students/:id error:", e);
        if (e?.code === 11000) {
            return NextResponse.json({ error: "Matrícula ya existente" }, { status: 409 });
        }
        return NextResponse.json({ error: e?.message ?? "Error al actualizar" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await connectMongo();
        const res = await Student.findByIdAndDelete(params.id);
        return res
            ? NextResponse.json({ ok: true }) // evita 204 para no romper .json() del cliente
            : NextResponse.json({ error: "No encontrado" }, { status: 404 });
    } catch (e:any) {
        console.error("DELETE /api/students/:id error:", e);
        return NextResponse.json({ error: e?.message ?? "Error al eliminar" }, { status: 500 });
    }
}
