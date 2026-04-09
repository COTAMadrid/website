'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { diagnose } from '@/lib/pricing/diagnose';
import type { Diagnosis, WizardAnswers } from '@/lib/pricing/types';
import { RangoPrecio } from './rango-precio';
import { EstructuraCoste } from './estructura-coste';
import { Duracion } from './duracion';
import { Semaforo } from './semaforo';
import { Riesgos } from './riesgos';
import { CtaDinamico } from './cta-dinamico';

export function Informe() {
  const router = useRouter();
  const [d, setD] = useState<Diagnosis | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('cota-final-answers');
    if (!raw) {
      router.replace('/diagnostico');
      return;
    }
    let answers: WizardAnswers;
    try {
      answers = JSON.parse(raw);
    } catch {
      router.replace('/diagnostico');
      return;
    }
    const diagnosis = diagnose(answers);
    setD(diagnosis);

    if (sentRef.current) return;
    sentRef.current = true;

    let resumen: string | undefined;
    try {
      resumen = sessionStorage.getItem('cota-prefill-resumen') ?? undefined;
    } catch {}

    let localidad: string | undefined;
    try {
      const rawPrefill = sessionStorage.getItem('cota-prefill-contact');
      if (rawPrefill) {
        const p = JSON.parse(rawPrefill) as { localidad?: string };
        if (p.localidad) localidad = p.localidad;
      }
    } catch {}

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contact: { ...answers.contacto, localidad },
        resumen,
        answers: { ...answers, contacto: undefined },
      }),
    }).catch((err) => console.error('[informe] lead submit failed', err));
  }, [router]);

  if (!d) return <div className="mx-auto max-w-3xl px-6 py-24 text-center">Generando tu informe…</div>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 print:py-8">
      <header className="mb-12">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">Tu diagnóstico</p>
        <h1 className="text-4xl md:text-5xl mt-2">Informe de tu reforma</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <RangoPrecio estimate={d.estimate} />
        <Duracion duration={d.duration} />
      </div>

      <div className="mb-12">
        <Semaforo viability={d.viability} />
      </div>

      <div className="mb-12">
        <EstructuraCoste estimate={d.estimate} />
      </div>

      <Riesgos risks={d.risks} />

      <CtaDinamico viability={d.viability} />
    </main>
  );
}
