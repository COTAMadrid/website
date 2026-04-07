'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Compact lead-capture card placed inside the hero. Same visual identity as
 * the FloatingForm (gold ribbon header, same headline, same fields, same
 * button) but more horizontal/dense to fit the hero without dominating.
 *
 * Both write to the same sessionStorage key `cota-prefill-contact`, so the
 * user gets continuity: hero card → floating card on scroll → wizard prefill.
 */
const PREFILL_KEY = 'cota-prefill-contact';

export function HeroLeadCard() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
      className="mt-10 max-w-xl lg:mx-0 mx-auto rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_40px_100px_-30px_oklch(0_0_0/0.8)] overflow-hidden focus-within:border-accent/50 focus-within:shadow-[0_40px_100px_-20px_oklch(0.78_0.12_80/0.28)] transition-all duration-500"
    >
      {/* Gold ribbon header — same as floating form */}
      <div className="bg-accent text-accent-foreground px-4 py-2 text-[0.65rem] font-mono uppercase tracking-[0.18em] flex items-center justify-between">
        <span>📐 Calcula tu reforma · Gratis · 60 s</span>
      </div>

      <form onSubmit={submit} className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError(null);
            }}
            placeholder="Nombre"
            aria-label="Nombre"
            autoComplete="given-name"
            className="h-12 text-base flex-1 bg-transparent border-white/15 text-white placeholder:text-white/55 focus-visible:border-accent/60"
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
            autoComplete="tel"
            inputMode="tel"
            className="h-12 text-base flex-1 bg-transparent border-white/15 text-white placeholder:text-white/55 focus-visible:border-accent/60"
          />
        </div>

        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base gap-2 group/cta bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-300 hover:scale-[1.01]"
        >
          Empezar análisis
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </Button>

        <p className="text-[0.7rem] text-white/55 text-center">
          Sin compromiso · Rango realista · Sin llamadas
        </p>
      </form>
    </motion.div>
  );
}
