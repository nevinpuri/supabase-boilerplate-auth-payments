// Script to fix customer mapping for existing subscriptions
// Run with: node scripts/fix-customer-mapping.js

const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

async function fixCustomerMapping() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  console.log('Fetching all subscriptions from database...');
  
  // Get all subscriptions
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*');
  
  if (error) {
    console.error('Error fetching subscriptions:', error);
    return;
  }
  
  console.log(`Found ${subscriptions?.length || 0} subscriptions`);
  
  // For each subscription, ensure customer mapping exists
  for (const sub of subscriptions || []) {
    console.log(`\nChecking subscription ${sub.id} for user ${sub.user_id}`);
    
    // Check if customer mapping exists
    const { data: existingMapping } = await supabase
      .from('customers')
      .select('*')
      .eq('id', sub.user_id)
      .maybeSingle();
    
    if (!existingMapping) {
      console.log('No mapping found, fetching from Stripe...');
      
      // Get subscription from Stripe
      const stripeSub = await stripe.subscriptions.retrieve(sub.id);
      const customerId = stripeSub.customer;
      
      console.log(`Creating mapping: user ${sub.user_id} -> customer ${customerId}`);
      
      // Create mapping
      const { error: insertError } = await supabase
        .from('customers')
        .insert([{ 
          id: sub.user_id, 
          stripe_customer_id: customerId 
        }]);
      
      if (insertError) {
        console.error('Error creating mapping:', insertError);
      } else {
        console.log('Mapping created successfully!');
      }
    } else {
      console.log('Mapping already exists:', existingMapping.stripe_customer_id);
    }
  }
  
  console.log('\n✅ Done!');
}

// Check for required env vars
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

fixCustomerMapping().catch(console.error);