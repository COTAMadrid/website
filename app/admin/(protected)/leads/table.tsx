'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface LeadRow {
  [key: string]: string;
}

const COLUMNS = [
  'Timestamp',
  'Nombre',
  'Email',
  'Teléfono',
  'Metros',
  'Barrio',
  'Presupuesto cliente',
  'Viabilidad',
];

export function LeadsTable() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [header, setHeader] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads || []);
        setHeader(data.header || []);
        setConfigured(data.configured !== false);
        if (data.error) setError(data.error);
      })
      .catch(() => setError('Error de red'))
      .finally(() => setLoading(false));
  }, []);

  function downloadCsv() {
    if (leads.length === 0 || header.length === 0) return;
    const csv = [
      header.join(','),
      ...leads.map((l) =>
        header.map((h) => `"${(l[h] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Cargando leads...</p>;

  if (!configured) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
        Google Sheets no configurado. Define{' '}
        <code className="font-mono">GOOGLE_SHEETS_ID</code>,{' '}
        <code className="font-mono">GOOGLE_SERVICE_ACCOUNT_EMAIL</code> y{' '}
        <code className="font-mono">GOOGLE_SERVICE_ACCOUNT_KEY</code> para ver
        los leads.
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Error: {error}</p>;
  }

  if (leads.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay leads todavía.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{leads.length} leads</p>
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border hover:bg-muted text-sm"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              {COLUMNS.map((c) => (
                <th key={c} className="px-3 py-2 font-medium text-xs uppercase tracking-wider">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((l, i) => (
              <tr key={i}>
                {COLUMNS.map((c) => (
                  <td key={c} className="px-3 py-2 align-top">
                    {l[c] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
