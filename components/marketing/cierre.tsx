'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { COPY } from '@/content/copy';

export function Cierre() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6 overflow-hidden bg-transparent"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.12_80/0.18),transparent_70%)] blur-3xl" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.025em] text-balance mb-14"
        >
          {COPY.cierre.title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/diagnostico"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-16 text-base px-9 gap-2 group/cta shadow-[0_30px_80px_-20px_oklch(0.78_0.12_80/0.55)] transition-transform duration-300 hover:scale-[1.03]'
            )}
          >
            {COPY.cierre.cta}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
