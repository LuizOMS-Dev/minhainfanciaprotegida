-- Phase 1 repair: reviewer update protection and low-risk advisor fixes.
-- Idempotent by design so it can be safely re-applied if the remote schema was partially updated.

CREATE TABLE IF NOT EXISTS public.article_review_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_article_review_notes_article_id
  ON public.article_review_notes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_review_notes_reviewer_id
  ON public.article_review_notes(reviewer_id);
CREATE INDEX IF NOT EXISTS article_sources_article_id_idx
  ON public.article_sources(article_id);
CREATE INDEX IF NOT EXISTS articles_author_id_idx
  ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS articles_reviewer_id_idx
  ON public.articles(reviewer_id);

ALTER TABLE public.article_review_notes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_review_notes TO authenticated;
GRANT ALL ON public.article_review_notes TO service_role;

DROP TRIGGER IF EXISTS set_updated_at_article_review_notes ON public.article_review_notes;
CREATE TRIGGER set_updated_at_article_review_notes
BEFORE UPDATE ON public.article_review_notes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP POLICY IF EXISTS "Admins and Editors have full access to review notes" ON public.article_review_notes;
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

DROP POLICY IF EXISTS "Reviewers can view review notes" ON public.article_review_notes;
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

DROP POLICY IF EXISTS "Reviewers can insert their own notes" ON public.article_review_notes;
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

DROP POLICY IF EXISTS "Reviewers can update their own notes" ON public.article_review_notes;
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

CREATE OR REPLACE FUNCTION public.protect_reviewer_updates()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'editor'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF public.has_role(auth.uid(), 'reviewer'::public.app_role) THEN
    IF OLD.status::text IN ('published', 'archived', 'scheduled') THEN
       RAISE EXCEPTION 'Access denied: reviewers cannot modify published, archived, or scheduled articles.';
    END IF;

    IF NOT (
      (OLD.reviewer_id IS NULL AND NEW.reviewer_id = auth.uid()) OR
      (OLD.reviewer_id = auth.uid() AND NEW.reviewer_id = auth.uid())
    ) THEN
       RAISE EXCEPTION 'Access denied: reviewers can only claim orphan articles or update articles assigned to themselves.';
    END IF;

    IF NEW.status::text NOT IN ('draft', 'review') THEN
       RAISE EXCEPTION 'Access denied: reviewers can only set status to draft or review.';
    END IF;

    IF (to_jsonb(NEW) - 'status' - 'reviewer_id' - 'updated_at') IS DISTINCT FROM (to_jsonb(OLD) - 'status' - 'reviewer_id' - 'updated_at') THEN
       RAISE EXCEPTION 'Access denied: reviewers can only change status and assignment fields.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_protect_reviewer_updates ON public.articles;
CREATE TRIGGER tr_protect_reviewer_updates
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.protect_reviewer_updates();

REVOKE EXECUTE ON FUNCTION public.protect_reviewer_updates() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_reviewer_updates() FROM anon;
REVOKE EXECUTE ON FUNCTION public.protect_reviewer_updates() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_admin_mfa() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_admin_mfa() FROM anon;
GRANT EXECUTE ON FUNCTION public.has_admin_mfa() TO authenticated;
