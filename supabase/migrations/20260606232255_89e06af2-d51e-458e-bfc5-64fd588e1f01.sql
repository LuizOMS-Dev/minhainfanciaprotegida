
-- Extend audit_action enum with new security events
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'email_not_verified_login_attempt';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'brute_force_detected';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'account_locked';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'account_unlocked';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'captcha_failed';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'captcha_bypassed_attempt';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'login_blocked_by_captcha';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'mfa_enabled';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'mfa_disabled';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'mfa_success';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'mfa_failed';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'mfa_reset';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'admin_export';

-- 1) login_attempts: append-only log of every login attempt for rate-limit + audit
CREATE TABLE public.login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  ip_address text,
  success boolean NOT NULL,
  reason text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX login_attempts_email_created_idx ON public.login_attempts (lower(email), created_at DESC);
CREATE INDEX login_attempts_ip_created_idx ON public.login_attempts (ip_address, created_at DESC);

GRANT ALL ON public.login_attempts TO service_role;
GRANT SELECT ON public.login_attempts TO authenticated;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read login attempts"
  ON public.login_attempts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
-- No INSERT/UPDATE/DELETE policies => writes only via service_role.

-- 2) account_lockouts: short-lived bans per email
CREATE TABLE public.account_lockouts (
  email text PRIMARY KEY,
  locked_until timestamptz NOT NULL,
  reason text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.account_lockouts TO service_role;
GRANT SELECT ON public.account_lockouts TO authenticated;
ALTER TABLE public.account_lockouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read lockouts"
  ON public.account_lockouts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) admin_sessions: tracks each successful admin login session
CREATE TABLE public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  user_role text,
  ip_address text,
  user_agent text,
  login_at timestamptz NOT NULL DEFAULT now(),
  logout_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_sessions_user_login_idx ON public.admin_sessions (user_id, login_at DESC);
CREATE INDEX admin_sessions_login_idx ON public.admin_sessions (login_at DESC);

GRANT ALL ON public.admin_sessions TO service_role;
GRANT SELECT ON public.admin_sessions TO authenticated;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read admin sessions"
  ON public.admin_sessions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
-- writes only via service_role (no insert/update/delete policies)
