'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COPY } from '@/content/copy';
import { HeroAnnotations } from './hero-annotations';

export function Hero() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);

  const submit = () => {
    if (value.trim()) sessionStorage.setItem('cota-hero-input', value.trim());
    router.push('/diagnostico');
  };

  const titleWords = COPY.hero.title.split(COPY.hero.highlight);

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[82vh] flex items-center px-6 overflow-hidden bg-black"
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
        className="absolute inset-0 z-[1] bg-gradient-to-r from-black/90 via-black/55 to-black/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/70"
      />

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
            className="mt-8 font-serif text-5xl md:text-7xl lg:text-[5.75rem] leading-[1.01] tracking-[-0.028em] text-balance text-white"
          >
            {titleWords[0]}
            <span className="italic text-accent">{COPY.hero.highlight}</span>
            {titleWords[1]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
            className="mt-8 text-lg md:text-xl text-white/75 max-w-2xl lg:mx-0 mx-auto leading-relaxed"
          >
            {COPY.hero.subtitle}
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-12 group flex flex-col sm:flex-row gap-3 max-w-2xl lg:mx-0 mx-auto p-2 sm:rounded-2xl sm:border sm:border-white/15 sm:bg-white/[0.06] sm:backdrop-blur-xl sm:shadow-[0_40px_100px_-30px_oklch(0_0_0/0.8)] sm:focus-within:border-accent/50 sm:focus-within:shadow-[0_40px_100px_-20px_oklch(0.78_0.12_80/0.28)] transition-all duration-500"
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={COPY.hero.inputPlaceholder}
              className="h-14 text-base border-border sm:border-transparent sm:bg-transparent sm:shadow-none sm:focus-visible:ring-0 sm:text-white sm:placeholder:text-white/50"
            />
            <Button
              type="submit"
              size="lg"
              className="h-14 px-7 text-base gap-2 group/cta transition-transform duration-300 hover:scale-[1.02]"
            >
              {COPY.hero.inputCta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-5 text-sm text-white/60"
          >
            {COPY.hero.microcopy}
          </motion.p>
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
