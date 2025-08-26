// Script to add display metadata to your Lead Score product
// Run with: node scripts/update-product-metadata.js

const Stripe = require('stripe');

async function updateProductMetadata() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  // Your Lead Score product ID (you'll need to get this from Stripe Dashboard)
  // Go to the product page and copy the ID from the URL or page
  const PRODUCT_ID = 'prod_YOUR_PRODUCT_ID'; // Replace with actual product ID
  
  // Update product with display metadata
  await stripe.products.update(PRODUCT_ID, {
    metadata: {
      index: '0', // Display order
      popular: 'true', // Mark the $149 tier as popular if you want
    }
  });
  
  // Update each price with tier names and features
  const priceTiers = [
    {
      id: 'price_1RfuawEYKoP5olgOciEei8kF', // $49
      metadata: {
        tier_name: 'Starter',
        features: 'Up to 100 leads/month, Basic scoring, Email support, 1 user'
      }
    },
    {
      id: 'price_1RgDmwEYKoP5olgOyEpa4mTm', // $149
      metadata: {
        tier_name: 'Professional',
        features: 'Up to 1000 leads/month, Advanced scoring, Priority support, 5 users, API access',
        popular: 'true'
      }
    },
    {
      id: 'price_1RgDn6EYKoP5olgOnvN1tQ70', // $399
      metadata: {
        tier_name: 'Enterprise',
        features: 'Unlimited leads, Custom scoring models, Dedicated support, Unlimited users, Custom integrations'
      }
    }
  ];
  
  for (const tier of priceTiers) {
    console.log(`Updating price ${tier.id} with metadata...`);
    await stripe.prices.update(tier.id, {
      metadata: tier.metadata
    });
  }
  
  console.log('Metadata updated! The webhook should sync these changes.');
}

updateProductMetadata().catch(console.error);