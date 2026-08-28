-- Harden payment data access to the explicit admin allow-list.
-- The admin_users table remains empty until an owner-approved admin email is added.

DO $$
DECLARE
  table_name text;
  policy_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['orders', 'subscriptions', 'invoices', 'refunds', 'payment_settings', 'student_enrollments'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;

  FOREACH policy_name IN ARRAY ARRAY[
    'admin_read_orders', 'admin_read_subscriptions', 'admin_read_invoices', 'admin_read_refunds',
    'admin_read_payment_settings', 'admin_update_payment_settings',
    'admin_read_enrollments', 'admin_update_enrollments'
  ] LOOP
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', policy_name);
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.subscriptions', policy_name);
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.invoices', policy_name);
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.refunds', policy_name);
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.payment_settings', policy_name);
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.student_enrollments', policy_name);
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
  END LOOP;
END $$;

CREATE POLICY admin_read_orders ON public.orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
CREATE POLICY admin_read_subscriptions ON public.subscriptions
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
CREATE POLICY admin_read_invoices ON public.invoices
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
CREATE POLICY admin_read_refunds ON public.refunds
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
CREATE POLICY admin_read_payment_settings ON public.payment_settings
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
CREATE POLICY admin_update_payment_settings ON public.payment_settings
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
CREATE POLICY admin_read_enrollments ON public.student_enrollments
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
CREATE POLICY admin_update_enrollments ON public.student_enrollments
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.email = auth.jwt() ->> 'email'));
