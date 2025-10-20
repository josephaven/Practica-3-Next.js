"use client";

import { useState } from "react";
import StudentList from "@/components/students/StudentList";
import StudentFormModal from "./StudentFormModal";

export default function StudentManager() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Estudiantes</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                    >
                        {/* icono + */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Agregar estudiante
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <StudentList />

            {/* Modal de alta */}
            <StudentFormModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
