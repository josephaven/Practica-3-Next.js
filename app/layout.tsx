import './globals.css';
import NavBar from '@/components/nav-bar/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body className="min-h-screen bg-slate-50 text-slate-900">
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Equipo React+Next.js
        </footer>
        </body>
        </html>
    );
}
