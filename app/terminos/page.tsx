import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones del servicio de Cota Madrid: diagnóstico online, asesoría, ejecución de reformas, precios, plazos, garantías y derecho de desistimiento.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cotamadrid.com/terminos' },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <article>
        <header className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            Legal · 04
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.025em] md:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Última actualización: [PLACEHOLDER: 1 de enero de 2026]
          </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-h2:tracking-[-0.01em] prose-a:text-accent">
          <h2>1. Objeto</h2>
          <p>
            Las presentes condiciones generales regulan el uso de los
            servicios ofrecidos por PCH Obras, operando bajo la marca
            comercial <strong>Cota</strong> (en adelante, &laquo;el
            Prestador&raquo;), a través del sitio web{' '}
            <strong>cotamadrid.com</strong>, así como la relación
            contractual entre el Prestador y sus clientes.
          </p>

          <h2>2. Servicios ofrecidos</h2>
          <p>
            El Prestador ofrece los siguientes servicios:
          </p>
          <ul>
            <li>
              <strong>Diagnóstico online gratuito:</strong> cuestionario
              guiado que genera un informe orientativo sobre viabilidad,
              precio estimado, plazos y riesgos de una potencial reforma.
            </li>
            <li>
              <strong>Asesoría previa:</strong> análisis personalizado de
              las necesidades del cliente y recomendaciones técnicas.
            </li>
            <li>
              <strong>Ejecución de obras:</strong> dirección y realización
              de reformas integrales, cocinas, baños y proyectos asimilados
              en Madrid, bajo contrato específico.
            </li>
          </ul>

          <h2>3. Condiciones del diagnóstico online</h2>
          <p>
            El diagnóstico online es un servicio informativo, gratuito y
            orientativo. El informe generado{' '}
            <strong>no constituye un presupuesto cerrado</strong> ni una
            oferta vinculante, y sus resultados se basan exclusivamente en
            la información facilitada por el usuario. Para la obtención de
            un presupuesto definitivo será siempre imprescindible una{' '}
            <strong>visita técnica presencial</strong> al inmueble por
            parte del Prestador.
          </p>
          <p>
            El Prestador se reserva el derecho a declinar proyectos que no
            se ajusten a su ámbito de actividad o a los criterios técnicos
            y de calidad propios del servicio.
          </p>

          <h2>4. Proceso de contratación</h2>
          <ol>
            <li>
              Solicitud del diagnóstico o contacto inicial a través del
              sitio web.
            </li>
            <li>Entrega del informe orientativo.</li>
            <li>Visita técnica al inmueble y levantamiento de mediciones.</li>
            <li>
              Entrega de presupuesto detallado, firma de contrato y pago
              conforme a las condiciones económicas pactadas.
            </li>
            <li>Ejecución de la obra según el cronograma acordado.</li>
            <li>
              Entrega final, certificación de fin de obra y activación de
              garantías.
            </li>
          </ol>

          <h2>5. Precios</h2>
          <p>
            Los precios, rangos o estimaciones publicados en el sitio web
            son meramente <strong>orientativos</strong> y no constituyen
            una oferta. Los precios definitivos se fijarán en el
            presupuesto entregado tras la visita técnica y se expresarán
            con el detalle de partidas y el IVA vigente en la fecha de
            emisión.
          </p>

          <h2>6. Forma de pago</h2>
          <p>
            La forma y el calendario de pago se acordarán en el contrato
            de obra. Con carácter general, será de aplicación un sistema
            de pagos fraccionados vinculado a hitos de ejecución, salvo
            pacto distinto entre las partes.
          </p>

          <h2>7. Plazos de ejecución</h2>
          <p>
            Los plazos se determinarán en el contrato de obra atendiendo
            al alcance del proyecto, condiciones del inmueble y
            disponibilidad de materiales. El Prestador se compromete a
            informar al cliente de cualquier circunstancia sobrevenida
            que pueda afectar a los plazos pactados.
          </p>

          <h2>8. Garantías legales</h2>
          <p>
            Las obras ejecutadas estarán cubiertas por las garantías
            previstas en la <strong>Ley 38/1999, de 5 de noviembre, de
            Ordenación de la Edificación</strong> y por la normativa de
            defensa de los consumidores y usuarios aplicable, con los
            plazos y alcances legalmente establecidos.
          </p>

          <h2>9. Derecho de desistimiento</h2>
          <p>
            Conforme al Real Decreto Legislativo 1/2007, de 16 de
            noviembre, por el que se aprueba el texto refundido de la Ley
            General para la Defensa de los Consumidores y Usuarios, el
            consumidor dispondrá de un plazo de{' '}
            <strong>catorce (14) días naturales</strong> para desistir de
            los contratos celebrados a distancia o fuera del
            establecimiento mercantil, sin necesidad de justificación y
            sin penalización alguna.
          </p>
          <p>
            El consumidor podrá ejercer su derecho comunicándolo por
            escrito al correo electrónico{' '}
            <strong>[PLACEHOLDER: email]</strong> antes de la finalización
            del plazo. En caso de que el consumidor haya solicitado
            expresamente el inicio de la prestación de los servicios
            durante el plazo de desistimiento, deberá abonar al Prestador
            el importe proporcional a la parte ya prestada en el momento
            en que haya informado del ejercicio del desistimiento.
          </p>

          <h2>10. Resolución de conflictos</h2>
          <p>
            En caso de controversia, las partes se comprometen a intentar
            una solución amistosa antes de acudir a la vía judicial. El
            consumidor podrá igualmente acudir a los sistemas de
            arbitraje de consumo y a la plataforma europea de resolución
            de litigios en línea, cuyos detalles se facilitan en la{' '}
            <Link href="/reclamaciones">página de reclamaciones</Link>.
          </p>
          <p>
            Para la resolución de cualquier controversia no resuelta
            amistosamente, las partes se someten a los Juzgados y
            Tribunales de Madrid capital, salvo que la normativa de
            consumo determine otro fuero aplicable.
          </p>

          <h2>11. Modificaciones de los términos</h2>
          <p>
            El Prestador se reserva el derecho a modificar en cualquier
            momento las presentes condiciones. Las modificaciones entrarán
            en vigor desde su publicación y no afectarán a los contratos
            ya formalizados, que se regirán por las condiciones vigentes
            en el momento de su firma.
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
