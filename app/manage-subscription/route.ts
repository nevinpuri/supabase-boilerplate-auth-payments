import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { stripeAdmin } from '@/lib/stripe/stripe-admin';
import { getCustomerId } from '@/lib/stripe/controllers/get-customer-id';
import { getURL } from '@/lib/utils/get-url';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const customerId = await getCustomerId({ userId: user.id });

  if (!customerId) {
    console.error('No Stripe customer found for user:', user.id);
    return redirect('/account?error=no-customer');
  }

  const { url } = await stripeAdmin.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getURL()}account`,
  });

  return redirect(url);
}