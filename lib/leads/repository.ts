import { appendLeadRow } from './google-sheets';
import { sendLeadEmail } from './smtp';
import type { Lead, LeadRepository } from './types';

export class DefaultLeadRepository implements LeadRepository {
  async save(lead: Lead): Promise<void> {
    // V1: Sheets is the persistent store
    await appendLeadRow(lead);
  }

  async notify(lead: Lead): Promise<void> {
    // V1: Resend email
    await sendLeadEmail(lead);
  }
}

/**
 * Process a lead end-to-end. save() and notify() run in parallel and
 * one failing does NOT block the other — we want both attempts.
 * Errors are aggregated and re-thrown so the API endpoint can log them.
 */
export async function processLead(
  lead: Lead,
  repo: LeadRepository = new DefaultLeadRepository()
): Promise<void> {
  const results = await Promise.allSettled([repo.save(lead), repo.notify(lead)]);
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => r.reason);
  if (errors.length > 0) {
    throw new AggregateError(errors, 'One or more lead destinations failed');
  }
}
