import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StatusesEditor } from './editor';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="size-3" />
          Volver a leads
        </Link>
        <h1 className="text-2xl font-semibold">Estados de leads</h1>
        <p className="text-sm text-muted-foreground">
          Personaliza los estados que usas para clasificar tus leads. El estado
          &quot;Nuevo&quot; es obligatorio y no puede borrarse.
        </p>
      </header>
      <StatusesEditor />
    </div>
  );
}
