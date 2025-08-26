import { createClient } from '@/lib/supabase/server';

type Props = {
  userId: string;
};

export async function getCustomerId({ userId }: Props) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching customer:', error);
    return null;
  }

  return data.stripe_customer_id;
}