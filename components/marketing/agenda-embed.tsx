'use client';

import { useEffect, useRef, useState } from 'react';

export function AgendaEmbed() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const username = process.env.NEXT_PUBLIC_CALCOM_USERNAME ?? 'cota';

  useEffect(() => {
    if (!ref.current || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className="mt-12 w-full min-h-[600px] rounded-xl border border-border overflow-hidden bg-card"
    >
      {visible ? (
        <iframe
          src={`https://cal.com/${username}?theme=dark&hideEventTypeDetails=false`}
          className="w-full h-[700px] border-0"
          title="Reservar sesión con Cota"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-[600px] text-muted-foreground">
          Cargando agenda…
        </div>
      )}
    </div>
  );
}
