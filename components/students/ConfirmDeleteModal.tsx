"use client";

import Modal from "@/components/ui/Modal";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    nombre?: string;
    apellido?: string;
    matricula?: string;
    busy?: boolean;
};

export default function ConfirmDeleteModal({
                                               open,
                                               onClose,
                                               onConfirm,
                                               nombre,
                                               apellido,
                                               matricula,
                                               busy = false,
                                           }: Props) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Confirmar eliminación"
            size="sm"
            closeOnBackdrop={!busy}
            closeOnEsc={!busy}
            disableClose={busy}
            description="Esta acción no se puede deshacer."
            footer={
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
                        disabled={busy}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm()}
                        className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                        disabled={busy}
                        autoFocus
                        data-autofocus
                    >
                        {busy ? "Eliminando…" : "Eliminar"}
                    </button>
                </div>
            }
        >
            <div className="flex items-start gap-3">
                {/* Ícono de alerta */}
                <div className="mt-0.5 rounded-full bg-red-50 p-2 text-red-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <p className="text-slate-700">
                    ¿Seguro que deseas eliminar a{" "}
                    <span className="font-semibold">{nombre} {apellido}</span>
                    {" "}(<span className="font-mono">{matricula}</span>)?
                </p>
            </div>
        </Modal>
    );
}
