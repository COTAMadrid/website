import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description:
    'Aviso legal de Cota Madrid (PCH Obras): identificación del titular, condiciones de uso, propiedad intelectual, responsabilidad y jurisdicción aplicable.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cotamadrid.com/aviso-legal' },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <article>
        <header className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            Legal · 01
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.025em] md:text-5xl">
            Aviso Legal
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Última actualización: [PLACEHOLDER: 1 de enero de 2026]
          </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-h2:tracking-[-0.01em] prose-a:text-accent">
          <h2>1. Identificación del titular</h2>
          <p>
            En cumplimiento del deber de información recogido en el artículo 10
            de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de
            la Información y de Comercio Electrónico (LSSI-CE), se facilitan
            los siguientes datos del titular del sitio web{' '}
            <strong>cotamadrid.com</strong>:
          </p>
          <ul>
            <li>
              <strong>Denominación social:</strong> PCH Obras (en adelante,
              &laquo;el Titular&raquo;), operando bajo la marca comercial{' '}
              <strong>Cota</strong>.
            </li>
            <li>
              <strong>CIF:</strong> [PLACEHOLDER: CIF]
            </li>
            <li>
              <strong>Domicilio social:</strong> [PLACEHOLDER: domicilio
              completo, Madrid, España]
            </li>
            <li>
              <strong>Datos registrales:</strong> [PLACEHOLDER: Registro
              Mercantil de Madrid, tomo, folio, hoja, inscripción]
            </li>
            <li>
              <strong>Correo electrónico de contacto:</strong> [PLACEHOLDER:
              email]
            </li>
            <li>
              <strong>Teléfono:</strong> [PLACEHOLDER: teléfono]
            </li>
          </ul>

          <h2>2. Objeto</h2>
          <p>
            El presente aviso legal regula el uso del sitio web{' '}
            <strong>cotamadrid.com</strong>, titularidad del Titular, que
            ofrece información sobre los servicios de consultoría y ejecución
            de reformas integrales de viviendas en Madrid, así como un
            diagnóstico orientativo online y formularios de contacto con
            potenciales clientes.
          </p>

          <h2>3. Condiciones de uso</h2>
          <p>
            El acceso y la utilización del sitio web atribuyen la condición de
            usuario e implican la aceptación plena y sin reservas de todas y
            cada una de las disposiciones incluidas en este aviso legal en la
            versión publicada en el momento del acceso. El usuario se
            compromete a utilizar el sitio web y sus contenidos conforme a la
            legislación vigente, a la buena fe y a los usos generalmente
            aceptados, absteniéndose de emplearlos con fines o efectos
            contrarios a la ley, a la moral o al orden público.
          </p>

          <h2>4. Propiedad intelectual e industrial</h2>
          <p>
            Todos los contenidos del sitio web, entendiendo por estos, a título
            enunciativo, los textos, fotografías, gráficos, imágenes, iconos,
            tecnología, software, enlaces y demás contenidos audiovisuales o
            sonoros, así como su diseño gráfico y códigos fuente, son
            propiedad intelectual del Titular o de terceros, sin que puedan
            entenderse cedidos al usuario ninguno de los derechos de
            explotación sobre los mismos más allá de lo estrictamente
            necesario para el correcto uso de la web.
          </p>
          <p>
            Las marcas, nombres comerciales o signos distintivos son
            titularidad del Titular o de terceros, sin que pueda entenderse
            que el acceso al sitio web atribuya ningún derecho sobre ellos.
          </p>

          <h2>5. Exclusión de garantías y responsabilidad</h2>
          <p>
            El contenido del presente sitio web es de carácter general y tiene
            una finalidad meramente informativa. El Titular no garantiza
            plenamente el acceso a todos los contenidos, ni su exhaustividad,
            corrección, vigencia o actualidad, ni su idoneidad o utilidad para
            un objetivo específico.
          </p>
          <p>
            El Titular excluye, hasta donde permite el ordenamiento jurídico,
            cualquier responsabilidad por los daños y perjuicios de toda
            naturaleza derivados de la interrupción del servicio o la
            ausencia de disponibilidad o continuidad del sitio web, la
            defraudación de la utilidad que los usuarios hubieran podido
            atribuir al mismo, o la existencia de virus y demás componentes
            informáticos dañinos.
          </p>
          <p>
            El diagnóstico orientativo online ofrecido en{' '}
            <Link href="/diagnostico">/diagnostico</Link> tiene carácter
            meramente informativo y no constituye un presupuesto cerrado ni
            una oferta vinculante. Cualquier presupuesto definitivo requerirá
            una visita técnica presencial.
          </p>

          <h2>6. Modificaciones</h2>
          <p>
            El Titular se reserva el derecho a efectuar, sin previo aviso, las
            modificaciones que considere oportunas en el sitio web, pudiendo
            cambiar, suprimir o añadir tanto los contenidos y servicios que
            se presten a través de la misma como la forma en la que estos
            aparezcan presentados o localizados.
          </p>

          <h2>7. Enlaces</h2>
          <p>
            En el caso de que en el sitio web se incluyesen enlaces o
            hipervínculos hacia otros sitios de Internet, el Titular no
            ejercerá ningún tipo de control sobre dichos sitios y contenidos.
            En ningún caso asumirá responsabilidad alguna por los contenidos
            de algún enlace perteneciente a un sitio web ajeno.
          </p>

          <h2>8. Derecho de exclusión</h2>
          <p>
            El Titular se reserva el derecho a denegar o retirar el acceso al
            sitio web y/o los servicios ofrecidos sin necesidad de preaviso,
            a instancia propia o de un tercero, a aquellos usuarios que
            incumplan el presente aviso legal.
          </p>

          <h2>9. Generalidades</h2>
          <p>
            El Titular perseguirá el incumplimiento de las presentes
            condiciones, así como cualquier utilización indebida del sitio
            web, ejerciendo todas las acciones civiles y penales que le
            puedan corresponder en derecho.
          </p>

          <h2>10. Legislación aplicable y jurisdicción</h2>
          <p>
            La relación entre el Titular y el usuario se regirá por la
            normativa española vigente. Para la resolución de cualquier
            controversia las partes se someten, con renuncia expresa a
            cualquier otro fuero que pudiera corresponderles, a los Juzgados
            y Tribunales de Madrid capital, salvo que la normativa aplicable
            en materia de consumidores y usuarios determine un fuero
            distinto.
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
