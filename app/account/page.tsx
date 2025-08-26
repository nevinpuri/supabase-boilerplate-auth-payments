import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getSubscription } from '@/lib/stripe/controllers/get-subscription';
import { getProducts } from '@/lib/stripe/controllers/get-products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductWithPrices, Price } from '@/lib/stripe/types';

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const subscription = await getSubscription(user.id);
  const products = await getProducts();

  let userProduct: ProductWithPrices | undefined;
  let userPrice: Price | undefined;

  if (subscription) {
    for (const product of products) {
      for (const price of product.prices) {
        if (price.id === subscription.price_id) {
          userProduct = product;
          userPrice = price;
        }
      }
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-8">
      <h1 className="text-3xl font-bold">Account</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscription && userProduct && userPrice ? (
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-lg">{userProduct.name}</p>
                <p className="text-muted-foreground">{userProduct.description}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  ${userPrice.unit_amount ? (userPrice.unit_amount / 100).toFixed(2) : '0'}
                </span>
                {userPrice.type === 'recurring' && (
                  <span className="text-muted-foreground">
                    /{userPrice.interval}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Status: <span className="font-medium capitalize">{subscription.status}</span>
              </div>
              {subscription.current_period_end && (
                <div className="text-sm text-muted-foreground">
                  {subscription.cancel_at_period_end 
                    ? `Cancels on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                    : `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  }
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You don't have an active subscription
              </p>
              <Button asChild>
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          )}
        </CardContent>
        {subscription && (
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/manage-subscription">Manage Subscription</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}