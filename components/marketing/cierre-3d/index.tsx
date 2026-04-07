'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ArchScene = dynamic(() => import('./arch-scene'), {
  ssr: false,
  loading: () => null,
});

/**
 * Strategic 3D moment — procedural wireframe archway behind the
 * Cierre headline. The ONLY 3D element on the page.
 *
 * Rules followed:
 * - skips on mobile (< 768px)
 * - skips on prefers-reduced-motion (static SVG fallback shown instead)
 * - dpr capped at 1.5 (in scene)
 * - mix-blend-screen so it sits behind text without harming legibility
 * - radial mask keeps the headline area legible
 */
export function Cierre3D() {
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(reduce || isMobile);
    if (isMobile || reduce) return;
    setEnabled(true);
  }, []);

  // Static SVG fallback — same archway silhouette
  if (!enabled) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center mix-blend-screen opacity-40"
      >
        <svg
          viewBox="0 0 240 220"
          className="h-[60%] w-auto max-w-[80%] text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <rect x="40" y="60" width="22" height="130" />
          <rect x="178" y="60" width="22" height="130" />
          <path d="M 40 60 A 80 60 0 0 1 200 60" />
          <line x1="20" y1="195" x2="220" y2="195" />
          {!reduced && (
            <line x1="20" y1="200" x2="220" y2="200" strokeDasharray="2 4" />
          )}
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[18%] z-[2] mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]"
    >
      <ArchScene />
    </div>
  );
}
