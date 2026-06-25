---
name: minha-infancia-vercel-release
description: "Use for Vercel hosting, deployment, environment variables, domain checks, runtime logs, rollback planning, preview deployments, production release gates, and cleanup decisions in Minha Infancia Protegida. Trigger for Vercel, deploy, production, environment variables, domain, logs, rollback, preview, or release."
---

# Minha Infancia Vercel Release

## Current project direction

- Vercel is the hosting/deploy platform.
- Hostinger manages domain/DNS when applicable.
- Production deploys require explicit confirmation.
- Do not delete old deployments without a separate confirmation.

## Pre-deploy checklist

- `npm.cmd audit` has no untreated high/critical vulnerabilities.
- `npm.cmd run build` passes.
- Environment variables are configured by name only in documentation; never print values.
- Supabase project refs and public publishable variables match the intended project.
- No Cloudflare/Turnstile flow is reintroduced.

## Deploy workflow

1. Prefer Git/GitHub release flow when repository sync is available.
2. Use Vercel CLI/MCP only with explicit production approval.
3. After deploy, verify production HTTP 200 on the canonical domain.
4. Check runtime logs for errors, warnings, and fatal failures.
5. Record deployment ID, URL, domain status, and log result in `outputs/`.

## Rollback/cleanup

- Keep rollback candidates until a newer deployment is verified.
- Cleanup is destructive; list candidates and ask before deleting.
