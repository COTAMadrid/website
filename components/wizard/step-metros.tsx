'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StepProps } from './wizard';

export function StepMetros({ answers, update, onNext, onBack, canBack }: StepProps) {
  const valid =
    typeof answers.metros === 'number' && answers.metros >= 15 && answers.metros <= 1000;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Cuántos metros tiene el piso?</h2>
        <p className="text-muted-foreground">Superficie útil aproximada.</p>
      </div>
      <div className="max-w-xs">
        <Label htmlFor="metros">Metros cuadrados</Label>
        <Input
          id="metros"
          type="number"
          min={15}
          max={1000}
          value={answers.metros ?? ''}
          onChange={(e) => update({ metros: Number(e.target.value) || undefined })}
          placeholder="Ej: 80"
          className="mt-2 text-2xl h-14"
          autoFocus
        />
      </div>
      <div className="flex justify-between">
        {canBack ? (
          <Button variant="ghost" onClick={onBack}>
            Atrás
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onNext} disabled={!valid} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
