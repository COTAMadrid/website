'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const FloorPlanScene = dynamic(() => import('./scene'), {
  ssr: false,
  loading: () => null,
});

/**
 * Hero floor-plan 3D layer. Mobile and reduced-motion users get
 * nothing extra — the three.js bundle is lazy-loaded only when we
 * decide to render the scene.
 */
export function HeroFloorPlan3D() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || reduce) return;
    setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[8%] top-[28%] size-[28rem] hidden md:block z-[2]"
    >
      <FloorPlanScene />
    </div>
  );
}
