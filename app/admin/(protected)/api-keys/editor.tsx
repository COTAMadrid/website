'use client';

import { useEffect, useState } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
  Zap,
  Pencil,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';

interface ProviderRow {
  id: string;
  name: string;
  envVar: string;
  docsUrl: string;
  status: 'configured' | 'env-var' | 'none';
  last_4: string | null;
  updated_at: string | null;
}

type Toast = { kind: 'ok' | 'error'; text: string } | null;

export function ApiKeysEditor() {
  const [rows, setRows] = useState<ProviderRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProviderRow | null>(null);
  const [deleting, setDeleting] = useState<ProviderRow | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  async function load() {
    setLoadError(null);
    try {
      const res = await fetch('/api/admin/api-keys', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data.error ?? 'Error al cargar');
        setRows([]);
        return;
      }
      setRows(data.providers ?? []);
    } catch {
      setLoadError('Error de red');
      setRows([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(t: Toast) {
    setToast(t);
    if (t) setTimeout(() => setToast(null), 5000);
  }

  async function runTest(p: ProviderRow) {
    setTestingId(p.id);
    try {
      const res = await fetch(`/api/admin/api-keys/${p.id}/test`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.ok) {
        showToast({ kind: 'ok', text: `${p.name}: clave válida` });
      } else {
        showToast({
          kind: 'error',
          text: `${p.name}: ${data.error ?? 'error desconocido'}`,
        });
      }
    } catch {
      showToast({ kind: 'error', text: `${p.name}: error de red` });
    } finally {
      setTestingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {loadError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Proveedor</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Últimos 4</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">
                Actualizada
              </th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows === null && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  Cargando...
                </td>
              </tr>
            )}
            {rows?.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <a
                        href={p.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        {p.envVar}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {p.last_4 ? `••••${p.last_4}` : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {p.updated_at
                    ? new Date(p.updated_at).toLocaleString('es-ES')
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      className="inline-flex items-center gap-1 h-8 px-2 rounded-md hover:bg-muted text-xs"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => runTest(p)}
                      disabled={testingId === p.id || p.status === 'none'}
                      className="inline-flex items-center gap-1 h-8 px-2 rounded-md hover:bg-muted text-xs disabled:opacity-40"
                      title="Probar"
                    >
                      {testingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Zap className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">Probar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(p)}
                      disabled={p.status !== 'configured'}
                      className="inline-flex items-center gap-1 h-8 px-2 rounded-md hover:bg-destructive/10 text-destructive text-xs disabled:opacity-40"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows?.length === 0 && !loadError && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  No hay proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 right-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg flex items-center gap-2 ${
            toast.kind === 'ok'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-200'
              : 'bg-red-50 border-red-300 text-red-900 dark:bg-red-950/60 dark:border-red-800 dark:text-red-200'
          }`}
        >
          {toast.kind === 'ok' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {toast.text}
        </div>
      )}

      {editing && (
        <EditModal
          provider={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            showToast({ kind: 'ok', text: 'Clave guardada' });
            await load();
          }}
          onError={(msg) => showToast({ kind: 'error', text: msg })}
        />
      )}

      {deleting && (
        <DeleteModal
          provider={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={async () => {
            setDeleting(null);
            showToast({ kind: 'ok', text: 'Clave eliminada' });
            await load();
          }}
          onError={(msg) => showToast({ kind: 'error', text: msg })}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ProviderRow['status'] }) {
  if (status === 'configured') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Configurada
      </span>
    );
  }
  if (status === 'env-var') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Variable entorno
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground border border-border">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
      No configurada
    </span>
  );
}

function EditModal({
  provider,
  onClose,
  onSaved,
  onError,
}: {
  provider: ProviderRow;
  onClose: () => void;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!value.trim()) {
      onError('Introduce una clave');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/api-keys/${provider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: value.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? 'Error al guardar');
        setSaving(false);
        return;
      }
      onSaved();
    } catch {
      onError('Error de red');
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-1">Editar {provider.name}</h2>
        <p className="text-xs text-muted-foreground mb-4">
          El valor actual nunca se muestra. Para cambiarlo, introduce uno nuevo.
        </p>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Nueva API key</span>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Pega aquí la nueva API key"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              className="h-10 w-full px-3 pr-10 rounded-md border border-border bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring/50 font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? 'Ocultar' : 'Mostrar'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-md border border-border text-sm hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  provider,
  onClose,
  onDeleted,
  onError,
}: {
  provider: ProviderRow;
  onClose: () => void;
  onDeleted: () => void;
  onError: (msg: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  async function confirm() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/api-keys/${provider.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? 'Error al eliminar');
        setDeleting(false);
        return;
      }
      onDeleted();
    } catch {
      onError('Error de red');
      setDeleting(false);
    }
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-2">
          Eliminar clave de {provider.name}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Se borrará el valor encriptado de la base de datos. Esta acción no se
          puede deshacer. Si existe la variable de entorno{' '}
          <code className="font-mono text-xs">{provider.envVar}</code>, el
          chatbot volverá a usarla automáticamente.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-md border border-border text-sm hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={deleting}
            className="h-10 px-4 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/80 disabled:opacity-50"
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
