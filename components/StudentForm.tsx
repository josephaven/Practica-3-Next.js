"use client";
import { useState } from "react";
import { useStudents } from "./StudentContext";

export default function StudentForm() {
  const { dispatch } = useStudents();
  const [form, setForm] = useState({ nombre: "", apellido: "", matricula: "", carrera: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      dispatch({ type: "add", payload: await res.json() });
      setForm({ nombre: "", apellido: "", matricula: "", carrera: "" });
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border bg-white p-4 shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(["nombre","apellido","matricula","carrera"] as const).map((k) => (
          <input
            key={k}
            value={form[k]}
            onChange={(e) => setForm((v) => ({ ...v, [k]: e.target.value }))}
            placeholder={k[0].toUpperCase() + k.slice(1)}
            className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
            required
          />
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button className="rounded bg-black px-4 py-2 text-white hover:opacity-90">
          Agregar
        </button>
      </div>
    </form>
  );
}
