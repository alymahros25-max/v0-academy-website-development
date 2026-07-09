-- ============================================================
-- STRIPE PAYMENTS & ORDERS SCHEMA
-- Phase: Payment Processing Integration
-- ============================================================

-- Orders table: Track all purchases
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Stripe identifiers
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  
  -- Product details
  product_id TEXT NOT NULL,
  category TEXT NOT NULL, -- 'quran' or 'arabic'
  sessions INTEGER NOT NULL DEFAULT 0,
  
  -- Payment details
  amount_paid DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Customer info
  customer_email TEXT NOT NULL,
  customer_id TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded, cancelled
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB,
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  CONSTRAINT valid_category CHECK (category IN ('quran', 'arabic'))
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_stripe_session_id_idx ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS orders_stripe_payment_intent_id_idx ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_category_idx ON orders(category);

-- Subscriptions table: Track active subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to order
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Subscription details
  product_id TEXT NOT NULL,
  category TEXT NOT NULL,
  sessions_purchased INTEGER NOT NULL DEFAULT 0,
  sessions_used INTEGER NOT NULL DEFAULT 0,
  
  -- User info
  user_email TEXT NOT NULL,
  
  -- Dates
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_sessions CHECK (sessions_used <= sessions_purchased)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS subscriptions_user_email_idx ON subscriptions(user_email);
CREATE INDEX IF NOT EXISTS subscriptions_order_id_idx ON subscriptions(order_id);
CREATE INDEX IF NOT EXISTS subscriptions_is_active_idx ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS subscriptions_expires_at_idx ON subscriptions(expires_at);

-- Invoices table: Track billing invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to order
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Invoice details
  invoice_number TEXT UNIQUE NOT NULL,
  stripe_invoice_id TEXT UNIQUE,
  
  -- Amount
  total_amount DECIMAL(10, 2) NOT NULL,
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, sent, paid, refunded, void
  
  -- Dates
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Customer
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Metadata
  pdf_url TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS invoices_order_id_idx ON invoices(order_id);
CREATE INDEX IF NOT EXISTS invoices_customer_email_idx ON invoices(customer_email);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_issued_at_idx ON invoices(issued_at DESC);

-- Refunds table: Track refund history
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to order
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Refund details
  stripe_refund_id TEXT UNIQUE NOT NULL,
  reason TEXT,
  
  -- Amount
  amount_refunded DECIMAL(10, 2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, succeeded, failed, cancelled
  
  -- Dates
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS refunds_order_id_idx ON refunds(order_id);
CREATE INDEX IF NOT EXISTS refunds_stripe_refund_id_idx ON refunds(stripe_refund_id);
CREATE INDEX IF NOT EXISTS refunds_status_idx ON refunds(status);

-- Enable RLS (Row Level Security) on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow admin to read all data
CREATE POLICY "admin_read_orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_read_subscriptions" ON subscriptions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_read_invoices" ON invoices
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_read_refunds" ON refunds
  FOR SELECT USING (auth.role() = 'authenticated');

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
