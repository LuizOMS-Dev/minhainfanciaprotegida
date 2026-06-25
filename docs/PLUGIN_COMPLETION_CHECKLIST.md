# Plugin Completion Checklist - Minha Infancia Protegida

Use this checklist before claiming any plugin-backed workstream is complete.

## Universal checks

- Scope is explicit and mapped to the right project skill or agent checklist.
- No secrets, tokens, service-role keys, cookies, passwords, or private keys are printed or committed.
- Production-impacting actions have explicit owner confirmation.
- Evidence is current: file changes, command output, rendered artifact, connector state, or report path.
- Residual risks and deferred items are listed.

## Codex Security

- Threat model or finding scope is written.
- Candidate findings have evidence, impact, recommendation, and disposition.
- Validated findings have validation and attack-path notes.
- Suppressed findings include proof and reason.
- Final report path is recorded.

## Build Web Apps

- Changed routes/components are listed.
- Build or focused validation passes when requested/needed.
- Accessibility, responsive behavior, SEO, and performance impact are considered.
- Any production deployment remains gated by confirmation.

## Build Web Data Visualization

- Data is bounded and sanitized.
- Manifest and snapshot do not include secrets or sensitive personal data.
- Chart/table purpose is clear to a non-technical reader.
- Rendered artifact or export path is recorded.

## PDF

- Source content is approved for sharing.
- No secrets or sensitive personal data are present.
- Output path is recorded.
- If generated for external use, audience and version/date are included.

## OpenAI Developers

- OpenAI key is server-side only.
- No `VITE_` OpenAI secret exists.
- Chat/assistant endpoint has validation, rate limit, and logging boundaries.
- Errors are handled without leaking prompts, secrets, or private data.

## Creative Production

- Brief includes audience, tone, channel, and safety constraints.
- Visuals avoid exploitative or sensitive child imagery.
- Assets have usage context and revision notes.
- Final asset paths or links are recorded.

## Linear

- Workspace/project is confirmed.
- Issue taxonomy is agreed: epic, task, bug, security, design, QA.
- Created/updated issue IDs are recorded.
- No external changes are made without confirmation.

## Build macOS Apps

- Native macOS scope exists and is approved.
- Xcode/project/scheme requirements are identified.
- Signing/notarization implications are documented before release work.
- No native project structure is introduced by accident.

## Build iOS Apps

- Native iOS scope exists and is approved.
- Simulator/device workflow is identified.
- Signing/App Store implications are documented before release work.
- No native project structure is introduced by accident.
