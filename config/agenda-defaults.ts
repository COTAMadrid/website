export const AGENDA_DEFAULTS = {
  time_slots: ['10:00', '12:00', '16:00', '18:00'] as string[],
  blocked_dates: [] as string[], // YYYY-MM-DD strings
  blocked_weekdays: [6] as number[], // 0=Mon, 6=Sun — sundays blocked by default
};

export type AgendaAvailability = {
  time_slots: string[];
  blocked_dates: string[];
  blocked_weekdays: number[];
};
