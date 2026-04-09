'use client';

import { useEffect, useState } from 'react';
import { X, Mail, Phone, MessageCircle, Send } from 'lucide-react';

interface Status {
  id: string;
  label: string;
  color: string;
  position: number;
}

interface Note {
  id: number;
  body: string;
  author: string | null;
  created_at: string;
}

interface LeadFull {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string;
  localidad: string | null;
  resumen: string | null;
  tipo: string | null;
  metros: number | null;
  barrio: string | null;
  presupuesto_rango: string | null;
  urgencia: string | null;
  score_value: number | null;
  score_quality: 'alto' | 'medio' | 'bajo' | null;
  status_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  diagnosis: {
    estimate: { min: number; max: number; central: number };
    duration: { weeksMin: number; weeksMax: number };
    risks: { id: string; title: string; description: string; severity: string }[];
    viability: { level: string; microcopy: string };
    answers: Record<string, unknown>;
  };
}

const QUALITY_LABEL = { alto: 'Lead caliente', medio: 'Lead templado', bajo: 'Lead frío' } as const;
const QUALITY_COLOR = {
  alto: 'text-emerald-600',
  medio: 'text-amber-600',
  bajo: 'text-rose-600',
} as const;

const fmtEur = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export function LeadDrawer({
  id,
  statuses,
  onClose,
  onChanged,
}: {
  id: string;
  statuses: Status[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [lead, setLead] = useState<LeadFull | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteBody, setNoteBody] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/leads/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data.lead);
        setNotes(data.notes ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  async function changeStatus(statusId: string) {
    if (!lead) return;
    setSavingStatus(true);
    await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ statusId }),
    });
    setLead({ ...lead, status_id: statusId });
    setSavingStatus(false);
    onChanged();
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteBody.trim()) return;
    const res = await fetch(`/api/admin/leads/${id}/notes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body: noteBody }),
    });
    const data = await res.json();
    setNotes(data.notes ?? []);
    setNoteBody('');
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="fixed right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-background shadow-2xl border-l border-border"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
              Lead · {id.slice(0, 8)}
            </div>
            <h2 className="text-lg font-semibold mt-0.5">
              {lead?.nombre ?? '…'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md p-2 hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </header>

        {loading && <div className="p-6 text-sm text-muted-foreground">Cargando…</div>}

        {lead && (
          <div className="p-6 space-y-6">
            {/* Score + status */}
            <div className="flex flex-wrap items-center gap-3">
              {lead.score_quality && (
                <div className={'font-semibold ' + QUALITY_COLOR[lead.score_quality]}>
                  {QUALITY_LABEL[lead.score_quality]} · {lead.score_value}/100
                </div>
              )}
              <select
                value={lead.status_id ?? ''}
                onChange={(e) => changeStatus(e.target.value)}
                disabled={savingStatus}
                className="h-9 rounded-md border border-border bg-background px-2 text-sm"
              >
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact actions */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <a
                href={`tel:${lead.telefono}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border h-10 px-3 text-sm hover:bg-muted"
              >
                <Phone className="size-4" />
                {lead.telefono}
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border h-10 px-3 text-sm hover:bg-muted"
              >
                <Mail className="size-4" />
                Email
              </a>
              <a
                href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${lead.nombre.split(' ')[0]}, te escribo de Cota Madrid sobre tu diagnóstico de reforma.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border h-10 px-3 text-sm hover:bg-muted"
              >
                <MessageCircle className="size-4" />
                WhatsApp
              </a>
            </div>

            {/* Resumen del cliente */}
            {lead.resumen && (
              <section>
                <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-2">
                  Lo que cuenta el cliente
                </h3>
                <div className="rounded-md border border-accent/30 bg-accent/5 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                  {lead.resumen}
                </div>
              </section>
            )}

            {/* Datos rápidos */}
            <section className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Field label="Email" value={lead.email} />
              <Field label="Localidad" value={lead.localidad} />
              <Field label="Tipo" value={lead.tipo} />
              <Field label="Metros" value={lead.metros ? `${lead.metros} m²` : null} />
              <Field label="Barrio" value={lead.barrio} />
              <Field label="Presup. cliente" value={lead.presupuesto_rango} />
              <Field label="Urgencia" value={lead.urgencia} />
            </section>

            {/* Diagnóstico */}
            <section>
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-2">
                Diagnóstico
              </h3>
              <div className="rounded-md border border-border p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rango estimado</span>
                  <span className="font-semibold tabular-nums">
                    {fmtEur(lead.diagnosis.estimate.min)} – {fmtEur(lead.diagnosis.estimate.max)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración</span>
                  <span className="tabular-nums">
                    {lead.diagnosis.duration.weeksMin}–{lead.diagnosis.duration.weeksMax} semanas
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viabilidad</span>
                  <span className="uppercase font-mono text-xs">{lead.diagnosis.viability.level}</span>
                </div>
                {lead.diagnosis.risks.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <div className="text-muted-foreground mb-1 text-xs">Riesgos detectados</div>
                    <ul className="space-y-1 text-xs">
                      {lead.diagnosis.risks.map((r) => (
                        <li key={r.id}>
                          <span className="font-medium">{r.title}</span> — {r.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* UTMs */}
            {(lead.utm_source || lead.referrer) && (
              <section>
                <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-2">
                  Origen
                </h3>
                <div className="rounded-md border border-border p-4 text-xs grid grid-cols-2 gap-2">
                  {lead.utm_source && <div>source: <span className="font-mono">{lead.utm_source}</span></div>}
                  {lead.utm_medium && <div>medium: <span className="font-mono">{lead.utm_medium}</span></div>}
                  {lead.utm_campaign && <div>campaign: <span className="font-mono">{lead.utm_campaign}</span></div>}
                  {lead.referrer && <div className="col-span-2">ref: <span className="font-mono break-all">{lead.referrer}</span></div>}
                </div>
              </section>
            )}

            {/* Notas internas */}
            <section>
              <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono mb-2">
                Notas internas
              </h3>
              <form onSubmit={addNote} className="flex items-start gap-2 mb-3">
                <textarea
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  rows={2}
                  placeholder="Llamé a las 11h, no contesta…"
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent/60"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-foreground text-background h-9 px-3 text-sm hover:opacity-90"
                >
                  <Send className="size-4" />
                </button>
              </form>
              <ul className="space-y-3">
                {notes.length === 0 && (
                  <li className="text-xs text-muted-foreground">Sin notas todavía.</li>
                )}
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className="rounded-md border border-border bg-card/30 p-3 text-sm"
                  >
                    <div className="text-[10px] text-muted-foreground font-mono mb-1">
                      {new Date(n.created_at).toLocaleString('es-ES')}
                      {n.author ? ` · ${n.author}` : ''}
                    </div>
                    <div className="whitespace-pre-wrap">{n.body}</div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
        {label}
      </div>
      <div className="mt-0.5">{value || <span className="text-muted-foreground">—</span>}</div>
    </div>
  );
}
