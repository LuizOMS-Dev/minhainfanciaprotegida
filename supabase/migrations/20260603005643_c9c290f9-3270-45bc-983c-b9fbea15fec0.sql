-- Revoke direct EXECUTE on SECURITY DEFINER functions that are only meant
-- to be invoked by triggers / privileged server code.
REVOKE EXECUTE ON FUNCTION public.handle_admin_bootstrap() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
