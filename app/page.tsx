import { Hero } from '@/components/marketing/hero';
import { Autoridad } from '@/components/marketing/autoridad';
import { PropuestaValor } from '@/components/marketing/propuesta-valor';
import { Escenarios } from '@/components/marketing/escenarios';
import { ComoFunciona } from '@/components/marketing/como-funciona';
import { Filtrado } from '@/components/marketing/filtrado';
import { AgendaBlock } from '@/components/marketing/agenda-block';
import { Cierre } from '@/components/marketing/cierre';

export default function Home() {
  return (
    <>
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
