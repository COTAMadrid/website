'use client';

import { useState } from 'react';
import type { Company } from '@/config/company-defaults';

const FIELDS: { key: keyof Company; label: string; type?: string }[] = [
  { key: 'legal_name', label: 'Razón social' },
  { key: 'commercial_name', label: 'Nombre comercial' },
  { key: 'cif', label: 'CIF' },
  { key: 'domicilio', label: 'Domicilio' },
  { key: 'registro_mercantil', label: 'Registro mercantil' },
  { key: 'email_contacto', label: 'Email de contacto', type: 'email' },
  { key: 'email_reclamaciones', label: 'Email reclamaciones', type: 'email' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'last_legal_update', label: 'Última actualización legal', type: 'date' },
];

export function EmpresaEditor({ initial }: { initial: Company }) {
  const [company, setCompany] = useState<Company>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, type }) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <input
              type={type ?? 'text'}
              value={company[key] ?? ''}
              onChange={(e) =>
                setCompany((c) => ({ ...c, [key]: e.target.value }))
              }
              className="h-10 px-3 rounded-md border border-border bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3 sticky bottom-0 bg-background py-3 border-t border-border mt-6">
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
