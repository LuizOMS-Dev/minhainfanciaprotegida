CREATE TABLE public.mfa_recovery_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code_hash text NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX mfa_recovery_codes_user_id_idx ON public.mfa_recovery_codes(user_id);
CREATE UNIQUE INDEX mfa_recovery_codes_hash_idx ON public.mfa_recovery_codes(code_hash);

GRANT SELECT ON public.mfa_recovery_codes TO authenticated;
GRANT ALL ON public.mfa_recovery_codes TO service_role;

ALTER TABLE public.mfa_recovery_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recovery codes"
  ON public.mfa_recovery_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);