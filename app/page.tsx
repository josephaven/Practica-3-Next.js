import Image from "next/image";

export default function Home() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border p-6 bg-white">
        <h1 className="text-2xl font-bold mb-2">Demo CRUD + API externa</h1>
        <p>Next.js (App Router), Tailwind, Server/Client Components.</p>
      </div>
      <div className="rounded-2xl border p-6 bg-white">
        <ul className="list-disc pl-4">
          <li>Interfaz responsive</li>
          <li>CRUD vía Route Handlers</li>
          <li>API externa (PokéAPI)</li>
          <li>Manejo de estado (useReducer + contexto)</li>
          <li>Navegación entre vistas</li>
        </ul>
      </div>
    </section>
  );
}
