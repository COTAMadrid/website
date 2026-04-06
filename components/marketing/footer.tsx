import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-serif text-2xl">Cota</p>
          <p className="text-sm text-muted-foreground mt-1">
            Reforma con criterio · Madrid
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/politica-privacidad" className="hover:text-foreground">
            Política de privacidad
          </Link>
          <Link href="/aviso-legal" className="hover:text-foreground">
            Aviso legal
          </Link>
          <Link href="/cookies" className="hover:text-foreground">
            Cookies
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PCH Obras
        </p>
      </div>
    </footer>
  );
}
