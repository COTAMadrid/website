'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, X, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PREFILL_KEY, type PrefillContact } from './hero-lead-card';

/**
 * Floating sticky lead form. Slides in when user scrolls past 70% of the
 * viewport. Same 4 mandatory fields as HeroLeadCard: nombre, email,
 * telefono, localidad. Both write to PREFILL_KEY and the wizard
 * /diagnostico is gated on this prefill being present.
 */
export function FloatingForm() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
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
        const threshold = window.innerHeight * 0.7;
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
    if (n.length < 2) {
      setError('Indica tu nombre');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(m)) {
      setError('Email no válido');
      return;
    }
    if (t.length < 9) {
      setError('Teléfono no válido');
      return;
    }
    if (l.length < 2) {
      setError('Indica tu localidad');
      return;
    }
    try {
      sessionStorage.setItem(
        PREFILL_KEY,
        JSON.stringify({
          nombre: n,
          email: m,
          telefono: telefono.trim(),
          localidad: l,
        } satisfies PrefillContact)
      );
    } catch {
      // ignore
    }
    router.push('/diagnostico');
  };

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          key="floating-form"
          role="complementary"
          aria-label="Calcula tu reforma"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed z-30 bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw-3rem)] max-w-[360px] sm:left-6 sm:translate-x-0"
        >
          <div className="relative rounded-xl border-2 border-accent/45 bg-[oklch(0.2_0.016_168/0.95)] backdrop-blur-xl shadow-[0_0_0_4px_oklch(0.76_0.11_78/0.1),0_30px_70px_-15px_oklch(0.76_0.11_78/0.5)] overflow-hidden focus-within:border-accent/80 focus-within:shadow-[0_0_0_5px_oklch(0.76_0.11_78/0.18),0_40px_90px_-15px_oklch(0.76_0.11_78/0.65)] transition-all duration-500">
            {/* Restrained header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[0.6rem] font-mono uppercase tracking-[0.22em] text-foreground/75">
              <span className="inline-flex items-center gap-2">
                <Ruler className="size-3 text-accent" strokeWidth={1.5} />
                Calcula tu reforma
              </span>
              <span className="text-foreground/45">01 · gratis</span>
            </div>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Cerrar"
              className="absolute top-1.5 right-1.5 rounded-md p-1 text-foreground/60 hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>

            <form onSubmit={submit} className="p-4 space-y-2.5">
              <div>
                <h3 className="font-serif text-base leading-tight text-card-foreground">
                  ¿Cuánto te puede costar tu reforma?
                </h3>
                <p className="mt-1 text-[0.7rem] text-muted-foreground">
                  Rellena 4 datos y accede al cálculo en 60 s.
                </p>
              </div>

              <div className="space-y-1.5">
                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError(null);
                  }}
                  placeholder="Nombre"
                  aria-label="Nombre"
                  className="h-9 text-sm"
                  autoComplete="given-name"
                  required
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="Email"
                  aria-label="Email"
                  className="h-9 text-sm"
                  autoComplete="email"
                  inputMode="email"
                  required
                />
                <Input
                  type="tel"
                  value={telefono}
                  onChange={(e) => {
                    setTelefono(e.target.value);
                    setError(null);
                  }}
                  placeholder="Teléfono"
                  aria-label="Teléfono"
                  className="h-9 text-sm"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
                <Input
                  type="text"
                  value={localidad}
                  onChange={(e) => {
                    setLocalidad(e.target.value);
                    setError(null);
                  }}
                  placeholder="Localidad"
                  aria-label="Localidad"
                  className="h-9 text-sm"
                  autoComplete="address-level2"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-sm gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Empezar análisis
                <ArrowRight className="size-4" />
              </Button>

              <p className="text-[0.6rem] text-muted-foreground text-center">
                Los 4 campos son obligatorios · Sin compromiso
              </p>
            </form>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
