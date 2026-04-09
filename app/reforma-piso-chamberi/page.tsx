import type { Metadata } from 'next';
import { BarrioLanding } from '@/components/marketing/barrio-landing';
import { BARRIOS } from '@/config/barrios';

const data = BARRIOS.chamberi;

export const metadata: Metadata = {
  title: 'Reformas de pisos en Chamberí · Cota Madrid',
  description:
    'Reformas integrales en Chamberí, uno de los barrios más vividos del centro de Madrid. Edificios históricos, suelos hidráulicos, instalaciones obsoletas — los conocemos.',
  alternates: { canonical: 'https://cotamadrid.es/reforma-piso-chamberi' },
};

export default function Page() {
  return <BarrioLanding data={data} />;
}
