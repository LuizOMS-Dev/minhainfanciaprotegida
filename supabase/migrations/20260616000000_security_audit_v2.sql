-- ==========================================
-- 1. MIGRAÇÃO DE ROLES
-- ==========================================
-- Renomeia 'revisor' para 'reviewer' e adiciona 'viewer' de forma segura.
ALTER TYPE public.app_role RENAME VALUE 'revisor' TO 'reviewer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- ==========================================
-- 2. FUNÇÕES DE SEGURANÇA (MFA)
-- ==========================================
-- Criação de helper function para validar MFA do Admin
CREATE OR REPLACE FUNCTION public.has_admin_mfa()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Verifica se é admin E se o token JWT afirma que passou por AAL2 (MFA)
  SELECT has_role(auth.uid(), 'admin'::app_role) AND (auth.jwt()->>'aal' = 'aal2');
$$;

-- ==========================================
-- 3. PRIVACIDADE DE PROFILES E VIEW PÚBLICA
-- ==========================================
-- Garantir que profiles não tenha permissão pública
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles are private to owner" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_admin_mfa()) WITH CHECK (public.has_admin_mfa());
CREATE POLICY "Users can update own profile name" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- View segura e sanitizada para expor autores (ex: artigos)
CREATE OR REPLACE VIEW public.public_author_profiles AS
SELECT id, display_name
FROM public.profiles;

-- Permissão de leitura da view apenas (isso esconde emails e logs)
GRANT SELECT ON public.public_author_profiles TO anon, authenticated;

-- ==========================================
-- 4. POLICIES PARA TABELAS SENSÍVEIS (MFA OBRIGATÓRIO)
-- ==========================================
-- audit_log
DROP POLICY IF EXISTS "Admins can read audit log" ON public.audit_log;
DROP POLICY IF EXISTS "Admins can insert audit log" ON public.audit_log;
CREATE POLICY "Audit logs require Admin MFA" ON public.audit_log FOR ALL TO authenticated USING (public.has_admin_mfa()) WITH CHECK (public.has_admin_mfa());

-- login_attempts
DROP POLICY IF EXISTS "Admins can view login attempts" ON public.login_attempts;
CREATE POLICY "Login attempts require Admin MFA" ON public.login_attempts FOR ALL TO authenticated USING (public.has_admin_mfa()) WITH CHECK (public.has_admin_mfa());

-- account_lockouts
DROP POLICY IF EXISTS "Admins can manage lockouts" ON public.account_lockouts;
CREATE POLICY "Lockouts require Admin MFA" ON public.account_lockouts FOR ALL TO authenticated USING (public.has_admin_mfa()) WITH CHECK (public.has_admin_mfa());

-- admin_sessions
DROP POLICY IF EXISTS "Admins can manage sessions" ON public.admin_sessions;
CREATE POLICY "Admin sessions require MFA" ON public.admin_sessions FOR ALL TO authenticated USING (public.has_admin_mfa()) WITH CHECK (public.has_admin_mfa());

-- user_roles
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "User roles require Admin MFA" ON public.user_roles FOR ALL TO authenticated USING (public.has_admin_mfa()) WITH CHECK (public.has_admin_mfa());
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- 5. POLICIES PARA CONTEÚDO (Articles)
-- ==========================================
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
DROP POLICY IF EXISTS "Editors can insert articles" ON public.articles;
DROP POLICY IF EXISTS "Editors can update articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;

CREATE POLICY "Articles visible to public if published" ON public.articles FOR SELECT TO public USING (status = 'published' AND (publish_at IS NULL OR publish_at <= now()));
CREATE POLICY "Editors and Reviewers can view all articles" ON public.articles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role) OR has_role(auth.uid(), 'reviewer'::app_role));

-- Inserção: Editor e Admin
CREATE POLICY "Editors and Admins insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Atualização Geral: Editor e Admin
CREATE POLICY "Editors and Admins update articles" ON public.articles FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Revisão: Reviewer (Apenas update, não pode deletar, não pode inserir)
CREATE POLICY "Reviewers can only update articles" ON public.articles FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'reviewer'::app_role)) WITH CHECK (has_role(auth.uid(), 'reviewer'::app_role));

-- Deleção: APENAS ADMIN E COM MFA
CREATE POLICY "Admins can delete articles with MFA" ON public.articles FOR DELETE TO authenticated USING (public.has_admin_mfa());

-- Aplicação similar aos article_sources, library_items e help_locations
-- Para fins deste script, estou focando nas bases principais e blindagem.
