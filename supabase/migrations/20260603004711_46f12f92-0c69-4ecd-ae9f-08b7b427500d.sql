-- Roles enum and user_roles table (separate from profiles to avoid privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'revisor');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT UPDATE, INSERT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Article types and status enums
CREATE TYPE public.article_type AS ENUM ('news', 'case', 'risk', 'guide');
CREATE TYPE public.article_status AS ENUM ('draft', 'review', 'scheduled', 'published', 'archived');

-- Articles (notícias, casos, riscos, guias)
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type article_type NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  body TEXT,
  cover_url TEXT,
  primary_source_label TEXT,
  primary_source_url TEXT,
  status article_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  last_verified_at DATE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX articles_type_status_idx ON public.articles (type, status, publish_at DESC);
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are public" ON public.articles FOR SELECT
  USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "Editors can view all articles" ON public.articles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'revisor'));
CREATE POLICY "Editors can insert articles" ON public.articles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Editors can update articles" ON public.articles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins can delete articles" ON public.articles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Article complementary sources
CREATE TABLE public.article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.article_sources TO anon, authenticated;
GRANT ALL ON public.article_sources TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.article_sources TO authenticated;
ALTER TABLE public.article_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sources are public" ON public.article_sources FOR SELECT USING (true);
CREATE POLICY "Editors manage sources" ON public.article_sources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Library items
CREATE TABLE public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  audience TEXT NOT NULL,
  source_org TEXT NOT NULL,
  year INT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER library_items_updated_at BEFORE UPDATE ON public.library_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
GRANT SELECT ON public.library_items TO anon, authenticated;
GRANT ALL ON public.library_items TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.library_items TO authenticated;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Library is public" ON public.library_items FOR SELECT USING (true);
CREATE POLICY "Editors manage library" ON public.library_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Help locations
CREATE TYPE public.help_type AS ENUM ('conselho_tutelar', 'delegacia', 'creas', 'cras', 'mp', 'disque');
CREATE TABLE public.help_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type help_type NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  hours TEXT,
  official_url TEXT,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX help_locations_state_idx ON public.help_locations (state, city);
GRANT SELECT ON public.help_locations TO anon, authenticated;
GRANT ALL ON public.help_locations TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.help_locations TO authenticated;
ALTER TABLE public.help_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Help locations are public" ON public.help_locations FOR SELECT USING (true);
CREATE POLICY "Editors manage help locations" ON public.help_locations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));