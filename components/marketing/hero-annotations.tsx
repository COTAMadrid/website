'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated dimension annotations overlay for the hero.
 * Drawn over the hand-with-pencil photo, positioned where the pencil
 * tip is pointing (center-left/lower area of the image), so it looks
 * like the hand is actually drawing them in real time.
 *
 * Pure SVG + Framer Motion. Loop with pause for hypnotic effect.
 */
export function HeroAnnotations() {
  const reduce = useReducedMotion();

  // Loop draw animation: draw → hold → fade → wait → repeat
  // Total cycle: 18s
  const drawLoop = (start: number, drawDur = 1.0) => {
    if (reduce) {
      return {
        initial: { pathLength: 1, opacity: 0.95 },
        animate: { pathLength: 1, opacity: 0.95 },
      };
    }
    const total = 18;
    return {
      initial: { pathLength: 0, opacity: 0 },
      animate: {
        pathLength: [0, 0, 1, 1, 0],
        opacity: [0, 0, 0.95, 0.95, 0],
      },
      transition: {
        duration: total,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [
          0,
          start / total,
          (start + drawDur) / total,
          14 / total, // hold until 14s
          16 / total, // fade by 16s
        ],
      },
    };
  };

  const fadeLoop = (start: number) => {
    if (reduce) {
      return { initial: { opacity: 0.95 }, animate: { opacity: 0.95 } };
    }
    const total = 18;
    return {
      initial: { opacity: 0 },
      animate: { opacity: [0, 0, 0.95, 0.95, 0] },
      transition: {
        duration: total,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [0, start / total, (start + 0.4) / total, 14 / total, 16 / total],
      },
    };
  };

  const stroke = 'oklch(0.78 0.12 80)'; // accent gold
  const muted = 'rgba(255,255,255,0.85)';

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] hidden md:block"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {/* Annotations positioned over the plano area of the photo
            (center-bottom where the pencil tip is). Coordinates assume
            the photo is roughly centered with the hand in the right half. */}

        {/* ANNOTATION 1 — Horizontal cota line over the plan area
            (starts at 2.5s — after viewer notices the hand) */}
        <motion.g>
          <motion.line x1="700" y1="560" x2="700" y2="595" {...drawLoop(2.5, 0.4)} />
          <motion.line x1="1100" y1="560" x2="1100" y2="595" {...drawLoop(2.5, 0.4)} />
          <motion.line x1="700" y1="578" x2="855" y2="578" {...drawLoop(2.7, 0.7)} />
          <motion.line x1="945" y1="578" x2="1100" y2="578" {...drawLoop(2.7, 0.7)} />
        </motion.g>
        <motion.text
          x="900"
          y="585"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="22"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fadeLoop(3.2)}
        >
          80 m²
        </motion.text>

        {/* ANNOTATION 2 — Vertical cota left side of plan (starts at 4.0s) */}
        <motion.g>
          <motion.line x1="640" y1="380" x2="675" y2="380" {...drawLoop(4.0, 0.4)} />
          <motion.line x1="640" y1="700" x2="675" y2="700" {...drawLoop(4.0, 0.4)} />
          <motion.line x1="657" y1="380" x2="657" y2="525" {...drawLoop(4.2, 0.6)} />
          <motion.line x1="657" y1="555" x2="657" y2="700" {...drawLoop(4.2, 0.6)} />
        </motion.g>
        <motion.text
          x="657"
          y="544"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="18"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fadeLoop(4.7)}
        >
          3.20 m
        </motion.text>

        {/* ANNOTATION 3 — Detail circle (zoom marker) near pencil tip
            (starts at 5.5s — feels like the pencil just drew it) */}
        <motion.circle
          cx="850"
          cy="450"
          r="55"
          strokeDasharray="4 6"
          {...drawLoop(5.5, 1.1)}
        />
        <motion.line x1="900" y1="410" x2="1000" y2="350" {...drawLoop(6.4, 0.5)} />
        <motion.text
          x="1012"
          y="345"
          fill={muted}
          stroke="none"
          fontSize="14"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...fadeLoop(6.8)}
        >
          DETALLE · 01
        </motion.text>

        {/* ANNOTATION 4 — Bottom-left location stamp (starts at 7.5s) */}
        <motion.line x1="100" y1="820" x2="320" y2="820" {...drawLoop(7.5, 0.5)} />
        <motion.text
          x="100"
          y="848"
          fill={muted}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.22em"
          {...fadeLoop(7.9)}
        >
          SALAMANCA · MADRID
        </motion.text>
      </svg>
    </div>
  );
}
