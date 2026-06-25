# Plugin Readiness Audit - Minha Infancia Protegida

Date: 2026-06-17
Scope: plugin/capability objective covering PDF, Codex Security, Build Web Data Visualization, Build Web Apps, Build macOS Apps, Build iOS Apps, Creative Production, Linear, and OpenAI Developers.

## Evidence inspected

- Project docs exist under `docs` and `docs/agents`.
- Project operating model exists under `.agents`.
- Local skills exist under `.agents/skills`.
- Present local skill directories include project-specific tech lead, Supabase ops, security audit, Vercel release, OpenAI assistant, frontend UX, plus web/Vercel support skills.
- `outputs` was created for future generated artifacts and readiness snapshots.

## Readiness by plugin

| Plugin | Readiness | Current project use | Evidence | Completion condition |
| --- | --- | --- | --- | --- |
| Codex Security | Active | Security scans, finding validation, auth/RLS/dependency release gates. | Formal audit artifacts exist under the local security scan directory; project security skill exists. | Current when every new security phase has scope, artifacts, findings disposition, and validation report. |
| Build Web Apps | Active | React/TanStack/Vite frontend work, accessibility, routing, UI, build behavior. | Frontend UX skill and web-design guidelines exist; build passed after recent fixes. | Current when frontend changes pass build and have focused UI/SEO/a11y acceptance notes when relevant. |
| Build Web Data Visualization | Ready optional | Dashboards and report artifacts for audits, advisor status, KPIs, traffic, and content performance. | Matrix and router now define safe use; no dashboard artifact is required yet. | Complete when a concrete dashboard/report request has bounded data, validated manifest, and rendered artifact. |
| PDF | Ready optional | Static stakeholder reports, audit summaries, technical handoff PDFs. | Matrix now defines gate; no PDF deliverable has been requested yet. | Complete when a specific PDF is generated from approved non-secret content. |
| OpenAI Developers | Future active | Production assistant and OpenAI server-side route. | OpenAI assistant skill exists; project guide says assistant is future until secure server-side route exists. | Complete when `/api/chat` or equivalent server route has rate limit, validation, secret-only key, and tests/build. |
| Creative Production | Ready optional | Campaign assets, awareness visuals, social concepts, brand direction. | Matrix now defines child-safety creative constraints. | Complete when a specific creative brief produces approved assets without sensitive/exploitative imagery. |
| Linear | Ready optional/future | Backlog, issues, milestones, bug triage. | Matrix and router define external issue gate. | Complete when owner asks for Linear issue creation/update and connector state is verified. |
| Build macOS Apps | Not primary | Future native macOS companion app only. | Matrix and router classify as non-primary. | Complete only if a macOS product scope is introduced and native project requirements are accepted. |
| Build iOS Apps | Not primary | Future native iOS companion app only. | Matrix and router classify as non-primary. | Complete only if an iOS product scope is introduced and native project requirements are accepted. |

## Gates that remain intentionally closed

- No production deploy without explicit confirmation.
- No Supabase migration, Auth setting change, DNS change, domain change, token change, or deletion without explicit confirmation.
- No PDF or data artifact should include secrets, raw private user data, tokens, or sensitive personal data.
- No OpenAI production key should be created or exposed until the server-side assistant architecture is ready.
- No Linear external issue should be created or changed until the owner asks for it.
- No native iOS/macOS project should be added until a native app scope is approved.

## Recommended next plugin-backed phases

1. Codex Security: rerun a focused diff scan after the next production-ready patch set.
2. Build Web Apps: continue performance/code splitting and UX/SEO polish.
3. Build Web Data Visualization: create a security/advisor dashboard only if the owner wants a visual executive report.
4. PDF: export stakeholder audit summary only after deciding what can be shared safely.
5. OpenAI Developers: design server-side assistant route only when the assistant becomes production-functional.
6. Creative Production: develop awareness campaign assets after finalizing brand/content constraints.
7. Linear: create a backlog only after confirming the workspace and desired issue taxonomy.
8. Build iOS/macOS Apps: keep dormant unless a native companion app becomes a product decision.
