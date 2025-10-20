import TeamMemberCard from "./TeamMemberCard";

const TEAM = [
    { name: "OLIVER BRYAN ANTONIO GALVEZ", matricula: "S21017275", image: "/team/alejandro.jpg" },
    { name: "JOSEPH J AVENDAÑO RODRIGUEZ", matricula: "S22021299", image: "/team/maria.jpg" },
    { name: " JORDAN JAIR CRUZ MENDOZA", matricula: "S22017019", image: "/team/jose.jpg" },
    { name: "ZUZZET HERNANDEZ SUAREZ", matricula: "S22017025", image: "/team/ana.jpg" },
    { name: "RICARDO  LANDA SOLANO", matricula: "S22017010", image: "/team/carlos.jpg" },
];

export default function TeamSection() {
    return (
        <section className="max-w-6xl mx-auto px-4 pb-16">
            <h2 className="text-3xl font-bold text-center mb-2">Equipo de desarrollo</h2>
            <p className="text-slate-600 text-center mb-10">
                Integrantes responsables del desarrollo, diseño e implementación del proyecto Next CRUD.
            </p>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {TEAM.map((m) => (
                    <TeamMemberCard key={m.matricula} {...m} />
                ))}
            </ul>
        </section>
    );
}
