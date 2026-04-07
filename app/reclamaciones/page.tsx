import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCompany } from '@/lib/db/repositories/company';

export const metadata: Metadata = {
  title: 'Hojas de Reclamaciones',
  description:
    'Información sobre las hojas de reclamaciones oficiales, arbitraje de consumo, mediación y plataforma europea ODR para clientes de Cota Madrid.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cotamadrid.com/reclamaciones' },
};

export default async function Page() {
  const company = await getCompany();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <article>
        <header className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            Legal · 05
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.025em] md:text-5xl">
            Hojas de Reclamaciones
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Última actualización: {company.last_legal_update}
          </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-h2:tracking-[-0.01em] prose-a:text-accent">
          <h2>1. Disponibilidad de hojas de reclamaciones</h2>
          <p>
            En cumplimiento de la normativa aplicable en materia de
            consumo, y en particular del{' '}
            <strong>Decreto 1/2010, de 14 de enero, del Consejo de
            Gobierno, por el que se aprueba el Reglamento de la Ley 11/1998,
            de 9 de julio, de Protección de los Consumidores de la
            Comunidad de Madrid</strong>, PCH Obras (marca comercial{' '}
            <strong>Cota</strong>) pone a disposición de sus clientes y
            usuarios las hojas oficiales de reclamación de la Comunidad de
            Madrid.
          </p>

          <h2>2. Cómo solicitar una hoja de reclamación</h2>
          <p>
            El cliente puede solicitar una hoja de reclamación a través de
            cualquiera de los siguientes canales:
          </p>
          <ul>
            <li>
              <strong>Correo electrónico:</strong>{' '}
              {company.email_reclamaciones || '—'}
            </li>
            <li>
              <strong>Presencialmente en obra</strong> al responsable
              designado por el Prestador, que facilitará el impreso oficial
              y asistirá al cliente en su cumplimentación.
            </li>
            <li>
              <strong>Por correo postal</strong> dirigido al domicilio
              social indicado en el{' '}
              <Link href="/aviso-legal">Aviso Legal</Link>.
            </li>
          </ul>
          <p>
            Las hojas de reclamaciones constan de tres ejemplares: uno para
            la Administración, otro para el Prestador y otro para el
            reclamante.
          </p>

          <h2>3. Plazos de respuesta</h2>
          <p>
            El Prestador se compromete a contestar por escrito a las
            reclamaciones recibidas en un plazo máximo de{' '}
            <strong>un (1) mes</strong> desde la recepción, conforme a lo
            previsto en la normativa de consumo. En el caso de
            reclamaciones especialmente complejas, el Prestador informará
            al cliente de las razones que justifiquen una posible
            ampliación razonable de dicho plazo.
          </p>

          <h2>4. Arbitraje y mediación</h2>
          <p>
            El cliente podrá igualmente someter sus reclamaciones a los
            organismos de <strong>arbitraje de consumo</strong>
            competentes, en particular a la Junta Arbitral de Consumo de
            la Comunidad de Madrid, cuyos servicios son gratuitos y
            vinculantes para ambas partes cuando el Prestador se haya
            adherido al sistema arbitral, y a los servicios públicos de
            mediación disponibles en su localidad.
          </p>

          <h2>5. Datos de contacto para reclamaciones</h2>
          <ul>
            <li>
              <strong>Entidad:</strong> {company.legal_name} ·{' '}
              {company.commercial_name} Madrid
            </li>
            <li>
              <strong>Correo electrónico:</strong>{' '}
              {company.email_reclamaciones || '—'}
            </li>
            <li>
              <strong>Teléfono:</strong> {company.telefono || '—'}
            </li>
            <li>
              <strong>Dirección postal:</strong> {company.domicilio || '—'}
            </li>
          </ul>

          <h2>6. Plataforma europea de resolución de litigios en línea</h2>
          <p>
            De conformidad con el Reglamento (UE) nº 524/2013 del
            Parlamento Europeo y del Consejo, de 21 de mayo de 2013, sobre
            resolución de litigios en línea en materia de consumo, se
            informa al usuario de la existencia de una plataforma europea
            de resolución de litigios en línea (plataforma ODR) accesible
            en la siguiente dirección:
          </p>
          <p>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
          <p>
            Los consumidores podrán acudir a dicha plataforma para
            resolver las controversias que se deriven de contratos de
            compraventa o servicios celebrados en línea.
          </p>
        </div>

        <nav
          aria-label="Volver"
          className="mt-16 border-t border-border/40 pt-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/70 transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            Volver al inicio
          </Link>
        </nav>
      </article>
    </main>
  );
}
