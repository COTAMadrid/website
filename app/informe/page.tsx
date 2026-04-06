import { Informe } from '@/components/informe/informe';
import { pageMeta } from '@/lib/seo';

export const metadata = {
  ...pageMeta({
    title: 'Tu informe — Cota',
    description: 'Resultado personalizado de tu diagnóstico.',
    path: '/informe',
  }),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Informe />;
}
