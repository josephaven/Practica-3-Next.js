// app/api/students/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { Student } from '@/model/Student';
import { isValidObjectId } from 'mongoose';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;

    if (!isValidObjectId(id)) {
        return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await connectMongo();
    const doc = await Student.findById(id).lean({ getters: true, virtuals: true });

    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const body = await req.json().catch(() => null);

    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Body inválido' }, { status: 400 });

    await connectMongo();
    const updated = await Student.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .lean({ getters: true, virtuals: true });

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;

    if (!isValidObjectId(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    await connectMongo();
    const del = await Student.findByIdAndDelete(id).lean({ getters: true, virtuals: true });

    if (!del) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
}
