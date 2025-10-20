"use client";

import { useEffect, useRef, useState } from "react";
import { useStudents } from "@/components/students/StudentContext";
import Modal from "@/components/ui/Modal";

type Props = { open: boolean; onClose: () => void };

export default function StudentFormModal({ open, onClose }: Props) {
    const { dispatch } = useStudents();
    const [form, setForm] = useState({ nombre: "", apellido: "", matricula: "", carrera: "" });
    const firstFieldRef = useRef<HTMLInputElement | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // focus inicial cuando abre
    useEffect(() => {
        if (open) setTimeout(() => firstFieldRef.current?.focus(), 0);
    }, [open]);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const created = await res.json();
                dispatch({ type: "add", payload: created });
                setForm({ nombre: "", apellido: "", matricula: "", carrera: "" });
                onClose();
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Agregar estudiante">
            <form onSubmit={submit} className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                        ref={firstFieldRef}
                        value={form.nombre}
                        onChange={(e) => setForm((v) => ({ ...v, nombre: e.target.value }))}
                        placeholder="Nombre"
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                        required
                        aria-label="Nombre"
                    />
                    <input
                        value={form.apellido}
                        onChange={(e) => setForm((v) => ({ ...v, apellido: e.target.value }))}
                        placeholder="Apellido"
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                        required
                        aria-label="Apellido"
                    />
                    <input
                        value={form.matricula}
                        onChange={(e) => setForm((v) => ({ ...v, matricula: e.target.value }))}
                        placeholder="Matrícula"
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                        required
                        aria-label="Matrícula"
                    />
                    <input
                        value={form.carrera}
                        onChange={(e) => setForm((v) => ({ ...v, carrera: e.target.value }))}
                        placeholder="Carrera"
                        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                        required
                        aria-label="Carrera"
                    />
                </div>

                <div className="mt-2 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border px-4 py-2 text-sm hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={submitting}
                        className="rounded bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
                    >
                        {submitting ? "Guardando…" : "Agregar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
