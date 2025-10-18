"use client";

import Link from "next/link";
import { useItems } from "./ItemContext";

export default function ClientList() {
  const { state, dispatch } = useItems();

  if (state.loading) return <p>Cargando…</p>;

  const toggle = async (id: string, done: boolean) => {
    const res = await fetch(`/api/items/${id}`, {
      method: "PUT",
      body: JSON.stringify({ done }),
    });
    dispatch({ type: "patch", payload: await res.json() });
  };

  const remove = async (id: string) => {
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    dispatch({ type: "remove", payload: id });
  };

  return (
    <ul className="divide-y">
      {state.items.map((i) => (
        <li key={i.id} className="py-3 flex items-center gap-3">
          <input
            type="checkbox"
            checked={i.done}
            onChange={(e) => toggle(i.id, e.target.checked)}
          />
          <Link href={`/items/${i.id}`} className="flex-1 hover:underline">
            {i.title}
          </Link>
          <button
            onClick={() => remove(i.id)}
            className="text-red-600 text-sm"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}
