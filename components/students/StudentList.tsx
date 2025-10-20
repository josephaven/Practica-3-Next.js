"use client";
import { useState } from "react";
import { useStudents } from "./StudentContext";
import {
    PencilSquareIcon,   // editar
    TrashIcon,          // eliminar
    CheckIcon,          // guardar
    XMarkIcon           // cancelar
} from "@heroicons/react/24/outline";

type EditId = string | null;

export default function StudentList() {
    const { state, dispatch } = useStudents();
    const [editing, setEditing] = useState<EditId>(null);
    const [draft, setDraft] = useState({ nombre: "", apellido: "", matricula: "", carrera: "" });

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

    const startEdit = (id: string) => {
        const s = state.students.find(x => x.id === id)!;
        setDraft({ nombre: s.nombre, apellido: s.apellido, matricula: s.matricula, carrera: s.carrera });
        setEditing(id);
    };

    const save = async (id: string) => {
        const res = await fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
        });
        if (res.ok) {
            dispatch({ type: "patch", payload: await res.json() });
            setEditing(null);
        } else if (res.status === 404) await resync();
    };

    const remove = async (id: string) => {
        const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
        if (res.ok) dispatch({ type: "remove", payload: id });
        else if (res.status === 404) await resync();
    };

    return (
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
                        {editing === s.id ? (
                            <>
                                {(["nombre","apellido","matricula","carrera"] as const).map((k) => (
                                    <td key={k} className="p-2 align-top">
                                        <input
                                            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                                            value={(draft as any)[k]}
                                            onChange={(e) => setDraft((v) => ({ ...v, [k]: e.target.value }))}
                                            aria-label={k}
                                        />
                                    </td>
                                ))}
                                <td className="p-2">
                                    <div className="flex justify-end gap-1 sm:gap-2">
                                        {/* Guardar */}
                                        <button
                                            onClick={() => save(s.id)}
                                            className="inline-flex items-center justify-center rounded-md bg-green-600 p-2 text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 cursor-pointer"
                                            title="Guardar cambios"
                                            aria-label="Guardar cambios"
                                        >
                                            <CheckIcon className="h-5 w-5" />
                                        </button>
                                        {/* Cancelar */}
                                        <button
                                            onClick={() => setEditing(null)}
                                            className="inline-flex items-center justify-center rounded-md border p-2 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                                            title="Cancelar edición"
                                            aria-label="Cancelar edición"
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </>
                        ) : (
                            <>
                                <td className="p-3">{s.nombre}</td>
                                <td className="p-3">{s.apellido}</td>
                                <td className="p-3">{s.matricula}</td>
                                <td className="p-3">{s.carrera}</td>
                                <td className="p-3">
                                    <div className="flex justify-end gap-1 sm:gap-2">
                                        {/* Editar */}
                                        <button
                                            onClick={() => startEdit(s.id)}
                                            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                                            title="Editar estudiante"
                                            aria-label={`Editar ${s.nombre}`}
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </button>
                                        {/* Eliminar */}
                                        <button
                                            onClick={() => remove(s.id)}
                                            className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                                            title="Eliminar estudiante"
                                            aria-label={`Eliminar ${s.nombre}`}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
