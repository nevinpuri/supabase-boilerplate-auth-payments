import { getProducts } from '@/lib/stripe/controllers/get-products';
import { PriceCard } from '@/components/pricing/price-card';
import { createCheckoutAction } from '@/lib/stripe/actions/create-checkout';

export default async function PricingPage() {
  const products = await getProducts();
  
  console.log('Products fetched:', products.length, 'products');
  console.log('Products data:', JSON.stringify(products, null, 2));

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        {products.map((product) => (
          <PriceCard 
            key={product.id} 
            product={product} 
            createCheckoutAction={createCheckoutAction}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">
            No pricing plans available yet. Please check back later.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>To load products:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Run the database migration in Supabase</li>
              <li>Start webhook listener: <code className="bg-gray-100 px-1 rounded">stripe listen --forward-to localhost:3000/api/webhooks</code></li>
              <li>Load fixtures: <code className="bg-gray-100 px-1 rounded">stripe fixtures ./stripe-fixtures.json --api-key sk_test_...</code></li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}