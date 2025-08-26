import { stripeAdmin } from '@/lib/stripe/stripe-admin';
import { createClient } from '@/lib/supabase/server';

type Props = {
  subscriptionId: string;
  customerId: string;
  isCreateAction: boolean;
};

export async function upsertUserSubscription({ subscriptionId, customerId, isCreateAction }: Props) {
  const supabase = await createClient();
  
  // Get customer's UUID from mapping table
  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (customerError || !customerData) {
    console.error('Customer not found:', customerId);
    throw new Error(`Customer lookup failed for ${customerId}`);
  }

  const subscription = await stripeAdmin.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });

  const subscriptionData = {
    id: subscription.id,
    user_id: customerData.id,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
    canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at).toISOString() : null,
    current_period_start: toDateTime(subscription.current_period_start).toISOString(),
    current_period_end: toDateTime(subscription.current_period_end).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
    trial_start: subscription.trial_start ? toDateTime(subscription.trial_start).toISOString() : null,
    trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
  };

  const { error } = await supabase.from('subscriptions').upsert([subscriptionData]);

  if (error) {
    console.error('Error upserting subscription:', error);
    throw error;
  }

  console.log(`Subscription ${subscription.id} for user ${customerData.id} upserted successfully`);

  // For new subscriptions, update user billing info
  if (isCreateAction && subscription.default_payment_method) {
    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod;
    
    await supabase
      .from('users')
      .update({
        billing_address: paymentMethod.billing_details.address,
        payment_method: paymentMethod[paymentMethod.type],
      })
      .eq('id', customerData.id);
  }
}

const toDateTime = (secs: number) => {
  const t = new Date('1970-01-01T00:00:00Z');
  t.setSeconds(secs);
  return t;
};