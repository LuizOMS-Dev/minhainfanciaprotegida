-- Auto-grant admin role to the designated principal administrator on first signup.
-- This way no password is ever stored or transmitted in code.
CREATE OR REPLACE FUNCTION public.handle_admin_bootstrap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = lower('luizotaviomscv@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_admin_bootstrap ON auth.users;
CREATE TRIGGER on_auth_user_admin_bootstrap
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_bootstrap();

-- Make sure the profile-creation trigger is wired (was referenced but not attached)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- updated_at triggers on content tables
DROP TRIGGER IF EXISTS set_updated_at_articles ON public.articles;
CREATE TRIGGER set_updated_at_articles
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_library_items ON public.library_items;
CREATE TRIGGER set_updated_at_library_items
  BEFORE UPDATE ON public.library_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Helpful index for slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS articles_type_slug_uniq
  ON public.articles (type, slug);

CREATE INDEX IF NOT EXISTS articles_published_idx
  ON public.articles (type, status, publish_at DESC);
