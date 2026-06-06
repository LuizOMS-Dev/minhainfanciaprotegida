ALTER TABLE public.article_sources
  ADD CONSTRAINT article_sources_url_http_only
  CHECK (url ~* '^https?://');