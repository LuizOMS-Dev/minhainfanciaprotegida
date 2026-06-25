# Guia do Projeto - Minha Infancia Protegida

## Arquitetura

- Frontend/app: React/TanStack Start/Vite.
- Hospedagem: Vercel.
- Dominio/DNS: Hostinger quando aplicavel.
- Backend/banco/auth: Supabase.
- Cloudflare: fora do escopo atual.

## Como rodar localmente

1. Instalar dependencias com `npm.cmd ci`.
2. Criar arquivo `.env` local baseado em `.env.example`.
3. Rodar build com `npm.cmd run build` antes de publicar mudancas importantes.

## Variaveis de ambiente

Use `.env.example` como fonte de nomes. Nunca comitar valores reais.

## Deploy

Deploy em producao exige confirmacao previa. Preferir fluxo Git/GitHub quando possivel para manter historico rastreavel.

## Supabase

Mudancas de schema, policies, RLS, views e funcoes devem passar por plano de migracao, revisao de seguranca e verificacao depois da aplicacao.

Status atual:

- Plano Supabase Free aceito por enquanto.
- `auth_leaked_password_protection` e Pro-only e fica como risco aceito enquanto nao houver upgrade.
- Advisories `unused_index` devem ser monitorados; nao remover indices de auditoria, login, FK ou admin sem evidencia de uso real e confirmacao.
- Recomendacao manual no Dashboard: senha minima 12+, requisitos fortes, troca segura de senha e senha atual obrigatoria ao trocar senha.

## OpenAI / Assistente

- OpenAI fica como integracao futura ate existir rota server-side segura para `/api/chat`.
- Nunca expor `OPENAI_API_KEY` no frontend ou em variaveis `VITE_`.
- Quando ativado, o assistente deve ter validacao de entrada, rate limit e logs sem dados sensiveis.

## Qualidade

- Sem secrets no codigo.
- Sem dependencias novas sem motivo claro.
- Sem remocao de arquivos sem lista previa e confirmacao.
- Performance e SEO devem ser revisados em fases dedicadas.

## Agentes, skills e plugins

- Skills locais do projeto ficam em `.agents/skills`.
- Roteador de agentes: `docs/agents/AGENT_ROUTER.md`.
- Modelo operacional: `.agents/OPERATING_MODEL.md`.
- Protocolo de subagentes: `.agents/SUBAGENT_PROTOCOL.md`.
- Plugins principais: Supabase, Vercel, Codex Security e OpenAI Developers.
- Matriz completa de plugins/capacidades: `docs/PLUGIN_CAPABILITY_MATRIX.md`.
