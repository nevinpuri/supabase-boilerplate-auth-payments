import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function upsertPrice(price: Stripe.Price) {
  const supabase = createAdminClient();
  
  const priceData = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : price.product.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type === 'recurring' ? 'recurring' : 'one_time',
    unit_amount: price.unit_amount ?? 0,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const { error } = await supabase.from('prices').upsert([priceData]);

  if (error) {
    console.error('Error upserting price:', error);
    throw error;
  }

  console.log(`Price ${price.id} upserted successfully`);
}