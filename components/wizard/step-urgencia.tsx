'use client';

import { Button } from '@/components/ui/button';
import { URGENCIA_OPTIONS } from '@/config/wizard';
import type { StepProps } from './wizard';

export function StepUrgencia({ answers, update, onNext, onBack, canBack }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿Cuándo te gustaría empezar?</h2>
        <p className="text-muted-foreground">
          Saber tu fecha nos ayuda a priorizar tu caso y a ser realistas con
          los plazos desde el primer día.
        </p>
      </div>
      <div className="grid gap-3">
        {URGENCIA_OPTIONS.map((opt) => {
          const selected = answers.urgencia === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ urgencia: opt.value })}
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
        <Button onClick={onNext} disabled={!answers.urgencia} size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
