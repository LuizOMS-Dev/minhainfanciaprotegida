-- Remove hardcoded admin email from trigger to avoid PII in source control.
-- First-admin bootstrapping now uses the claimFirstAdmin server function.
DROP TRIGGER IF EXISTS on_auth_user_admin_bootstrap ON auth.users;
DROP FUNCTION IF EXISTS public.handle_admin_bootstrap();