'use client';

import { useState } from 'react';
import { Database } from 'lucide-react';

export function DbInitButton() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function run() {
    setRunning(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/db/init', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ kind: 'error', text: data.error || 'Error al inicializar' });
      } else {
        setMessage({
          kind: 'ok',
          text: `Esquema inicializado (${data.statements} sentencias).`,
        });
      }
    } catch {
      setMessage({ kind: 'error', text: 'Error de red' });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={run}
        disabled={running}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 disabled:opacity-50"
      >
        <Database className="h-4 w-4" />
        {running ? 'Inicializando...' : 'Inicializar base de datos'}
      </button>
      {message && (
        <p
          role="status"
          className={
            message.kind === 'ok' ? 'text-sm text-emerald-600' : 'text-sm text-destructive'
          }
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
