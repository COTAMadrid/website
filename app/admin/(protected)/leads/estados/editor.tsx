'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

interface Status {
  id: string;
  label: string;
  color: string;
  position: number;
  is_default: boolean;
}

export function StatusesEditor() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState('#737373');

  function load() {
    fetch('/api/admin/leads/statuses')
      .then((r) => r.json())
      .then((d) => setStatuses(d.statuses ?? []))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(s: Status) {
    setError(null);
    const res = await fetch('/api/admin/leads/statuses', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: s.id,
        label: s.label,
        color: s.color,
        position: s.position,
      }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? 'Error al guardar');
      return;
    }
    load();
  }

  async function remove(id: string) {
    if (!confirm(`¿Borrar el estado "${id}"? Los leads que lo tengan quedarán sin estado.`)) return;
    await fetch(`/api/admin/leads/statuses?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    load();
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!newId.trim() || !newLabel.trim()) return;
    const res = await fetch('/api/admin/leads/statuses', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: newId.trim(),
        label: newLabel.trim(),
        color: newColor,
        position: (statuses[statuses.length - 1]?.position ?? 0) + 1,
      }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? 'Error');
      return;
    }
    setNewId('');
    setNewLabel('');
    setNewColor('#737373');
    load();
  }

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <ul className="space-y-2">
        {statuses.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-md border border-border bg-card/20 p-3"
          >
            <input
              type="color"
              value={s.color}
              onChange={(e) =>
                setStatuses((all) =>
                  all.map((x) => (x.id === s.id ? { ...x, color: e.target.value } : x))
                )
              }
              className="h-9 w-12 rounded cursor-pointer border border-border bg-background"
            />
            <input
              type="text"
              value={s.label}
              onChange={(e) =>
                setStatuses((all) =>
                  all.map((x) => (x.id === s.id ? { ...x, label: e.target.value } : x))
                )
              }
              className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm"
            />
            <span className="font-mono text-[10px] text-muted-foreground w-24 truncate">
              {s.id}
            </span>
            <input
              type="number"
              value={s.position}
              onChange={(e) =>
                setStatuses((all) =>
                  all.map((x) =>
                    x.id === s.id ? { ...x, position: Number(e.target.value) } : x
                  )
                )
              }
              className="h-9 w-16 rounded-md border border-border bg-background px-2 text-sm tabular-nums"
            />
            <button
              type="button"
              onClick={() => save(s)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-border hover:bg-muted"
              title="Guardar cambios"
            >
              <Save className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => remove(s.id)}
              disabled={s.is_default}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-border hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
              title={s.is_default ? 'No se puede borrar' : 'Borrar'}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={add}
        className="rounded-md border border-dashed border-border p-4 space-y-3"
      >
        <h3 className="text-sm font-medium">Añadir nuevo estado</h3>
        <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr] gap-2">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="h-9 rounded cursor-pointer border border-border bg-background"
          />
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Nombre visible (ej: Visita programada)"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          />
          <input
            type="text"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="id-tecnico (ej: visita-programada)"
            className="h-9 rounded-md border border-border bg-background px-3 text-sm font-mono"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-foreground text-background h-9 px-4 text-sm hover:opacity-90"
        >
          <Plus className="size-4" />
          Añadir estado
        </button>
      </form>
    </div>
  );
}
