import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/marketing/footer';
import { CookieBanner } from '@/components/cookie-banner';
import { WhatsAppFloating } from '@/components/whatsapp-floating';
import { ChatBubble } from '@/components/chatbot/chat-bubble';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cotamadrid.com'),
  title: 'Cota — Reforma con criterio · Madrid',
  description:
    'Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
        <WhatsAppFloating />
        <ChatBubble />
      </body>
    </html>
  );
}
