'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-card border border-border rounded-lg p-5 shadow-2xl z-50">
      <p className="text-sm text-foreground">
        Usamos cookies técnicas y de analítica anónima para mejorar la web.{' '}
        <Link href="/cookies" className="underline">
          Saber más
        </Link>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={accept}>
          Aceptar
        </Button>
      </div>
    </div>
  );
}
