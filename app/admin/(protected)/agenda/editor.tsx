'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AgendaAvailability } from '@/config/agenda-defaults';

const WEEKDAYS = [
  { value: 0, label: 'Lunes' },
  { value: 1, label: 'Martes' },
  { value: 2, label: 'Miércoles' },
  { value: 3, label: 'Jueves' },
  { value: 4, label: 'Viernes' },
  { value: 5, label: 'Sábado' },
  { value: 6, label: 'Domingo' },
];

export function AgendaEditor({ initial }: { initial: AgendaAvailability }) {
  const [availability, setAvailability] = useState<AgendaAvailability>(initial);
  const [newSlot, setNewSlot] = useState('');
  const [newDate, setNewDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  function addSlot() {
    if (!newSlot.match(/^\d{2}:\d{2}$/)) return;
    if (availability.time_slots.includes(newSlot)) return;
    setAvailability((a) => ({
      ...a,
      time_slots: [...a.time_slots, newSlot].sort(),
    }));
    setNewSlot('');
  }

  function removeSlot(s: string) {
    setAvailability((a) => ({ ...a, time_slots: a.time_slots.filter((x) => x !== s) }));
  }

  function addDate() {
    if (!newDate) return;
    if (availability.blocked_dates.includes(newDate)) return;
    setAvailability((a) => ({
      ...a,
      blocked_dates: [...a.blocked_dates, newDate].sort(),
    }));
    setNewDate('');
  }

  function removeDate(d: string) {
    setAvailability((a) => ({ ...a, blocked_dates: a.blocked_dates.filter((x) => x !== d) }));
  }

  function toggleWeekday(v: number) {
    setAvailability((a) => ({
      ...a,
      blocked_weekdays: a.blocked_weekdays.includes(v)
        ? a.blocked_weekdays.filter((x) => x !== v)
        : [...a.blocked_weekdays, v].sort((x, y) => x - y),
    }));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/agenda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability }),
      });
      const data = await res.json();
      if (!res.ok) setMessage({ kind: 'error', text: data.error || 'Error al guardar' });
      else setMessage({ kind: 'ok', text: 'Guardado correctamente' });
    } catch {
      setMessage({ kind: 'error', text: 'Error de red' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-3">Franjas horarias</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {availability.time_slots.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/40 text-sm font-mono"
            >
              {s}
              <button
                type="button"
                onClick={() => removeSlot(s)}
                aria-label={`Eliminar ${s}`}
                className="hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-sm"
          />
          <button
            type="button"
            onClick={addSlot}
            className="inline-flex items-center gap-1 h-9 px-3 rounded-md border border-border hover:bg-muted text-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Añadir franja
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Días de la semana bloqueados</h2>
        <div className="flex flex-wrap gap-3">
          {WEEKDAYS.map((w) => (
            <label key={w.value} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={availability.blocked_weekdays.includes(w.value)}
                onChange={() => toggleWeekday(w.value)}
              />
              {w.label}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Fechas bloqueadas</h2>
        <ul className="space-y-1 mb-3">
          {availability.blocked_dates.map((d) => (
            <li key={d} className="flex items-center gap-3 text-sm">
              <span className="font-mono">{d}</span>
              <button
                type="button"
                onClick={() => removeDate(d)}
                aria-label={`Eliminar ${d}`}
                className="hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
          {availability.blocked_dates.length === 0 && (
            <li className="text-sm text-muted-foreground">Sin fechas bloqueadas.</li>
          )}
        </ul>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-sm"
          />
          <button
            type="button"
            onClick={addDate}
            className="inline-flex items-center gap-1 h-9 px-3 rounded-md border border-border hover:bg-muted text-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Bloquear fecha
          </button>
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
