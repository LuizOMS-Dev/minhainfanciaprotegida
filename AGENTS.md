# AGENTS.md - Minha Infancia Protegida

## Papel do Codex neste projeto

Atuar como desenvolvedor tecnico principal, com postura proativa e cautelosa.

## Regras de seguranca

- Nunca expor valores reais de tokens, secrets, senhas, cookies ou chaves.
- Pedir confirmacao antes de deploy em producao, mudancas de banco, credenciais, DNS, dominio, MCPs ou exclusoes relevantes.
- Nao usar Cloudflare neste projeto, salvo decisao futura explicita do dono.
- Preferir Vercel para hospedagem/deploy, Hostinger para dominio/DNS e Supabase para backend/banco/auth.
- OpenAI/API keys devem ficar apenas no servidor; nunca usar prefixo `VITE_` para secrets.
- Supabase Free esta aceito; `auth_leaked_password_protection` fica como risco aceito ate upgrade Pro.

## Fluxo padrao

1. Diagnostico.
2. Plano curto.
3. Implementacao segura.
4. Validacao quando autorizada ou necessaria pela tarefa.
5. Resumo final simples.

## Skills e agentes do projeto

- Skills reais do projeto ficam em `.agents/skills`.
- O roteamento principal fica em `.agents/OPERATING_MODEL.md` e `docs/agents/AGENT_ROUTER.md`.
- Subagentes seguem `.agents/SUBAGENT_PROTOCOL.md`.
- Use os plugins instalados conforme a area: Supabase, Vercel, Codex Security e OpenAI Developers.
- Matriz de plugins/capacidades: `docs/PLUGIN_CAPABILITY_MATRIX.md`.

## Comandos uteis

- Instalar dependencias: `npm.cmd ci`
- Build local: `npm.cmd run build`
- Auditoria npm: `npm.cmd audit`
- Deploy Vercel: usar Vercel CLI ou GitHub integration com confirmacao previa.

## Cuidados especiais

- O site ja foi publicado uma vez a partir de working tree local; manter Git/GitHub sincronizado para nao perder historico.
- Supabase tem RLS/policies/funcoes sensiveis; migracoes precisam de plano e rollback.
- Upgrade de Vite/esbuild deve ser uma etapa propria porque envolve major version.
- Auditoria Codex Security formal exige autorizacao explicita para subagentes antes de iniciar varredura completa.
