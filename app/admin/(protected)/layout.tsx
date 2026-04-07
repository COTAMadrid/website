import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoutButton } from './logout-button';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <aside className="md:w-64 md:min-h-screen border-b md:border-b-0 md:border-r border-border p-4 md:p-6 bg-muted/30">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Cota</p>
          <p className="font-semibold text-lg">Admin</p>
        </div>
        <nav className="flex md:flex-col gap-2 text-sm md:h-[calc(100vh-8rem)]">
          <Link
            href="/admin/chatbot"
            className="px-3 py-2 rounded-md hover:bg-muted transition"
          >
            Chatbot
          </Link>
          <div className="md:mt-auto">
            <LogoutButton />
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
