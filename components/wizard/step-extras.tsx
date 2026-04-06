'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { StepProps } from './wizard';

const EXTRAS = [
  { key: 'sinAscensor', label: 'Edificio sin ascensor', help: 'Subir material y bajar escombro a mano.' },
  { key: 'edificioProtegido', label: 'Edificio protegido o catalogado', help: 'Patrimonio puede requerir trámites adicionales.' },
  { key: 'zonaBajasEmisiones', label: 'Dentro de Madrid Central / ZBE', help: 'Restricciones de acceso para vehículos.' },
] as const;

export function StepExtras({ answers, update, onNext, onBack, canBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Algo más que debamos saber?</h2>
        <p className="text-muted-foreground">Marca lo que aplique. Puedes saltar este paso.</p>
      </div>
      <div className="space-y-4">
        {EXTRAS.map(({ key, label, help }) => (
          <label
            key={key}
            className="flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer min-h-[44px]"
          >
            <Checkbox
              checked={answers.extras?.[key] ?? false}
              onCheckedChange={(c) => update({ extras: { [key]: !!c } })}
              className="mt-1"
            />
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-sm text-muted-foreground">{help}</div>
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        {canBack ? (
          <Button variant="ghost" onClick={onBack}>
            Atrás
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onNext} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
