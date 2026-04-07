'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from './chat-window';

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <ChatWindow onClose={() => setOpen(false)} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat con asesor de Cota'}
        aria-expanded={open}
        className="fixed bottom-24 right-6 z-35 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
