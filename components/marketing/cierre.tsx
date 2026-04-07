'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { COPY } from '@/content/copy';
import { Cierre3D } from './cierre-3d';

export function Cierre() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative isolate pt-40 md:pt-56 pb-28 md:pb-40 px-6 overflow-hidden bg-background"
    >
      {/* SOLID OPAQUE COVER — blocks the global blueprint background
          from leaking through. z-0 keeps it inside the stacking context
          but above any negative-z siblings. */}
      <div aria-hidden className="absolute inset-0 z-0 bg-background" />

      {/* Soft warm glow halo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.12_80/0.18),transparent_70%)] blur-3xl" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      {/* THE 3D MOMENT — procedural wireframe arch */}
      <Cierre3D />

      {/* Coordinate crosshairs in the four corners — editorial annotation */}
      <div aria-hidden className="pointer-events-none absolute inset-6 z-[2] hidden md:block text-accent/40">
        <span className="cota-cross absolute left-0 top-0" />
        <span className="cota-cross absolute right-0 top-0" />
        <span className="cota-cross absolute left-0 bottom-0" />
        <span className="cota-cross absolute right-0 bottom-0" />
      </div>

      <div className="relative z-[3] mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent"
        >
          <span className="h-px w-8 bg-accent/60" />
          07 · Cierre
          <span className="h-px w-8 bg-accent/60" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[2.4rem] md:text-5xl lg:text-[3.75rem] leading-[1.02] tracking-[-0.025em] text-balance mb-12 max-w-[22ch] mx-auto"
        >
          {COPY.cierre.title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/diagnostico" className="cota-numlink">
            <span className="idx">07</span>
            <span>{COPY.cierre.cta}</span>
            <ArrowRight className="arrow size-3.5" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
