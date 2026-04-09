'use client';

import { useEffect, useMemo, useState } from 'react';
import { LeadDrawer } from './drawer';

interface LeadRow {
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
}

interface LeadStatus {
  id: string;
  label: string;
  color: string;
  position: number;
}

const QUALITY_LABEL = { alto: 'Alto', medio: 'Medio', bajo: 'Bajo' } as const;
const QUALITY_COLOR = {
  alto: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  medio: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  bajo: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
} as const;

const PRESUPUESTO_LABEL: Record<string, string> = {
  'menos-40': '< 40k',
  '40-80': '40-80k',
  '80-150': '80-150k',
  '150-mas': '> 150k',
  'no-se': '?',
};

const URGENCIA_LABEL: Record<string, string> = {
  'este-mes': 'Este mes',
  '1-3-meses': '1-3m',
  '3-6-meses': '3-6m',
  'sin-fecha': 'Sin fecha',
};

export function LeadsTable() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [statuses, setStatuses] = useState<LeadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [qualityFilter, setQualityFilter] = useState<string>('');
  const [sinceFilter, setSinceFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (qualityFilter) params.set('quality', qualityFilter);
    if (sinceFilter) params.set('since', sinceFilter);
    if (search) params.set('q', search);
    fetch('/api/admin/leads?' + params.toString())
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads ?? []);
        setStatuses(data.statuses ?? []);
        setConfigured(data.configured !== false);
        setError(data.error ?? null);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, qualityFilter, sinceFilter]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const statusById = useMemo(
    () => new Map(statuses.map((s) => [s.id, s])),
    [statuses]
  );

  if (!configured) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
        Base de datos no configurada. Define <code>POSTGRES_URL</code> y
        ejecuta el init en <code>/admin/db</code>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email, barrio…"
          className="h-9 flex-1 min-w-[200px] rounded-md border border-border bg-background px-3 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
        >
          <option value="">Todos los estados</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={qualityFilter}
          onChange={(e) => setQualityFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
        >
          <option value="">Toda calidad</option>
          <option value="alto">Score alto</option>
          <option value="medio">Score medio</option>
          <option value="bajo">Score bajo</option>
        </select>
        <select
          value={sinceFilter}
          onChange={(e) => setSinceFilter(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
        >
          <option value="">Cualquier fecha</option>
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">Error: {error}</p>}

      {!loading && leads.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No hay leads que coincidan.</p>
      )}

      {leads.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-3 py-2 font-medium">Fecha</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Nombre</th>
                <th className="px-3 py-2 font-medium">Tipo</th>
                <th className="px-3 py-2 font-medium">m²</th>
                <th className="px-3 py-2 font-medium">Barrio</th>
                <th className="px-3 py-2 font-medium">€ rango</th>
                <th className="px-3 py-2 font-medium">Urgencia</th>
                <th className="px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((l) => {
                const st = l.status_id ? statusById.get(l.status_id) : undefined;
                return (
                  <tr
                    key={l.id}
                    onClick={() => setOpenId(l.id)}
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-3 py-2 align-top tabular-nums whitespace-nowrap text-muted-foreground">
                      {new Date(l.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">
                      {l.score_quality && (
                        <span
                          className={
                            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono ' +
                            QUALITY_COLOR[l.score_quality]
                          }
                        >
                          {QUALITY_LABEL[l.score_quality]} · {l.score_value}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium">{l.nombre}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {l.telefono}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">
                      {l.tipo}
                    </td>
                    <td className="px-3 py-2 align-top tabular-nums">
                      {l.metros}
                    </td>
                    <td className="px-3 py-2 align-top">{l.barrio}</td>
                    <td className="px-3 py-2 align-top whitespace-nowrap tabular-nums">
                      {l.presupuesto_rango
                        ? PRESUPUESTO_LABEL[l.presupuesto_rango]
                        : ''}
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">
                      {l.urgencia ? URGENCIA_LABEL[l.urgencia] : ''}
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">
                      {st && (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono"
                          style={{
                            backgroundColor: st.color + '22',
                            color: st.color,
                          }}
                        >
                          <span
                            className="inline-block size-1.5 rounded-full"
                            style={{ backgroundColor: st.color }}
                          />
                          {st.label}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {openId && (
        <LeadDrawer
          id={openId}
          statuses={statuses}
          onClose={() => setOpenId(null)}
          onChanged={load}
        />
      )}
    </div>
  );
}
