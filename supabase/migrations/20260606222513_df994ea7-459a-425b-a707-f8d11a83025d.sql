CREATE TYPE public.audit_action AS ENUM (
  'login','logout','login_failed','unauthorized_access',
  'content_create','content_update','content_delete',
  'content_publish','content_unpublish',
  'user_create','user_update','user_delete',
  'role_change','password_reset','csv_import',
  'library_change','location_change'
);

CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_email text,
  user_role text,
  action public.audit_action NOT NULL,
  target_type text,
  target_id text,
  target_title text,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_log_created_at_idx ON public.audit_log (created_at DESC);
CREATE INDEX audit_log_user_id_idx ON public.audit_log (user_id);
CREATE INDEX audit_log_action_idx ON public.audit_log (action);

GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log" ON public.audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
-- No INSERT/UPDATE/DELETE policies: writes only via service_role server fns.