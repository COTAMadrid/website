'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated dimension annotations overlay for the hero.
 * Architectural cota lines that draw themselves over the background image,
 * one by one, like someone is annotating the photo in real time.
 *
 * Pure SVG + Framer Motion. No three.js. No new deps. Mobile-friendly.
 */
export function HeroAnnotations() {
  const reduce = useReducedMotion();

  // If user prefers reduced motion, render the final state without animation.
  const draw = (delay: number, duration = 1.2) =>
    reduce
      ? { initial: { pathLength: 1, opacity: 1 }, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { duration, delay, ease: 'easeInOut' as const }, opacity: { duration: 0.4, delay } },
        };

  const fade = (delay: number) =>
    reduce
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 4 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: 'easeOut' as const },
        };

  // Color tokens
  const stroke = 'oklch(0.78 0.12 80)'; // accent gold
  const muted = 'rgba(255,255,255,0.7)';

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
        strokeWidth="1.2"
        strokeLinecap="round"
      >
        {/* ─────────────────────────────────────────────────────────
            ANNOTATION 1 — Horizontal dimension line top-right
            "|———— 80 m² ————|" (delay 1.4s)
            ───────────────────────────────────────────────────────── */}
        <motion.g {...fade(1.4)}>
          {/* left tick */}
          <motion.line x1="1080" y1="100" x2="1080" y2="130" {...draw(1.4, 0.4)} />
          {/* right tick */}
          <motion.line x1="1480" y1="100" x2="1480" y2="130" {...draw(1.4, 0.4)} />
          {/* horizontal rule (with gap for label) */}
          <motion.line x1="1080" y1="115" x2="1245" y2="115" {...draw(1.6, 0.7)} />
          <motion.line x1="1315" y1="115" x2="1480" y2="115" {...draw(1.6, 0.7)} />
        </motion.g>
        <motion.text
          x="1280"
          y="121"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="20"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fade(2.0)}
        >
          80 m²
        </motion.text>

        {/* ─────────────────────────────────────────────────────────
            ANNOTATION 2 — Vertical dimension line right side
            (delay 2.6s)
            ───────────────────────────────────────────────────────── */}
        <motion.g {...fade(2.6)}>
          <motion.line x1="1510" y1="180" x2="1540" y2="180" {...draw(2.6, 0.4)} />
          <motion.line x1="1510" y1="540" x2="1540" y2="540" {...draw(2.6, 0.4)} />
          <motion.line x1="1525" y1="180" x2="1525" y2="345" {...draw(2.8, 0.6)} />
          <motion.line x1="1525" y1="385" x2="1525" y2="540" {...draw(2.8, 0.6)} />
        </motion.g>
        <motion.text
          x="1525"
          y="370"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="18"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.08em"
          {...fade(3.1)}
        >
          3.20 m
        </motion.text>

        {/* ─────────────────────────────────────────────────────────
            ANNOTATION 3 — Detail circle (zoom marker) center-right
            (delay 3.4s)
            ───────────────────────────────────────────────────────── */}
        <motion.circle
          cx="1180"
          cy="600"
          r="60"
          strokeDasharray="4 6"
          {...draw(3.4, 1.2)}
        />
        <motion.line
          x1="1240"
          y1="560"
          x2="1340"
          y2="500"
          {...draw(4.0, 0.6)}
        />
        <motion.text
          x="1352"
          y="495"
          fill={muted}
          stroke="none"
          fontSize="14"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...fade(4.4)}
        >
          DETALLE · 01
        </motion.text>

        {/* ─────────────────────────────────────────────────────────
            ANNOTATION 4 — Bottom-right location stamp
            with horizontal hairline (delay 4.6s)
            ───────────────────────────────────────────────────────── */}
        <motion.line x1="1280" y1="800" x2="1500" y2="800" {...draw(4.6, 0.6)} />
        <motion.text
          x="1500"
          y="828"
          textAnchor="end"
          fill={muted}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.22em"
          {...fade(5.0)}
        >
          SALAMANCA · MADRID · 40°25′N
        </motion.text>

        {/* ─────────────────────────────────────────────────────────
            ANNOTATION 5 — Crosshair cota mark left side (delay 5.4s)
            ───────────────────────────────────────────────────────── */}
        <motion.g {...fade(5.4)}>
          <motion.line x1="80" y1="450" x2="140" y2="450" {...draw(5.4, 0.4)} />
          <motion.line x1="110" y1="420" x2="110" y2="480" {...draw(5.4, 0.4)} />
          <motion.circle cx="110" cy="450" r="6" {...draw(5.6, 0.3)} />
        </motion.g>
        <motion.text
          x="155"
          y="455"
          fill={muted}
          stroke="none"
          fontSize="12"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...fade(5.8)}
        >
          ORIGEN · 0,0
        </motion.text>
      </svg>
    </div>
  );
}
