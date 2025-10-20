"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
    name: string;
    matricula: string;
    image?: string; // ← importante
};

export default function TeamMemberCard({ name, matricula, image }: Props) {
    const [imgError, setImgError] = useState(false);
    const initials = name.split(" ").filter(Boolean).slice(0,2).map(n=>n[0]).join("").toUpperCase();

    return (
        <li className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="flex flex-col items-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border border-slate-200 mb-4">
                    {image && !imgError ? (
                        <Image
                            src={image}
                            alt={`Foto de ${name}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-700 font-semibold text-2xl">
                            {initials}
                        </div>
                    )}
                </div>
                <p className="font-medium text-lg">{name}</p>
                <p className="text-sm text-slate-500">{matricula}</p>
            </div>
        </li>
    );
}
