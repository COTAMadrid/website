'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UiMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'cota-chat-history';

const WELCOME: UiMessage = {
  role: 'assistant',
  content:
    '¡Hola! Soy el asesor virtual de Cota. Puedo ayudarte con dudas sobre tu reforma en Madrid: viabilidad, precios orientativos, plazos o riesgos. ¿En qué te ayudo?',
};

interface Props {
  onClose: () => void;
}

export function ChatWindow({ onClose }: Props) {
  const [messages, setMessages] = useState<UiMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
              data.error ||
              'Lo siento, ahora mismo no puedo responder. Prueba por WhatsApp o haz el diagnóstico en /diagnostico.',
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
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
      aria-label="Chat con el asesor de Cota"
      className="fixed bottom-40 right-4 sm:right-6 z-35 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] h-[70vh] sm:h-[540px] max-h-[640px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <div>
          <p className="text-sm font-semibold leading-tight">Asesor de Cota</p>
          <p className="text-xs text-muted-foreground">Reformas en Madrid</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar chat"
          className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              'flex',
              m.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'rounded-2xl px-3 py-2 text-sm max-w-[85%] whitespace-pre-wrap',
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
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
      {error && (
        <p role="alert" className="px-3 pb-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
