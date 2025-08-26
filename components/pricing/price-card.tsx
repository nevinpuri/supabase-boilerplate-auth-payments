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

  const features = product.metadata?.features 
    ? (typeof product.metadata.features === 'string' 
        ? product.metadata.features.split(',') 
        : product.metadata.features)
    : [];

  const isPopular = product.metadata?.popular === 'true';

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
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
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