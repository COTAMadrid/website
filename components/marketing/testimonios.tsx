'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';

/**
 * Testimonios reales de PCH Obras (baños) presentados honestamente como
 * "los proyectos que nos llevaron hasta aquí". Cota es marca nueva pero
 * el equipo no — y eso es lo que da confianza.
 */
const TESTIMONIOS = [
  {
    body: 'Lo que más valoré fue que vinieron, vieron el baño y me dijeron desde el primer minuto qué se podía hacer y qué no. Me ahorraron meterme en una obra que iba a darme problemas.',
    author: 'M.C.',
    location: 'Chamberí',
    project: 'Reforma de baño',
  },
  {
    body: 'Otros me daban presupuestos al teléfono sin venir. Ellos vinieron, estuvieron una hora midiendo y haciendo preguntas, y al final el presupuesto salió como dijeron. Sin extras raros.',
    author: 'J.R.',
    location: 'Salamanca',
    project: 'Cocina + baño',
  },
  {
    body: 'Cuidaron mucho los detalles. Cuando aparecieron humedades en una pared que no esperábamos, lo pararon todo, me explicaron las opciones y decidimos juntos. Eso lo agradeces mucho.',
    author: 'A.G.',
    location: 'Retiro',
    project: 'Reforma integral parcial',
  },
] as const;

export function Testimonios() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      id="testimonios"
      className="relative px-6 py-20 md:py-28 bg-background scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-2xl"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Lo que dicen quienes han trabajado con nosotros
            </span>
          </div>
          <h2 className="font-serif text-[2.2rem] leading-[1.05] tracking-[-0.025em] md:text-[3rem] text-balance">
            Los proyectos que nos llevaron hasta aquí.
          </h2>
          <p className="mt-5 text-base text-foreground/65 md:text-lg max-w-xl">
            Cota Madrid es nuestra nueva forma de trabajar, pero el equipo
            lleva más de una década reformando viviendas en Madrid. Estos son
            algunos comentarios de clientes anteriores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {TESTIMONIOS.map((t, i) => (
            <motion.figure
              key={t.author + t.location}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.15 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col rounded-lg border border-border/60 bg-card/30 p-6 md:p-7 transition-colors hover:border-accent/40"
            >
              <Quote
                aria-hidden
                className="size-6 text-accent/50 mb-4"
                strokeWidth={1.5}
              />
              <blockquote className="flex-1 text-base leading-relaxed text-foreground/85 md:text-[1.05rem]">
                {t.body}
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border/40">
                <div className="font-serif text-lg">{t.author}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55 mt-1">
                  {t.location} · {t.project}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-foreground/45 italic">
          Iniciales y barrio publicados con consentimiento. Reseñas
          completas disponibles bajo petición.
        </p>
      </div>
    </section>
  );
}
