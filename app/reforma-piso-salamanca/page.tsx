import type { Metadata } from 'next';
import { BarrioLanding } from '@/components/marketing/barrio-landing';
import { BARRIOS } from '@/config/barrios';

const data = BARRIOS.salamanca;

export const metadata: Metadata = {
  title: 'Reformas de pisos en Salamanca · Cota Madrid',
  description:
    'Reformas integrales de viviendas en el barrio de Salamanca. Conocemos las particularidades técnicas, las fincas señoriales y las normativas del distrito. Diagnóstico gratuito.',
  alternates: { canonical: 'https://cotamadrid.es/reforma-piso-salamanca' },
};

export default function Page() {
  return <BarrioLanding data={data} />;
}
