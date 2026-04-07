import Link from 'next/link';
import {
  Building2,
  Calculator,
  Calendar,
  Users,
  MessageSquare,
  Database,
} from 'lucide-react';
import { isDbConfigured } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

const CARDS = [
  {
    href: '/admin/empresa',
    title: 'Empresa',
    desc: 'Datos legales, contacto, dirección y redes sociales.',
    Icon: Building2,
  },
  {
    href: '/admin/precios',
    title: 'Precios',
    desc: 'Tarifas €/m², factores por barrio, antigüedad, plazo y extras.',
    Icon: Calculator,
  },
  {
    href: '/admin/agenda',
    title: 'Agenda',
    desc: 'Franjas horarias, días bloqueados y semanales no disponibles.',
    Icon: Calendar,
  },
  {
    href: '/admin/leads',
    title: 'Leads',
    desc: 'Solicitudes recibidas (Google Sheets) con exportación CSV.',
    Icon: Users,
  },
  {
    href: '/admin/chatbot',
    title: 'Chatbot',
    desc: 'System prompt, base de conocimiento y proveedores IA.',
    Icon: MessageSquare,
  },
  {
    href: '/admin/db',
    title: 'Base de datos',
    desc: 'Inicializar el esquema en Vercel Postgres.',
    Icon: Database,
  },
];

export default function AdminDashboard() {
  const dbReady = isDbConfigured();
  return (
    <div className="max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Panel de administración</h1>
        <p className="text-sm text-muted-foreground">
          Bienvenido al backoffice de Cota Madrid.
        </p>
      </header>
      {!dbReady && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
          Base de datos no configurada — define{' '}
          <code className="font-mono">POSTGRES_URL</code> para activar la
          edición. La web sigue funcionando con valores por defecto.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ href, title, desc, Icon }) => (
          <Link
            key={href}
            href={href}
            className="border border-border rounded-lg p-4 hover:bg-muted/40 transition flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-accent" />
              <h2 className="font-semibold">{title}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
