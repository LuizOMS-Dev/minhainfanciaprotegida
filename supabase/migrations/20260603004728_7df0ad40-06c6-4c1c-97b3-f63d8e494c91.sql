-- Lock down search_path on definer functions and revoke broad EXECUTE
ALTER FUNCTION public.has_role(UUID, app_role) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.set_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
-- has_role remains callable by authenticated (needed by RLS expressions) and by RLS internal use