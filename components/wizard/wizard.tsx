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

  // Gate: if there's no PrefillContact in sessionStorage, render an inline
  // contact form below instead of bouncing the user back home. Once they
  // submit it, we proceed into the wizard.
  useEffect(() => {
    const p = readPrefill();
    if (p) {
      setPrefill(p);
      if (hydrated && (!answers.contacto || !answers.contacto.email)) {
        update({
          contacto: {
            nombre: p.nombre,
            email: p.email,
            telefono: p.telefono,
          },
        });
      }
    }
    setGateChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated || !gateChecked) return null;

  if (!prefill) {
    return (
      <InlineContactGate
        onSubmit={(p) => {
          try {
            sessionStorage.setItem(PREFILL_KEY, JSON.stringify(p));
          } catch {}
          setPrefill(p);
          update({
            contacto: { nombre: p.nombre, email: p.email, telefono: p.telefono },
          });
        }}
      />
    );
  }

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

function InlineContactGate({
  onSubmit,
}: {
  onSubmit: (p: PrefillContact) => void;
}) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [resumen, setResumen] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = nombre.trim();
    const m = email.trim();
    const t = telefono.replace(/\D/g, '');
    const l = localidad.trim();
    const r = resumen.trim();
    if (n.length < 2) return setError('Indica tu nombre');
    if (!/\S+@\S+\.\S+/.test(m)) return setError('Email no válido');
    if (t.length < 9) return setError('Teléfono no válido');
    if (l.length < 2) return setError('Indica tu localidad');
    setError(null);
    if (r.length > 0) {
      try {
        sessionStorage.setItem('cota-prefill-resumen', r);
      } catch {}
    }
    onSubmit({ nombre: n, email: m, telefono: telefono.trim(), localidad: l });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 md:py-28">
      <div className="mb-6 flex items-center gap-4">
        <span className="h-px w-10 bg-accent" />
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          Diagnóstico · paso previo
        </span>
      </div>
      <h1 className="font-serif text-[2rem] leading-[1.05] tracking-[-0.025em] md:text-[2.75rem] text-balance">
        Antes de calcular, dinos quién eres.
      </h1>
      <p className="mt-4 text-base text-foreground/70 md:text-lg">
        El diagnóstico es gratuito y dura menos de un minuto. Solo necesitamos
        cuatro datos para enviarte el informe después.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nombre" value={nombre} onChange={setNombre} autoComplete="given-name" />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Teléfono" type="tel" value={telefono} onChange={setTelefono} autoComplete="tel" />
          <Field label="Localidad" value={localidad} onChange={setLocalidad} autoComplete="address-level2" />
        </div>

        <label className="block pt-2">
          <span className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
            <span>Cuéntanos qué reforma tienes en mente</span>
            <span className="text-foreground/40">Opcional</span>
          </span>
          <textarea
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            rows={4}
            placeholder="Ej: piso de 80 m² en Chamberí, queremos tirar un tabique entre cocina y salón, cambiar el baño y poner suelo nuevo. Hay humedades en una pared exterior."
            className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm leading-relaxed text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-accent/60 focus:bg-background/60"
          />
          <span className="mt-1.5 block text-[10px] text-foreground/45">
            Cuanta más información nos des, mejor podremos prepararnos antes de hablar contigo.
          </span>
        </label>

        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-transform hover:-translate-y-0.5"
        >
          Empezar diagnóstico
        </button>
        <p className="text-center text-[11px] text-foreground/50">
          Sin compromiso · solo guardamos tus datos para enviarte el informe
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-accent/60 focus:bg-background/60"
      />
    </label>
  );
}
