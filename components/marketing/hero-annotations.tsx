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
        {/* Pen tip in the photo lands roughly at viewBox (900, 540).
            - 80 m² horizontal cota: extends LEFT of the pen tip, just BELOW it
            - 3.20 m vertical cota: drops DOWN from the pen tip
            - DETALLE circle: relocated to TOP-LEFT corner area */}

        {/* L-shape composition on the right side of the photo:
            - Vertical 3.20m sits at x=900 (pen tip), goes from y=320 to y=620
            - Horizontal 80m² starts where vertical ends (x=900, y=620),
              extends RIGHT to x=1450
            - DETALLE circle floats inside the empty rectangle delimited
              by the two cotas (top-right of vertical, above horizontal),
              not touching either line */}

        {/* ANNOTATION 1 — Vertical "3.20 m" rising above pen tip
            (starts at 2.5s — drawn first because the horizontal anchors here) */}
        <motion.g>
          {/* Bottom tick at horizontal junction */}
          <motion.line x1="885" y1="620" x2="915" y2="620" {...drawLoop(1.8, 0.25)} />
          {/* Top tick */}
          <motion.line x1="885" y1="320" x2="915" y2="320" {...drawLoop(1.8, 0.25)} />
          {/* Vertical rule with gap for label */}
          <motion.line x1="900" y1="320" x2="900" y2="445" {...drawLoop(2.0, 0.5)} />
          <motion.line x1="900" y1="495" x2="900" y2="620" {...drawLoop(2.0, 0.5)} />
        </motion.g>
        <motion.text
          x="900"
          y="477"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="18"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fadeLoop(2.6)}
        >
          3.20 m
        </motion.text>

        {/* ANNOTATION 2 — Horizontal "80 m²" extending RIGHT from where
            the vertical ends (starts at 4.0s) */}
        <motion.g>
          {/* Left tick where the vertical bottom is */}
          <motion.line x1="900" y1="605" x2="900" y2="635" {...drawLoop(3.0, 0.25)} />
          {/* Right tick */}
          <motion.line x1="1450" y1="605" x2="1450" y2="635" {...drawLoop(3.0, 0.25)} />
          {/* Horizontal rule with gap for label */}
          <motion.line x1="900" y1="620" x2="1115" y2="620" {...drawLoop(3.2, 0.6)} />
          <motion.line x1="1235" y1="620" x2="1450" y2="620" {...drawLoop(3.2, 0.6)} />
        </motion.g>
        <motion.text
          x="1175"
          y="628"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="24"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fadeLoop(3.9)}
        >
          80 m²
        </motion.text>

        {/* ANNOTATION 3 — Detail circle floating in the empty rectangle
            delimited by the two cotas, NOT touching them.
            Rectangle: x ∈ [900, 1450], y ∈ [320, 620]
            Circle center: (1200, 460), r=46. Margins: 254px right, 134px
            top, 160px bottom — well clear of both lines. */}
        <motion.circle
          cx="1200"
          cy="460"
          r="46"
          strokeDasharray="4 6"
          {...drawLoop(4.2, 0.9)}
        />
        {/* Leader line goes UP-RIGHT to label, away from the cotas */}
        <motion.line x1="1240" y1="425" x2="1335" y2="370" {...drawLoop(5.0, 0.5)} />
        <motion.text
          x="1345"
          y="365"
          fill={muted}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...fadeLoop(5.5)}
        >
          DETALLE · 01
        </motion.text>

        {/* ANNOTATION 4 — Bottom-right location stamp (starts at 7.5s) */}
        <motion.line x1="1280" y1="850" x2="1500" y2="850" {...drawLoop(5.8, 0.4)} />
        <motion.text
          x="1500"
          y="878"
          textAnchor="end"
          fill={muted}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.22em"
          {...fadeLoop(6.2)}
        >
          SALAMANCA · MADRID · 80 M²
        </motion.text>
      </svg>
    </div>
  );
}
