import type { Metadata } from 'next';

const SITE_URL = 'https://cotamadrid.es';

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Cota',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
