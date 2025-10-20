import Link from "next/link";

export default function Hero() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide bg-white">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          Proyecto académico · Next.js + Tailwind
        </span>

                <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    Demo CRUD con Next.js + API externa
                </h1>

                <p className="mt-4 text-lg text-slate-600">
                    App con <strong>App Router</strong>, componentes de servidor/cliente, accesible y responsiva.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        href="/students"
                        className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                        aria-label="Ir a Estudiantes"
                    >
                        Ver estudiantes
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>

                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium border hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                        Acerca de
                    </Link>
                </div>
            </div>
        </section>
    );
}
