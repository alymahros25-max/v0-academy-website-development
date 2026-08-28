-- ============================================================
-- MULTI-PROVIDER PAYMENT SETTINGS & STUDENT ENROLLMENTS
-- Phase: Flexible Payment Gateway Architecture
-- ============================================================

-- Payment Settings: Store configuration for all 3 providers (Stripe, Paddle, PayTabs)
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Provider identification
  provider_name TEXT NOT NULL UNIQUE, -- 'stripe', 'paddle', 'paytabs'
  
  -- API credentials (encrypted by Supabase)
  api_key TEXT NOT NULL DEFAULT '',
  secret_key TEXT,
  merchant_id TEXT,
  vendor_id TEXT, -- Paddle specific
  
  -- Webhook configuration
  webhook_secret TEXT,
  webhook_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT FALSE, -- Only one provider should be active
  
  -- Configuration metadata
  currency TEXT DEFAULT 'USD',
  min_amount DECIMAL(10, 2) DEFAULT 1.00,
  max_amount DECIMAL(10, 2) DEFAULT 99999.99,
  
  -- Support info
  support_email TEXT,
  support_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_verified_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_provider CHECK (provider_name IN ('stripe', 'paddle', 'paytabs')),
  CONSTRAINT valid_amount_range CHECK (min_amount < max_amount)
);

-- Create unique index: Only one provider can be active at a time
CREATE UNIQUE INDEX IF NOT EXISTS payment_settings_active_provider_idx 
  ON payment_settings(((is_active = true)))
  WHERE is_active = true;

-- Create indexes
CREATE INDEX IF NOT EXISTS payment_settings_provider_idx ON payment_settings(provider_name);
CREATE INDEX IF NOT EXISTS payment_settings_active_idx ON payment_settings(is_active);
CREATE INDEX IF NOT EXISTS payment_settings_updated_at_idx ON payment_settings(updated_at DESC);

-- Student Enrollments: Track course subscriptions for each student
CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Order reference
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  
  -- Student identification (email-based, no user account required)
  student_email TEXT NOT NULL,
  student_name TEXT,
  
  -- Course details
  course_category TEXT NOT NULL, -- 'quran' or 'arabic'
  product_id TEXT NOT NULL,
  
  -- Sessions tracking
  total_sessions INTEGER NOT NULL,
  sessions_used INTEGER NOT NULL DEFAULT 0,
  
  -- Payment provider
  payment_provider TEXT NOT NULL DEFAULT 'paddle', -- 'stripe', 'paddle', 'paytabs'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'refunded'
  
  -- Enrollment dates
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_sessions CHECK (sessions_used <= total_sessions),
  CONSTRAINT valid_category CHECK (course_category IN ('quran', 'arabic'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS enrollments_student_email_idx ON student_enrollments(student_email);
CREATE INDEX IF NOT EXISTS enrollments_order_id_idx ON student_enrollments(order_id);
CREATE INDEX IF NOT EXISTS enrollments_course_category_idx ON student_enrollments(course_category);
CREATE INDEX IF NOT EXISTS enrollments_is_active_idx ON student_enrollments(is_active);
CREATE INDEX IF NOT EXISTS enrollments_expires_at_idx ON student_enrollments(expires_at);
CREATE INDEX IF NOT EXISTS enrollments_payment_provider_idx ON student_enrollments(payment_provider);

-- Update orders table to include payment_provider column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'stripe';

ALTER TABLE orders 
ADD CONSTRAINT valid_payment_provider CHECK (payment_provider IN ('stripe', 'paddle', 'paytabs'));

-- Enable RLS on new tables
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only authenticated users can read (admin panel)
CREATE POLICY "admin_read_payment_settings" ON payment_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_update_payment_settings" ON payment_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "admin_read_enrollments" ON student_enrollments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_update_enrollments" ON student_enrollments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Trigger: Update updated_at timestamp for payment_settings
CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update updated_at timestamp for enrollments
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON student_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initialize Paddle as the default active provider (empty keys for now, admin fills them)
INSERT INTO payment_settings (provider_name, is_active)
VALUES 
  ('paddle', true),
  ('stripe', false),
  ('paytabs', false)
ON CONFLICT (provider_name) DO NOTHING;

-- Grant permissions
GRANT SELECT, UPDATE ON payment_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE ON student_enrollments TO authenticated;
