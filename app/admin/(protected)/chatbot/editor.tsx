'use client';

import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { ChatbotConfig, KnowledgeEntry, Provider } from '@/lib/chatbot/types';

interface Props {
  initial: ChatbotConfig;
}

export function ChatbotConfigEditor({ initial }: Props) {
  const [config, setConfig] = useState<ChatbotConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  function updateKnowledge(idx: number, patch: Partial<KnowledgeEntry>) {
    setConfig((c) => ({
      ...c,
      knowledge: c.knowledge.map((k, i) => (i === idx ? { ...k, ...patch } : k)),
    }));
  }

  function addKnowledge() {
    setConfig((c) => ({
      ...c,
      knowledge: [...c.knowledge, { topic: 'Nuevo tema', content: '' }],
    }));
  }

  function removeKnowledge(idx: number) {
    setConfig((c) => ({ ...c, knowledge: c.knowledge.filter((_, i) => i !== idx) }));
  }

  function moveProvider(idx: number, dir: -1 | 1) {
    setConfig((c) => {
      const arr = [...c.providers];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return c;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return { ...c, providers: arr };
    });
  }

  function updateProvider(idx: number, patch: Partial<Provider>) {
    setConfig((c) => ({
      ...c,
      providers: c.providers.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/chatbot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ kind: 'error', text: data.error || 'Error al guardar' });
      } else {
        setMessage({
          kind: 'ok',
          text: data.persisted
            ? 'Guardado en Vercel KV.'
            : 'Guardado en memoria (no persistente). Configura Vercel KV para guardar definitivamente.',
        });
      }
    } catch {
      setMessage({ kind: 'error', text: 'Error de red' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-2">System prompt</h2>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => setConfig((c) => ({ ...c, systemPrompt: e.target.value }))}
          rows={10}
          className="w-full rounded-md border border-border bg-background p-3 text-sm font-mono outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Base de conocimiento</h2>
          <button
            type="button"
            onClick={addKnowledge}
            className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" /> Añadir
          </button>
        </div>
        <div className="space-y-3">
          {config.knowledge.map((k, i) => (
            <div key={i} className="border border-border rounded-md p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={k.topic}
                  onChange={(e) => updateKnowledge(i, { topic: e.target.value })}
                  placeholder="Tema"
                  className="flex-1 h-9 px-3 rounded-md border border-border bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
                <button
                  type="button"
                  onClick={() => removeKnowledge(i)}
                  aria-label="Eliminar entrada"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={k.content}
                onChange={(e) => updateKnowledge(i, { content: e.target.value })}
                rows={3}
                placeholder="Contenido"
                className="w-full rounded-md border border-border bg-background p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Cadena de proveedores</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Se prueban en este orden. Si uno falla o no tiene API key, se intenta el siguiente.
        </p>
        <div className="space-y-2">
          {config.providers.map((p, i) => (
            <div
              key={p.id}
              className="border border-border rounded-md p-3 flex items-center gap-3"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveProvider(i, -1)}
                  disabled={i === 0}
                  aria-label="Subir"
                  className="h-6 w-6 inline-flex items-center justify-center rounded border border-border hover:bg-muted disabled:opacity-30"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveProvider(i, 1)}
                  disabled={i === config.providers.length - 1}
                  aria-label="Bajar"
                  className="h-6 w-6 inline-flex items-center justify-center rounded border border-border hover:bg-muted disabled:opacity-30"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {i + 1}. {p.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.id} · env: {p.apiKeyEnv}
                </p>
                <input
                  type="text"
                  value={p.model}
                  onChange={(e) => updateProvider(i, { model: e.target.value })}
                  className="mt-1 h-8 px-2 w-full rounded-md border border-border bg-background text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={(e) => updateProvider(i, { enabled: e.target.checked })}
                />
                Activo
              </label>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 sticky bottom-0 bg-background py-3 border-t border-border">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
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
    </div>
  );
}
