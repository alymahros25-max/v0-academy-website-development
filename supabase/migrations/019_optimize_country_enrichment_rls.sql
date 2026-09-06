-- =============================================================================
-- 019: Optimize admin RLS policies for Country Content Enrichment tables
-- Limits this performance fix to the three tables introduced in migration 018.
-- =============================================================================

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['area_themes', 'area_cities', 'area_timezones'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'Admins can manage ' || table_name, table_name);
    EXECUTE format($policy$
      CREATE POLICY %I ON %I FOR ALL
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
    $policy$, 'Admins can manage ' || table_name, table_name);
  END LOOP;
END $$;
