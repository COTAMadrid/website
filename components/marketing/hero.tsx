'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COPY } from '@/content/copy';

export function Hero() {
  const router = useRouter();
  const [value, setValue] = useState('');

  const submit = () => {
    if (value.trim()) sessionStorage.setItem('cota-hero-input', value.trim());
    router.push('/diagnostico');
  };

  return (
    <section className="relative min-h-[92vh] flex items-center px-6 overflow-hidden">
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/3 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.12_80/0.18),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(1_0_0/0.04),transparent_60%)]" />
      </div>
      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
      />

      <div className="mx-auto max-w-5xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_oklch(0.78_0.12_80/0.8)]" />
          Consultoría de reformas · Madrid
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-[-0.025em] text-balance"
        >
          {COPY.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: 'easeOut' }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {COPY.hero.subtitle}
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: 'easeOut' }}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="mt-12 group flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto p-2 sm:rounded-2xl sm:border sm:border-border/60 sm:bg-card/40 sm:backdrop-blur-sm sm:shadow-[0_30px_80px_-30px_oklch(0_0_0/0.6)] sm:focus-within:border-accent/40 sm:focus-within:shadow-[0_30px_80px_-20px_oklch(0.78_0.12_80/0.18)] transition-all duration-500"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={COPY.hero.inputPlaceholder}
            className="h-14 text-base border-border sm:border-transparent sm:bg-transparent sm:shadow-none sm:focus-visible:ring-0"
          />
          <Button type="submit" size="lg" className="h-14 px-7 text-base gap-2 group/cta">
            {COPY.hero.inputCta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </Button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-5 text-sm text-muted-foreground"
        >
          {COPY.hero.microcopy}
        </motion.p>
      </div>
    </section>
  );
}
