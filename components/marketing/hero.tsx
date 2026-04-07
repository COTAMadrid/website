'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { COPY } from '@/content/copy';
import { HeroAnnotations } from './hero-annotations';
// HeroFloorPlan3D disabled — could not be made to fit the container
// without clipping. Files kept on disk for future revival.
import { HeroLeadCard } from '@/components/lead-capture/hero-lead-card';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);

  const titleWords = COPY.hero.title.split(COPY.hero.highlight);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[82dvh] flex items-center px-6 overflow-hidden bg-background"
    >
      {/* LAYER 0: Background image with parallax */}
      <motion.div
        aria-hidden
        style={{ y: yImg, scale: scaleImg }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src={COPY.hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* LAYER 1: Cinematic gradient overlay
          Left side dark (for text), right side reveals the hand image */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-[linear-gradient(100deg,oklch(0.12_0.02_168/0.94)_0%,oklch(0.14_0.02_168/0.7)_45%,oklch(0.14_0.02_168/0.15)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[oklch(0.1_0.02_168/0.4)] via-transparent to-[oklch(0.1_0.02_168/0.8)]"
      />

      {/* LAYER 2: 3D rotating floor plan — DISABLED (clipping issue) */}
      {/* <HeroFloorPlan3D /> */}

      {/* LAYER 5: Animated cota annotations (SVG, draws over the photo) */}
      <HeroAnnotations />

      {/* LAYER 3: Gold glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
        <div className="absolute left-[15%] top-[55%] h-[38rem] w-[38rem] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.12_80/0.18),transparent_70%)] blur-3xl" />
      </div>

      {/* LAYER 4: Subtle grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[4] opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      {/* LAYER 10: Content (text + form) */}
      <div className="relative z-10 mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-10 items-center py-16">
        <div className="lg:col-span-8 lg:text-left text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-white/80 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_oklch(0.78_0.12_80/0.9)]" />
            {COPY.hero.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 font-serif text-[2.6rem] md:text-5xl lg:text-[4.25rem] leading-[1.02] tracking-[-0.028em] text-balance text-white max-w-[18ch]"
          >
            {titleWords[0]}
            <span className="italic text-accent">{COPY.hero.highlight}</span>
            {titleWords[1]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
            className="mt-8 text-base md:text-[1.05rem] text-white/70 max-w-[58ch] lg:mx-0 mx-auto leading-relaxed font-medium"
          >
            {COPY.hero.subtitle}
          </motion.p>

          <HeroLeadCard />
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.3em] text-white/50 flex flex-col items-center gap-2"
      >
        <span>Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
