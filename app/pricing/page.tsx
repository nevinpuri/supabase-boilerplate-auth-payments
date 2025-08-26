import { getProducts } from '@/lib/stripe/controllers/get-products';
import { PriceCard } from '@/components/pricing/price-card';
import { createCheckoutAction } from '@/lib/stripe/actions/create-checkout';

export default async function PricingPage() {
  const products = await getProducts();

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
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No pricing plans available yet. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}