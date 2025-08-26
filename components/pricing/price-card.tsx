'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductWithPrices, Price } from '@/lib/stripe/types';
import { Check } from 'lucide-react';

type PriceCardProps = {
  product: ProductWithPrices;
  price?: Price;
  createCheckoutAction?: (data: FormData) => void;
};

export function PriceCard({ product, price, createCheckoutAction }: PriceCardProps) {
  const selectedPrice = price || product.prices[0];
  
  if (!selectedPrice) {
    return null;
  }

  // Determine tier name based on price
  const getTierName = (amount: number) => {
    if (amount === 4900) return 'Starter';
    if (amount === 14900) return 'Professional';
    if (amount === 39900) return 'Enterprise';
    return product.name;
  };

  const getTierDescription = (amount: number) => {
    if (amount === 4900) return 'Perfect for individuals getting started';
    if (amount === 14900) return 'Best for growing teams';
    if (amount === 39900) return 'For large organizations';
    return product.description;
  };

  const getTierFeatures = (amount: number) => {
    if (amount === 4900) return ['Up to 100 leads/month', 'Basic scoring', 'Email support', '1 user'];
    if (amount === 14900) return ['Up to 1,000 leads/month', 'Advanced scoring', 'Priority support', '5 users', 'API access'];
    if (amount === 39900) return ['Unlimited leads', 'Custom scoring models', 'Dedicated support', 'Unlimited users', 'Custom integrations'];
    return [];
  };

  const features = getTierFeatures(selectedPrice.unit_amount || 0);
  const isPopular = selectedPrice.unit_amount === 14900; // Make Professional tier popular

  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 text-sm rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle>{getTierName(selectedPrice.unit_amount || 0)}</CardTitle>
        <CardDescription>{getTierDescription(selectedPrice.unit_amount || 0)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">
            ${selectedPrice.unit_amount ? (selectedPrice.unit_amount / 100).toFixed(0) : '0'}
          </span>
          {selectedPrice.type === 'recurring' && (
            <span className="text-muted-foreground">
              /{selectedPrice.interval}
            </span>
          )}
        </div>
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">{feature.trim()}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        {createCheckoutAction && (
          <form action={createCheckoutAction} className="w-full">
            <input type="hidden" name="priceId" value={selectedPrice.id} />
            <Button 
              type="submit" 
              className="w-full"
              variant={isPopular ? 'default' : 'outline'}
            >
              Get Started
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
}