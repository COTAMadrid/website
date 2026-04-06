'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Global blueprint background — 3 real architectural floor plan PNGs
 * (generated via AI, navy blue on cream paper) drawn into the page with
 * a wipe-reveal mask animation, like someone is drawing the plan over
 * the page in real time.
 *
 * Sits at z-0 fixed; the dark sections above are bg-transparent and the
 * cream sections are bg-cream/85, so the plans show through everywhere.
 */
export function BlueprintBackground() {
  const reduce = useReducedMotion();

  const plans = [
    {
      src: '/images/cota/planos/plano-01.png',
      alt: 'Plano editorial 65 m²',
      cycleStart: 0,
      className:
        'absolute left-[2%] top-[5%] h-[55vh] w-auto max-w-[40vw] aspect-square',
    },
    {
      src: '/images/cota/planos/plano-02.png',
      alt: 'Plano editorial 65 m² Chamberí',
      cycleStart: 8,
      className:
        'absolute right-[3%] top-[38%] h-[52vh] w-auto max-w-[40vw] aspect-square',
    },
    {
      src: '/images/cota/planos/plano-03.png',
      alt: 'Plano editorial 78 m² Malasaña',
      cycleStart: 16,
      className:
        'absolute left-[4%] bottom-[6%] h-[50vh] w-auto max-w-[40vw] aspect-square',
    },
  ];

  // Total cycle = 24s. Wipe draw 0-6s, hold 6-18s, fade 18-20s, wait 20-24s.
  const wipeAnimation = (cycleStart: number) => {
    if (reduce) {
      return {
        initial: { clipPath: 'inset(0 0 0 0)', opacity: 0.32 },
        animate: { clipPath: 'inset(0 0 0 0)', opacity: 0.32 },
      };
    }
    const total = 24;
    return {
      initial: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      animate: {
        clipPath: [
          'inset(0 100% 0 0)', // 0s — fully hidden
          'inset(0 100% 0 0)', // start delay
          'inset(0 0% 0 0)', // 6s — fully revealed
          'inset(0 0% 0 0)', // hold
          'inset(0 0% 0 0)', // hold end
          'inset(0 100% 0 0)', // wipe back out
        ],
        opacity: [0, 0, 0.32, 0.32, 0.32, 0],
      },
      transition: {
        duration: total,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [
          0,
          cycleStart / total,
          (cycleStart + 6) / total,
          (cycleStart + 18) / total,
          (cycleStart + 20) / total,
          1,
        ],
      },
    };
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {plans.map((plan) => (
        <motion.div key={plan.src} className={plan.className} {...wipeAnimation(plan.cycleStart)}>
          <Image
            src={plan.src}
            alt={plan.alt}
            fill
            sizes="40vw"
            className="object-contain mix-blend-multiply"
            priority={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
