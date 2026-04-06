'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StepProps } from './wizard';

export function StepContacto({ answers, update, onNext, onBack }: StepProps) {
  const [touched, setTouched] = useState(false);
  const c = answers.contacto ?? { nombre: '', email: '', telefono: '' };
  const valid =
    c.nombre.length >= 2 &&
    /\S+@\S+\.\S+/.test(c.email) &&
    c.telefono.replace(/\D/g, '').length >= 9;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl mb-2">¿A quién enviamos el informe?</h2>
        <p className="text-muted-foreground">
          Solo lo usamos para contactarte sobre tu reforma. No enviamos publicidad.
        </p>
      </div>
      <div className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={c.nombre}
            onChange={(e) => update({ contacto: { ...c, nombre: e.target.value } })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={c.email}
            onChange={(e) => update({ contacto: { ...c, email: e.target.value } })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="tel"
            value={c.telefono}
            onChange={(e) => update({ contacto: { ...c, telefono: e.target.value } })}
            className="mt-2"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Al enviar aceptas nuestra{' '}
          <a href="/politica-privacidad" className="underline">
            política de privacidad
          </a>
          .
        </p>
      </div>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Atrás
        </Button>
        <Button
          onClick={() => {
            setTouched(true);
            if (valid) onNext();
          }}
          disabled={touched && !valid}
          size="lg"
        >
          Ver mi informe
        </Button>
      </div>
    </div>
  );
}
