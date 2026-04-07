'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

/**
 * Self-contained inline calendar. Does NOT book anything — captures a
 * desired date + time slot and stashes it into sessionStorage under
 * `cota-prefill-meeting` so downstream forms can prefill.
 */

const WEEK_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const TIME_SLOTS = ['10:00', '12:00', '16:00', '18:00'];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function ymd(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function todayYMD() {
  const now = new Date();
  return ymd(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Monday-first offset: JS getUTCDay is 0=Sun..6=Sat, we want 0=Mon..6=Sun */
function mondayOffset(jsDay: number) {
  return (jsDay + 6) % 7;
}

export function AgendaCalendar() {
  const now = useMemo(() => new Date(), []);
  const currentMonthStart = useMemo(
    () => new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)),
    [now]
  );

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const today = todayYMD();

  // Build 42-cell grid
  const cells = useMemo(() => {
    const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1));
    const offset = mondayOffset(firstOfMonth.getUTCDay());
    const gridStart = new Date(Date.UTC(viewYear, viewMonth, 1 - offset));
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(
        Date.UTC(
          gridStart.getUTCFullYear(),
          gridStart.getUTCMonth(),
          gridStart.getUTCDate() + i
        )
      );
      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth(),
        day: d.getUTCDate(),
        iso: ymd(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
        inMonth: d.getUTCMonth() === viewMonth,
      };
    });
  }, [viewYear, viewMonth]);

  const monthLabel = useMemo(() => {
    const label = new Date(
      Date.UTC(viewYear, viewMonth, 1)
    ).toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [viewYear, viewMonth]);

  const canGoPrev =
    viewYear > currentMonthStart.getUTCFullYear() ||
    (viewYear === currentMonthStart.getUTCFullYear() &&
      viewMonth > currentMonthStart.getUTCMonth());

  function goPrev() {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNext() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleConfirm() {
    if (!selectedDate || !selectedTime) return;
    try {
      sessionStorage.setItem(
        'cota-prefill-meeting',
        JSON.stringify({ date: selectedDate, time: selectedTime })
      );
    } catch {
      /* sessionStorage unavailable — still flip UI */
    }
    setConfirmed(true);
  }

  function handleModify() {
    setConfirmed(false);
  }

  if (confirmed && selectedDate && selectedTime) {
    return (
      <div className="relative isolate bg-[oklch(0.18_0.022_168)] border border-accent/30 rounded-xl p-6 shadow-editorial">
        <div className="absolute inset-0 -z-10 rounded-xl bg-background" />
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent/20 text-accent ring-1 ring-accent/40">
            <Check className="size-6" strokeWidth={2} />
          </div>
          <p className="max-w-xs font-serif text-lg leading-snug text-foreground">
            Reserva registrada · {selectedDate} {selectedTime}
          </p>
          <p className="text-xs text-foreground/65">
            Te contactaremos para confirmar
          </p>
          <button
            type="button"
            onClick={handleModify}
            className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-accent underline-offset-4 hover:underline"
          >
            Modificar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate bg-[oklch(0.18_0.022_168)] border border-accent/30 rounded-xl p-6 shadow-editorial">
      {/* Solid opaque cover so the global blueprint background never leaks
          through and the calendar reads as a real card */}
      <div aria-hidden className="absolute inset-0 -z-10 rounded-xl bg-background" />
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Mes anterior"
          className="flex size-9 items-center justify-center rounded-md border border-border/60 text-foreground/80 transition-colors hover:bg-accent/15 hover:text-accent hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-foreground/80 disabled:hover:border-border/60"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        <div className="font-serif text-xl tracking-tight text-foreground">{monthLabel}</div>
        <button
          type="button"
          onClick={goNext}
          aria-label="Mes siguiente"
          className="flex size-9 items-center justify-center rounded-md border border-border/60 text-foreground/80 transition-colors hover:bg-accent/15 hover:text-accent hover:border-accent/40"
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="mb-2 grid grid-cols-7 gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/65">
        {WEEK_LABELS.map((l) => (
          <div key={l} className="flex h-7 items-center justify-center">
            {l}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          const isPast = c.iso < today;
          const isToday = c.iso === today;
          const isSelected = c.iso === selectedDate;
          const disabled = isPast || !c.inMonth;

          const base =
            'flex h-9 items-center justify-center rounded text-sm transition-colors';
          let cls = base;
          if (!c.inMonth) {
            cls += ' text-muted-foreground/30';
          } else if (isPast) {
            cls += ' text-muted-foreground/40 cursor-not-allowed';
          } else if (isSelected) {
            cls += ' bg-accent text-accent-foreground font-medium';
          } else if (isToday) {
            cls += ' ring-2 ring-accent text-foreground hover:bg-accent/10';
          } else {
            cls += ' text-foreground hover:bg-accent/10';
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                setSelectedDate(c.iso);
                setSelectedTime(null);
              }}
              className={cls}
              aria-label={c.iso}
              aria-pressed={isSelected}
            >
              {c.day}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="mt-6">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Franja horaria
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => {
            const enabled = !!selectedDate;
            const active = slot === selectedTime;
            return (
              <button
                key={slot}
                type="button"
                disabled={!enabled}
                onClick={() => setSelectedTime(slot)}
                className={
                  'rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] transition-colors ' +
                  (active
                    ? 'border-accent bg-accent text-accent-foreground'
                    : enabled
                      ? 'border-border text-foreground hover:border-accent hover:text-accent'
                      : 'border-border/50 text-muted-foreground/40 cursor-not-allowed')
                }
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="cota-numlink w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="idx">07</span>
          <span>Confirmar reserva</span>
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Te enviaremos confirmación por email
        </p>
      </div>
    </div>
  );
}
