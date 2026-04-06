'use client';

import { Button } from '@/components/ui/button';
import { CALIDAD_OPTIONS } from '@/config/wizard';
import type { StepProps } from './wizard';

export function StepCalidad({ answers, update, onNext, onBack, canBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Qué nivel de acabados buscas?</h2>
        <p className="text-muted-foreground">Marca el rango de inversión.</p>
      </div>
      <div className="grid gap-3">
        {CALIDAD_OPTIONS.map((opt) => {
          const selected = answers.calidad === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ calidad: opt.value })}
              className={`text-left p-5 rounded-lg border transition-colors min-h-[44px] ${
                selected
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="font-medium">{opt.label}</div>
              {opt.description && (
                <div className="text-sm text-muted-foreground mt-1">{opt.description}</div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between">
        {canBack ? (
          <Button variant="ghost" onClick={onBack}>
            Atrás
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onNext} disabled={!answers.calidad} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
