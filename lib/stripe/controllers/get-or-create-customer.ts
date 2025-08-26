import { stripeAdmin } from '@/lib/stripe/stripe-admin';
import { createAdminClient } from '@/lib/supabase/admin';

type Props = {
  userId: string;
  email: string;
};

export async function getOrCreateCustomer({ userId, email }: Props) {
  const supabase = createAdminClient();
  
  // Check if customer exists
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripeAdmin.customers.create({
    email,
    metadata: {
      supabaseUserId: userId,
    },
  });

  // Store customer ID mapping
  const { error } = await supabase
    .from('customers')
    .upsert([{ id: userId, stripe_customer_id: customer.id }]);

  if (error) {
    console.error('Error storing customer mapping:', error);
    throw error;
  }

  return customer.id;
}