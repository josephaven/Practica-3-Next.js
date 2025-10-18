"use client";
import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Item } from '@/lib/store';

type State = { items: Item[]; loading: boolean };
type Action =
  | { type: 'load' } | { type: 'set'; payload: Item[] }
  | { type: 'add'; payload: Item } | { type: 'patch'; payload: Item }
  | { type: 'remove'; payload: string };

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

function reducer(s: State, a: Action): State {
  if (a.type === 'load') return { ...s, loading: true };
  if (a.type === 'set') return { items: a.payload, loading: false };
  if (a.type === 'add') return { ...s, items: [a.payload, ...s.items] };
  if (a.type === 'patch') return { ...s, items: s.items.map(i => i.id === a.payload.id ? a.payload : i) };
  if (a.type === 'remove') return { ...s, items: s.items.filter(i => i.id !== a.payload) };
  return s;
}

export function ItemProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], loading: false });
  useEffect(() => { (async () => {
    dispatch({ type: 'load' });
    const res = await fetch('/api/items'); dispatch({ type: 'set', payload: await res.json() });
  })(); }, []);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
export const useItems = () => { const c = useContext(Ctx); if (!c) throw new Error('useItems dentro de ItemProvider'); return c; };
