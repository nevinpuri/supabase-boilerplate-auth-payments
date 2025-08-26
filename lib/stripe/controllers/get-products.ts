import { createClient } from '@/lib/supabase/server';
import { ProductWithPrices } from '@/lib/stripe/types';

export async function getProducts(): Promise<ProductWithPrices[]> {
  try {
    const supabase = await createClient();

    // First, let's check if the products table exists
    const { data, error } = await supabase
      .from('products')
      .select('*, prices(*)')
      .eq('active', true)
      .eq('prices.active', true)
      .order('metadata->index')
      .order('unit_amount', { referencedTable: 'prices' });

    if (error) {
      console.error('Error fetching products:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Check if it's a table doesn't exist error
      if (error.code === '42P01') {
        console.error('Products table does not exist. Please run the database migration.');
      }
      
      return [];
    }

    console.log('Successfully fetched products:', data?.length || 0);
    
    // Filter out products without prices
    const productsWithPrices = (data ?? []).filter(product => 
      product.prices && product.prices.length > 0
    );
    
    return productsWithPrices;
  } catch (error) {
    console.error('Unexpected error in getProducts:', error);
    return [];
  }
}