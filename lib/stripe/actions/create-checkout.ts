'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { stripeAdmin } from '@/lib/stripe/stripe-admin';
import { getOrCreateCustomer } from '@/lib/stripe/controllers/get-or-create-customer';
import { getURL } from '@/lib/utils/get-url';

export async function createCheckoutAction(formData: FormData) {
  const priceId = formData.get('priceId') as string;
  
  if (!priceId) {
    throw new Error('Price ID is required');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  if (!user.email) {
    throw new Error('User email is required');
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateCustomer({
    userId: user.id,
    email: user.email,
  });

  // Get price details to determine mode
  const price = await stripeAdmin.prices.retrieve(priceId);

  // Create checkout session
  const checkoutSession = await stripeAdmin.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    customer: customerId,
    customer_update: {
      address: 'auto',
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: price.type === 'recurring' ? 'subscription' : 'payment',
    allow_promotion_codes: true,
    success_url: `${getURL()}account?success=true`,
    cancel_url: `${getURL()}pricing?canceled=true`,
  });

  if (!checkoutSession.url) {
    throw new Error('Failed to create checkout session');
  }

  redirect(checkoutSession.url);
}