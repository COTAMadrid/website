'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// TODO: future enhancement — components/wizard/step-contacto.tsx should
// read sessionStorage key `cota-prefill-contact` ({ nombre, telefono })
// and prefill its fields on mount.
const PREFILL_KEY = 'cota-prefill-contact';

export function FloatingForm() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
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
    const t = telefono.replace(/\D/g, '');
    if (n.length < 2) {
      setError('Indica tu nombre');
      return;
    }
    if (t.length < 9) {
      setError('Teléfono no válido');
      return;
    }
    try {
      sessionStorage.setItem(
        PREFILL_KEY,
        JSON.stringify({ nombre: n, telefono: telefono.trim() })
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
          className="fixed z-30 bottom-6 left-1/2 -translate-x-1/2 w-[calc(100vw-3rem)] max-w-[340px] sm:left-6 sm:translate-x-0"
        >
          <div className="relative rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
            {/* Gold ribbon header */}
            <div className="bg-accent text-accent-foreground px-4 py-2 text-[0.65rem] font-mono uppercase tracking-[0.18em] flex items-center justify-between">
              <span>📐 Calcula tu reforma · Gratis</span>
            </div>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Cerrar"
              className="absolute top-1.5 right-1.5 rounded-md p-1 text-accent-foreground/80 hover:text-accent-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>

            <form onSubmit={submit} className="p-4 space-y-3">
              <div>
                <h3 className="font-serif text-lg leading-tight text-card-foreground">
                  ¿Cuánto te puede costar tu reforma?
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Análisis completo en menos de 60 segundos.
                </p>
              </div>

              <div className="space-y-2">
                <Input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    setError(null);
                  }}
                  placeholder="Nombre"
                  aria-label="Nombre"
                  className="h-10"
                  autoComplete="given-name"
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
                  className="h-10"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-sm gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Empezar análisis
                <ArrowRight className="size-4" />
              </Button>

              <p className="text-[0.65rem] text-muted-foreground text-center">
                Sin compromiso · Rango realista de precio
              </p>
            </form>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
