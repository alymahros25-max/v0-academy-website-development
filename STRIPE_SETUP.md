# Stripe Payment Integration - Setup Guide

## Current Status: Prepared but disabled by default

The Stripe infrastructure is prepared for future testing, but **public payment is currently disabled and the checkout button is hidden**. Do not add live keys or enable public checkout until the launch checklist in `MULTI_PROVIDER_PAYMENTS.md` is complete.

To enable the flow later, set both `NEXT_PUBLIC_PAYMENTS_ENABLED=true` and `PAYMENTS_ENABLED=true` in the intended environment, then use test-mode credentials and webhooks first.

---

## What's Already Built

### 1. **Product Catalog** (`lib/products.ts`)
All 6 course packages are configured:

**Quran Memorization (حفظ القرآن الكريم):**
- 4 Sessions: $15
- 8 Sessions: $27
- 12 Sessions: $38

**Arabic Foundation (تأسيس العربي):**
- 4 Sessions: $24
- 8 Sessions: $38
- 12 Sessions: $50

### 2. **Checkout Flow**
- **EmbeddedCheckout Component** (`components/stripe-checkout.tsx`)
  - Beautiful Stripe-hosted checkout
  - Full multilingual support (AR/EN/FR)
  - Automatic locale detection
  - Secure payment processing

- **Checkout Success Page** (`app/checkout-success/page.tsx`)
  - Order confirmation display
  - Order ID and details
  - Payment status tracking

### 3. **Backend Integration**
- **Stripe Server Config** (`lib/stripe.ts`)
  - Price validation to prevent tampering
  - Secure API key management
  
- **Webhook Handler** (`app/api/stripe/webhook/route.ts`)
  - Processes: payment_intent.succeeded, charge.refunded
  - Creates orders in Supabase
  - Handles refunds automatically

- **Database Schema** (`supabase/migrations/009_stripe_payments.sql`)
  - `orders` table - tracks all purchases
  - `invoices` table - stores invoice details
  - Row-level security configured

---

## How to Test (Only after explicit enablement)

The public checkout is intentionally hidden while payments are disabled. The testing steps below apply only after enabling both payment feature flags in a non-production Preview environment and completing the launch checklist in `MULTI_PROVIDER_PAYMENTS.md`.


### Step 1: Use Stripe Test Cards

In the Stripe Sandbox (which is already active), you can test with these cards:

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Exp: 12/25
CVC: 123
```

**Declined Payment:**
```
Card: 4000 0000 0000 0002
Exp: 12/25
CVC: 123
```

**3D Secure (Requires Auth):**
```
Card: 4000 0027 6000 3184
Exp: 12/25
CVC: 123
```

### Step 2: Test the Flow

1. Go to: `https://quran-elhafez.com/quran` (or `/arabic`)
2. Click "اشتري الآن" (Buy Now)
3. Click on any package
4. You'll see Stripe checkout
5. Use test card from above
6. Complete payment
7. You'll be redirected to success page

### Step 3: Check Orders in Dashboard

After each test payment:
- Check `/admin` dashboard
- Orders appear in Supabase
- Payment status shows as "completed" or "refunded"

---

## Next Steps: Going Live (only after test approval)

When you're ready for **real money**:

### 1. Get Production API Keys

From the screenshot you showed, you need to:
- Click "Claim & Add Keys"
- Go to Stripe Dashboard
- In Settings → API Keys, copy:
  - **Publishable Key** (starts with `pk_live_`)
  - **Secret Key** (starts with `sk_live_`)
  - **Webhook Secret** (for webhook endpoint)

### 2. Add to Vercel Environment Variables

In your Vercel project settings:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 3. Add Webhook Endpoint

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint:
   ```
   https://quran-elhafez.com/api/stripe/webhook
   ```
3. Select events:
   - `checkout.session.completed`
   - `charge.refunded`
   - `payment_intent.succeeded`
4. Get the Webhook Secret and add to env vars

### 4. Test with Real Cards

Use your own card to test real payment flow (small amount like $1).

### 5. Verify Payouts

In Stripe Dashboard:
- Payouts section shows money received
- Default: automatic payouts every 2-3 days
- Goes directly to your connected bank account

---

## How Payments Work (Flow Diagram)

```
User clicks "Buy Now"
    ↓
EmbeddedCheckout opens
    ↓
User enters card details (secure, handled by Stripe)
    ↓
Stripe processes payment
    ↓
Webhook triggered → /api/stripe/webhook
    ↓
Order saved to Supabase database
    ↓
User redirected to success page (/checkout-success)
    ↓
Admin sees order in dashboard (/admin)
    ↓
Money appears in your bank account (2-3 days)
```

---

## Security Features

✅ **Server-side price validation** - prevents client-side tampering
✅ **Webhook signature verification** - validates Stripe events
✅ **PCI compliance** - Stripe handles card data securely
✅ **Row-level security** - Supabase RLS on orders
✅ **Error handling** - graceful degradation if services fail
✅ **Build-safe** - no runtime errors on deployment

---

## Troubleshooting

### "Checkout not loading?"
- Make sure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Verify Stripe keys are correct

### "Payment succeeded but no order in database?"
- Check webhook is configured
- Verify `STRIPE_WEBHOOK_SECRET` is set
- Check Supabase connection in webhook logs

### "Can't see test payments?"
- Use test cards (not real cards)
- Check Stripe Dashboard → Events
- Verify webhook endpoint is active

---

## Files Overview

| File | Purpose |
|------|---------|
| `lib/products.ts` | Product catalog with prices |
| `lib/stripe.ts` | Stripe configuration and validation |
| `components/stripe-checkout.tsx` | Checkout UI component |
| `app/actions/stripe.ts` | Server actions for checkout |
| `app/api/stripe/webhook/route.ts` | Webhook event handler |
| `app/checkout-success/page.tsx` | Success page after payment |
| `supabase/migrations/009_stripe_payments.sql` | Database schema |

---

## Support

For Stripe questions: https://stripe.com/docs
For webhook testing: https://stripe.com/docs/webhooks/test

The payment infrastructure is documented and guarded, but it is **not publicly enabled** until the required provider, webhook, database, legal, and operational checks are completed.
