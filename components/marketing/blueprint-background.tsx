'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Global blueprint background — 3 floor plans drawing themselves progressively.
 * Sits behind all home page content via z-0 fixed; sections above use semi-
 * transparent backgrounds (95% opacity) so this stays visible through them.
 *
 * Each plan draws in stages: exterior walls → interior walls → doors → windows
 * → furniture, then holds, fades, waits, and starts again. Three plans are
 * staggered so something is always being drawn somewhere on the page.
 */
export function BlueprintBackground() {
  const reduce = useReducedMotion();

  // Cycle = 24s total per plan (12s draw, 6s hold, 2s fade, 4s wait)
  // Each "stage" is a fraction of those first 12s.

  const drawStage = (
    cycleStart: number,
    stageStart: number,
    stageDuration: number
  ) => {
    if (reduce) {
      return {
        initial: { pathLength: 1, opacity: 0.85 },
        animate: { pathLength: 1, opacity: 0.85 },
      };
    }
    const total = 24;
    const t0 = (cycleStart + stageStart) / total;
    const t1 = (cycleStart + stageStart + stageDuration) / total;
    const tHoldEnd = (cycleStart + 18) / total;
    const tFadeEnd = (cycleStart + 20) / total;
    return {
      initial: { pathLength: 0, opacity: 0 },
      animate: {
        pathLength: [0, 0, 1, 1, 1, 0],
        opacity: [0, 0, 0.85, 0.85, 0.85, 0],
      },
      transition: {
        duration: total,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [0, t0, t1, tHoldEnd, tFadeEnd, 1],
      },
    };
  };

  const stroke = '#c9a66b';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* ╭──────────────────────────────────────────────────╮
          │  PLAN A — top-left  — 1-dorm small piso          │
          │  Cycle starts at 0s                              │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 600 480"
        preserveAspectRatio="xMinYMin meet"
        className="absolute left-[2%] top-[6%] h-[60vh] w-auto opacity-90"
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Stage 1 (0-3s): exterior walls */}
        <motion.rect x="40" y="40" width="520" height="400" {...drawStage(0, 0, 3)} />

        {/* Stage 2 (3-6s): interior walls */}
        <motion.line x1="280" y1="40" x2="280" y2="240" {...drawStage(0, 3, 1.5)} />
        <motion.line x1="280" y1="240" x2="40" y2="240" {...drawStage(0, 4, 1.5)} />
        <motion.line x1="280" y1="240" x2="280" y2="440" {...drawStage(0, 4.5, 1.5)} />
        <motion.line x1="280" y1="320" x2="560" y2="320" {...drawStage(0, 5, 1)} />

        {/* Stage 3 (6-8s): door arcs */}
        <motion.path d="M 280 200 A 40 40 0 0 0 320 240" {...drawStage(0, 6, 0.6)} />
        <motion.path d="M 280 360 A 40 40 0 0 1 320 320" {...drawStage(0, 6.5, 0.6)} />
        <motion.path d="M 80 240 A 40 40 0 0 1 120 200" {...drawStage(0, 7, 0.6)} />

        {/* Stage 4 (8-10s): windows (double line) */}
        <motion.line x1="100" y1="36" x2="180" y2="36" strokeWidth="3" {...drawStage(0, 8, 0.8)} />
        <motion.line x1="100" y1="44" x2="180" y2="44" strokeWidth="3" {...drawStage(0, 8, 0.8)} />
        <motion.line x1="380" y1="36" x2="480" y2="36" strokeWidth="3" {...drawStage(0, 8.4, 0.8)} />
        <motion.line x1="380" y1="44" x2="480" y2="44" strokeWidth="3" {...drawStage(0, 8.4, 0.8)} />
        <motion.line x1="556" y1="100" x2="556" y2="180" strokeWidth="3" {...drawStage(0, 8.8, 0.8)} />
        <motion.line x1="564" y1="100" x2="564" y2="180" strokeWidth="3" {...drawStage(0, 8.8, 0.8)} />

        {/* Stage 5 (10-12s): furniture sketches */}
        {/* Sofa (salon) */}
        <motion.rect x="80" y="300" width="160" height="60" rx="4" {...drawStage(0, 10, 0.8)} />
        {/* Bed (dormitorio) */}
        <motion.rect x="400" y="370" width="100" height="50" rx="4" {...drawStage(0, 10.4, 0.8)} />
        {/* Kitchen counter */}
        <motion.line x1="60" y1="80" x2="220" y2="80" strokeWidth="2" {...drawStage(0, 10.8, 0.6)} />
        {/* Bath circle (lavabo) */}
        <motion.circle cx="380" cy="280" r="14" {...drawStage(0, 11.2, 0.6)} />

        {/* Label */}
        <motion.text
          x="50"
          y="465"
          fill={stroke}
          stroke="none"
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...drawStage(0, 11.5, 0.5)}
        >
          PLANTA · 01 · 65 m²
        </motion.text>
      </svg>

      {/* ╭──────────────────────────────────────────────────╮
          │  PLAN B — mid-right — 2-dorm bigger piso         │
          │  Cycle starts at 8s (offset)                     │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 700 500"
        preserveAspectRatio="xMaxYMid meet"
        className="absolute right-[2%] top-[35%] h-[55vh] w-auto opacity-90"
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Stage 1 (0-3s): exterior walls */}
        <motion.rect x="40" y="40" width="620" height="420" {...drawStage(8, 0, 3)} />

        {/* Stage 2 (3-6s): interior walls — 2 dorms + bath + kitchen + salon */}
        <motion.line x1="40" y1="240" x2="380" y2="240" {...drawStage(8, 3, 1.2)} />
        <motion.line x1="380" y1="40" x2="380" y2="460" {...drawStage(8, 3.5, 1.2)} />
        <motion.line x1="220" y1="240" x2="220" y2="460" {...drawStage(8, 4, 1)} />
        <motion.line x1="500" y1="40" x2="500" y2="240" {...drawStage(8, 4.5, 1)} />

        {/* Stage 3 (6-8s): door arcs */}
        <motion.path d="M 380 100 A 40 40 0 0 1 340 140" {...drawStage(8, 6, 0.5)} />
        <motion.path d="M 380 320 A 40 40 0 0 0 340 280" {...drawStage(8, 6.4, 0.5)} />
        <motion.path d="M 220 320 A 40 40 0 0 1 180 280" {...drawStage(8, 6.8, 0.5)} />
        <motion.path d="M 500 100 A 40 40 0 0 0 540 140" {...drawStage(8, 7.2, 0.5)} />

        {/* Stage 4 (8-10s): windows */}
        <motion.line x1="80" y1="36" x2="180" y2="36" strokeWidth="3" {...drawStage(8, 8, 0.7)} />
        <motion.line x1="80" y1="44" x2="180" y2="44" strokeWidth="3" {...drawStage(8, 8, 0.7)} />
        <motion.line x1="240" y1="36" x2="340" y2="36" strokeWidth="3" {...drawStage(8, 8.4, 0.7)} />
        <motion.line x1="240" y1="44" x2="340" y2="44" strokeWidth="3" {...drawStage(8, 8.4, 0.7)} />
        <motion.line x1="540" y1="36" x2="620" y2="36" strokeWidth="3" {...drawStage(8, 8.8, 0.7)} />
        <motion.line x1="540" y1="44" x2="620" y2="44" strokeWidth="3" {...drawStage(8, 8.8, 0.7)} />
        <motion.line x1="656" y1="280" x2="656" y2="380" strokeWidth="3" {...drawStage(8, 9.2, 0.7)} />
        <motion.line x1="664" y1="280" x2="664" y2="380" strokeWidth="3" {...drawStage(8, 9.2, 0.7)} />

        {/* Stage 5 (10-12s): furniture */}
        {/* 2 beds */}
        <motion.rect x="60" y="100" width="100" height="60" rx="4" {...drawStage(8, 10, 0.7)} />
        <motion.rect x="240" y="100" width="100" height="60" rx="4" {...drawStage(8, 10.3, 0.7)} />
        {/* Sofa salon */}
        <motion.rect x="420" y="320" width="180" height="70" rx="4" {...drawStage(8, 10.6, 0.7)} />
        {/* Kitchen counter */}
        <motion.line x1="60" y1="280" x2="200" y2="280" strokeWidth="2" {...drawStage(8, 10.9, 0.5)} />
        <motion.line x1="60" y1="280" x2="60" y2="320" strokeWidth="2" {...drawStage(8, 10.9, 0.5)} />
        {/* Bath fixtures */}
        <motion.circle cx="280" cy="380" r="14" {...drawStage(8, 11.2, 0.5)} />
        <motion.rect x="320" y="370" width="40" height="20" rx="2" {...drawStage(8, 11.2, 0.5)} />

        <motion.text
          x="50"
          y="485"
          fill={stroke}
          stroke="none"
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...drawStage(8, 11.5, 0.5)}
        >
          PLANTA · 02 · 92 m²
        </motion.text>
      </svg>

      {/* ╭──────────────────────────────────────────────────╮
          │  PLAN C — bottom-left — open loft                │
          │  Cycle starts at 16s                             │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 500 400"
        preserveAspectRatio="xMinYMax meet"
        className="absolute left-[3%] bottom-[8%] h-[45vh] w-auto opacity-90"
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Stage 1: exterior */}
        <motion.rect x="40" y="40" width="420" height="320" {...drawStage(16, 0, 3)} />

        {/* Stage 2: minimal interior — open loft */}
        <motion.line x1="280" y1="40" x2="280" y2="160" {...drawStage(16, 3, 1)} />
        <motion.line x1="280" y1="160" x2="200" y2="160" {...drawStage(16, 3.5, 1)} />

        {/* Stage 3: door */}
        <motion.path d="M 280 120 A 40 40 0 0 0 320 160" {...drawStage(16, 6, 0.6)} />
        <motion.path d="M 200 200 A 40 40 0 0 1 240 160" {...drawStage(16, 6.5, 0.6)} />

        {/* Stage 4: large windows (loft) */}
        <motion.line x1="80" y1="36" x2="240" y2="36" strokeWidth="3" {...drawStage(16, 8, 0.8)} />
        <motion.line x1="80" y1="44" x2="240" y2="44" strokeWidth="3" {...drawStage(16, 8, 0.8)} />
        <motion.line x1="456" y1="80" x2="456" y2="240" strokeWidth="3" {...drawStage(16, 8.5, 0.8)} />
        <motion.line x1="464" y1="80" x2="464" y2="240" strokeWidth="3" {...drawStage(16, 8.5, 0.8)} />

        {/* Stage 5: furniture */}
        <motion.rect x="80" y="220" width="180" height="80" rx="4" {...drawStage(16, 10, 0.8)} />
        <motion.rect x="320" y="60" width="100" height="60" rx="4" {...drawStage(16, 10.4, 0.7)} />
        <motion.circle cx="380" cy="240" r="14" {...drawStage(16, 10.8, 0.5)} />
        <motion.line x1="80" y1="100" x2="200" y2="100" strokeWidth="2" {...drawStage(16, 11, 0.5)} />

        <motion.text
          x="50"
          y="385"
          fill={stroke}
          stroke="none"
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...drawStage(16, 11.5, 0.5)}
        >
          PLANTA · 03 · 78 m²
        </motion.text>
      </svg>
    </div>
  );
}
