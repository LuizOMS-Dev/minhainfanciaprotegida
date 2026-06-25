# Subagent Protocol - Minha Infancia Protegida

## When to use subagents

Use subagents for work that benefits from independent parallel review:

- Formal Codex Security repository or scoped scans.
- Large dead-file/import audits.
- Accessibility and SEO reviews across many pages.
- Deployment readiness reviews with separate build/log/domain ownership.

Do not use subagents for small edits, one-file fixes, secret handling, credential changes, DNS changes, or direct production mutations.

## Authorization gate

Formal security scans require explicit owner authorization for subagents before starting.

The parent agent must state:

- scan target;
- expected artifact directory;
- number/type of subagents;
- that no secrets should be printed;
- that production will not be changed.

## Ownership model

- Parent agent: orchestration, scope, dedupe, final decisions, user communication.
- Discovery subagent: reviews assigned files/surfaces and returns candidate findings.
- Validation subagent: proves whether a candidate is exploitable or suppressed.
- Attack-path subagent: documents impact, severity, and realistic abuse path.
- QA subagent: runs or reviews acceptance checks and residual risk.

## Required subagent output

Every subagent response must include:

- owned scope;
- files reviewed;
- findings with file/line references;
- evidence;
- impact;
- recommended fix;
- explicit `no finding` statement when clean;
- deferred items with exact reason.

## Security constraints

- Never include secret values.
- Do not mutate production.
- Do not apply database migrations.
- Do not delete files or deployments.
- Do not broaden scope silently.
