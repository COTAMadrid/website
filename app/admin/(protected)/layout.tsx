import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoutButton } from './logout-button';
import {
  LayoutDashboard,
  Building2,
  Calculator,
  Calendar,
  Users,
  MessageSquare,
  Database,
  KeyRound,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/empresa', label: 'Empresa', Icon: Building2 },
  { href: '/admin/precios', label: 'Precios', Icon: Calculator },
  { href: '/admin/agenda', label: 'Agenda', Icon: Calendar },
  { href: '/admin/leads', label: 'Leads', Icon: Users },
  { href: '/admin/conversaciones', label: 'Conversaciones', Icon: MessageSquare },
  { href: '/admin/chatbot', label: 'Chatbot', Icon: MessageSquare },
  { href: '/admin/api-keys', label: 'API Keys', Icon: KeyRound },
  { href: '/admin/db', label: 'Base de datos', Icon: Database },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <aside className="md:w-64 md:min-h-screen border-b md:border-b-0 md:border-r border-border p-4 md:p-6 bg-muted/30">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Cota</p>
          <p className="font-semibold text-lg">Admin</p>
        </div>
        <nav className="flex md:flex-col gap-1 text-sm md:h-[calc(100vh-8rem)] flex-wrap">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-md hover:bg-muted transition flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
          <div className="md:mt-auto pt-4">
            <LogoutButton />
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
