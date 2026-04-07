import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/marketing/footer';
import { CookieBanner } from '@/components/cookie-banner';
import { WhatsAppFloating } from '@/components/whatsapp-floating';
import { ChatBubble } from '@/components/chatbot/chat-bubble';
import { getCompany } from '@/lib/db/repositories/company';

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

const SITE_URL = 'https://cotamadrid.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cota Madrid · Reforma con criterio',
    template: '%s · Cota Madrid',
  },
  description:
    'Cota es la consultoría premium de reformas integrales en Madrid. Diagnóstico gratuito en 60 segundos: precio orientativo, plazos y riesgos.',
  keywords: [
    'reforma piso madrid',
    'reforma integral madrid',
    'consultoría reforma',
    'presupuesto reforma madrid',
    'cocina baño reforma',
  ],
  authors: [{ name: 'PCH Obras' }],
  creator: 'PCH Obras',
  publisher: 'PCH Obras',
  category: 'business',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: SITE_URL,
    siteName: 'Cota Madrid',
    title: 'Cota Madrid · Reforma con criterio',
    description:
      'Consultoría premium de reformas integrales en Madrid. Diagnóstico gratuito en 60 segundos: precio orientativo, plazos y riesgos.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Cota Madrid · Reforma con criterio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cota Madrid · Reforma con criterio',
    description:
      'Consultoría premium de reformas integrales en Madrid. Diagnóstico gratuito en 60 segundos.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: '[PLACEHOLDER: google-site-verification]',
    yandex: '[PLACEHOLDER: yandex-verification]',
  },
  icons: {
    icon: '/images/cota/logo-cota.png',
    apple: '/images/cota/logo-cota.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompany();
  const JSON_LD = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: company.legal_name,
        alternateName: `${company.commercial_name} Madrid`,
        url: SITE_URL,
        logo: `${SITE_URL}/images/cota/logo-cota.png`,
        email: company.email_contacto || undefined,
        telephone: company.telefono || undefined,
        description:
          'Consultoría premium de reformas integrales en Madrid operando bajo la marca comercial Cota.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.domicilio || undefined,
          addressLocality: 'Madrid',
          addressRegion: 'Madrid',
          addressCountry: 'ES',
        },
      },
      {
        '@type': 'GeneralContractor',
        '@id': `${SITE_URL}/#localbusiness`,
        name: `${company.commercial_name} Madrid`,
        image: `${SITE_URL}/opengraph-image`,
        url: SITE_URL,
        priceRange: '€€€',
        telephone: company.telefono || undefined,
        email: company.email_contacto || undefined,
        description:
          'Reformas integrales, cocinas y baños en Madrid. Diagnóstico online gratuito y presupuesto tras visita técnica.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: company.domicilio || undefined,
          addressLocality: 'Madrid',
          addressRegion: 'Madrid',
          addressCountry: 'ES',
        },
        areaServed: {
          '@type': 'City',
          name: 'Madrid',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${company.commercial_name} Madrid`,
        inLanguage: 'es-ES',
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <div className="flex-1">{children}</div>
        <Footer />
        <CookieBanner />
        <WhatsAppFloating />
        <ChatBubble />
      </body>
    </html>
  );
}
