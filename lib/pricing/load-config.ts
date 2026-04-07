import { getPricingConfig, type PricingConfig } from '@/lib/db/repositories/pricing';

export async function loadPricingConfig(): Promise<PricingConfig> {
  return getPricingConfig();
}
