'use client';

import { Button } from '@/components/ui/button';
import { ANTIGUEDAD_OPTIONS } from '@/config/wizard';
import type { StepProps } from './wizard';

export function StepAntiguedad({ answers, update, onNext, onBack, canBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Cuándo se construyó el edificio?</h2>
        <p className="text-muted-foreground">La antigüedad nos dice qué problemas pueden aparecer.</p>
      </div>
      <div className="grid gap-3">
        {ANTIGUEDAD_OPTIONS.map((opt) => {
          const selected = answers.antiguedad === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ antiguedad: opt.value })}
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
        <Button onClick={onNext} disabled={!answers.antiguedad} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
