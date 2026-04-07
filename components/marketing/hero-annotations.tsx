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
        {/* Cotas now ORIGINATE near the pen tip (right endpoint ≈ x: 940, y: 540
            in the photo) and extend to the LEFT, like the hand is drawing
            them outward. Each cota's right edge clusters around the pen tip. */}

        {/* ANNOTATION 1 — Horizontal cota extending LEFT from pen tip
            (starts at 2.5s) */}
        <motion.g>
          {/* Right tick (near pen tip) */}
          <motion.line x1="940" y1="525" x2="940" y2="555" {...drawLoop(2.5, 0.3)} />
          {/* Left tick */}
          <motion.line x1="220" y1="525" x2="220" y2="555" {...drawLoop(2.5, 0.3)} />
          {/* Horizontal rule with gap for label */}
          <motion.line x1="220" y1="540" x2="520" y2="540" {...drawLoop(2.7, 0.7)} />
          <motion.line x1="640" y1="540" x2="940" y2="540" {...drawLoop(2.7, 0.7)} />
        </motion.g>
        <motion.text
          x="580"
          y="548"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="26"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fadeLoop(3.2)}
        >
          80 m²
        </motion.text>

        {/* ANNOTATION 2 — Vertical cota anchored to pen tip area
            (starts at 4.0s) */}
        <motion.g>
          <motion.line x1="905" y1="220" x2="935" y2="220" {...drawLoop(4.0, 0.3)} />
          <motion.line x1="905" y1="500" x2="935" y2="500" {...drawLoop(4.0, 0.3)} />
          <motion.line x1="920" y1="220" x2="920" y2="335" {...drawLoop(4.2, 0.6)} />
          <motion.line x1="920" y1="395" x2="920" y2="500" {...drawLoop(4.2, 0.6)} />
        </motion.g>
        <motion.text
          x="920"
          y="370"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="20"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fadeLoop(4.7)}
        >
          3.20 m
        </motion.text>

        {/* ANNOTATION 3 — Detail circle (zoom marker) on the LEFT
            with a leader line back to the pen tip (starts at 5.5s) */}
        <motion.circle
          cx="380"
          cy="380"
          r="55"
          strokeDasharray="4 6"
          {...drawLoop(5.5, 1.1)}
        />
        {/* Leader line going FROM pen tip area TO the detail circle */}
        <motion.line x1="900" y1="500" x2="430" y2="420" {...drawLoop(6.4, 0.6)} />
        <motion.text
          x="380"
          y="475"
          textAnchor="middle"
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
        <motion.line x1="100" y1="780" x2="380" y2="780" {...drawLoop(7.5, 0.5)} />
        <motion.text
          x="100"
          y="808"
          fill={muted}
          stroke="none"
          fontSize="14"
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
