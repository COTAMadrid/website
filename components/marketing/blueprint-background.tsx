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
        initial: { pathLength: 1, opacity: 1 },
        animate: { pathLength: 1, opacity: 1 },
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
        opacity: [0, 0, 1, 1, 1, 0],
      },
      transition: {
        duration: total,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [0, t0, t1, tHoldEnd, tFadeEnd, 1],
      },
    };
  };

  const stroke = '#3e5c7f';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* ╭──────────────────────────────────────────────────╮
          │  PLAN A — top-left  — Realistic 1-dorm piso      │
          │  Cycle starts at 0s                              │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 720 540"
        preserveAspectRatio="xMinYMin meet"
        className="absolute left-[2%] top-[6%] h-[68vh] w-auto opacity-95"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* ─────────── STAGE 1 (0-3s): exterior walls (double line for thickness) ─────────── */}
        {/* Outer */}
        <motion.rect x="60" y="60" width="600" height="420" {...drawStage(0, 0, 1.5)} />
        {/* Inner (8px thickness) */}
        <motion.rect x="68" y="68" width="584" height="404" {...drawStage(0, 1, 1.5)} />

        {/* ─────────── STAGE 2 (3-6s): interior walls (single line) ─────────── */}
        {/* Vertical wall separating salon-cocina from dorms-bath */}
        <motion.line x1="380" y1="68" x2="380" y2="280" {...drawStage(0, 3, 1)} />
        {/* Horizontal wall under cocina/bath */}
        <motion.line x1="68" y1="200" x2="240" y2="200" {...drawStage(0, 3.5, 0.8)} />
        <motion.line x1="240" y1="200" x2="240" y2="68" {...drawStage(0, 4, 0.6)} />
        {/* Wall between dorm and bath */}
        <motion.line x1="380" y1="280" x2="652" y2="280" {...drawStage(0, 4.4, 1)} />
        {/* Bath internal wall */}
        <motion.line x1="540" y1="68" x2="540" y2="280" {...drawStage(0, 4.8, 0.8)} />
        {/* Pasillo wall */}
        <motion.line x1="240" y1="280" x2="380" y2="280" {...drawStage(0, 5.2, 0.6)} />

        {/* ─────────── STAGE 3 (6-8s): doors with leaf + arc ─────────── */}
        {/* Door entrada (bottom) */}
        <motion.line x1="320" y1="472" x2="320" y2="436" {...drawStage(0, 6, 0.4)} />
        <motion.path d="M 320 472 A 36 36 0 0 1 356 436" {...drawStage(0, 6, 0.5)} />
        {/* Door cocina */}
        <motion.line x1="200" y1="200" x2="200" y2="168" {...drawStage(0, 6.3, 0.4)} />
        <motion.path d="M 200 200 A 32 32 0 0 1 232 168" {...drawStage(0, 6.3, 0.5)} />
        {/* Door bath */}
        <motion.line x1="540" y1="200" x2="572" y2="200" {...drawStage(0, 6.6, 0.4)} />
        <motion.path d="M 540 200 A 32 32 0 0 0 572 168" {...drawStage(0, 6.6, 0.5)} />
        {/* Door dorm 1 */}
        <motion.line x1="450" y1="280" x2="450" y2="312" {...drawStage(0, 6.9, 0.4)} />
        <motion.path d="M 450 280 A 32 32 0 0 0 482 312" {...drawStage(0, 6.9, 0.5)} />

        {/* ─────────── STAGE 4 (8-10s): windows (4 parallel lines = wall break) ─────────── */}
        {/* Window N - salon */}
        <motion.line x1="120" y1="60" x2="220" y2="60" {...drawStage(0, 8, 0.5)} />
        <motion.line x1="120" y1="68" x2="220" y2="68" {...drawStage(0, 8, 0.5)} />
        <motion.line x1="170" y1="58" x2="170" y2="70" {...drawStage(0, 8, 0.5)} />
        {/* Window N - cocina */}
        <motion.line x1="290" y1="60" x2="350" y2="60" {...drawStage(0, 8.3, 0.5)} />
        <motion.line x1="290" y1="68" x2="350" y2="68" {...drawStage(0, 8.3, 0.5)} />
        {/* Window E - dorm */}
        <motion.line x1="652" y1="320" x2="652" y2="430" {...drawStage(0, 8.6, 0.5)} />
        <motion.line x1="660" y1="320" x2="660" y2="430" {...drawStage(0, 8.6, 0.5)} />
        <motion.line x1="650" y1="375" x2="662" y2="375" {...drawStage(0, 8.6, 0.5)} />
        {/* Window E - bath */}
        <motion.line x1="652" y1="120" x2="652" y2="180" {...drawStage(0, 8.9, 0.5)} />
        <motion.line x1="660" y1="120" x2="660" y2="180" {...drawStage(0, 8.9, 0.5)} />

        {/* ─────────── STAGE 5 (10-12s): furniture + fixtures (REAL) ─────────── */}

        {/* COCINA: counter L-shape + sink + stove + fridge */}
        {/* counter */}
        <motion.line x1="76" y1="100" x2="232" y2="100" {...drawStage(0, 10, 0.5)} />
        <motion.line x1="76" y1="100" x2="76" y2="192" {...drawStage(0, 10, 0.5)} />
        {/* sink (2 basins) */}
        <motion.rect x="100" y="76" width="40" height="22" rx="2" {...drawStage(0, 10.1, 0.4)} />
        <motion.line x1="120" y1="78" x2="120" y2="98" {...drawStage(0, 10.1, 0.3)} />
        {/* stove with 4 burners */}
        <motion.rect x="160" y="76" width="46" height="22" {...drawStage(0, 10.2, 0.4)} />
        <motion.circle cx="170" cy="84" r="3" {...drawStage(0, 10.2, 0.3)} />
        <motion.circle cx="184" cy="84" r="3" {...drawStage(0, 10.2, 0.3)} />
        <motion.circle cx="170" cy="93" r="2.5" {...drawStage(0, 10.2, 0.3)} />
        <motion.circle cx="184" cy="93" r="2.5" {...drawStage(0, 10.2, 0.3)} />
        {/* fridge */}
        <motion.rect x="80" y="120" width="36" height="40" {...drawStage(0, 10.3, 0.4)} />
        <motion.line x1="80" y1="125" x2="116" y2="125" {...drawStage(0, 10.3, 0.3)} />

        {/* BAÑO: WC + lavabo + bañera */}
        {/* WC (oval + tank) */}
        <motion.ellipse cx="570" cy="248" rx="12" ry="14" {...drawStage(0, 10.4, 0.4)} />
        <motion.rect x="558" y="220" width="24" height="14" {...drawStage(0, 10.4, 0.4)} />
        {/* lavabo */}
        <motion.rect x="600" y="80" width="40" height="22" rx="2" {...drawStage(0, 10.5, 0.4)} />
        <motion.ellipse cx="620" cy="91" rx="12" ry="6" {...drawStage(0, 10.5, 0.4)} />
        {/* bañera */}
        <motion.rect x="552" y="116" width="92" height="40" rx="6" {...drawStage(0, 10.6, 0.4)} />
        <motion.rect x="560" y="124" width="76" height="24" rx="4" {...drawStage(0, 10.6, 0.4)} />
        <motion.circle cx="630" cy="136" r="2" {...drawStage(0, 10.6, 0.3)} />

        {/* SALON: sofa 3-seater + coffee table + tv */}
        <motion.rect x="100" y="380" width="180" height="60" rx="4" {...drawStage(0, 10.7, 0.5)} />
        {/* sofa cushion divisions */}
        <motion.line x1="160" y1="395" x2="160" y2="440" {...drawStage(0, 10.7, 0.4)} />
        <motion.line x1="220" y1="395" x2="220" y2="440" {...drawStage(0, 10.7, 0.4)} />
        {/* sofa back rail */}
        <motion.line x1="100" y1="392" x2="280" y2="392" {...drawStage(0, 10.7, 0.4)} />
        {/* coffee table */}
        <motion.rect x="140" y="320" width="100" height="36" rx="3" {...drawStage(0, 10.8, 0.4)} />
        {/* TV (line on wall) */}
        <motion.line x1="150" y1="304" x2="230" y2="304" strokeWidth="2.5" {...drawStage(0, 10.8, 0.4)} />

        {/* DORM: cama matrimonio + 2 mesitas + armario */}
        {/* bed */}
        <motion.rect x="430" y="370" width="120" height="80" rx="3" {...drawStage(0, 10.9, 0.5)} />
        {/* headboard */}
        <motion.line x1="430" y1="376" x2="550" y2="376" strokeWidth="2" {...drawStage(0, 10.9, 0.4)} />
        {/* 2 pillows */}
        <motion.rect x="438" y="380" width="48" height="20" rx="2" {...drawStage(0, 10.9, 0.4)} />
        <motion.rect x="494" y="380" width="48" height="20" rx="2" {...drawStage(0, 10.9, 0.4)} />
        {/* nightstands */}
        <motion.rect x="406" y="380" width="20" height="24" {...drawStage(0, 11, 0.4)} />
        <motion.rect x="554" y="380" width="20" height="24" {...drawStage(0, 11, 0.4)} />
        {/* armario (wardrobe) */}
        <motion.rect x="400" y="296" width="240" height="32" {...drawStage(0, 11.1, 0.5)} />
        {/* doors of wardrobe */}
        <motion.line x1="460" y1="296" x2="460" y2="328" {...drawStage(0, 11.1, 0.3)} />
        <motion.line x1="520" y1="296" x2="520" y2="328" {...drawStage(0, 11.1, 0.3)} />
        <motion.line x1="580" y1="296" x2="580" y2="328" {...drawStage(0, 11.1, 0.3)} />

        {/* ─────────── STAGE 6 (11.4-12.5s): labels + dimensions + north arrow ─────────── */}

        {/* Room labels */}
        <motion.text x="180" y="430" textAnchor="middle" fill={stroke} stroke="none" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.22em" {...drawStage(0, 11.4, 0.4)}>SALÓN · 24 m²</motion.text>
        <motion.text x="155" y="180" textAnchor="middle" fill={stroke} stroke="none" fontSize="8" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.2em" {...drawStage(0, 11.4, 0.4)}>COCINA · 8 m²</motion.text>
        <motion.text x="510" y="430" textAnchor="middle" fill={stroke} stroke="none" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.22em" {...drawStage(0, 11.5, 0.4)}>DORMITORIO · 14 m²</motion.text>
        <motion.text x="595" y="265" textAnchor="middle" fill={stroke} stroke="none" fontSize="7" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.18em" {...drawStage(0, 11.5, 0.4)}>BAÑO · 6 m²</motion.text>
        <motion.text x="310" y="350" textAnchor="middle" fill={stroke} stroke="none" fontSize="6" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.18em" {...drawStage(0, 11.5, 0.4)}>PASILLO</motion.text>

        {/* Dimension lines (top, bottom, left) with extension marks */}
        {/* Bottom */}
        <motion.line x1="60" y1="510" x2="660" y2="510" strokeDasharray="1 3" {...drawStage(0, 11.6, 0.5)} />
        <motion.line x1="60" y1="500" x2="60" y2="520" {...drawStage(0, 11.6, 0.3)} />
        <motion.line x1="660" y1="500" x2="660" y2="520" {...drawStage(0, 11.6, 0.3)} />
        <motion.text x="360" y="506" textAnchor="middle" fill={stroke} stroke="none" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.15em" {...drawStage(0, 11.7, 0.4)}>12.00 m</motion.text>
        {/* Left vertical */}
        <motion.line x1="30" y1="60" x2="30" y2="480" strokeDasharray="1 3" {...drawStage(0, 11.6, 0.5)} />
        <motion.line x1="20" y1="60" x2="40" y2="60" {...drawStage(0, 11.6, 0.3)} />
        <motion.line x1="20" y1="480" x2="40" y2="480" {...drawStage(0, 11.6, 0.3)} />
        <motion.text x="22" y="276" textAnchor="middle" fill={stroke} stroke="none" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.15em" transform="rotate(-90 22 276)" {...drawStage(0, 11.7, 0.4)}>8.40 m</motion.text>

        {/* North arrow (top-right corner) */}
        <motion.circle cx="688" cy="32" r="14" {...drawStage(0, 11.8, 0.4)} />
        <motion.line x1="688" y1="20" x2="688" y2="44" {...drawStage(0, 11.8, 0.4)} />
        <motion.path d="M 688 18 L 684 26 L 692 26 Z" {...drawStage(0, 11.8, 0.4)} />
        <motion.text x="688" y="55" textAnchor="middle" fill={stroke} stroke="none" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" letterSpacing="0.2em" {...drawStage(0, 11.8, 0.4)}>N</motion.text>

        {/* Title bar */}
        <motion.text
          x="60"
          y="48"
          fill={stroke}
          stroke="none"
          fontSize="9"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.22em"
          {...drawStage(0, 11.9, 0.5)}
        >
          PLANTA · 01 · 65 m² · CHAMBERÍ
        </motion.text>
        <motion.text
          x="60"
          y="534"
          fill={stroke}
          stroke="none"
          fontSize="7"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.2em"
          {...drawStage(0, 11.9, 0.5)}
        >
          ESC. 1:50 · COTA MADRID · DIAGNÓSTICO 001
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
        strokeWidth="1.1"
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
        strokeWidth="1.1"
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
