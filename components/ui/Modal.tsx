"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Size = "sm" | "md" | "lg" | "xl";

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    /** Footer opcional (botones de acción) */
    footer?: React.ReactNode;
    /** Tamaño del panel */
    size?: Size;
    /** Evitar cerrar con click en backdrop */
    closeOnBackdrop?: boolean; // default: true
    /** Evitar cerrar con tecla ESC */
    closeOnEsc?: boolean; // default: true
    /** Ocultar botón (X) */
    hideCloseButton?: boolean;
    /** Foco inicial dentro del modal (si lo envías) */
    initialFocusRef?: React.RefObject<HTMLElement>;
    /** Descripción accesible opcional (id generado internamente si se envía string) */
    description?: string;
    /** Deshabilita cierre mientras hay acción en curso (ej. busy) */
    disableClose?: boolean;
};

const sizeClasses: Record<Size, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
};

export default function Modal({
                                  open,
                                  onClose,
                                  title,
                                  children,
                                  footer,
                                  size = "md",
                                  closeOnBackdrop = true,
                                  closeOnEsc = true,
                                  hideCloseButton = false,
                                  initialFocusRef,
                                  description,
                                  disableClose = false,
                              }: Props) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const lastActiveRef = useRef<HTMLElement | null>(null);
    const descId = description ? "modal-desc-" + Math.random().toString(36).slice(2) : undefined;

    // Guardar foco previo y bloquear scroll al abrir; restaurar al cerrar
    useLayoutEffect(() => {
        if (!open) return;
        lastActiveRef.current = document.activeElement as HTMLElement | null;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
            // restaurar foco al trigger
            lastActiveRef.current?.focus?.();
        };
    }, [open]);

    // Foco inicial dentro del modal
    useEffect(() => {
        if (!open) return;
        const el = initialFocusRef?.current || panelRef.current?.querySelector<HTMLElement>(
            "[autofocus], [data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        el?.focus?.();
    }, [open, initialFocusRef]);

    // Esc + Focus Trap
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && closeOnEsc && !disableClose) {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key !== "Tab") return;

            // Focus trap
            const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusables || focusables.length === 0) return;
            const list = Array.from(focusables).filter((n) => n.offsetParent !== null);
            const first = list[0];
            const last = list[list.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, closeOnEsc, disableClose, onClose]);

    if (!open) return null;

    const panel = (
        <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={descId}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-100 transition-opacity data-[closing=true]:opacity-0"
                onClick={() => {
                    if (!disableClose && closeOnBackdrop) onClose();
                }}
                aria-hidden
            />
            {/* Contenedor centrado */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    ref={panelRef}
                    className={`w-full ${sizeClasses[size]} rounded-2xl border bg-white shadow-lg outline-none
                     opacity-100 translate-y-0 scale-100
                     transition-all duration-150 ease-out
                     data-[closing=true]:opacity-0 data-[closing=true]:translate-y-2 data-[closing=true]:scale-95`}
                    tabIndex={-1}
                >
                    {/* Header */}
                    {(title || !hideCloseButton) && (
                        <div className="flex items-start justify-between gap-4 p-6 pb-4">
                            {title ? (
                                <h2 id="modal-title" className="text-lg font-semibold">
                                    {title}
                                </h2>
                            ) : (
                                <span className="sr-only">Modal</span>
                            )}
                            {!hideCloseButton && (
                                <button
                                    onClick={() => !disableClose && onClose()}
                                    className="rounded p-1 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                                    aria-label="Cerrar"
                                    disabled={disableClose}
                                >
                                    {/* X */}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className="px-6 pb-6">
                        {description && (
                            <p id={descId} className="mb-4 text-slate-600">
                                {description}
                            </p>
                        )}
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && <div className="border-t px-6 py-4">{footer}</div>}
                </div>
            </div>
        </div>
    );

    // Portal a body para evitar stacking/contextos
    return createPortal(panel, document.body);
}
