'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COPY } from '@/content/copy';

export function Hero() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const reduce = useReducedMotion();

  const submit = () => {
    if (value.trim()) sessionStorage.setItem('cota-hero-input', value.trim());
    router.push('/diagnostico');
  };

  const titleWords = COPY.hero.title.split(COPY.hero.highlight);

  return (
    <section className="relative isolate min-h-[100vh] flex items-center px-6 overflow-hidden bg-[var(--color-cream)] text-[var(--color-cream-foreground)]">
      {/* Faint architectural grid + paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-x-12 gap-y-16 items-center py-24 lg:py-20">
        {/* TEXT — left column */}
        <div className="lg:col-span-7 lg:text-left text-center order-2 lg:order-1">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 border-b border-current/30 pb-1 text-[0.65rem] uppercase tracking-[0.3em] text-current/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_oklch(0.78_0.12_80/0.9)]" />
            {COPY.hero.eyebrow}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.02] tracking-[-0.025em] text-balance"
          >
            {titleWords[0]}
            <span className="italic text-accent">{COPY.hero.highlight}</span>
            {titleWords[1]}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
            className="mt-7 text-base md:text-lg text-current/70 max-w-xl lg:mx-0 mx-auto leading-relaxed"
          >
            {COPY.hero.subtitle}
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl lg:mx-0 mx-auto"
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={COPY.hero.inputPlaceholder}
              className="h-13 text-base bg-white border-current/15 focus-visible:border-accent focus-visible:ring-accent/20"
            />
            <Button
              type="submit"
              size="lg"
              className="h-13 px-6 text-base gap-2 group/cta transition-transform duration-300 hover:scale-[1.02]"
            >
              {COPY.hero.inputCta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-4 text-xs uppercase tracking-[0.18em] text-current/55"
          >
            {COPY.hero.microcopy}
          </motion.p>
        </div>

        {/* COLLAGE — right column, asymmetric */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 32, rotate: reduce ? 0 : -1.5 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative order-1 lg:order-2"
        >
          <div className="relative mx-auto max-w-sm lg:max-w-none lg:translate-x-4">
            {/* Shadow / paper edge */}
            <div className="absolute -inset-3 bg-[var(--color-cream)] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.5),0_20px_40px_-20px_rgba(0,0,0,0.3)] rounded-[2px]" />

            {/* The actual collage image */}
            <div className="relative aspect-square">
              <Image
                src={COPY.hero.image}
                alt={COPY.hero.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover object-center"
              />
            </div>

            {/* Annotation: top-right cota */}
            <div className="absolute -top-4 right-2 lg:-top-6 lg:right-6 flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-current/60">
              <span className="h-px w-12 bg-current/40" />
              <span>fig. 01 — diagnóstico</span>
            </div>

            {/* Annotation: bottom-left measurement */}
            <div className="absolute -bottom-5 left-0 lg:-bottom-7 lg:left-4 flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-current/60">
              <span>80 m² · chamberí</span>
              <span className="h-px w-16 bg-current/40" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom hairline rule + scroll hint */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 px-6 pb-6 flex items-end justify-between text-[0.6rem] uppercase tracking-[0.28em] text-current/50"
      >
        <span className="font-mono">cotamadrid.com · est. 2026</span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col items-center gap-2"
        >
          <span>Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-current/60 to-transparent" />
        </motion.div>
        <span className="font-mono">[ pch obras ]</span>
      </div>
    </section>
  );
}
