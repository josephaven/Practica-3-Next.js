"use client";
import { useItems } from './ItemContext';
import { useState } from 'react';

export default function ItemForm() {
  const { dispatch } = useItems(); const [title, setTitle] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/items', { method: 'POST', body: JSON.stringify({ title }) });
    dispatch({ type: 'add', payload: await res.json() }); setTitle('');
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input className="flex-1 border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nuevo item..." />
      <button className="px-4 py-2 rounded bg-black text-white">Agregar</button>
    </form>
  );
}
