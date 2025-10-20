'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

const LINKS = [
    { href: '/', label: 'Inicio' },
    { href: '/students', label: 'Estudiantes' },
    { href: '/about', label: 'Acerca de' },
];

export default function NavBar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);

    // sombra sutil al hacer scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // cerrar menú al cambiar de ruta
    useEffect(() => setOpen(false), [pathname]);

    // cerrar con ESC en móvil
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            {/* Skip link para accesibilidad */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-white"
            >
                Saltar al contenido
            </a>

            <header
                className={cx(
                    'sticky top-0 z-30 bg-white text-slate-900 transition-shadow',
                    scrolled && 'shadow-sm border-b border-slate-200/70'
                )}
            >
                <nav
                    className="mx-auto max-w-6xl px-4"
                    role="navigation"
                    aria-label="Principal"
                >
                    <div className="h-14 flex items-center gap-4">
                        {/* Marca */}
                        <Link
                            href="/"
                            className="font-semibold tracking-tight hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded"
                        >
                            Next CRUD
                        </Link>

                        {/* Links (desktop) */}
                        <ul className="ml-auto hidden md:flex items-center gap-1">
                            {LINKS.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        aria-current={isActive(l.href) ? 'page' : undefined}
                                        className={cx(
                                            'relative block px-3 py-2 text-sm rounded-md transition-colors outline-none',
                                            // hover/focus: resalte claro + subrayado animado
                                            'hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400',
                                            // indicador activo
                                            isActive(l.href) &&
                                            'font-medium bg-slate-100 ring-1 ring-slate-200',
                                            // línea inferior animada en hover
                                            'after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-[2px] after:rounded after:scale-x-0 after:transition-transform after:origin-left after:bg-slate-900 hover:after:scale-x-100'
                                        )}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Botón menú móvil */}
                        <button
                            ref={btnRef}
                            type="button"
                            className="ml-auto md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                            aria-label="Abrir menú"
                            aria-controls="mobile-menu"
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                        >
                            {open ? (
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Menú móvil accesible */}
                    <div
                        id="mobile-menu"
                        className={cx(
                            'md:hidden grid transition-[grid-template-rows] duration-200 ease-out overflow-hidden',
                            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        )}
                    >
                        <ul className="min-h-0 overflow-hidden border-t border-slate-200 py-2 bg-white" role="menu">
                            {LINKS.map((l) => (
                                <li key={l.href} role="none">
                                    <Link
                                        href={l.href}
                                        role="menuitem"
                                        aria-current={isActive(l.href) ? 'page' : undefined}
                                        className={cx(
                                            'relative block px-3 py-2 text-sm rounded-md outline-none transition-colors',
                                            'hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400',
                                            isActive(l.href) && 'font-medium bg-slate-100',
                                            'after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded after:scale-x-0 after:transition-transform after:origin-left after:bg-slate-900 hover:after:scale-x-100'
                                        )}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}
