'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { ChatWindow } from './chat-window';

const NUDGE_SHOWN_KEY = 'cota-chat-nudge-shown-paths';
const NUDGE_DISMISSED_KEY = 'cota-chat-nudge-dismissed';
const NUDGE_DELAY_MS = 12_000;
const NUDGE_SCROLL_TRIGGER = 0.4; // 40% de la página

interface NudgeContext {
  path: string;
  key: string;
  message: string;
}

/** Devuelve el contexto del nudge según el pathname y scroll opcional. */
function nudgeContextFor(path: string, scrolledDeep: boolean): NudgeContext {
  if (path === '/' || path === '') {
    return scrolledDeep
      ? {
          path,
          key: 'home-deep',
          message: '¿Te ayudo a afinar tu presupuesto? Puedo abrirte el formulario rellenado según lo que me cuentes.',
        }
      : {
          path,
          key: 'home-top',
          message: '¿Te ayudo a entender qué cuesta tu reforma? Pregúntame lo que quieras.',
        };
  }
  if (path.startsWith('/diagnostico'))
    return {
      path,
      key: 'diagnostico',
      message: '¿Tienes alguna duda mientras rellenas el formulario? Estoy aquí.',
    };
  if (path.startsWith('/sobre-cota'))
    return {
      path,
      key: 'sobre-cota',
      message: '¿Quieres que te cuente cómo trabajamos en tu caso concreto?',
    };
  if (path.startsWith('/calculadora-reforma-madrid'))
    return {
      path,
      key: 'calculadora',
      message: '¿Te ayudo a interpretar el rango que te ha salido?',
    };
  if (path.startsWith('/reforma-piso-')) {
    const barrio = path.replace('/reforma-piso-', '');
    return {
      path,
      key: `barrio-${barrio}`,
      message: `¿Reforma en ${barrio.charAt(0).toUpperCase() + barrio.slice(1)}? Cuéntame y te oriento.`,
    };
  }
  return {
    path,
    key: 'other',
    message: '¿Te ayudo con algo de tu reforma?',
  };
}

function getShownSet(): Set<string> {
  try {
    const raw = sessionStorage.getItem(NUDGE_SHOWN_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function markShown(key: string) {
  try {
    const s = getShownSet();
    s.add(key);
    sessionStorage.setItem(NUDGE_SHOWN_KEY, JSON.stringify([...s]));
  } catch {}
}

export function ChatBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  const dismissedRef = useRef(false);

  // Check if user dismissed globally at mount
  useEffect(() => {
    try {
      dismissedRef.current = sessionStorage.getItem(NUDGE_DISMISSED_KEY) === '1';
    } catch {}
  }, []);

  // Fire contextual nudges per route change + deep scroll
  useEffect(() => {
    if (!pathname) return;
    let cancelled = false;

    function tryShow(scrolledDeep: boolean) {
      if (cancelled || open || dismissedRef.current) return;
      const ctx = nudgeContextFor(pathname || '/', scrolledDeep);
      if (getShownSet().has(ctx.key)) return;
      setNudge(ctx.message);
      markShown(ctx.key);
    }

    const topTimer = setTimeout(() => tryShow(false), NUDGE_DELAY_MS);

    function onScroll() {
      const doc = document.documentElement;
      const scrolled =
        (window.scrollY + window.innerHeight) / doc.scrollHeight >= NUDGE_SCROLL_TRIGGER;
      if (scrolled) tryShow(true);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelled = true;
      clearTimeout(topTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname, open]);

  function openFromNudge() {
    setNudge(null);
    setOpen(true);
  }

  function dismissNudge() {
    setNudge(null);
    try {
      sessionStorage.setItem(NUDGE_DISMISSED_KEY, '1');
    } catch {}
    dismissedRef.current = true;
  }

  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}

      {nudge && !open && (
        <div className="fixed bottom-40 right-6 z-30 max-w-[280px] animate-in slide-in-from-right-2 fade-in duration-500">
          <div className="relative rounded-2xl rounded-br-sm border border-accent/40 bg-background shadow-2xl p-3 pr-8">
            <button
              type="button"
              onClick={dismissNudge}
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
                <p className="text-sm leading-snug text-foreground/85">{nudge}</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setNudge(null);
          }}
          aria-label="Abrir chat con Lucia, asesora de Cota"
          aria-expanded={open}
          className="group fixed bottom-24 right-6 z-35 flex items-center gap-3 rounded-full bg-[oklch(0.18_0.022_168/0.55)] backdrop-blur-xl border border-accent/40 pl-1.5 pr-4 py-1.5 shadow-[0_20px_60px_-10px_oklch(0.06_0.02_168/0.5),0_0_0_4px_oklch(0.76_0.11_78/0.06)] hover:-translate-y-0.5 hover:bg-[oklch(0.18_0.022_168/0.75)] hover:border-accent/70 transition-all duration-300"
        >
          {!nudge && (
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

          <span
            className={
              'hidden sm:flex flex-col text-left leading-tight ' +
              (nudge ? 'px-1' : 'pr-1')
            }
          >
            <span className="font-serif text-sm text-foreground">Habla con Lucia</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
              Asesora · online
            </span>
          </span>

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
