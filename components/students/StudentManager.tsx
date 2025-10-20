"use client";

import { useState } from "react";
import StudentList from "@/components//students/StudentList";
import StudentFormModal from "./StudentFormModal";
import { useStudents } from "@/components/students/StudentContext";
import type { Student } from "@/lib/store";

type Draft = Omit<Student, "id">;
const EMPTY: Draft = { nombre: "", apellido: "", matricula: "", carrera: "" };

export default function StudentManager() {
    const { dispatch } = useStudents();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Student | null>(null);

    // abrir para crear
    const onAdd = () => {
        setEditing(null);
        setOpen(true);
    };

    // abrir para editar (recibe el estudiante desde la tabla)
    const onEdit = (s: Student) => {
        setEditing(s);
        setOpen(true);
    };

    // submit centralizado (create/update)
    const handleSubmit = async (draft: Draft) => {
        if (editing) {
            // UPDATE
            const res = await fetch(`/api/students/${editing.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(draft),
            });
            if (res.ok) {
                dispatch({ type: "patch", payload: await res.json() });
                setOpen(false);
                setEditing(null);
            }
            return;
        }

        // CREATE
        const res = await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
        });
        if (res.ok) {
            dispatch({ type: "add", payload: await res.json() });
            setOpen(false);
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Estudiantes</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onAdd}
                        className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Agregar estudiante
                    </button>
                </div>
            </div>

            {/* Tabla con callback de edición */}
            <StudentList onEdit={onEdit} />

            {/* Modal unificado: crear/editar */}
            <StudentFormModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditing(null);
                }}
                initial={
                    editing
                        ? {
                            nombre: editing.nombre,
                            apellido: editing.apellido,
                            matricula: editing.matricula,
                            carrera: editing.carrera,
                        }
                        : EMPTY
                }
                mode={editing ? "edit" : "create"}
                onSubmit={handleSubmit}
            />
        </>
    );
}
