// Script to sync existing Stripe products to your database
// Run with: node scripts/sync-stripe-products.js

const Stripe = require('stripe');

async function syncProducts() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  console.log('Fetching products from Stripe...');
  
  // Fetch all products
  const products = await stripe.products.list({
    active: true,
    limit: 100,
  });
  
  console.log(`Found ${products.data.length} products`);
  
  // Fetch all prices
  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
  });
  
  console.log(`Found ${prices.data.length} prices`);
  
  // Trigger webhook events for each product
  for (const product of products.data) {
    console.log(`Syncing product: ${product.name}`);
    
    // Update the product to trigger a webhook
    await stripe.products.update(product.id, {
      metadata: {
        ...product.metadata,
        last_synced: new Date().toISOString(),
      }
    });
  }
  
  // Trigger webhook events for each price
  for (const price of prices.data) {
    console.log(`Syncing price: ${price.id} (${price.unit_amount/100} ${price.currency})`);
    
    // Update the price metadata to trigger a webhook
    await stripe.prices.update(price.id, {
      metadata: {
        ...price.metadata,
        last_synced: new Date().toISOString(),
      }
    });
  }
  
  console.log('Sync triggered! Check your webhook logs.');
}

syncProducts().catch(console.error);