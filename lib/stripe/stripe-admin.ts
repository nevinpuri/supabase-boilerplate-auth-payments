import Stripe from 'stripe';

export const stripeAdmin = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  appInfo: {
    name: 'Supabase Boilerplate',
    version: '1.0.0',
  },
});