import Script from 'next/script';
import { Hero } from '@/components/marketing/hero';
import { Autoridad } from '@/components/marketing/autoridad';
import { PropuestaValor } from '@/components/marketing/propuesta-valor';
import { Escenarios } from '@/components/marketing/escenarios';
import { ComoFunciona } from '@/components/marketing/como-funciona';
import { Filtrado } from '@/components/marketing/filtrado';
import { AgendaBlock } from '@/components/marketing/agenda-block';
import { Cierre } from '@/components/marketing/cierre';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Reforma integral de pisos en Madrid · Cota',
  description:
    'Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener. Consultoría premium en Madrid.',
  path: '/',
});

export default function Home() {
  return (
    <>
      <Script
        id="ld-localbusiness"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': 'https://cotamadrid.com/#business',
            name: 'Cota',
            legalName: 'PCH Obras',
            url: 'https://cotamadrid.com',
            areaServed: { '@type': 'City', name: 'Madrid' },
            description:
              'Consultoría y ejecución de reformas integrales de pisos en Madrid. Análisis previo de viabilidad, precio y riesgos.',
            priceRange: '€€€',
          }),
        }}
      />
      <Hero />
      <Autoridad />
      <PropuestaValor />
      <Escenarios />
      <ComoFunciona />
      <Filtrado />
      <AgendaBlock />
      <Cierre />
    </>
  );
}
