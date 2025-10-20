import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Student } from "@/model/Student";

export const dynamic = "force-dynamic";

type StudentInput = {
    nombre: string;
    apellido: string;
    matricula: string;
    carrera: string;
};

// Valida y además actúa como type guard
function isStudentInput(b: unknown): b is StudentInput {
    if (!b || typeof b !== "object") return false;
    const o = b as Record<string, unknown>;
    return (
        typeof o.nombre === "string" &&
        typeof o.apellido === "string" &&
        typeof o.matricula === "string" &&
        typeof o.carrera === "string"
    );
}

function missingFields(b: unknown): string[] {
    const req = ["nombre", "apellido", "matricula", "carrera"] as const;
    if (!b || typeof b !== "object") return [...req];
    const o = b as Record<string, unknown>;
    return req.filter((k) => !o[k]);
}

function errMsg(e: unknown, fallback = "Error interno") {
    return e instanceof Error ? e.message : fallback;
}

export async function GET() {
    try {
        await connectMongo();
        const docs = await Student.find().sort({ createdAt: -1 });
        const list = docs.map((d) => d.toJSON());
        return NextResponse.json(list, { headers: { "Cache-Control": "no-store" } });
    } catch (e: unknown) {
        console.error("GET /api/students error:", e);
        return NextResponse.json({ error: errMsg(e) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectMongo();
        const body = await req.json().catch(() => null);

        // valida campos requeridos
        const miss = missingFields(body);
        if (miss.length) {
            return NextResponse.json(
                { error: `Campos requeridos: ${miss.join(", ")}` },
                { status: 400 }
            );
        }

        if (!isStudentInput(body)) {
            return NextResponse.json({ error: "Body inválido" }, { status: 400 });
        }

        const created = await Student.create({
            nombre: body.nombre,
            apellido: body.apellido,
            matricula: body.matricula,
            carrera: body.carrera,
        });

        return NextResponse.json(created.toJSON(), {
            status: 201,
            headers: { "Cache-Control": "no-store" },
        });
    } catch (e: unknown) {
        console.error("POST /api/students error:", e);
        if (typeof e === "object" && e && (e as { code?: number }).code === 11000) {
            return NextResponse.json({ error: "Matrícula ya existente" }, { status: 409 });
        }
        return NextResponse.json({ error: errMsg(e, "Error al crear") }, { status: 500 });
    }
}
