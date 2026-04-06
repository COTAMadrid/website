'use client';

import { useEffect, useState } from 'react';
import type { WizardAnswers } from '@/lib/pricing/types';

const STORAGE_KEY = 'cota-wizard-state';

export type PartialAnswers = Partial<Omit<WizardAnswers, 'extras'>> & {
  extras?: Partial<WizardAnswers['extras']>;
};

export const EMPTY: PartialAnswers = {
  extras: { sinAscensor: false, edificioProtegido: false, zonaBajasEmisiones: false },
};

export function useWizardState() {
  const [answers, setAnswers] = useState<PartialAnswers>(EMPTY);
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAnswers(parsed.answers ?? EMPTY);
        setStep(parsed.step ?? 0);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
  }, [answers, step, hydrated]);

  const update = (patch: PartialAnswers) =>
    setAnswers((a) => ({
      ...a,
      ...patch,
      extras: { ...a.extras, ...patch.extras },
    }));

  const reset = () => {
    setAnswers(EMPTY);
    setStep(0);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return { answers, step, setStep, update, reset, hydrated };
}

export function isComplete(a: PartialAnswers): a is WizardAnswers {
  return (
    !!a.tipo &&
    typeof a.metros === 'number' &&
    !!a.barrio &&
    !!a.antiguedad &&
    !!a.calidad &&
    !!a.estado &&
    !!a.plazo &&
    !!a.extras &&
    typeof a.extras.sinAscensor === 'boolean' &&
    typeof a.extras.edificioProtegido === 'boolean' &&
    typeof a.extras.zonaBajasEmisiones === 'boolean' &&
    !!a.contacto
  );
}
