---
name: minha-infancia-supabase-ops
description: "Use for Supabase work in Minha Infancia Protegida: RLS policies, migrations, security/performance advisors, Auth settings, private helper functions, public views, service role safety, publishable keys, and database hardening. Trigger for Supabase, banco, RLS, policies, Auth, migrations, advisors, leaked password protection, or database security."
---

# Minha Infancia Supabase Ops

## Current project facts

- Supabase project ref: `vpnqdktjuhbesuphuvag`.
- Supabase Free is accepted for now.
- `auth_leaked_password_protection` is Pro-only and is an accepted residual advisor until upgrade.
- `unused_index` warnings are monitoring items; do not drop indexes without evidence and confirmation.

## Required workflow

1. Read `AGENTS.md` and `docs/PROJECT_GUIDE.md`.
2. Check existing migrations before changing schema or policies.
3. Prefer idempotent SQL and reversible reasoning.
4. Verify advisors after any database hardening change.
5. Record the migration version, intent, and outcome in `outputs/`.

## Safety rules

- Never expose `SUPABASE_SERVICE_ROLE_KEY`.
- Never put service-role or secret keys in frontend code or `VITE_` variables.
- Keep privileged helper functions outside exposed schemas when possible.
- Use `security_invoker` for public views that should respect RLS.
- Ask before applying migrations to remote production.

## Manual dashboard items

- Auth password hardening in the Free plan may require Dashboard action:
- Minimum password length 12 or greater.
- Strong password requirements.
- Secure password change.
- Require current password on update.
