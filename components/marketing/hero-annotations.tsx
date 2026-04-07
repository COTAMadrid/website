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
        {/* All cotas in the RIGHT-BOTTOM quadrant (x: 1000-1520, y: 580-850)
            so they sit outside the text column (which lives top-left).
            They cluster around the visible plano in the photo. */}

        {/* ANNOTATION 1 — Horizontal cota right-bottom (starts at 2.5s) */}
        <motion.g>
          <motion.line x1="1080" y1="660" x2="1080" y2="690" {...drawLoop(2.5, 0.3)} />
          <motion.line x1="1500" y1="660" x2="1500" y2="690" {...drawLoop(2.5, 0.3)} />
          <motion.line x1="1080" y1="675" x2="1240" y2="675" {...drawLoop(2.7, 0.7)} />
          <motion.line x1="1340" y1="675" x2="1500" y2="675" {...drawLoop(2.7, 0.7)} />
        </motion.g>
        <motion.text
          x="1290"
          y="683"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="24"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fadeLoop(3.2)}
        >
          80 m²
        </motion.text>

        {/* ANNOTATION 2 — Vertical cota right edge (starts at 4.0s) */}
        <motion.g>
          <motion.line x1="1525" y1="580" x2="1555" y2="580" {...drawLoop(4.0, 0.3)} />
          <motion.line x1="1525" y1="800" x2="1555" y2="800" {...drawLoop(4.0, 0.3)} />
          <motion.line x1="1540" y1="580" x2="1540" y2="675" {...drawLoop(4.2, 0.6)} />
          <motion.line x1="1540" y1="710" x2="1540" y2="800" {...drawLoop(4.2, 0.6)} />
        </motion.g>
        <motion.text
          x="1540"
          y="697"
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

        {/* ANNOTATION 3 — Detail circle right-center, leader going up-left
            (starts at 5.5s) */}
        <motion.circle
          cx="1180"
          cy="780"
          r="50"
          strokeDasharray="4 6"
          {...drawLoop(5.5, 1.1)}
        />
        <motion.line x1="1145" y1="745" x2="1060" y2="660" {...drawLoop(6.4, 0.6)} />
        <motion.text
          x="1180"
          y="868"
          textAnchor="middle"
          fill={muted}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...fadeLoop(6.8)}
        >
          DETALLE · 01
        </motion.text>

        {/* ANNOTATION 4 — Bottom-right location stamp (starts at 7.5s) */}
        <motion.line x1="1280" y1="850" x2="1500" y2="850" {...drawLoop(7.5, 0.5)} />
        <motion.text
          x="1500"
          y="878"
          textAnchor="end"
          fill={muted}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.22em"
          {...fadeLoop(7.9)}
        >
          SALAMANCA · MADRID · 80 M²
        </motion.text>
      </svg>
    </div>
  );
}
