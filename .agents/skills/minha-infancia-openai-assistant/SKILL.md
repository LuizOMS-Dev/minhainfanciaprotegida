---
name: minha-infancia-openai-assistant
description: "Use for future OpenAI or OpenAI-compatible assistant work in Minha Infancia Protegida, including /api/chat, AI SDK, model selection, server-side key handling, rate limits, safety disclaimers, child-safety content boundaries, and avoiding frontend secret exposure. Trigger for OpenAI, API key, assistant, chat, /api/chat, AI SDK, model, streaming, or chatbot production readiness."
---

# Minha Infancia OpenAI Assistant

## Current status

- The assistant UI exists, but OpenAI production activation is future work.
- Any OpenAI-compatible key must remain server-side only.
- Never use `VITE_` for OpenAI secrets.

## Required implementation shape

- Use a server-side route for `/api/chat`.
- Validate input length and shape.
- Add rate limiting before production.
- Log failures without message contents or secrets.
- Keep emergency disclaimers visible: the assistant is informational and not an official reporting channel.

## Safety boundaries

- Do not provide instructions that facilitate abuse, evasion, grooming, exploitation, or harassment.
- For urgent risk, direct users to official emergency/reporting channels.
- Avoid collecting unnecessary personal data from children or victims.

## OpenAI Developers plugin routing

- Use OpenAI Developers docs/tooling for API behavior, model access, quota, authentication errors, and key setup.
- Do not create, rotate, or store OpenAI keys unless the owner explicitly asks and the destination is confirmed.
