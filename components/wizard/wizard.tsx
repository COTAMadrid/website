'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWizardState, isComplete } from '@/lib/wizard-state';
import {
  PREFILL_KEY,
  type PrefillContact,
} from '@/components/lead-capture/hero-lead-card';
import { ProgressBar } from './progress-bar';
import { ReceiptPanel, buildReceipt } from './receipt-panel';
import { StepTipo } from './step-tipo';
import { StepMetros } from './step-metros';
import { StepBarrio } from './step-barrio';
import { StepAntiguedad } from './step-antiguedad';
import { StepCalidad } from './step-calidad';
import { StepEstado } from './step-estado';
import { StepPlazo } from './step-plazo';
import { StepExtras } from './step-extras';
import { StepPresupuesto } from './step-presupuesto';
import { StepContacto } from './step-contacto';

const STEPS = [
  StepTipo,
  StepMetros,
  StepBarrio,
  StepAntiguedad,
  StepCalidad,
  StepEstado,
  StepPlazo,
  StepExtras,
  StepPresupuesto,
  StepContacto,
];

export interface StepProps {
  answers: ReturnType<typeof useWizardState>['answers'];
  update: ReturnType<typeof useWizardState>['update'];
  onNext: () => void;
  onBack: () => void;
  canBack: boolean;
  isLast: boolean;
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

function readPrefill(): PrefillContact | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PrefillContact>;
    if (
      typeof parsed.nombre === 'string' &&
      parsed.nombre.trim().length >= 2 &&
      typeof parsed.email === 'string' &&
      /\S+@\S+\.\S+/.test(parsed.email) &&
      typeof parsed.telefono === 'string' &&
      parsed.telefono.replace(/\D/g, '').length >= 9 &&
      typeof parsed.localidad === 'string' &&
      parsed.localidad.trim().length >= 2
    ) {
      return parsed as PrefillContact;
    }
  } catch {
    // ignore
  }
  return null;
}

export function Wizard() {
  const router = useRouter();
  const { answers, step, setStep, update, hydrated } = useWizardState();
  const [generating, setGenerating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gateChecked, setGateChecked] = useState(false);
  const [prefill, setPrefill] = useState<PrefillContact | null>(null);

  // Gate: require valid PrefillContact in sessionStorage. Otherwise bounce
  // back to home where the user must fill the lead form first.
  useEffect(() => {
    const p = readPrefill();
    if (!p) {
      router.replace('/');
      return;
    }
    setPrefill(p);
    // Hydrate the wizard contacto state from prefill so the contact step
    // already shows the user's data — they just confirm and submit.
    if (hydrated && (!answers.contacto || !answers.contacto.email)) {
      update({
        contacto: {
          nombre: p.nombre,
          email: p.email,
          telefono: p.telefono,
        },
      });
    }
    setGateChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, hydrated]);

  if (!hydrated || !gateChecked) return null;

  const Current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const { total } = buildReceipt(answers);

  const goToInforme = () => {
    if (!isComplete(answers)) return;
    sessionStorage.setItem('cota-final-answers', JSON.stringify(answers));
    setGenerating(true);
    setTimeout(() => router.push('/informe'), 1500);
  };

  const next = () => {
    if (isLast) {
      goToInforme();
      return;
    }
    setStep(step + 1);
  };

  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[1fr_400px] md:items-start">
        {/* LEFT — wizard */}
        <div className="min-w-0">
          <ProgressBar current={step} total={STEPS.length} />
          <div className="mt-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <Current
                  answers={answers}
                  update={update}
                  onNext={next}
                  onBack={back}
                  canBack={step > 0}
                  isLast={isLast}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — receipt (desktop) */}
        <div className="hidden md:block sticky top-24">
          <ReceiptPanel
            answers={answers}
            onComplete={goToInforme}
            generating={generating}
          />
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm"
        >
          <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Tu reforma
          </span>
          <span className="font-mono tabular-nums font-semibold">
            {total > 0 ? `~${fmtEur(total)}` : '— · —'}
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-50 bg-black/50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="w-full bg-background p-4 max-h-[85vh] overflow-y-auto rounded-t-xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs text-muted-foreground"
                >
                  Cerrar ✕
                </button>
              </div>
              <ReceiptPanel
                answers={answers}
                onComplete={goToInforme}
                generating={generating}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* spacer so content isn't hidden behind mobile bar */}
      <div className="md:hidden h-16" />
    </div>
  );
}
