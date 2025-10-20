import FeatureCard from "./FeatureCard";

const FEATURES = [
    { title: "CRUD con Route Handlers", desc: "Create/Read/Update/Delete usando App Router." },
    { title: "API externa (PokéAPI)", desc: "Fetch server/client con caché y manejo de estados." },
    { title: "Estado global", desc: "useReducer + Context para flujos predecibles." },
    { title: "Accesibilidad", desc: "Focus visible, semántica y contraste correcto." },
    { title: "UI responsiva", desc: "Tailwind y diseño mobile-first." },
    { title: "Arquitectura limpia", desc: "Componentes modulares y reutilizables." },
];

export default function FeaturesSection() {
    return (
        <section className="max-w-6xl mx-auto px-4 pb-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
            </div>
        </section>
    );
}
