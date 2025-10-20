"use client";
import { createContext, useContext, useEffect, useReducer } from "react";
import type { Student } from "@/lib/store";

type State = { students: Student[]; loading: boolean };
type Action =
  | { type: "load" }
  | { type: "set"; payload: Student[] }
  | { type: "add"; payload: Student }
  | { type: "patch"; payload: Student }
  | { type: "remove"; payload: string };

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "load":   return { ...s, loading: true };
    case "set":    return { students: a.payload, loading: false };
    case "add":    return { ...s, students: [a.payload, ...s.students] };
    case "patch":  return { ...s, students: s.students.map(x => x.id === a.payload.id ? a.payload : x) };
    case "remove": return { ...s, students: s.students.filter(x => x.id !== a.payload) };
    default:       return s;
  }
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { students: [], loading: false });

  useEffect(() => {
    (async () => {
      dispatch({ type: "load" });
      const res = await fetch("/api/students", { cache: "no-store" });
      dispatch({ type: "set", payload: await res.json() });
    })();
  }, []);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export const useStudents = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStudents debe usarse dentro de StudentProvider");
  return ctx;
};
