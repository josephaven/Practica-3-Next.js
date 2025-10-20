import Image from "next/image";

type Props = {
    name: string;
    matricula: string;
};

export default function TeamMemberCard({ name, matricula }: Props) {
    return (
        <li className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center focus-within:ring-2 focus-within:ring-slate-400 focus-within:ring-offset-2">
            <div className="flex flex-col items-center">
                {/* Círculo con iniciales */}
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold text-2xl mb-4">
                    {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                </div>

                {/* Información */}
                <div className="space-y-1">
                    <p className="font-medium text-lg">{name}</p>
                    <p className="text-sm text-slate-500">{matricula}</p>
                </div>
            </div>
        </li>
    );
}

