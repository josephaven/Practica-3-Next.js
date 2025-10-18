type Poke = { name: string; url: string };

export default async function About() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=6', { cache: 'no-store' });
  const data = await res.json() as { results: Poke[] };
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">API externa (PokéAPI)</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.results.map(p => (
          <div key={p.name} className="rounded-2xl border p-4 bg-white">
            <h3 className="font-medium">{p.name}</h3>
            <a className="text-sm text-blue-600 hover:underline" href={p.url} target="_blank">Ver detalle</a>
          </div>
        ))}
      </div>
    </section>
  );
}
