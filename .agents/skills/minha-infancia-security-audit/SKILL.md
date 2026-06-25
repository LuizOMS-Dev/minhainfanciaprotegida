---
name: minha-infancia-security-audit
description: "Use for security review and Codex Security workflows in Minha Infancia Protegida, including repo-wide scans, scoped scans, secrets review, auth/session review, RLS review, endpoint review, dependency audit, attack-path validation, and security release gates. Trigger for security, auditoria, Codex Security, vulnerability, secrets, auth risk, RLS risk, or production hardening."
---

# Minha Infancia Security Audit

## Scope

- Cover frontend, server functions, Supabase integration, Auth/session flows, admin routes, dependencies, environment handling, and deployment configuration.
- Treat child-safety content and admin access as sensitive product areas.

## Required workflow

1. Read `AGENTS.md`, `docs/PROJECT_GUIDE.md`, and `docs/agents/security-reviewer.md`.
2. Run quick local checks first: dependency audit, secret pattern scan, route/API inventory, Auth/RLS review.
3. For formal Codex Security scans, follow the Codex Security plugin workflow exactly.
4. Get explicit authorization before launching subagents for exhaustive repository or scoped-path scans.
5. Save final markdown and HTML reports under a security scan output directory.

## Finding policy

- Prioritize exploitable issues over style.
- Findings need affected file/line, impact, realistic attack path, and remediation.
- Do not mark a finding fixed without validation.
- Do not expose secret values in reports.

## Release gate

- Production deploy should not proceed with untreated Critical or High findings unless the owner explicitly accepts the risk.
