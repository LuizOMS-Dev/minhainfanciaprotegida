-- ==========================================
-- PATCH: LIMITAR VIEW PÚBLICA DE AUTORES
-- ==========================================
-- A view não utiliza security_invoker. Ela atua como um SECURITY DEFINER (comportamento padrão de views no Postgres < 15), 
-- o que significa que ela ignora o RLS restrito da tabela profiles. 
-- Isso é DE PROPÓSITO: precisamos que usuários anônimos consigam ler o nome do autor,
-- mas a tabela profiles impede isso para proteger o e-mail e dados. 
-- Portanto, a view é uma "projeção pública controlada e segura", pois amarra a exposição estritamente a quem tem artigo publicado.

CREATE OR REPLACE VIEW public.public_author_profiles AS
SELECT DISTINCT p.id, p.display_name
FROM public.profiles p
JOIN public.articles a ON (p.id = a.author_id OR p.id = a.reviewer_id)
WHERE a.status = 'published' AND p.display_name IS NOT NULL;

-- ==========================================
-- PATCH: REMOVER POLÍTICAS ÓRFÃS LEGADAS (SEM MFA)
-- ==========================================
-- Estas políticas antigas permitiam acesso sem validação AAL2. 
-- Ao removê-las, deixaremos ativas APENAS as políticas novas criadas na v2, que exigem has_admin_mfa().

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins read lockouts" ON public.account_lockouts;
DROP POLICY IF EXISTS "Admins read admin sessions" ON public.admin_sessions;
DROP POLICY IF EXISTS "Admins read login attempts" ON public.login_attempts;

-- Estas políticas antigas da tabela articles estavam redundantes.
-- Já criamos as substitutas "Articles visible to public if published" 
-- e "Editors and Reviewers can view all articles" na migration anterior.
DROP POLICY IF EXISTS "Editors can view all articles" ON public.articles;
DROP POLICY IF EXISTS "Published articles are public" ON public.articles;
