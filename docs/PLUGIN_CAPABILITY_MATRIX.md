# Plugin Capability Matrix - Minha Infancia Protegida

Use this guide to decide when each installed plugin/capability should be used in this project.

## Safety baseline

- Never expose token, secret, password, cookie, private key, service-role key, or personal access token values.
- Ask before production deploy, remote database migration, DNS/domain change, credential change, destructive cleanup, or full security scan.
- Keep Cloudflare out of the project unless the owner explicitly changes that decision.
- Prefer Vercel for deploy/hosting, Hostinger for domain/DNS, and Supabase for database/auth/backend.
- OpenAI keys must stay server-side. Never expose `OPENAI_API_KEY` through `VITE_` variables or browser bundles.

## Operational plugins

| Plugin | Status | Use when | Required gate |
| --- | --- | --- | --- |
| Codex Security | Active | Threat modeling, formal scans, finding validation, security release gates, auth/session/RLS review. | Ask before full scan with subagents or production-impacting remediation. |
| Build Web Apps | Active | React/TanStack/Vite UI work, frontend architecture, accessibility, responsive behavior, web app best practices. | Ask before large refactor or production deploy. |
| Build Web Data Visualization | Optional active | Dashboards, data reports, KPI visuals, security/advisor summaries, analytics-grade report artifacts. | Use bounded data only; do not send secrets or sensitive personal data to widgets. |
| OpenAI Developers | Future active | Production assistant, `/api/chat`, OpenAI API, Agents SDK, server-side key handling, model/API troubleshooting. | Ask before creating/writing OpenAI keys or enabling paid/API production flows. |
| PDF | Optional active | Exporting audit reports, project guides, compliance summaries, or stakeholder-ready PDFs. | Confirm before generating public/shareable documents with sensitive content. |
| Creative Production | Optional active | Campaign visuals, awareness assets, social concepts, hero imagery, editorial creative direction. | Avoid sensitive child imagery; keep protection-focused, non-exploitative visuals. |
| Linear | Optional future | Issue tracking, phase planning, backlog, acceptance criteria, bug triage. | Ask before creating/updating external issues if connected. |

## Platform-specific plugins

| Plugin | Status | Use when | Required gate |
| --- | --- | --- | --- |
| Build macOS Apps | Not primary | Only if the project later gains a macOS companion app or native desktop workflow. | Ask before introducing native app structure or Xcode config. |
| Build iOS Apps | Not primary | Only if the project later gains an iOS app, simulator workflow, or App Store path. | Ask before introducing native app structure, signing, or simulator/device workflows. |

## Recommended routing

1. Security, auth, RLS, secrets, dependency risk: use Codex Security plus the project security agent.
2. Supabase database/auth/policies/advisors: use Supabase plugin plus the Supabase specialist.
3. Web UI, routes, accessibility, SEO, and performance: use Build Web Apps plus frontend/UX/QA/SEO agents.
4. Reports and dashboards: use Build Web Data Visualization for interactive artifacts; use PDF only for static deliverables.
5. OpenAI assistant: use OpenAI Developers only after server-side route, rate limit, input validation, and secret storage are planned.
6. Creative campaigns: use Creative Production after content/safety constraints are explicit.
7. Product management: use Linear only when the owner wants external issue/backlog updates.

## Current project posture

- Web app is the primary product surface.
- Vercel, Supabase, Hostinger, Codex Security, and Build Web Apps are the core operational stack.
- OpenAI assistant is not production-active until a secure server-side chat route exists.
- PDF, data visualization, Creative Production, Linear, macOS, and iOS are available capabilities, but not default production workstreams.
