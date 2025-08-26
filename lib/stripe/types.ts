export type Product = {
  id: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Record<string, any>;
};

export type Price = {
  id: string;
  product_id?: string;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: 'one_time' | 'recurring';
  interval?: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  trial_period_days?: number;
  metadata?: Record<string, any>;
};

export type ProductWithPrices = Product & {
  prices: Price[];
};

export type Subscription = {
  id: string;
  user_id: string;
  status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid' | 'paused';
  metadata?: Record<string, any>;
  price_id?: string;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
};