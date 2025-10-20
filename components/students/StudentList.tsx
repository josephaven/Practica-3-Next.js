"use client";
import { useState } from "react";
import { useStudents } from "./StudentContext";
import type { Student } from "@/lib/store";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "@/components/students/ConfirmDeleteModal";

type Props = {
    onEdit: (s: Student) => void;
};

export default function StudentList({ onEdit }: Props) {
    const { state, dispatch } = useStudents();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [target, setTarget] = useState<Student | null>(null);
    const [busy, setBusy] = useState(false);

    if (state.loading) {
        return (
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-600">Cargando…</p>
            </div>
        );
    }

    const resync = async () => {
        const fresh = await fetch("/api/students", { cache: "no-store" }).then(r => r.json());
        dispatch({ type: "set", payload: fresh });
    };

    const askRemove = (s: Student) => {
        setTarget(s);
        setConfirmOpen(true);
    };

    const confirmRemove = async () => {
        if (!target) return;
        setBusy(true);
        const res = await fetch(`/api/students/${target.id}`, { method: "DELETE" });
        setBusy(false);
        setConfirmOpen(false);
        if (res.ok) dispatch({ type: "remove", payload: target.id });
        else if (res.status === 404) await resync();
        setTarget(null);
    };

    return (
        <>
            <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                    <tr>
                        <th className="p-3 text-left font-semibold">Nombre</th>
                        <th className="p-3 text-left font-semibold">Apellido</th>
                        <th className="p-3 text-left font-semibold">Matrícula</th>
                        <th className="p-3 text-left font-semibold">Carrera</th>
                        <th className="p-3 text-right font-semibold">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {state.students.map((s) => (
                        <tr key={s.id} className="border-t">
                            <td className="p-3">{s.nombre}</td>
                            <td className="p-3">{s.apellido}</td>
                            <td className="p-3">{s.matricula}</td>
                            <td className="p-3">{s.carrera}</td>
                            <td className="p-3">
                                <div className="flex justify-end gap-1 sm:gap-2">
                                    {/* Editar */}
                                    <button
                                        onClick={() => onEdit(s)}
                                        className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                                        title="Editar estudiante"
                                        aria-label={`Editar ${s.nombre}`}
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>

                                    {/* Eliminar (abre confirmación) */}
                                    <button
                                        onClick={() => askRemove(s)}
                                        className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                                        title="Eliminar estudiante"
                                        aria-label={`Eliminar ${s.nombre}`}
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {state.students.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-6 text-center text-slate-500">
                                No hay estudiantes aún. Usa “Agregar estudiante”.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación de eliminación */}
            <ConfirmDeleteModal
                open={confirmOpen}
                onClose={() => {
                    if (!busy) {
                        setConfirmOpen(false);
                        setTarget(null);
                    }
                }}
                onConfirm={confirmRemove}
                nombre={target?.nombre}
                apellido={target?.apellido}
                matricula={target?.matricula}
                busy={busy}
            />
        </>
    );
}
