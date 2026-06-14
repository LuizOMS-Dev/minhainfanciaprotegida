ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS executive_summary jsonb,
  ADD COLUMN IF NOT EXISTS why_it_matters text,
  ADD COLUMN IF NOT EXISTS how_to_act jsonb;