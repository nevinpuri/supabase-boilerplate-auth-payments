import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function upsertProduct(product: Stripe.Product) {
  const supabase = createAdminClient();
  
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabase.from('products').upsert([productData]);

  if (error) {
    console.error('Error upserting product:', error);
    throw error;
  }

  console.log(`Product ${product.id} upserted successfully`);
}