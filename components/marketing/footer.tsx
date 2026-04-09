import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { getCompany } from '@/lib/db/repositories/company';

const SERVICIOS: Array<{ label: string; href: string }> = [
  { label: 'Reforma integral', href: '/#propuesta' },
  { label: 'Diagnóstico online', href: '/diagnostico' },
  { label: 'Calculadora rápida', href: '/calculadora-reforma-madrid' },
  { label: 'Reformas en Salamanca', href: '/reforma-piso-salamanca' },
  { label: 'Reformas en Chamberí', href: '/reforma-piso-chamberi' },
  { label: 'Reformas en Retiro', href: '/reforma-piso-retiro' },
  { label: 'Agendar visita', href: '/#agenda' },
];

const EMPRESA: Array<{ label: string; href: string }> = [
  { label: 'Sobre Cota', href: '/sobre-cota' },
  { label: 'Proceso', href: '/#como-funciona' },
  { label: 'Proyectos', href: '/#escenarios' },
  { label: 'Calculadora', href: '/calculadora-reforma-madrid' },
];

const LEGAL: Array<{ label: string; href: string }> = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Privacidad', href: '/politica-privacidad' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Términos', href: '/terminos' },
  { label: 'Reclamaciones', href: '/reclamaciones' },
];

export async function Footer() {
  const year = new Date().getFullYear();
  const company = await getCompany();
  const telHref = `tel:${company.telefono.replace(/\s+/g, '')}`;
  const waHref = `https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <footer
      className="relative border-t border-border/60"
      style={{ backgroundColor: 'oklch(0.13 0.02 168)' }}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Pie de página
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            {/* Logo — inverted via CSS so the dark serif "Cota" reads
                white on the dark green footer without needing a
                transparent PNG. */}
            <Link href="/" aria-label="Cota Madrid" className="inline-block group">
              <span
                aria-hidden
                className="block h-32 w-80 md:h-36 md:w-[22rem] bg-foreground transition-colors group-hover:bg-accent"
                style={{
                  WebkitMaskImage: 'url(/images/cota/logo-cota.svg)',
                  maskImage: 'url(/images/cota/logo-cota.svg)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'left center',
                  maskPosition: 'left center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-foreground/70">
              Reforma con criterio.
              <br />
              Consultoría premium de reformas integrales en Madrid.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/85">
              <span className="size-1.5 rounded-full bg-accent" />
              Garantía LOE · 10 años
            </p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">
              {company.legal_name} · {company.commercial_name} Madrid
            </p>
          </div>

          {/* Servicios */}
          <nav aria-label="Servicios">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Servicios
            </h3>
            <ul className="mt-6 space-y-3">
              {SERVICIOS.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/70 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Empresa */}
          <nav aria-label="Empresa">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Empresa
            </h3>
            <ul className="mt-6 space-y-3">
              {EMPRESA.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/70 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Contacto
            </h3>
            <ul className="mt-6 space-y-3 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" aria-hidden />
                <span>{company.domicilio || 'Madrid, España'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" aria-hidden />
                <a href={telHref} className="transition-colors hover:text-accent">
                  {company.telefono}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" aria-hidden />
                <a
                  href={`mailto:${company.email_contacto}`}
                  className="transition-colors hover:text-accent"
                >
                  {company.email_contacto}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" aria-hidden />
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 border-t border-border/40 pt-8 md:mt-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/50">
              © {year} {company.legal_name} · {company.commercial_name} Madrid · Todos los derechos reservados
            </p>
            <nav aria-label="Enlaces legales">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {LEGAL.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60 transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
