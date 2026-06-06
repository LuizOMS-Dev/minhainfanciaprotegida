ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS reading_minutes integer,
  ADD COLUMN IF NOT EXISTS understand text,
  ADD COLUMN IF NOT EXISTS lessons text,
  ADD COLUMN IF NOT EXISTS timeline jsonb,
  ADD COLUMN IF NOT EXISTS faq jsonb,
  ADD COLUMN IF NOT EXISTS related_laws text[],
  ADD COLUMN IF NOT EXISTS related_signal_tags text[],
  ADD COLUMN IF NOT EXISTS national_context text[];

COMMENT ON COLUMN public.articles.reading_minutes IS 'Tempo estimado de leitura em minutos (opcional, calculado do body como fallback).';
COMMENT ON COLUMN public.articles.understand IS 'Bloco "Entenda o assunto" — HTML curto: o que aconteceu, por que importa, impacto.';
COMMENT ON COLUMN public.articles.lessons IS 'Bloco "O que aprendemos com este caso" — apenas para artigos do tipo case.';
COMMENT ON COLUMN public.articles.timeline IS 'Linha do tempo: [{ date, title, text }].';
COMMENT ON COLUMN public.articles.faq IS 'Perguntas frequentes: [{ q, a }] — alimenta FAQPage schema.';
COMMENT ON COLUMN public.articles.related_laws IS 'Slugs do catálogo de leis (src/content/laws.ts): eca-art-227, lei-13431, cp-art-217a, etc.';
COMMENT ON COLUMN public.articles.related_signal_tags IS 'Tags de sinais (src/content/signals.ts) relacionadas ao tema.';
COMMENT ON COLUMN public.articles.national_context IS 'Chaves de contexto nacional: maio-laranja, eca, direitos-crianca, seguranca-digital, educacao-preventiva.';