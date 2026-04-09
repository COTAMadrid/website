import type { Metadata } from 'next';
import { BarrioLanding } from '@/components/marketing/barrio-landing';
import { BARRIOS } from '@/config/barrios';

const data = BARRIOS.retiro;

export const metadata: Metadata = {
  title: 'Reformas de pisos en Retiro · Cota Madrid',
  description:
    'Reformas integrales en el barrio de Retiro. Fincas de los años 50–80 con sus particularidades. Cocinas, baños, instalaciones y distribución. Diagnóstico gratuito.',
  alternates: { canonical: 'https://cotamadrid.es/reforma-piso-retiro' },
};

export default function Page() {
  return <BarrioLanding data={data} />;
}
