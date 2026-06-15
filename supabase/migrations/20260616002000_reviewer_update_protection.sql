-- 1. Criação da tabela separada e privada de Notas de Revisão
CREATE TABLE public.article_review_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices de performance e consulta
CREATE INDEX IF NOT EXISTS idx_article_review_notes_article_id ON public.article_review_notes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_review_notes_reviewer_id ON public.article_review_notes(reviewer_id);

-- Ativar RLS
ALTER TABLE public.article_review_notes ENABLE ROW LEVEL SECURITY;

-- Conceder permissões operacionais
GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_review_notes TO authenticated;
GRANT ALL ON public.article_review_notes TO service_role;

-- Trigger para updated_at da nota (usando função padrão do projeto)
DROP TRIGGER IF EXISTS set_updated_at_article_review_notes ON public.article_review_notes;
CREATE TRIGGER set_updated_at_article_review_notes
BEFORE UPDATE ON public.article_review_notes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Policies da nova tabela
-- Admins e Editors podem ler tudo e inserir/editar notas em geral
CREATE POLICY "Admins and Editors have full access to review notes" ON public.article_review_notes
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR 
    public.has_role(auth.uid(), 'editor'::public.app_role)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::public.app_role) OR 
    public.has_role(auth.uid(), 'editor'::public.app_role)
  );

-- Reviewers só podem visualizar suas próprias notas OU notas atreladas aos seus artigos
CREATE POLICY "Reviewers can view review notes" ON public.article_review_notes
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'reviewer'::public.app_role) AND (
      reviewer_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.articles a
        WHERE a.id = article_review_notes.article_id
        AND a.reviewer_id = auth.uid()
      )
    )
  );

-- Reviewers só podem criar notas atribuídas a si próprios em artigos que já pertencem a eles
CREATE POLICY "Reviewers can insert their own notes" ON public.article_review_notes
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'reviewer'::public.app_role) AND 
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_id
      AND a.reviewer_id = auth.uid()
    )
  );

-- Reviewers só podem editar as suas próprias notas de revisão, e apenas de artigos que continuem com eles
CREATE POLICY "Reviewers can update their own notes" ON public.article_review_notes
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'reviewer'::public.app_role) AND 
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_id
      AND a.reviewer_id = auth.uid()
    )
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'reviewer'::public.app_role) AND 
    reviewer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.articles a
      WHERE a.id = article_id
      AND a.reviewer_id = auth.uid()
    )
  );

-- 2. Trigger de Allow-list Dinâmica para updates na tabela articles
CREATE OR REPLACE FUNCTION public.protect_reviewer_updates()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Bypass para admin ou editor (fluxo livre)
  IF public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role) THEN
    RETURN NEW;
  END IF;

  -- Restrições rígoridas para Reviewer
  IF public.has_role(auth.uid(), 'reviewer'::public.app_role) THEN

    -- Bloqueio mestre: Artigo publicado, arquivado ou agendado não pode ser alterado por reviewer
    IF OLD.status::text IN ('published', 'archived', 'scheduled') THEN
       RAISE EXCEPTION 'Acesso negado: Reviewer não pode modificar artigos publicados, arquivados ou agendados.';
    END IF;

    -- Controle de Posse (Ownership/Assignment)
    -- O revisor só pode modificar se já for dele ou se ele estiver assumindo um órfão e atribuindo a si mesmo
    IF NOT (
      (OLD.reviewer_id IS NULL AND NEW.reviewer_id = auth.uid()) OR 
      (OLD.reviewer_id = auth.uid() AND NEW.reviewer_id = auth.uid())
    ) THEN
       RAISE EXCEPTION 'Acesso negado: Reviewer só pode assumir artigos órfãos e só pode modificar artigos já atribuídos a si. Você não pode remover sua atribuição nem transferir o artigo.';
    END IF;

    -- Alteração de Status (Apenas draft ou review)
    IF NEW.status::text NOT IN ('draft', 'review') THEN
       RAISE EXCEPTION 'Acesso negado: Reviewer apenas pode alterar status para draft ou review. Publicação, arquivamento e agendamento bloqueados.';
    END IF;

    -- True Allow-List (via JSONB)
    -- Compara a linha inteira, subtraindo os únicos 3 campos que o reviewer pode alterar de forma lícita.
    -- Se restar qualquer diferença nos demais campos (incluindo campos recém-adicionados no futuro), barra o UPDATE.
    IF (to_jsonb(NEW) - 'status' - 'reviewer_id' - 'updated_at') IS DISTINCT FROM (to_jsonb(OLD) - 'status' - 'reviewer_id' - 'updated_at') THEN
       RAISE EXCEPTION 'Acesso negado: Tentativa de alterar campos editoriais bloqueada pela política JSONB. Reviewer só pode alterar status e atribuição.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Acoplar a Trigger
DROP TRIGGER IF EXISTS tr_protect_reviewer_updates ON public.articles;
CREATE TRIGGER tr_protect_reviewer_updates
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.protect_reviewer_updates();
