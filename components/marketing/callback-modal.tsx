'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { X, Phone, Check } from 'lucide-react';

const FRANJAS = [
  { value: 'manana', label: 'Por la mañana (9–14h)' },
  { value: 'tarde', label: 'Por la tarde (14–18h)' },
  { value: 'tarde-noche', label: 'A última hora (18–20h)' },
  { value: 'cualquiera', label: 'Cuando podáis' },
] as const;

export function CallbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [franja, setFranja] = useState<(typeof FRANJAS)[number]['value']>('cualquiera');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const n = nombre.trim();
    const t = telefono.replace(/\D/g, '');
    if (n.length < 2) return setError('Indica tu nombre');
    if (t.length < 9) return setError('Teléfono no válido');
    setLoading(true);
    try {
      const res = await fetch('/api/leads/callback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ nombre: n, telefono: telefono.trim(), franja }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? 'No hemos podido enviar la solicitud.');
        return;
      }
      setDone(true);
    } catch {
      setError('Error de red. Vuelve a intentarlo o llámanos directamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pedir que me llaméis"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-accent/30 bg-background shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md hover:bg-foreground/10 text-foreground/60 hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        {done ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/40">
              <Check className="size-6" />
            </div>
            <h2 className="font-serif text-2xl mb-2">Recibido</h2>
            <p className="text-sm text-foreground/70">
              Te llamaremos en la franja que has elegido. Si tienes prisa,
              también puedes escribirnos por WhatsApp.
            </p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex h-10 px-5 items-center justify-center rounded-full bg-accent text-accent-foreground font-mono text-[11px] uppercase tracking-[0.18em]"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <header className="px-6 pt-6 pb-3">
              <div className="mb-3 inline-flex size-10 items-center justify-center rounded-md bg-accent/15 text-accent ring-1 ring-accent/30">
                <Phone className="size-5" />
              </div>
              <h2 className="font-serif text-2xl leading-tight">
                Llamadme vosotros
              </h2>
              <p className="mt-2 text-sm text-foreground/65">
                Déjanos tu nombre, tu teléfono y cuándo prefieres que te
                llamemos. Sin email, sin formulario largo.
              </p>
            </header>

            <form onSubmit={submit} className="px-6 pb-6 space-y-3">
              <Field
                label="Nombre"
                value={nombre}
                onChange={setNombre}
                autoComplete="given-name"
                placeholder="Tu nombre"
              />
              <Field
                label="Teléfono"
                value={telefono}
                onChange={setTelefono}
                type="tel"
                autoComplete="tel"
                placeholder="+34 600 000 000"
              />
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
                  Cuándo te viene bien
                </span>
                <select
                  value={franja}
                  onChange={(e) => setFranja(e.target.value as typeof franja)}
                  className="w-full h-10 rounded-md border border-border/60 bg-background/40 px-3 text-sm text-foreground outline-none focus:border-accent/60"
                >
                  {FRANJAS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>

              {error && (
                <p role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground disabled:opacity-60 transition-transform hover:-translate-y-0.5"
              >
                {loading ? 'Enviando…' : 'Pedir llamada'}
              </button>
              <p className="text-center text-[10px] text-foreground/45">
                Llamada gratuita · sin compromiso
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-accent/60 focus:bg-background/60"
      />
    </label>
  );
}
