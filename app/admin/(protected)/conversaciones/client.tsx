'use client';

import { useEffect, useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface ConvRow {
  id: string;
  created_at: string;
  updated_at: string;
  visitor_id: string | null;
  page_path: string | null;
  lead_id: string | null;
  message_count: number;
  last_message_preview: string | null;
}

interface MsgRow {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  provider_used: string | null;
  created_at: string;
}

export function ConversacionesClient() {
  const [list, setList] = useState<ConvRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [openConv, setOpenConv] = useState<ConvRow | null>(null);
  const [openMsgs, setOpenMsgs] = useState<MsgRow[]>([]);
  const [openLoading, setOpenLoading] = useState(false);

  function load() {
    fetch('/api/admin/conversations')
      .then((r) => r.json())
      .then((d) => setList(d.conversations ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!openId) return;
    setOpenLoading(true);
    fetch(`/api/admin/conversations/${openId}`)
      .then((r) => r.json())
      .then((d) => {
        setOpenConv(d.conversation);
        setOpenMsgs(d.messages ?? []);
      })
      .finally(() => setOpenLoading(false));
  }, [openId]);

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  if (list.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay conversaciones registradas.
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 text-[10px] uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2 font-medium">Última actividad</th>
              <th className="px-3 py-2 font-medium">Mensajes</th>
              <th className="px-3 py-2 font-medium">Página</th>
              <th className="px-3 py-2 font-medium">Lead vinculado</th>
              <th className="px-3 py-2 font-medium">Última frase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((c) => (
              <tr
                key={c.id}
                onClick={() => setOpenId(c.id)}
                className="cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <td className="px-3 py-2 align-top tabular-nums whitespace-nowrap text-muted-foreground">
                  {new Date(c.updated_at).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-3 py-2 align-top tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="size-3 text-muted-foreground" />
                    {c.message_count}
                  </span>
                </td>
                <td className="px-3 py-2 align-top font-mono text-[10px] text-muted-foreground">
                  {c.page_path ?? '—'}
                </td>
                <td className="px-3 py-2 align-top">
                  {c.lead_id ? (
                    <span className="font-mono text-[10px] text-emerald-600">
                      {c.lead_id.slice(0, 8)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2 align-top text-foreground/75 truncate max-w-[300px]">
                  {c.last_message_preview ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openId && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpenId(null)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-background shadow-2xl border-l border-border"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 py-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                  Conversación · {openId.slice(0, 8)}
                </div>
                <h2 className="text-lg font-semibold mt-0.5">
                  {openConv?.page_path ?? 'Lucia'}
                </h2>
              </div>
              <button
                onClick={() => setOpenId(null)}
                aria-label="Cerrar"
                className="rounded-md p-2 hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </header>

            {openLoading && <p className="p-6 text-sm text-muted-foreground">Cargando…</p>}

            {!openLoading && (
              <div className="p-6 space-y-3">
                {openMsgs.map((m) => (
                  <div
                    key={m.id}
                    className={
                      'rounded-lg p-3 text-sm whitespace-pre-wrap ' +
                      (m.role === 'user'
                        ? 'bg-accent/15 border border-accent/30 ml-8'
                        : 'bg-muted/40 border border-border mr-8')
                    }
                  >
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mb-1">
                      {m.role === 'user' ? 'Cliente' : 'Lucia'} ·{' '}
                      {new Date(m.created_at).toLocaleString('es-ES')}
                      {m.provider_used && ` · ${m.provider_used}`}
                    </div>
                    {m.content}
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
