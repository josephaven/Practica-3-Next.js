"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";

type Draft = { nombre: string; apellido: string; matricula: string; carrera: string };
type Mode = "create" | "edit";

type Props = {
    open: boolean;
    onClose: () => void;
    initial: Draft;       // datos iniciales: vacío para crear, prellenado para editar
    mode: Mode;           // "create" o "edit"
    onSubmit: (draft: Draft) => Promise<void>; // la acción real la maneja StudentManager
};

export default function StudentFormModal({ open, onClose, initial, mode, onSubmit }: Props) {
    const [form, setForm] = useState<Draft>(initial);
    const [submitting, setSubmitting] = useState(false);
    const firstFieldRef = useRef<HTMLInputElement | null>(null);

    // focus inicial + reset al abrir/cerrar o cambiar modo
    useEffect(() => {
        if (open) {
            setForm(initial);
            setTimeout(() => firstFieldRef.current?.focus(), 0);
        }
    }, [open, initial]);

    const title = mode === "edit" ? "Editar estudiante" : "Agregar estudiante";
    const cta   = mode === "edit" ? "Guardar cambios" : "Agregar";

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(form);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={title}>
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
                        {submitting ? "Guardando…" : cta}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
