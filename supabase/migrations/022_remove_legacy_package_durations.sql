-- Keep the production catalog aligned with the 30-minute-only offer.
-- This migration is idempotent and does not touch authentication, payments, or users.
DELETE FROM public.packages
WHERE duration IN (40, 60);
