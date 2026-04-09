'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Inline micro-CTA that can be placed between sections.
 * Styled as an editorial separator with a call-to-action.
 */
export function InlineCTA({
  label = 'Calcula tu reforma en 60 segundos',
  href = '/diagnostico',
}: {
  label?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="relative py-10 md:py-14 px-6"
    >
      <div className="mx-auto max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        <span className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-accent/30 hidden sm:block" />
        <Link
          href={href}
          className="inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/[0.04] px-5 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-accent/90 hover:bg-accent/10 hover:border-accent/35 transition-all duration-400 group"
        >
          {label}
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
        </Link>
        <span className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-accent/30 hidden sm:block" />
      </div>
    </motion.div>
  );
}
