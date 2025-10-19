"use client";
import { useState } from "react";
import { useStudents } from "./StudentContext";

type EditId = string | null;

export default function StudentList() {
  const { state, dispatch } = useStudents();
  const [editing, setEditing] = useState<EditId>(null);
  const [draft, setDraft] = useState({ nombre: "", apellido: "", matricula: "", carrera: "" });

  if (state.loading) return <p>Cargando…</p>;

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
        <thead className="bg-slate-100 text-slate-700">
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
                      />
                    </td>
                  ))}
                  <td className="p-2">
                    {/* 👉 evita solapes: apila en móvil, fila en pantallas grandes */}
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
                      <button
                        onClick={() => save(s.id)}
                        className="rounded bg-black px-4 py-2 text-white hover:opacity-90"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="rounded border px-4 py-2 hover:bg-slate-50"
                      >
                        Cancelar
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
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(s.id)}
                        className="rounded border px-3 py-1 hover:bg-slate-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => remove(s.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Eliminar
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
