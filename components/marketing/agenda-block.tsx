'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { Phone, Monitor, Home, Check, Lock } from 'lucide-react';
import { COPY } from '@/content/copy';
import { AgendaCalendar } from './agenda-calendar';

const AGENDA_CONTACT_KEY = 'cota-prefill-agenda';

interface AgendaContact {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  resumen: string;
}

function isValidContact(c: Partial<AgendaContact>): c is AgendaContact {
  return Boolean(
    c.nombre && c.nombre.trim().length >= 2 &&
    c.email && /^\S+@\S+\.\S+$/.test(c.email) &&
    c.telefono && c.telefono.trim().length >= 6 &&
    c.ciudad && c.ciudad.trim().length >= 2 &&
    c.resumen && c.resumen.trim().length >= 10
  );
}

interface AgendaBlockProps {
  timeSlots?: string[];
  blockedDates?: string[];
  blockedWeekdays?: number[];
}

const ICONS: Record<string, typeof Phone> = { Phone, Monitor, Home };

export function AgendaBlock({
  timeSlots,
  blockedDates,
  blockedWeekdays,
}: AgendaBlockProps = {}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const [selectedKind, setSelectedKind] = useState<string>(
    COPY.agenda.options[0].title
  );
  const [contact, setContact] = useState<AgendaContact | null>(null);

  // Restore contact from sessionStorage on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(AGENDA_CONTACT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AgendaContact>;
      if (isValidContact(parsed)) setContact(parsed);
    } catch {}
  }, []);

  function handleContactSubmit(c: AgendaContact) {
    try {
      sessionStorage.setItem(
        AGENDA_CONTACT_KEY,
        JSON.stringify({ ...c, kind: selectedKind })
      );
    } catch {}
    setContact(c);
  }

  function handleEditContact() {
    setContact(null);
  }

  return (
    <section
      id="agenda"
      ref={ref}
      className="relative isolate overflow-hidden bg-background px-6 py-16 md:py-24"
    >
      {/* Solid opaque cover blocks the global blueprint */}
      <div aria-hidden className="absolute inset-0 z-0 bg-background" />
      {/* Textural background image */}
      <div aria-hidden className="absolute inset-0 z-[1]">
        <Image
          src={COPY.agenda.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-12"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {COPY.agenda.eyebrow}
            </span>
          </div>
          <h2 className="max-w-3xl font-serif text-[2.2rem] leading-[1.04] tracking-[-0.025em] md:text-5xl lg:text-[3.25rem] text-balance text-foreground">
            {COPY.agenda.title}
          </h2>
          <p className="mt-5 max-w-xl text-sm text-foreground/65 md:text-base">
            Elige el tipo de sesión, déjanos tus datos y reserva una franja. Te confirmamos por email.
          </p>
        </motion.div>

        {/* 2-col split: meeting types + (contact form OR calendar) */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div>
            {/* Step label */}
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60">
              <span className="inline-flex size-5 items-center justify-center rounded-full border border-accent/40 text-accent">1</span>
              Elige el tipo de sesión
            </div>

            <div className="space-y-3">
              {COPY.agenda.options.map((o, i) => (
                <MeetingOption
                  key={o.title}
                  num={String(i + 1).padStart(2, '0')}
                  title={o.title}
                  duration={o.duration}
                  body={o.body}
                  icon={o.icon}
                  delay={0.1 + i * 0.08}
                  inView={inView}
                  selected={selectedKind === o.title}
                  onSelect={() => setSelectedKind(o.title)}
                />
              ))}
            </div>

            {/* Scarcity microcopy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/60"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Solo un número limitado de proyectos al mes
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {contact ? (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60">
                    <span className="inline-flex size-5 items-center justify-center rounded-full border border-accent/40 text-accent">3</span>
                    Reserva fecha y hora
                  </div>
                  <button
                    type="button"
                    onClick={handleEditContact}
                    className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent underline-offset-4 hover:underline"
                  >
                    Editar datos
                  </button>
                </div>
                <AgendaCalendar
                  timeSlots={timeSlots}
                  blockedDates={blockedDates}
                  blockedWeekdays={blockedWeekdays}
                />
              </>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60">
                  <span className="inline-flex size-5 items-center justify-center rounded-full border border-accent/40 text-accent">2</span>
                  Tus datos
                </div>
                <ContactGate kind={selectedKind} onSubmit={handleContactSubmit} />
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MeetingOption({
  num,
  title,
  duration,
  body,
  icon,
  delay,
  inView,
  selected,
  onSelect,
}: {
  num: string;
  title: string;
  duration: string;
  body: string;
  icon: string;
  delay: number;
  inView: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = ICONS[icon] ?? Phone;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      aria-pressed={selected}
      className={`group relative w-full text-left rounded-lg border transition-all duration-300 ${
        selected
          ? 'border-accent bg-accent/10 shadow-[0_8px_32px_-12px_oklch(0.78_0.12_80/0.4)]'
          : 'border-border/60 bg-card/40 hover:border-accent/50 hover:bg-card/70'
      }`}
    >
      <div className="flex items-start gap-4 p-5">
        {/* Icon badge */}
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-md transition-colors ${
            selected
              ? 'bg-accent text-accent-foreground'
              : 'bg-card border border-border/60 text-accent/80'
          }`}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-xl tracking-tight text-foreground md:text-2xl">
              {title}
            </h3>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">
              {duration}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-foreground/70">{body}</p>
        </div>

        {/* Selected indicator */}
        <div
          className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full transition-all ${
            selected
              ? 'bg-accent text-accent-foreground scale-100'
              : 'border border-border/60 bg-transparent scale-95'
          }`}
        >
          {selected && <Check className="size-3" strokeWidth={3} />}
        </div>
      </div>

      {/* Bottom hairline accent — gold when selected */}
      <span
        aria-hidden
        className={`absolute bottom-0 left-5 right-5 h-px transition-colors ${
          selected ? 'bg-accent/70' : 'bg-transparent'
        }`}
      />

      {/* Numero in bottom-right corner */}
      <span className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/35">
        {num}
      </span>
    </motion.button>
  );
}

function ContactGate({
  kind,
  onSubmit,
}: {
  kind: string;
  onSubmit: (c: AgendaContact) => void;
}) {
  const [form, setForm] = useState<AgendaContact>({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    resumen: '',
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AgendaContact>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidContact(form)) {
      setError('Revisa los campos: todos son obligatorios y el resumen debe tener al menos 10 caracteres.');
      return;
    }
    setError(null);
    onSubmit(form);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative isolate rounded-xl border border-accent/30 bg-[oklch(0.18_0.022_168)] p-6 shadow-editorial"
    >
      <div aria-hidden className="absolute inset-0 -z-10 rounded-xl bg-background" />

      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-8 items-center justify-center rounded-md bg-accent/15 text-accent ring-1 ring-accent/30">
          <Lock className="size-4" strokeWidth={2} />
        </span>
        <div>
          <p className="font-serif text-lg leading-tight text-foreground">
            Antes de ver la agenda
          </p>
          <p className="mt-1 text-xs text-foreground/65">
            Para reservar <span className="text-accent">{kind.toLowerCase()}</span>, necesitamos saber con quién hablamos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Nombre" value={form.nombre} onChange={(v) => update('nombre', v)} placeholder="Tu nombre" autoComplete="name" />
        <Field label="Email" value={form.email} onChange={(v) => update('email', v)} placeholder="tu@email.com" type="email" autoComplete="email" />
        <Field label="Teléfono" value={form.telefono} onChange={(v) => update('telefono', v)} placeholder="+34 600 000 000" type="tel" autoComplete="tel" />
        <Field label="Ciudad" value={form.ciudad} onChange={(v) => update('ciudad', v)} placeholder="Madrid" autoComplete="address-level2" />
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
          Resumen de la reforma
        </label>
        <textarea
          value={form.resumen}
          onChange={(e) => update('resumen', e.target.value)}
          rows={3}
          placeholder="Ej: piso de 80 m² en Chamberí, reforma integral, presupuesto orientativo 100k…"
          className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-accent/60 focus:bg-background/60"
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="cota-numlink mt-5 w-full justify-center"
      >
        <span className="idx">02</span>
        <span>Continuar a la agenda</span>
      </button>
      <p className="mt-3 text-center text-[11px] text-foreground/50">
        Solo guardamos tus datos para confirmar la reserva
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-accent/60 focus:bg-background/60"
      />
    </label>
  );
}
