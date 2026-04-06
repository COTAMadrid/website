'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';

export function Escenarios() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-40 px-6 bg-[var(--color-cream)] text-[var(--color-cream-foreground)] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-16 md:mb-20"
        >
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-cream-muted)] mb-5">
            {COPY.escenarios.eyebrow}
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.escenarios.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {COPY.escenarios.cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col bg-white/60 backdrop-blur-sm border border-[var(--color-cream-border)] rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_oklch(0_0_0/0.3)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 font-serif text-xs tracking-[0.22em] text-white/90">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="flex flex-col flex-1 p-8">
                <h3 className="font-serif text-2xl leading-snug mb-4 tracking-tight">
                  {c.title}
                </h3>
                <p className="text-[var(--color-cream-muted)] leading-relaxed flex-1">
                  {c.body}
                </p>
                <div className="mt-8 pt-6 border-t border-[var(--color-cream-border)]">
                  <p className="text-sm tracking-wide font-medium text-[color:oklch(0.45_0.1_75)]">
                    {c.closing}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
