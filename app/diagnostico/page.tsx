import { Wizard } from '@/components/wizard/wizard';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Diagnóstico gratuito de tu reforma · Cota',
  description:
    'Analiza tu reforma en menos de 1 minuto: precio, duración, riesgos y viabilidad.',
  path: '/diagnostico',
});

export default function Page() {
  return <Wizard />;
}
