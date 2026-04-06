'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Global blueprint background — sits behind all page content with very low
 * opacity. Slow continuous architectural draw animations: dimension lines,
 * floor plan fragments, measurement marks. Gives the page a feeling of being
 * a "live architectural project in progress" without distracting from text.
 *
 * Uses fixed positioning so it stays as the page scrolls. Pure SVG.
 */
export function BlueprintBackground() {
  const reduce = useReducedMotion();

  // Loop animation for path drawing — slow, repeating
  const loopDraw = (delay: number, duration = 6) =>
    reduce
      ? { initial: { pathLength: 1, opacity: 0.55 }, animate: { pathLength: 1, opacity: 0.55 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: [0, 1, 1, 0], opacity: [0, 0.55, 0.55, 0] },
          transition: {
            duration,
            delay,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut' as const,
            times: [0, 0.4, 0.85, 1],
          },
        };

  const loopFade = (delay: number, duration = 6) =>
    reduce
      ? { initial: { opacity: 0.55 }, animate: { opacity: 0.55 } }
      : {
          initial: { opacity: 0 },
          animate: { opacity: [0, 0.55, 0.55, 0] },
          transition: {
            duration,
            delay,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut' as const,
            times: [0, 0.4, 0.85, 1],
          },
        };

  // Plain warm gold (RGB hex so it's universally supported)
  const stroke = '#c9a66b';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[15] overflow-hidden"
    >
      {/* ╭──────────────────────────────────────────────────╮
          │  GROUP A — Top-left floor plan fragment          │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMinYMin meet"
        className="absolute left-[3%] top-[5%] h-[55vh] w-auto"
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinecap="round"
      >
        {/* Floor plan rectangle (room outline) */}
        <motion.rect x="40" y="40" width="320" height="220" {...loopDraw(0, 7)} />
        {/* Internal wall */}
        <motion.line x1="200" y1="40" x2="200" y2="160" {...loopDraw(1.2, 5)} />
        <motion.line x1="200" y1="160" x2="360" y2="160" {...loopDraw(2.4, 4)} />
        {/* Door swing arc */}
        <motion.path
          d="M 200 160 A 40 40 0 0 1 240 200"
          {...loopDraw(3.6, 3)}
        />
        {/* Window markers (top wall) */}
        <motion.line x1="80" y1="36" x2="140" y2="36" strokeWidth="2" {...loopDraw(0.8, 5)} />
        <motion.line x1="80" y1="44" x2="140" y2="44" strokeWidth="2" {...loopDraw(0.8, 5)} />

        {/* Dimension line below */}
        <motion.line x1="40" y1="295" x2="360" y2="295" {...loopDraw(2, 5)} />
        <motion.line x1="40" y1="285" x2="40" y2="305" {...loopDraw(2, 5)} />
        <motion.line x1="360" y1="285" x2="360" y2="305" {...loopDraw(2, 5)} />
        <motion.text
          x="200"
          y="320"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="14"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.1em"
          {...loopFade(2.5, 5)}
        >
          12.40 m
        </motion.text>
      </svg>

      {/* ╭──────────────────────────────────────────────────╮
          │  GROUP B — Mid-right vertical dimension stack    │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 400 700"
        preserveAspectRatio="xMaxYMid meet"
        className="absolute right-[4%] top-[35%] h-[60vh] w-auto"
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinecap="round"
      >
        {/* Vertical cota stack */}
        <motion.line x1="350" y1="60" x2="380" y2="60" {...loopDraw(8, 4)} />
        <motion.line x1="350" y1="240" x2="380" y2="240" {...loopDraw(8, 4)} />
        <motion.line x1="365" y1="60" x2="365" y2="135" {...loopDraw(8.5, 4)} />
        <motion.line x1="365" y1="165" x2="365" y2="240" {...loopDraw(8.5, 4)} />
        <motion.text
          x="365"
          y="155"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.1em"
          {...loopFade(9, 4)}
        >
          2.80
        </motion.text>

        <motion.line x1="350" y1="280" x2="380" y2="280" {...loopDraw(10, 4)} />
        <motion.line x1="350" y1="500" x2="380" y2="500" {...loopDraw(10, 4)} />
        <motion.line x1="365" y1="280" x2="365" y2="380" {...loopDraw(10.5, 4)} />
        <motion.line x1="365" y1="410" x2="365" y2="500" {...loopDraw(10.5, 4)} />
        <motion.text
          x="365"
          y="400"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.1em"
          {...loopFade(11, 4)}
        >
          3.40
        </motion.text>

        {/* Detail circle with leader */}
        <motion.circle
          cx="220"
          cy="600"
          r="40"
          strokeDasharray="3 5"
          {...loopDraw(12, 5)}
        />
        <motion.line x1="260" y1="570" x2="340" y2="540" {...loopDraw(13, 3)} />
        <motion.text
          x="300"
          y="528"
          fill={stroke}
          stroke="none"
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...loopFade(14, 3)}
        >
          DETALLE
        </motion.text>
      </svg>

      {/* ╭──────────────────────────────────────────────────╮
          │  GROUP C — Bottom-left isometric grid sketch     │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 600 500"
        preserveAspectRatio="xMinYMax meet"
        className="absolute left-[5%] bottom-[10%] h-[50vh] w-auto"
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinecap="round"
      >
        {/* Isometric box outline */}
        <motion.path
          d="M 100 250 L 250 180 L 400 250 L 400 380 L 250 450 L 100 380 Z"
          {...loopDraw(16, 7)}
        />
        {/* Top edge separator */}
        <motion.line x1="250" y1="180" x2="250" y2="320" {...loopDraw(17, 5)} />
        <motion.line x1="100" y1="250" x2="250" y2="320" {...loopDraw(17.5, 5)} />
        <motion.line x1="400" y1="250" x2="250" y2="320" {...loopDraw(18, 5)} />

        {/* Crosshair label */}
        <motion.line x1="80" y1="120" x2="130" y2="120" {...loopDraw(20, 3)} />
        <motion.line x1="105" y1="95" x2="105" y2="145" {...loopDraw(20, 3)} />
        <motion.text
          x="145"
          y="124"
          fill={stroke}
          stroke="none"
          fontSize="12"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.18em"
          {...loopFade(20.8, 3)}
        >
          PLANO · 04
        </motion.text>
      </svg>

      {/* ╭──────────────────────────────────────────────────╮
          │  GROUP D — Floating cota top-center               │
          ╰──────────────────────────────────────────────────╯ */}
      <svg
        viewBox="0 0 600 100"
        preserveAspectRatio="xMidYMin meet"
        className="absolute left-[40%] top-[18%] h-[8vh] w-auto"
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinecap="round"
      >
        <motion.line x1="20" y1="40" x2="20" y2="60" {...loopDraw(24, 3)} />
        <motion.line x1="580" y1="40" x2="580" y2="60" {...loopDraw(24, 3)} />
        <motion.line x1="20" y1="50" x2="270" y2="50" {...loopDraw(24.5, 5)} />
        <motion.line x1="330" y1="50" x2="580" y2="50" {...loopDraw(24.5, 5)} />
        <motion.text
          x="300"
          y="56"
          textAnchor="middle"
          fill={stroke}
          stroke="none"
          fontSize="14"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="0.1em"
          {...loopFade(25, 5)}
        >
          80 m²
        </motion.text>
      </svg>
    </div>
  );
}
