// Hardcoded Stripe configuration
// This approach skips the database entirely for product display

export const STRIPE_PRODUCTS = [
  {
    id: 'lead-score-starter',
    name: 'Lead Score Starter',
    description: 'Perfect for small teams getting started',
    metadata: {
      features: ['Up to 100 leads/month', 'Basic scoring algorithm', 'Email support', '1 user account']
    },
    prices: [{
      id: 'price_1RfuawEYKoP5olgOciEei8kF', // Your actual Stripe price ID
      unit_amount: 4900,
      currency: 'usd',
      type: 'recurring' as const,
      interval: 'month' as const,
      active: true
    }]
  },
  {
    id: 'lead-score-pro',
    name: 'Lead Score Professional',
    description: 'Best for growing teams',
    metadata: {
      popular: true,
      features: ['Up to 1,000 leads/month', 'Advanced scoring', 'Priority support', '5 user accounts', 'API access']
    },
    prices: [{
      id: 'price_1RgDmwEYKoP5olgOyEpa4mTm', // Your actual Stripe price ID
      unit_amount: 14900,
      currency: 'usd',
      type: 'recurring' as const,
      interval: 'month' as const,
      active: true
    }]
  },
  {
    id: 'lead-score-enterprise',
    name: 'Lead Score Enterprise',
    description: 'For large organizations',
    metadata: {
      features: ['Unlimited leads', 'Custom scoring models', 'Dedicated support', 'Unlimited users', 'Custom integrations', 'SLA guarantee']
    },
    prices: [{
      id: 'price_1RgDn6EYKoP5olgOnvN1tQ70', // Your actual Stripe price ID
      unit_amount: 39900,
      currency: 'usd',
      type: 'recurring' as const,
      interval: 'month' as const,
      active: true
    }]
  }
];