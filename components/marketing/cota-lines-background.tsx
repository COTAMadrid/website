'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Subtle animated cota-line background. Replaces the noisy floor-plan
 * blueprint with discrete dimension lines (horizontal + vertical hairlines
 * with end ticks) that draw themselves softly across the page, in the
 * same visual language as the hero cotas but much quieter.
 *
 * Fixed at z-0, mix-blend-screen, low opacity. Scattered around the
 * viewport so different cotas appear as the user scrolls. Each cota
 * has its own slow fade loop with a long delay.
 */
export function CotaLinesBackground() {
  const reduce = useReducedMotion();

  // Loop a single cota: appear → hold → fade → wait → repeat
  // Total cycle = 22s. Multiple cotas staggered by `cycleStart`.
  const drawCota = (cycleStart: number, drawDur = 1.4) => {
    if (reduce) {
      return {
        initial: { pathLength: 1, opacity: 0.45 },
        animate: { pathLength: 1, opacity: 0.45 },
      };
    }
    const total = 22;
    return {
      initial: { pathLength: 0, opacity: 0 },
      animate: {
        pathLength: [0, 0, 1, 1, 0],
        opacity: [0, 0, 0.45, 0.45, 0],
      },
      transition: {
        duration: total,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [
          0,
          cycleStart / total,
          (cycleStart + drawDur) / total,
          16 / total,
          18 / total,
        ],
      },
    };
  };

  const fadeText = (cycleStart: number) => {
    if (reduce) {
      return { initial: { opacity: 0.4 }, animate: { opacity: 0.4 } };
    }
    const total = 22;
    return {
      initial: { opacity: 0 },
      animate: { opacity: [0, 0, 0.4, 0.4, 0] },
      transition: {
        duration: total,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [
          0,
          (cycleStart + 0.5) / total,
          (cycleStart + 1.5) / total,
          16 / total,
          18 / total,
        ],
      },
    };
  };

  const stroke = '#c9a66b';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Single SVG covering the entire viewport. Cotas positioned in
          screen-relative coordinates so they distribute across the page. */}
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {/* ─── Cota A — top-left horizontal (delay 0s) ─── */}
        <motion.g>
          <motion.line x1="80" y1="120" x2="80" y2="148" {...drawCota(0, 0.4)} />
          <motion.line x1="380" y1="120" x2="380" y2="148" {...drawCota(0, 0.4)} />
          <motion.line x1="80" y1="134" x2="200" y2="134" {...drawCota(0.2, 0.8)} />
          <motion.line x1="260" y1="134" x2="380" y2="134" {...drawCota(0.2, 0.8)} />
        </motion.g>
        <motion.text
          x="230"
          y="139"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.12em"
          {...fadeText(0)}
        >
          12.4 m
        </motion.text>

        {/* ─── Cota B — mid-right vertical (delay 4s) ─── */}
        <motion.g>
          <motion.line x1="1500" y1="280" x2="1528" y2="280" {...drawCota(4, 0.4)} />
          <motion.line x1="1500" y1="560" x2="1528" y2="560" {...drawCota(4, 0.4)} />
          <motion.line x1="1514" y1="280" x2="1514" y2="395" {...drawCota(4.2, 0.8)} />
          <motion.line x1="1514" y1="445" x2="1514" y2="560" {...drawCota(4.2, 0.8)} />
        </motion.g>
        <motion.text
          x="1514"
          y="425"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="10"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.12em"
          {...fadeText(4)}
        >
          3.6 m
        </motion.text>

        {/* ─── Cota C — bottom-left horizontal (delay 8s) ─── */}
        <motion.g>
          <motion.line x1="120" y1="700" x2="120" y2="728" {...drawCota(8, 0.4)} />
          <motion.line x1="540" y1="700" x2="540" y2="728" {...drawCota(8, 0.4)} />
          <motion.line x1="120" y1="714" x2="298" y2="714" {...drawCota(8.2, 0.9)} />
          <motion.line x1="362" y1="714" x2="540" y2="714" {...drawCota(8.2, 0.9)} />
        </motion.g>
        <motion.text
          x="330"
          y="719"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.12em"
          {...fadeText(8)}
        >
          18.0 m
        </motion.text>

        {/* ─── Cota D — top-center detail crosshair (delay 12s) ─── */}
        <motion.g>
          <motion.line x1="780" y1="200" x2="820" y2="200" {...drawCota(12, 0.3)} />
          <motion.line x1="800" y1="180" x2="800" y2="220" {...drawCota(12, 0.3)} />
        </motion.g>
        <motion.text
          x="830"
          y="205"
          fill={stroke}
          stroke="none"
          fontSize="9"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.2em"
          {...fadeText(12)}
        >
          ORIGEN · 0,0
        </motion.text>

        {/* ─── Cota E — left side small vertical (delay 14s) ─── */}
        <motion.g>
          <motion.line x1="60" y1="380" x2="88" y2="380" {...drawCota(14, 0.3)} />
          <motion.line x1="60" y1="540" x2="88" y2="540" {...drawCota(14, 0.3)} />
          <motion.line x1="74" y1="380" x2="74" y2="450" {...drawCota(14.2, 0.5)} />
          <motion.line x1="74" y1="475" x2="74" y2="540" {...drawCota(14.2, 0.5)} />
        </motion.g>
        <motion.text
          x="74"
          y="465"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="9"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.12em"
          {...fadeText(14)}
        >
          2.4
        </motion.text>
      </svg>
    </div>
  );
}
