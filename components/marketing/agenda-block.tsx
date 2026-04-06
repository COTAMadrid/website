'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';
import { AgendaEmbed } from './agenda-embed';

export function AgendaBlock() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      id="agenda"
      ref={ref}
      className="relative py-32 md:py-40 px-6 bg-background overflow-hidden"
    >
      {/* Textural background image */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={COPY.agenda.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="text-xs uppercase tracking-[0.24em] text-accent mb-5">
            {COPY.agenda.eyebrow}
          </div>
          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-balance">
            {COPY.agenda.title}
          </h2>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Solo trabajamos con un número limitado de proyectos al mes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {COPY.agenda.options.map((o, i) => (
            <motion.article
              key={o.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col items-center text-center p-10 rounded-2xl border border-border bg-card/50 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_40px_80px_-30px_oklch(0.78_0.12_80/0.3)]"
            >
              <div className="text-4xl mb-5 transition-transform duration-500 group-hover:scale-110">
                {o.icon}
              </div>
              <h3 className="font-serif text-2xl tracking-tight">{o.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent">
                {o.duration}
              </p>
              <div className="my-5 h-px w-10 bg-border" />
              <p className="text-muted-foreground leading-relaxed">{o.body}</p>
            </motion.article>
          ))}
        </div>
        <AgendaEmbed />
      </div>
    </section>
  );
}
