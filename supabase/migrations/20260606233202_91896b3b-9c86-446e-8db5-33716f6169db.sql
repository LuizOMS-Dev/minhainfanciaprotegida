ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'recovery_code_generated';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'recovery_code_used';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'recovery_code_regenerated';
ALTER TYPE public.audit_action ADD VALUE IF NOT EXISTS 'csp_violation';