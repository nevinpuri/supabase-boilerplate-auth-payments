import { createAdminClient } from '@/lib/supabase/admin';
import { stripeAdmin } from '@/lib/stripe/stripe-admin';

type Props = {
  userId: string;
};

export async function getCustomerId({ userId }: Props) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle(); // Use maybeSingle to avoid error when no rows found

  if (error) {
    console.error('Error fetching customer:', error);
    return null;
  }

  if (!data || !data.stripe_customer_id) {
    // Try to find customer in Stripe by metadata
    console.log('No customer mapping found, searching Stripe for user:', userId);
    
    const customers = await stripeAdmin.customers.list({
      limit: 100,
    });
    
    const customer = customers.data.find(c => 
      c.metadata?.supabaseUserId === userId ||
      c.email === userId // Sometimes user ID might be stored differently
    );
    
    if (customer) {
      console.log('Found customer in Stripe, creating mapping:', customer.id);
      // Create the mapping
      await supabase
        .from('customers')
        .upsert([{ id: userId, stripe_customer_id: customer.id }]);
      
      return customer.id;
    }
    
    console.log('No Stripe customer found for user:', userId);
    return null;
  }

  return data.stripe_customer_id;
}