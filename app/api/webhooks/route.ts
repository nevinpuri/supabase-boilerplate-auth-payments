import Stripe from 'stripe';
import { stripeAdmin } from '@/lib/stripe/stripe-admin';
import { upsertProduct } from '@/lib/stripe/controllers/upsert-product';
import { upsertPrice } from '@/lib/stripe/controllers/upsert-price';
import { upsertUserSubscription } from '@/lib/stripe/controllers/upsert-user-subscription';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return Response.json('Webhook secret not configured', { status: 500 });
  }

  let event: Stripe.Event;

  try {
    if (!sig) {
      return Response.json('No signature provided', { status: 400 });
    }
    event = stripeAdmin.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return Response.json(`Webhook Error: ${(error as any).message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProduct(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPrice(event.data.object as Stripe.Price);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          await upsertUserSubscription({
            subscriptionId: subscription.id,
            customerId: subscription.customer as string,
            isCreateAction: false,
          });
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await upsertUserSubscription({
              subscriptionId: subscriptionId as string,
              customerId: checkoutSession.customer as string,
              isCreateAction: true,
            });
          }
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return Response.json('Webhook handler failed. View your nextjs function logs.', {
        status: 400,
      });
    }
  }
  
  return Response.json({ received: true });
}