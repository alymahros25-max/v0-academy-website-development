-- Keep the production catalog aligned with the 30-minute-only offer.
-- This migration is idempotent and does not touch authentication, payments, or users.
DELETE FROM public.packages
WHERE duration IN (40, 60);

DELETE FROM public.area_packages
WHERE package_key ~ '-(40|60)-'
   OR name_ar ~ '(40|60) دقيقة'
   OR name_en ~ '(40|60)';
