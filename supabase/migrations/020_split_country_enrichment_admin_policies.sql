-- =============================================================================
-- 020: Split Country Content Enrichment admin policies by write operation
-- Prevents the admin policy from overlapping the public SELECT policy.
-- =============================================================================

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['area_themes', 'area_cities', 'area_timezones'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'Admins can manage ' || table_name, table_name);

    EXECUTE format($policy$
      CREATE POLICY %I ON %I FOR INSERT TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.admin_users au
          WHERE lower(au.email) = lower((SELECT auth.jwt()) ->> 'email')
        )
      )
    $policy$, 'Admins can insert ' || table_name, table_name);

    EXECUTE format($policy$
      CREATE POLICY %I ON %I FOR UPDATE TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.admin_users au
          WHERE lower(au.email) = lower((SELECT auth.jwt()) ->> 'email')
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.admin_users au
          WHERE lower(au.email) = lower((SELECT auth.jwt()) ->> 'email')
        )
      )
    $policy$, 'Admins can update ' || table_name, table_name);

    EXECUTE format($policy$
      CREATE POLICY %I ON %I FOR DELETE TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.admin_users au
          WHERE lower(au.email) = lower((SELECT auth.jwt()) ->> 'email')
        )
      )
    $policy$, 'Admins can delete ' || table_name, table_name);
  END LOOP;
END $$;
