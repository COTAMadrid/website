'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, X, Ruler, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PREFILL_KEY, type PrefillContact } from './hero-lead-card';

/**
 * Minimal sticky bottom CTA bar. Replaces the old full-form overlay that
 * blocked all content. Now shows a clean one-line bar that expands on click.
 */
export function FloatingForm() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const threshold = window.innerHeight * 0.8;
        if (y > threshold) setVisible(true);
        else if (y < 200) setVisible(false);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    const m = email.trim();
    const t = telefono.replace(/\D/g, '');
    const l = localidad.trim();
    if (n.length < 2) { setError('Indica tu nombre'); return; }
    if (!/\S+@\S+\.\S+/.test(m)) { setError('Email no válido'); return; }
    if (t.length < 9) { setError('Teléfono no válido'); return; }
    if (l.length < 2) { setError('Indica tu localidad'); return; }
    try {
      sessionStorage.setItem(
        PREFILL_KEY,
        JSON.stringify({ nombre: n, email: m, telefono: telefono.trim(), localidad: l } satisfies PrefillContact)
      );
    } catch { /* ignore */ }
    router.push('/diagnostico');
  };

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          key="floating-cta"
          role="complementary"
          aria-label="Calcula tu reforma"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-30 bottom-0 left-0 right-0"
        >
          {/* Backdrop gradient for readability */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.018_168)] via-[oklch(0.12_0.018_168/0.95)] to-transparent pointer-events-none" />

          <div className="relative mx-auto max-w-4xl px-4 pb-4 pt-3">
            {/* Expanded form */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <form onSubmit={submit} className="rounded-t-xl border border-b-0 border-white/10 bg-[oklch(0.18_0.016_168/0.98)] backdrop-blur-xl p-4 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif text-sm text-card-foreground">
                        ¿Cuánto te puede costar tu reforma?
                      </h3>
                      <button
                        type="button"
                        onClick={() => setExpanded(false)}
                        aria-label="Cerrar formulario"
                        className="p-1 text-foreground/50 hover:text-foreground transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="text" value={nombre} onChange={(e) => { setNombre(e.target.value); setError(null); }} placeholder="Nombre" aria-label="Nombre" className="h-10 text-sm" autoComplete="given-name" required />
                      <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} placeholder="Email" aria-label="Email" className="h-10 text-sm" autoComplete="email" inputMode="email" required />
                      <Input type="tel" value={telefono} onChange={(e) => { setTelefono(e.target.value); setError(null); }} placeholder="Teléfono" aria-label="Teléfono" className="h-10 text-sm" autoComplete="tel" inputMode="tel" required />
                      <Input type="text" value={localidad} onChange={(e) => { setLocalidad(e.target.value); setError(null); }} placeholder="Localidad" aria-label="Localidad" className="h-10 text-sm" autoComplete="address-level2" required />
                    </div>
                    {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
                    <Button type="submit" className="w-full h-11 text-sm gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      Empezar análisis <ArrowRight className="size-4" />
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed bar */}
            <div className={`flex items-center gap-3 ${expanded ? 'rounded-b-xl border border-t-0' : 'rounded-xl border'} border-white/10 bg-[oklch(0.18_0.016_168/0.98)] backdrop-blur-xl px-4 py-3`}>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex-1 flex items-center gap-3 text-left group"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/15 text-accent shrink-0">
                  <Ruler className="size-4" strokeWidth={1.5} />
                </span>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-foreground/80 group-hover:text-foreground transition-colors">
                  Calcula tu reforma gratis
                </span>
                <ChevronUp className={`size-4 text-accent/70 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} />
              </button>

              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-accent-foreground text-[0.72rem] font-mono uppercase tracking-[0.12em] hover:bg-accent/90 transition-colors shrink-0"
              >
                Empezar <ArrowRight className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Cerrar"
                className="p-1 text-foreground/40 hover:text-foreground transition-colors shrink-0"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
