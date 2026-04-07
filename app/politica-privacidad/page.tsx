import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCompany } from '@/lib/db/repositories/company';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de privacidad RGPD de Cota Madrid (PCH Obras): responsable del tratamiento, finalidades, legitimación, conservación, destinatarios y derechos del interesado.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cotamadrid.com/politica-privacidad' },
};

export default async function Page() {
  const company = await getCompany();
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <article>
        <header className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            Legal · 02
          </p>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.025em] md:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Última actualización: {company.last_legal_update}
          </p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:font-serif prose-h2:tracking-[-0.01em] prose-a:text-accent">
          <p>
            La presente Política de Privacidad regula el tratamiento de los
            datos personales facilitados por los usuarios del sitio web{' '}
            <strong>cotamadrid.com</strong>, en cumplimiento del Reglamento
            (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de
            abril de 2016 (RGPD) y de la Ley Orgánica 3/2018, de 5 de
            diciembre, de Protección de Datos Personales y garantía de los
            derechos digitales (LOPDGDD).
          </p>

          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>
              <strong>Responsable:</strong> {company.legal_name} (marca
              comercial <strong>{company.commercial_name}</strong>)
            </li>
            <li>
              <strong>CIF:</strong> {company.cif || '—'}
            </li>
            <li>
              <strong>Domicilio:</strong> {company.domicilio || '—'}
            </li>
            <li>
              <strong>Correo electrónico:</strong>{' '}
              {company.email_contacto || '—'}
            </li>
          </ul>

          <h2>2. Finalidad del tratamiento</h2>
          <p>
            Los datos personales recabados a través de este sitio web serán
            tratados con las siguientes finalidades:
          </p>
          <ul>
            <li>
              <strong>Gestión de leads del diagnóstico online:</strong>{' '}
              recibir, almacenar y analizar las respuestas del cuestionario
              de diagnóstico para elaborar un informe orientativo y
              contactar con el usuario.
            </li>
            <li>
              <strong>Comunicación comercial:</strong> responder a consultas,
              enviar presupuestos, concertar visitas técnicas y ofrecer
              información sobre los servicios contratados o potencialmente
              de interés.
            </li>
            <li>
              <strong>Atención al cliente:</strong> resolución de dudas a
              través del chatbot del sitio web, correo electrónico o
              WhatsApp.
            </li>
            <li>
              <strong>Gestión contractual:</strong> ejecución de los
              contratos de obra formalizados y cumplimiento de las
              obligaciones legales derivadas.
            </li>
          </ul>
          <p>
            Los datos tratados incluyen, según el caso: nombre, apellidos,
            correo electrónico, teléfono, dirección del inmueble objeto de
            la reforma, respuestas al cuestionario de diagnóstico y las
            conversaciones mantenidas con el chatbot.
          </p>

          <h2>3. Legitimación</h2>
          <p>
            La base jurídica del tratamiento de los datos es:
          </p>
          <ul>
            <li>
              <strong>Consentimiento del interesado</strong> (art. 6.1.a
              RGPD) al cumplimentar los formularios de diagnóstico y
              contacto, así como al interactuar con el chatbot.
            </li>
            <li>
              <strong>Ejecución de un contrato</strong> (art. 6.1.b RGPD)
              cuando el usuario contrata los servicios del Responsable.
            </li>
            <li>
              <strong>Interés legítimo</strong> (art. 6.1.f RGPD) para
              responder a solicitudes directas, mantener la seguridad del
              sitio y prevenir el fraude.
            </li>
            <li>
              <strong>Cumplimiento de obligaciones legales</strong> (art.
              6.1.c RGPD) en materia fiscal, contable y de consumo.
            </li>
          </ul>

          <h2>4. Conservación de los datos</h2>
          <p>
            Los datos personales se conservarán durante los plazos
            siguientes:
          </p>
          <ul>
            <li>
              <strong>Leads no convertidos:</strong> 12 meses desde el
              último contacto, salvo solicitud previa de supresión.
            </li>
            <li>
              <strong>Clientes:</strong> durante toda la relación contractual
              y, una vez finalizada, durante los plazos legalmente exigidos
              para atender posibles responsabilidades (en particular, los
              plazos fiscales y contables).
            </li>
            <li>
              <strong>Conversaciones del chatbot:</strong> se conservan
              únicamente el tiempo necesario para la prestación del
              servicio y el análisis de calidad, y posteriormente se
              eliminan o anonimizan.
            </li>
          </ul>

          <h2>5. Destinatarios</h2>
          <p>
            Los datos personales no se cederán a terceros salvo obligación
            legal. No obstante, determinados proveedores actúan como{' '}
            <strong>encargados del tratamiento</strong> en cumplimiento de un
            contrato que garantiza los niveles de protección exigidos por el
            RGPD:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> — alojamiento del sitio web.
            </li>
            <li>
              <strong>Resend</strong> — envío de correo electrónico
              transaccional (informes y notificaciones).
            </li>
            <li>
              <strong>Proveedores de inteligencia artificial</strong> para el
              chatbot conversacional: OpenAI, Anthropic, Google (Gemini),
              DeepSeek y/o Groq, en función del modelo seleccionado.
            </li>
            <li>
              <strong>Vercel KV</strong> — almacenamiento técnico de estado
              y sesiones.
            </li>
          </ul>
          <p>
            Algunos de estos proveedores pueden realizar{' '}
            <strong>transferencias internacionales</strong> de datos fuera
            del Espacio Económico Europeo. En tales casos, dichas
            transferencias estarán amparadas por las cláusulas contractuales
            tipo aprobadas por la Comisión Europea u otras garantías
            adecuadas conforme a los artículos 46 y siguientes del RGPD.
          </p>

          <h2>6. Derechos del interesado</h2>
          <p>
            El usuario puede ejercer en cualquier momento los siguientes
            derechos:
          </p>
          <ul>
            <li>Derecho de acceso.</li>
            <li>Derecho de rectificación.</li>
            <li>Derecho de supresión (derecho al olvido).</li>
            <li>Derecho de oposición.</li>
            <li>Derecho a la limitación del tratamiento.</li>
            <li>Derecho a la portabilidad de los datos.</li>
            <li>
              Derecho a no ser objeto de decisiones individuales
              automatizadas, incluida la elaboración de perfiles.
            </li>
            <li>Derecho a retirar el consentimiento prestado.</li>
          </ul>

          <h2>7. Cómo ejercer los derechos</h2>
          <p>
            El usuario podrá ejercer sus derechos enviando una comunicación
            escrita al correo electrónico{' '}
            <strong>{company.email_contacto || '—'}</strong> o por correo postal al
            domicilio indicado en el apartado 1, acompañando copia de su DNI
            o documento acreditativo equivalente.
          </p>

          <h2>8. Reclamación ante la AEPD</h2>
          <p>
            Sin perjuicio de lo anterior, el usuario tiene derecho a
            presentar una reclamación ante la{' '}
            <strong>Agencia Española de Protección de Datos</strong> (AEPD),
            especialmente cuando no haya obtenido satisfacción en el
            ejercicio de sus derechos. Los datos de contacto de la AEPD
            están disponibles en{' '}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aepd.es
            </a>
            .
          </p>

          <h2>9. Medidas de seguridad</h2>
          <p>
            El Responsable ha adoptado las medidas técnicas y organizativas
            necesarias para garantizar la seguridad de los datos personales
            y evitar su alteración, pérdida, tratamiento o acceso no
            autorizado, atendiendo al estado de la técnica, la naturaleza
            de los datos almacenados y los riesgos a los que estén
            expuestos, conforme a lo previsto en el artículo 32 del RGPD.
          </p>

          <h2>10. Modificaciones de la política</h2>
          <p>
            El Responsable se reserva el derecho a modificar la presente
            política para adaptarla a novedades legislativas o
            jurisprudenciales, así como a prácticas del sector. En dichos
            supuestos, se anunciará en esta página los cambios introducidos
            con razonable antelación a su puesta en práctica.
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
