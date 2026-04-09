'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ChatWindow } from './chat-window';

const NUDGE_KEY = 'cota-chat-nudge-shown';
const NUDGE_DELAY_MS = 15_000;

/** Returns a contextual nudge string based on the current pathname. */
function nudgeFor(path: string): string {
  if (path === '/' || path === '')
    return '¿Te ayudo a entender qué cuesta tu reforma? Pregúntame lo que quieras.';
  if (path.startsWith('/diagnostico'))
    return '¿Tienes alguna duda mientras rellenas el diagnóstico? Estoy aquí.';
  if (path.startsWith('/sobre-cota'))
    return '¿Quieres que te cuente cómo trabajamos en tu caso concreto?';
  if (path.startsWith('/calculadora-reforma-madrid'))
    return '¿Te ayudo a interpretar el rango que te ha salido?';
  if (path.startsWith('/reforma-piso-')) {
    const barrio = path.replace('/reforma-piso-', '');
    return `¿Reforma en ${barrio.charAt(0).toUpperCase() + barrio.slice(1)}? Cuéntame y te oriento.`;
  }
  return '¿Te ayudo con algo de tu reforma?';
}

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    try {
      if (sessionStorage.getItem(NUDGE_KEY)) return;
    } catch {}
    const t = setTimeout(() => {
      if (open) return;
      setNudge(nudgeFor(window.location.pathname));
      try {
        sessionStorage.setItem(NUDGE_KEY, '1');
      } catch {}
    }, NUDGE_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openFromNudge() {
    setNudge(null);
    setOpen(true);
  }

  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}

      {nudge && !open && (
        <div className="fixed bottom-40 right-6 z-30 max-w-[280px] animate-in slide-in-from-right-2 fade-in duration-500">
          <div className="relative rounded-2xl rounded-br-sm border border-accent/40 bg-background shadow-2xl p-3 pr-8">
            <button
              type="button"
              onClick={() => setNudge(null)}
              aria-label="Descartar"
              className="absolute top-1 right-1 inline-flex size-6 items-center justify-center rounded-md text-foreground/40 hover:text-foreground hover:bg-foreground/10"
            >
              <X className="size-3" />
            </button>
            <button
              type="button"
              onClick={openFromNudge}
              className="flex items-start gap-2 text-left"
            >
              <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden border border-accent/50">
                <Image
                  src="/images/cota/avatar-lucia.png"
                  alt="Lucia"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent mb-0.5">
                  Lucia · Cota
                </p>
                <p className="text-sm leading-snug text-foreground/85">
                  {nudge}
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {!open && (
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setNudge(null);
        }}
        aria-label="Abrir chat con Lucia, asesora de Cota"
        aria-expanded={open}
        className="group fixed bottom-24 right-6 z-35 flex items-center gap-3 rounded-full bg-[oklch(0.18_0.022_168/0.55)] backdrop-blur-xl border border-accent/40 pl-1.5 pr-4 py-1.5 shadow-[0_20px_60px_-10px_oklch(0.06_0.02_168/0.5),0_0_0_4px_oklch(0.76_0.11_78/0.06)] hover:-translate-y-0.5 hover:bg-[oklch(0.18_0.022_168/0.75)] hover:border-accent/70 transition-all duration-300"
      >
        {/* Avatar with online dot — hidden when the nudge OR the chat window
            is showing so we never have two Lucia avatars on screen at once */}
        {!nudge && !open && (
          <span className="relative shrink-0">
            <span className="block h-11 w-11 rounded-full overflow-hidden border-2 border-accent/60 relative">
              <Image
                src="/images/cota/avatar-lucia.png"
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[oklch(0.18_0.022_168)]"
            />
          </span>
        )}

        {/* Name + role — hidden on tiny screens, visible from xs up.
            When nudge is showing, the bubble collapses to just the label so
            it visually 'feeds' the speech bubble above it. */}
        <span
          className={
            'hidden sm:flex flex-col text-left leading-tight ' +
            (nudge ? 'px-1' : 'pr-1')
          }
        >
          <span className="font-serif text-sm text-foreground">
            Habla con Lucia
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
            Asesora · online
          </span>
        </span>

        {/* Pulse ring for first-time attention */}
        {!nudge && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-accent/30 animate-ping opacity-25 pointer-events-none"
            style={{ animationDuration: '3s' }}
          />
        )}
      </button>
      )}
    </>
  );
}
