import { STRIPE_PRODUCTS } from '@/lib/stripe/config';
import { PriceCard } from '@/components/pricing/price-card';
import { createCheckoutAction } from '@/lib/stripe/actions/create-checkout';

// This version uses hardcoded products instead of database
export default async function SimplePricingPage() {
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
        {STRIPE_PRODUCTS.map((product) => (
          <PriceCard 
            key={product.id} 
            product={product as any} 
            createCheckoutAction={createCheckoutAction}
          />
        ))}
      </div>
    </div>
  );
}