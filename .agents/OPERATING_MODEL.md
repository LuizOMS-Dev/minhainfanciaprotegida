# Operating Model - Minha Infancia Protegida

## Stage 1 - Skills reais

Project-local skills live in `.agents/skills` and are versioned with the repo.

- `minha-infancia-tech-lead`: default coordinator and project governance.
- `minha-infancia-supabase-ops`: Supabase, Auth, RLS, migrations, advisors.
- `minha-infancia-security-audit`: Codex Security and security release gates.
- `minha-infancia-vercel-release`: Vercel deploys, envs, logs, rollback.
- `minha-infancia-openai-assistant`: future OpenAI assistant server-side flow.
- `minha-infancia-frontend-ux`: frontend, UX, SEO, a11y, performance.

## Stage 2 - Agentes operacionais

Agent checklists live in `docs/agents`.

- Tech Lead routes work and decides safe order.
- Frontend/UI/UX/Web agents handle interface and public experience.
- Backend/Supabase agents handle data, Auth, RLS, server functions.
- DevOps/Vercel agent handles deploy, env, logs, rollback.
- Security agent handles threat modeling, scans, findings, release gates.
- QA/SEO agents handle acceptance checks, accessibility, SEO, performance.

## Stage 3 - Subagentes

Use subagents for parallel review only when the task benefits from independent ownership.

- Security scans: explicit authorization is required before launching subagents.
- Each subagent must own a narrow scope and return findings with file/line, evidence, impact, and recommendation.
- Parent agent owns dedupe, final decisions, and production-risk escalation.

## Stage 4 - Fluxo padrao

Every substantial change should follow:

1. Diagnose current state.
2. Pick the matching project skill and plugin.
3. Execute local non-destructive changes first.
4. Validate with the minimum meaningful checks.
5. Ask before deploy, DB migration, DNS, credentials, deletion, or full scan.
6. Save important reports in `outputs/`.

## Plugin map

- Supabase plugin: database, Auth, RLS, advisors, migrations.
- Vercel plugin: deployments, domains, runtime logs, docs.
- Codex Security plugin: repository/scoped security scan and validation.
- OpenAI Developers plugin: OpenAI API, model/key/error guidance.
- Full plugin/capability routing: `docs/PLUGIN_CAPABILITY_MATRIX.md`.
