import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-6xl">Cota</h1>
      <p className="text-muted-foreground">Reforma con criterio · Madrid</p>
      <div className="flex gap-3">
        <Button>Empezar diagnóstico</Button>
        <Button variant="outline">Saber más</Button>
      </div>
    </main>
  );
}
