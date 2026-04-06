'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useWizardState, isComplete } from '@/lib/wizard-state';
import { ProgressBar } from './progress-bar';
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

export function Wizard() {
  const router = useRouter();
  const { answers, step, setStep, update, hydrated } = useWizardState();

  if (!hydrated) return null;

  const Current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      if (isComplete(answers)) {
        sessionStorage.setItem('cota-final-answers', JSON.stringify(answers));
        router.push('/informe');
      }
      return;
    }
    setStep(step + 1);
  };

  const back = () => setStep(Math.max(0, step - 1));

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
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
  );
}
