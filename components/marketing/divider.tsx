'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type Variant = 'measure' | 'crosses' | 'hairline';

/**
 * Architectural-style section dividers.
 * Not page rules — drawing annotations.
 */
export function Divider({
  variant = 'measure',
  label,
  className = '',
}: {
  variant?: Variant;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  if (variant === 'crosses') {
    return (
      <div
        ref={ref}
        aria-hidden
        className={`flex items-center justify-center gap-6 py-6 text-[color:var(--color-accent,oklch(0.78_0.12_80))]/70 ${className}`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-xs tracking-widest"
          >
            ×
          </motion.span>
        ))}
      </div>
    );
  }

  if (variant === 'hairline') {
    return (
      <div ref={ref} aria-hidden className={`relative py-8 ${className}`}>
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto h-px max-w-3xl origin-center bg-gradient-to-r from-transparent via-[color:var(--color-accent,oklch(0.78_0.12_80))]/40 to-transparent"
        />
      </div>
    );
  }

  // measure — blueprint dimension line  |---⟨ label ⟩---|
  return (
    <div
      ref={ref}
      aria-hidden
      className={`relative mx-auto flex max-w-4xl items-center gap-4 px-6 py-8 ${className}`}
    >
      <motion.svg
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        viewBox="0 0 20 12"
        className="h-3 w-4 shrink-0 text-[color:var(--color-accent,oklch(0.78_0.12_80))]/60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <line x1="1" y1="1" x2="1" y2="11" />
        <line x1="1" y1="6" x2="20" y2="6" />
      </motion.svg>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="h-px flex-1 origin-left bg-[color:var(--color-accent,oklch(0.78_0.12_80))]/30"
      />
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
        >
          ⟨ {label} ⟩
        </motion.span>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="h-px flex-1 origin-right bg-[color:var(--color-accent,oklch(0.78_0.12_80))]/30"
      />
      <motion.svg
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        viewBox="0 0 20 12"
        className="h-3 w-4 shrink-0 text-[color:var(--color-accent,oklch(0.78_0.12_80))]/60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <line x1="19" y1="1" x2="19" y2="11" />
        <line x1="0" y1="6" x2="19" y2="6" />
      </motion.svg>
    </div>
  );
}
