<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- **Stripe Integration** - Complete payment processing and subscription management
  - Subscription plans with Stripe Checkout
  - Customer portal for subscription management
  - Webhook handling for real-time updates
  - Product and pricing synchronization
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[INSERT STRIPE PUBLISHABLE KEY]
   STRIPE_SECRET_KEY=[INSERT STRIPE SECRET KEY]
   STRIPE_WEBHOOK_SECRET=[INSERT STRIPE WEBHOOK SECRET]
   
   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)
   
   Stripe keys can be found in your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Stripe Payment Integration Setup

This boilerplate includes a complete Stripe integration for payments and subscriptions.

### Setting up Stripe

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com) and create an account
   - Switch to Test mode for development

2. **Configure Customer Portal**
   - Go to [Customer Portal Settings](https://dashboard.stripe.com/test/settings/billing/portal)
   - Click the `Activate test link` button
   - Configure the portal settings as needed

3. **Run Database Migrations**
   ```bash
   # Run the migration to create Stripe-related tables
   # You'll need the Supabase CLI installed
   supabase migration up
   ```

4. **Set up Stripe Products**
   
   Option 1: Using Stripe Fixtures (Recommended)
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe
   
   # Run the fixture to create sample products
   stripe fixtures ./stripe-fixtures.json --api-key YOUR_STRIPE_SECRET_KEY
   ```
   
   Option 2: Manual Setup
   - Create products and prices in your [Stripe Dashboard](https://dashboard.stripe.com/test/products)
   - Products will sync automatically via webhooks

5. **Configure Stripe Webhook**
   
   For local development:
   ```bash
   # Forward webhooks to your local server
   stripe listen --forward-to localhost:3000/api/webhooks
   ```
   
   For production:
   - Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
   - Add endpoint: `https://your-domain.com/api/webhooks`
   - Select events:
     - `product.created`
     - `product.updated`
     - `price.created`
     - `price.updated`
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET` env var

### Available Pages

- `/pricing` - Display all available pricing plans
- `/account` - View current subscription and account details
- `/manage-subscription` - Redirect to Stripe Customer Portal

### Testing Payments

Use these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires auth**: 4000 0025 0000 3155

Fill any valid future date for expiry and any 3 digits for CVC.

### Customizing Products

Edit `stripe-fixtures.json` to customize your products and pricing. The metadata field supports:
- `index`: Display order
- `popular`: Mark as popular ("true")
- `features`: Comma-separated list of features

### Production Checklist

- [ ] Activate your Stripe account
- [ ] Switch from Test to Live mode in Stripe
- [ ] Update all environment variables with production keys
- [ ] Configure production webhook endpoint
- [ ] Run fixtures with production API key
- [ ] Test the complete payment flow

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
