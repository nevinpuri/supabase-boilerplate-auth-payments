-- Manual insert for your Lead Score product
-- Run this in your Supabase SQL Editor after running the migration

-- Insert the Lead Score product
INSERT INTO products (id, active, name, description, metadata) 
VALUES (
  'prod_leadscore', -- You can get the actual product ID from Stripe Dashboard
  true,
  'Lead Score',
  'Advanced lead scoring and management system',
  '{"index": "0"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  active = EXCLUDED.active,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- Insert the three pricing tiers
INSERT INTO prices (id, product_id, active, unit_amount, currency, type, interval, interval_count, metadata) 
VALUES 
  -- $49/month tier
  (
    'price_1RfuawEYKoP5olgOciEei8kF',
    'prod_leadscore',
    true,
    4900, -- in cents
    'usd',
    'recurring',
    'month',
    1,
    '{"tier": "starter", "features": "Up to 100 leads/month, Basic scoring, Email support"}'::jsonb
  ),
  -- $149/month tier
  (
    'price_1RgDmwEYKoP5olgOyEpa4mTm',
    'prod_leadscore',
    true,
    14900, -- in cents
    'usd',
    'recurring',
    'month',
    1,
    '{"tier": "professional", "popular": "true", "features": "Up to 1000 leads/month, Advanced scoring, Priority support, API access"}'::jsonb
  ),
  -- $399/month tier
  (
    'price_1RgDn6EYKoP5olgOnvN1tQ70',
    'prod_leadscore',
    true,
    39900, -- in cents
    'usd',
    'recurring',
    'month',
    1,
    '{"tier": "enterprise", "features": "Unlimited leads, Custom scoring models, Dedicated support, Custom integrations"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  active = EXCLUDED.active,
  unit_amount = EXCLUDED.unit_amount,
  metadata = EXCLUDED.metadata;