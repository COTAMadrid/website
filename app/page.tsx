import Script from 'next/script';
import { Hero } from '@/components/marketing/hero';
import { BudgetShowcase } from '@/components/marketing/budget-showcase';
import { Autoridad } from '@/components/marketing/autoridad';
import { FloatingForm } from '@/components/lead-capture/floating-form';
import { PropuestaValor } from '@/components/marketing/propuesta-valor';
import { Escenarios } from '@/components/marketing/escenarios';
import { ComoFunciona } from '@/components/marketing/como-funciona';
import { Filtrado } from '@/components/marketing/filtrado';
import { AgendaBlock } from '@/components/marketing/agenda-block';
import { Cierre } from '@/components/marketing/cierre';
import { TrustStrip } from '@/components/marketing/trust-strip';
import { InlineCTA } from '@/components/marketing/inline-cta';
import { Divider } from '@/components/marketing/divider';
// Background experiments removed — global cotas and floor plans
// were unfixable in time. The page stays clean without them.
import { pageMeta } from '@/lib/seo';
import { getAgendaAvailability } from '@/lib/db/repositories/agenda';

export const metadata = pageMeta({
  title: 'Reforma integral de pisos en Madrid · Cota',
  description:
    'Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener. Consultoría premium en Madrid.',
  path: '/',
});

export default async function Home() {
  const agenda = await getAgendaAvailability();
  return (
    <>
      <Script
        id="ld-localbusiness"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://cotamadrid.es/#business',
            name: 'Cota',
            legalName: 'PCH Obras',
            url: 'https://cotamadrid.es',
            areaServed: { '@type': 'City', name: 'Madrid' },
            description:
              'Consultoría y ejecución de reformas integrales de pisos en Madrid. Análisis previo de viabilidad, precio y riesgos.',
            priceRange: '€€€',
          }),
        }}
      />
      <Hero />
      <TrustStrip />
      <BudgetShowcase />
      <Autoridad />
      <InlineCTA label="¿Cuánto cuesta tu reforma?" />
      <PropuestaValor />
      <Divider variant="measure" label="Casos · 03" />
      <Escenarios />
      <InlineCTA label="Calcula tu reforma en 60 segundos" />
      <Divider variant="crosses" />
      <ComoFunciona />
      <Filtrado />
      <Divider variant="measure" label="Agenda · 06" />
      <AgendaBlock
        timeSlots={agenda.time_slots}
        blockedDates={agenda.blocked_dates}
        blockedWeekdays={agenda.blocked_weekdays}
      />
      <Cierre />
      <FloatingForm />
    </>
  );
}
