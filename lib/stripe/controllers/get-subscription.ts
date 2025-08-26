import { createClient } from '@/lib/supabase/server';

export async function getSubscription(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', userId)
    .in('status', ['trialing', 'active'])
    .order('created', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}