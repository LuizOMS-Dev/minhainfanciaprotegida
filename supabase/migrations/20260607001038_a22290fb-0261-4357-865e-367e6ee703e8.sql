ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS action_steps text[],
  ADD COLUMN IF NOT EXISTS warning_indicators text[],
  ADD COLUMN IF NOT EXISTS severity_level text,
  ADD COLUMN IF NOT EXISTS impact_summary text,
  ADD COLUMN IF NOT EXISTS source_confidence text,
  ADD COLUMN IF NOT EXISTS ai_summary text;

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_severity_level_check,
  ADD CONSTRAINT articles_severity_level_check
    CHECK (severity_level IS NULL OR severity_level IN ('baixo','medio','alto','gravissimo'));

ALTER TABLE public.articles
  DROP CONSTRAINT IF EXISTS articles_source_confidence_check,
  ADD CONSTRAINT articles_source_confidence_check
    CHECK (source_confidence IS NULL OR source_confidence IN ('alta','media','baixa'));