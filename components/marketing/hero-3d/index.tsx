'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Hero3DScene = dynamic(() => import('./scene'), {
  ssr: false,
  loading: () => null,
});

/**
 * Client-only 3D hero layer.
 * - Skips 3D on mobile (< 768px)
 * - Skips 3D when prefers-reduced-motion
 * - SSR disabled so three.js never hits the server bundle path
 */
export function Hero3D() {
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
      className="pointer-events-none absolute inset-0 z-[2] opacity-100 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)]"
    >
      <Hero3DScene />
    </div>
  );
}
