import Link from 'next/link';
import { Settings2 } from 'lucide-react';
import { LeadsTable } from './table';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="max-w-7xl">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Leads recibidos</h1>
          <p className="text-sm text-muted-foreground">
            Bandeja de entrada de diagnósticos. Filtra, marca el estado y deja
            notas internas por cada conversación.
          </p>
        </div>
        <Link
          href="/admin/leads/estados"
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border hover:bg-muted text-sm shrink-0"
        >
          <Settings2 className="h-4 w-4" />
          Estados
        </Link>
      </header>
      <LeadsTable />
    </div>
  );
}
