# Agent Router - Minha Infancia Protegida

Use this router to pick the right project skill, plugin, and checklist.

## Default

- Skill: `.agents/skills/minha-infancia-tech-lead`
- Checklist: `AGENTS.md` and `docs/PROJECT_GUIDE.md`
- Plugin matrix: `docs/PLUGIN_CAPABILITY_MATRIX.md`
- Use for: phase planning, prioritization, project continuity, multi-area work.

## Supabase

- Skill: `.agents/skills/minha-infancia-supabase-ops`
- Plugin: Supabase
- Checklist: `docs/agents/supabase-specialist.md`
- Use for: Auth, RLS, migrations, advisors, database hardening.

## Security

- Skill: `.agents/skills/minha-infancia-security-audit`
- Plugin: Codex Security
- Checklist: `docs/agents/security-reviewer.md`
- Protocol: `.agents/SUBAGENT_PROTOCOL.md`
- Use for: formal scans, secrets, auth/session, dependency risk, release gates.

## Vercel / Deploy

- Skill: `.agents/skills/minha-infancia-vercel-release`
- Plugin: Vercel
- Checklist: `docs/agents/devops-engineer.md`
- Use for: deploy, env vars, domains, logs, rollback, production readiness.

## OpenAI assistant

- Skill: `.agents/skills/minha-infancia-openai-assistant`
- Plugin: OpenAI Developers
- Use for: `/api/chat`, AI SDK, server-side key handling, model/API errors.

## Frontend / UX / SEO

- Skill: `.agents/skills/minha-infancia-frontend-ux`
- Plugin: Build Web Apps
- Checklist: `docs/agents/frontend-engineer.md`, `ui-designer.md`, `ux-designer.md`, `web-designer.md`, `seo-performance-specialist.md`, `qa-engineer.md`
- Use for: UI, responsive behavior, accessibility, SEO, performance, conversion.

## Reports / PDFs / Data visualization

- Plugins: PDF and Build Web Data Visualization
- Use for: audit PDFs, stakeholder-ready project summaries, dashboards, KPI reports, security/advisor summaries.
- Gate: do not include secrets, raw private data, tokens, or sensitive personal data in generated artifacts.

## Creative production

- Plugin: Creative Production
- Use for: awareness campaign assets, social concepts, hero imagery, content direction, brand moodboards.
- Gate: keep visuals protective and non-exploitative; avoid realistic sensitive child imagery.

## Product management

- Plugin: Linear
- Use for: backlog, issues, milestones, acceptance criteria, bug triage.
- Gate: ask before creating or changing external issues.

## Native app plugins

- Plugins: Build macOS Apps and Build iOS Apps
- Use for: future native companion app work only.
- Gate: ask before adding native project structure, signing, simulator/device flows, or App Store/macOS packaging work.

## Escalation rules

- Ask before production deploy.
- Ask before remote database migration.
- Ask before DNS/domain changes.
- Ask before credential/token changes.
- Ask before deleting files, deployments, indexes, or data.
- Ask before launching full Codex Security subagent scan.
