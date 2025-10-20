"use client";

import { useEffect, useRef } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
    const dialogRef = useRef<HTMLDivElement | null>(null);

    // cerrar con ESC y bloquear scroll del body
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
                onClick={onClose}
                aria-hidden
            />
            {/* contenedor */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div
                    ref={dialogRef}
                    className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-lg animate-[fadeIn_.15s_ease-out]"
                >
                    <div className="flex items-start justify-between gap-4">
                        {title ? (
                            <h2 id="modal-title" className="text-lg font-semibold">
                                {title}
                            </h2>
                        ) : (
                            <span className="sr-only">Modal</span>
                        )}
                        <button
                            onClick={onClose}
                            className="rounded p-1 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                            aria-label="Cerrar modal"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="mt-4">{children}</div>
                </div>
            </div>
        </div>
    );
}
