'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StepProps } from './wizard';

export function StepPresupuesto({ answers, update, onNext, onBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Tienes un presupuesto en mente?</h2>
        <p className="text-muted-foreground">
          Opcional. Nos ayuda a ser más precisos sobre la viabilidad.
        </p>
      </div>
      <div className="max-w-xs">
        <Label htmlFor="presupuesto">Presupuesto aproximado (€)</Label>
        <Input
          id="presupuesto"
          type="number"
          min={0}
          step={1000}
          value={answers.presupuestoCliente ?? ''}
          onChange={(e) =>
            update({ presupuestoCliente: e.target.value ? Number(e.target.value) : undefined })
          }
          placeholder="Ej: 60000"
          className="mt-2 text-2xl h-14"
        />
        <p className="text-xs text-muted-foreground mt-2">Puedes saltar esta pregunta.</p>
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onNext} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
