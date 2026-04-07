import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCompany } from '@/lib/db/repositories/company';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description:
    'Política de cookies de Cota Madrid: tipos de cookies utilizadas, finalidad, duración y gestión desde el navegador.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cotamadrid.com/cookies' },
};

export default async function Page() {
  const company = await getCompany();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <article>
        <header className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            Legal · 03
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.025em] md:text-5xl">
            Política de Cookies
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Última actualización: {company.last_legal_update}
          </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-h2:tracking-[-0.01em] prose-a:text-accent">
          <h2>1. ¿Qué son las cookies?</h2>
          <p>
            Una cookie es un pequeño fichero de texto que un sitio web
            almacena en el navegador del usuario cuando lo visita. Las
            cookies permiten al sitio recordar información sobre la visita,
            como el idioma preferido u otras preferencias, de forma que el
            usuario no tenga que volver a configurarlas en cada visita.
          </p>
          <p>
            En determinadas ocasiones, en lugar de cookies HTTP se utilizan
            tecnologías equivalentes de almacenamiento local del navegador
            (<em>localStorage</em> y <em>sessionStorage</em>), que se
            encuentran sometidas al mismo régimen informativo y de
            consentimiento que las cookies tradicionales, conforme al
            artículo 22.2 de la LSSI-CE.
          </p>

          <h2>2. Tipos de cookies utilizadas</h2>
          <p>
            El sitio web <strong>cotamadrid.com</strong> utiliza las
            siguientes categorías de cookies y tecnologías asimiladas:
          </p>
          <ul>
            <li>
              <strong>Cookies técnicas o necesarias:</strong> imprescindibles
              para el funcionamiento del sitio, la navegación por las
              distintas secciones, el mantenimiento de la sesión del panel
              de administración y la memorización del consentimiento del
              banner de cookies. Están exentas del requisito de
              consentimiento previo.
            </li>
            <li>
              <strong>Almacenamiento local de sesión del diagnóstico y
              chatbot:</strong> tecnologías de <em>sessionStorage</em>{' '}
              necesarias para la continuidad del cuestionario y la
              conversación con el chatbot durante la visita.
            </li>
            <li>
              <strong>Cookies analíticas:</strong> en su caso, cookies o
              medición anónima de tráfico para conocer el uso agregado del
              sitio y mejorar la experiencia. No identifican
              individualmente al usuario.
            </li>
          </ul>
          <p>
            El sitio <strong>no utiliza</strong> cookies publicitarias, de
            perfilado ni de terceros con fines de marketing.
          </p>

          <h2>3. Detalle de las cookies y almacenamiento local</h2>
          <div className="not-prose my-6 overflow-x-auto rounded border border-border/40">
            <table className="w-full text-left text-sm">
              <thead className="bg-foreground/5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Finalidad</th>
                  <th className="px-4 py-3">Duración</th>
                  <th className="px-4 py-3">Propietario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-foreground/80">
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">
                    cota_admin_session
                  </td>
                  <td className="px-4 py-3">Cookie técnica</td>
                  <td className="px-4 py-3">
                    Mantener la sesión autenticada del panel de
                    administración.
                  </td>
                  <td className="px-4 py-3">Sesión</td>
                  <td className="px-4 py-3">Propia</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">
                    cota-cookies-accepted
                  </td>
                  <td className="px-4 py-3">localStorage</td>
                  <td className="px-4 py-3">
                    Recordar la aceptación del aviso de cookies.
                  </td>
                  <td className="px-4 py-3">Persistente</td>
                  <td className="px-4 py-3">Propia</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">
                    cota-chat-history
                  </td>
                  <td className="px-4 py-3">sessionStorage</td>
                  <td className="px-4 py-3">
                    Mantener el historial de conversación con el chatbot
                    durante la visita.
                  </td>
                  <td className="px-4 py-3">Sesión del navegador</td>
                  <td className="px-4 py-3">Propia</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">
                    cota-prefill-contact
                  </td>
                  <td className="px-4 py-3">sessionStorage</td>
                  <td className="px-4 py-3">
                    Rellenar automáticamente campos de contacto a partir de
                    datos previos del diagnóstico.
                  </td>
                  <td className="px-4 py-3">Sesión del navegador</td>
                  <td className="px-4 py-3">Propia</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">
                    cota-wizard-state
                  </td>
                  <td className="px-4 py-3">sessionStorage</td>
                  <td className="px-4 py-3">
                    Conservar el avance del cuestionario de diagnóstico
                    entre pasos.
                  </td>
                  <td className="px-4 py-3">Sesión del navegador</td>
                  <td className="px-4 py-3">Propia</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>4. Cómo gestionar las cookies</h2>
          <p>
            El usuario puede, en cualquier momento, permitir, bloquear o
            eliminar las cookies instaladas en su equipo mediante la
            configuración de las opciones del navegador. A continuación se
            enlazan las guías oficiales de los navegadores más habituales:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Apple Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/es-es/microsoft-edge"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p>
            Se advierte al usuario que la desactivación de las cookies
            técnicas puede afectar al correcto funcionamiento del sitio
            web.
          </p>

          <h2>5. Aceptación y consentimiento</h2>
          <p>
            Al continuar navegando por este sitio web tras haber recibido
            información sobre las cookies empleadas y haber aceptado
            expresamente el aviso, el usuario presta su consentimiento
            para el uso descrito en la presente política. El Responsable
            podrá modificar esta política en función de exigencias
            legislativas, reglamentarias o con la finalidad de adaptarla a
            las instrucciones dictadas por la Agencia Española de
            Protección de Datos.
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
