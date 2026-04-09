'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { X, Send, Loader2, Phone, Calculator, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CallbackModal } from '@/components/marketing/callback-modal';

interface UiMessage {
  role: 'user' | 'assistant';
  content: string;
  action?: 'callback' | 'diagnostico' | null;
}

const STORAGE_KEY = 'cota-chat-history';
const CONV_KEY = 'cota-chat-conversation-id';
const VISITOR_KEY = 'cota-visitor-id';

function getOrCreateId(key: string): string {
  if (typeof window === 'undefined') return '';
  try {
    let v = sessionStorage.getItem(key);
    if (!v) {
      v = crypto.randomUUID();
      sessionStorage.setItem(key, v);
    }
    return v;
  } catch {
    return crypto.randomUUID();
  }
}

const WELCOME: UiMessage = {
  role: 'assistant',
  content:
    '¡Hola! Soy Lucia, del equipo de Cota Madrid. Te puedo ayudar con tu reforma: estimaciones de precio, plazos, viabilidad o cualquier duda. Cuéntame, ¿qué tienes en mente?',
};

interface Props {
  onClose: () => void;
}

export function ChatWindow({ onClose }: Props) {
  const [messages, setMessages] = useState<UiMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationIdRef = useRef<string>('');
  const visitorIdRef = useRef<string>('');

  const [whatsappHref, setWhatsappHref] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/company')
      .then((r) => r.json())
      .then((d) => {
        if (d.whatsapp) {
          const digits = String(d.whatsapp).replace(/\D/g, '');
          if (digits.length >= 9) {
            setWhatsappHref(
              `https://wa.me/${digits}?text=${encodeURIComponent('Hola, vengo del chat de Cota Madrid y prefiero hablar por WhatsApp.')}`
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    conversationIdRef.current = getOrCreateId(CONV_KEY);
    visitorIdRef.current = getOrCreateId(VISITOR_KEY);
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UiMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {}
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next: UiMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          conversationId: conversationIdRef.current,
          visitorId: visitorIdRef.current,
          pagePath:
            typeof window !== 'undefined'
              ? window.location.pathname
              : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al contactar con el asesor.');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Disculpa, ahora mismo no puedo responderte. Si quieres avanzar, puedes pedir tu estimación de presupuesto online o escribirnos por WhatsApp.',
            action: 'diagnostico',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, action: data.action },
        ]);
      }
    } catch {
      setError('Error de red.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Chat con Lucia, asesora de Cota"
      className="fixed bottom-40 right-4 sm:right-6 z-35 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] h-[70vh] sm:h-[540px] max-h-[640px] bg-background border border-accent/40 rounded-2xl shadow-[0_30px_80px_-15px_oklch(0.06_0.02_168/0.85),0_0_0_4px_oklch(0.76_0.11_78/0.06)] flex flex-col overflow-hidden"
    >
      <header className="relative flex items-center justify-between px-4 py-3 border-b border-border bg-[oklch(0.18_0.022_168)]">
        <div className="flex items-center gap-3">
          {/* Avatar with online status */}
          <div className="relative shrink-0">
            <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-accent/60">
              <Image
                src="/images/cota/avatar-lucia.png"
                alt="Lucia, asesora de Cota Madrid"
                fill
                sizes="44px"
                className="object-cover"
                priority={false}
              />
            </div>
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[oklch(0.18_0.022_168)]"
            />
          </div>
          <div className="relative flex items-center min-w-0">
            <p className="text-sm font-semibold leading-none text-foreground shrink-0 mr-5">
              Lucia
            </p>
            <span className="text-[10px] uppercase tracking-[0.16em] text-foreground/60 font-mono shrink-0 leading-none mr-1">
              Asesora
            </span>
            <span
              aria-label="Cota Madrid"
              className="absolute left-[7rem] top-1/2 -translate-y-1/2 block h-24 w-64 shrink-0 bg-foreground pointer-events-none"
              style={{
                WebkitMaskImage: 'url(/images/cota/logo-cota.svg)',
                maskImage: 'url(/images/cota/logo-cota.svg)',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'left center',
                maskPosition: 'left center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
              }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar chat"
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-foreground/10 transition text-foreground/70"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Subtle architectural background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[64px] bottom-[60px] opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_95%)]"
      >
        <Image
          src="/images/cota/chat-bg.png"
          alt=""
          fill
          sizes="380px"
          className="object-cover"
        />
      </div>

      <div
        ref={scrollRef}
        className="relative z-[1] flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          // Show avatar only on the first assistant message in a streak
          const prevSameRole = i > 0 && messages[i - 1].role === m.role;
          return (
            <div
              key={i}
              className={cn(
                'flex items-end gap-2',
                isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!isUser && (
                <div className="h-7 w-7 shrink-0 rounded-full overflow-hidden border border-accent/50 relative">
                  {!prevSameRole ? (
                    <Image
                      src="/images/cota/avatar-lucia.png"
                      alt=""
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              )}
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div
                  className={cn(
                    'rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
                    isUser
                      ? 'bg-accent text-accent-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  )}
                >
                  {m.content}
                </div>
                {!isUser && m.action === 'callback' && (
                  <button
                    type="button"
                    onClick={() => setCallbackOpen(true)}
                    className="self-start inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-accent-foreground hover:-translate-y-0.5 transition-transform"
                  >
                    <Phone className="size-3.5" />
                    Sí, llamadme
                  </button>
                )}
                {!isUser && m.action === 'diagnostico' && (
                  <a
                    href="/diagnostico"
                    className="self-start inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-accent-foreground hover:-translate-y-0.5 transition-transform"
                  >
                    <Calculator className="size-3.5" />
                    Pedir mi presupuesto online
                  </a>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="h-7 w-7 shrink-0 rounded-full overflow-hidden border border-accent/50 relative">
              <Image
                src="/images/cota/avatar-lucia.png"
                alt=""
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <div className="bg-muted rounded-2xl px-3 py-2 text-sm inline-flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> escribiendo...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-border p-3 flex items-center gap-2 bg-background"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          aria-label="Mensaje"
          className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Enviar mensaje"
          className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/80 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {whatsappHref && (
        <div className="border-t border-border bg-background px-3 py-2 text-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-foreground/55 hover:text-accent transition-colors"
          >
            <MessageCircle className="size-3" />
            ¿Prefieres hablar por WhatsApp?
          </a>
        </div>
      )}

      {error && (
        <p role="alert" className="px-3 pb-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  );
}
