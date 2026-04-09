'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { calculate } from '@/lib/pricing/calculate';
import { TIPO_OPTIONS, BARRIO_OPTIONS } from '@/config/wizard';
import type { Barrio, ReformType } from '@/lib/pricing/types';

const fmtEur = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export function CalculadoraLite() {
  const [tipo, setTipo] = useState<ReformType | ''>('');
  const [metros, setMetros] = useState<number>(80);
  const [barrio, setBarrio] = useState<Barrio | ''>('');

  const result = useMemo(() => {
    if (!tipo || !barrio || !metros || metros < 15) return null;
    // Sensible defaults so the lite calc returns a real range
    const estimate = calculate({
      tipo,
      metros,
      barrio,
      antiguedad: '1950-1980',
      calidad: 'medio',
      estado: 'vivido-obsoleto',
      plazo: '3-6-meses',
      extras: {
        sinAscensor: false,
        edificioProtegido: false,
        zonaBajasEmisiones: false,
      },
    });
    return estimate;
  }, [tipo, metros, barrio]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-accent/30 bg-card/30 backdrop-blur-sm p-6 md:p-10 shadow-editorial">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Tipo */}
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
              Tipo de reforma
            </span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as ReformType)}
              className="w-full h-12 rounded-md border border-border/60 bg-background px-3 text-base outline-none focus:border-accent/60"
            >
              <option value="">Elegir…</option>
              {TIPO_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          {/* Metros */}
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
              Metros cuadrados
            </span>
            <div className="relative">
              <input
                type="number"
                min={15}
                max={1000}
                value={metros}
                onChange={(e) => setMetros(Number(e.target.value))}
                className="w-full h-12 rounded-md border border-border/60 bg-background px-3 pr-12 text-base outline-none focus:border-accent/60 tabular-nums"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-foreground/50">
                m²
              </span>
            </div>
          </label>

          {/* Barrio */}
          <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
              Barrio
            </span>
            <select
              value={barrio}
              onChange={(e) => setBarrio(e.target.value as Barrio)}
              className="w-full h-12 rounded-md border border-border/60 bg-background px-3 text-base outline-none focus:border-accent/60"
            >
              <option value="">Elegir…</option>
              {BARRIO_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Resultado */}
        <div className="mt-10">
          {result ? (
            <div className="rounded-xl border border-accent/40 bg-accent/5 p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-2">
                Rango orientativo
              </div>
              <div className="font-serif text-4xl md:text-5xl tabular-nums text-accent">
                {fmtEur(result.min)} – {fmtEur(result.max)}
              </div>
              <p className="mt-3 text-sm text-foreground/70 md:text-base max-w-2xl">
                Asume calidad media, antigüedad 1950–1980, vivienda vivida y
                plazo razonable. El número real depende de muchos detalles
                que no preguntamos aquí — para una estimación honesta y
                personalizada, haz el diagnóstico completo.
              </p>
              <div className="mt-6">
                <Link
                  href="/diagnostico"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-foreground transition-transform hover:-translate-y-0.5"
                >
                  Hacer diagnóstico completo
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-6 md:p-8 text-center text-sm text-foreground/55">
              Rellena los tres campos para ver el rango orientativo.
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer / nota técnica */}
      <p className="mt-8 text-center text-xs text-foreground/50 max-w-2xl mx-auto leading-relaxed">
        Esta calculadora rápida usa el mismo motor que el diagnóstico completo,
        pero con valores promedio para los factores que no preguntamos. El
        resultado real puede variar entre un 20% y un 40% según calidades,
        antigüedad, estado actual y particularidades del piso.
      </p>
    </div>
  );
}
