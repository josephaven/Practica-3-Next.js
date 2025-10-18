import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50">
        <nav className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-semibold">Next CRUD</Link>
            <div className="ml-auto flex gap-4 text-sm">
              <Link href="/items" className="hover:underline">Items</Link>
              <Link href="/about" className="hover:underline">About</Link>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Equipo React+Next.js
        </footer>
      </body>
    </html>
  );
}
