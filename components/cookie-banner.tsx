'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cota-cookies-accepted';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 rounded-xl border border-white/[0.08] bg-[oklch(0.16_0.016_168/0.95)] backdrop-blur-2xl p-4 shadow-[0_20px_60px_-15px_oklch(0_0_0/0.5)]">
      <p className="text-[0.78rem] leading-relaxed text-foreground/70">
        Usamos cookies técnicas y analítica anónima.{' '}
        <Link href="/cookies" className="text-accent/80 hover:text-accent underline underline-offset-2 transition-colors">
          Saber más
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={accept}
          className="rounded-full bg-accent/10 border border-accent/25 px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent hover:bg-accent/20 transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
