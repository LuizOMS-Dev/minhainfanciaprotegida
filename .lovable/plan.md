
## Escopo e princípios

- Tudo abaixo é restrito a `/auth`, `/admin/*` (sob `_authenticated`) e `/relatorio-seo`.
- Páginas públicas, layout, SEO público, conteúdo institucional e UX do portal **não mudam**.
- Cadastro público continua bloqueado (já feito em rodada anterior).
- Toda mudança de schema entra em uma única migration; toda escrita sensível usa `supabaseAdmin` em server-fn; toda leitura sensível usa `requireSupabaseAuth` + `requireRole`.

---

## 1. Remover login com Google

- `src/routes/auth.tsx`: remover botão "Entrar com Google", função `google()`, import de `lovable`, e auditoria do provider Google. Login passa a ser **apenas e-mail + senha + Turnstile + (depois) código MFA**.
- Chamar `supabase--configure_social_auth` com `disable_providers: ["google"]` para desativar o provedor no Auth do Supabase.
- Não removo `lovable` do projeto — só do fluxo administrativo.

---

## 2. E-mail verificado obrigatório

- Server-fn nova `assertEmailVerified()` (chamada no gate admin) lê `email_confirmed_at` via `supabaseAdmin.auth.admin.getUserById(userId)`. Sem confirmação → 403 + audit `email_not_verified_login_attempt` + redirect para `/auth?reason=email_not_verified`.
- Gate em `src/routes/_authenticated/admin/route.tsx` (`beforeLoad`) chama `assertEmailVerified` antes de `requireRole`.
- Toda server-fn admin sensível também valida via helper compartilhado `requireAdminContext(context)` que faz: email verificado → papel válido → (item 5) MFA aal2.

---

## 3. Rate limit / força bruta (tabela `login_attempts`)

Nova tabela (append-only para auditoria + linha agregada para contagem):

```
login_attempts(id, email citext, ip_address text, success bool, reason text, created_at timestamptz)
account_lockouts(email citext PK, locked_until timestamptz, reason text, updated_at)
```

- Server-fn pública `recordLoginAttempt` (já existe) é estendida para:
  1. Inserir em `login_attempts`.
  2. Contar falhas dos últimos 15 min por `email` **e** por `ip`.
  3. Se ≥5 falhas → inserir/atualizar `account_lockouts` por 15 min + audit `account_locked` + `brute_force_detected`.
- Nova server-fn pública `checkLoginAllowed({email, ip})` chamada **antes** de `signInWithPassword` em `auth.tsx`. Se bloqueado → erro "Conta temporariamente bloqueada. Tente em N minutos." (sem revelar se o e-mail existe).
- Limpeza: job não necessário; expurgo opcional via SQL > 30 dias (documentado, não automatizado).

---

## 4. CAPTCHA — Cloudflare Turnstile

Pré-requisito do usuário: criar site key + secret em https://dash.cloudflare.com/?to=/:account/turnstile.

- Pedir secrets via `secrets--add_secret`:
  - `VITE_TURNSTILE_SITE_KEY` (pública, vai pro client).
  - `TURNSTILE_SECRET_KEY` (server-only).
- Renderizar widget Turnstile em `auth.tsx` (login) e em futura página de "esqueci minha senha".
- Server-fn `verifyTurnstile(token, ip)` faz POST para `https://challenges.cloudflare.com/turnstile/v0/siteverify`. Falha → audit `captcha_failed` + bloqueio do login.
- Tokens são single-use; verificação acontece dentro de `recordLoginAttempt`/`checkLoginAllowed`.

---

## 5. MFA obrigatório (TOTP nativo do Supabase)

- Habilitar TOTP em Supabase Auth (config). Sem migration: o factor é por usuário.
- Nova rota `/_authenticated/admin/mfa.tsx`:
  - Se usuário sem factor TOTP verificado → fluxo de enrollment (`supabase.auth.mfa.enroll({factorType: 'totp'})` → QR code → challenge → verify).
  - Se já tem factor → mostra status, botão "remover" (registra `mfa_disabled`).
- Gate `_authenticated/admin/route.tsx`:
  - `supabase.auth.mfa.getAuthenticatorAssuranceLevel()` no client.
  - Se `currentLevel !== 'aal2'` e usuário é admin/editor/revisor → redirect:
    - Sem factor → `/admin/mfa` (enrollment forçado).
    - Com factor mas sem challenge → `/auth/mfa` (página nova só para inserir código TOTP do login atual).
- Server-side: `requireAdminContext` valida `claims.aal === 'aal2'` (Supabase emite aal no JWT). Sem aal2 → 403 + audit `unauthorized_access`.
- Eventos auditados: `mfa_enabled`, `mfa_disabled`, `mfa_success`, `mfa_failed`.

---

## 6. Sessões administrativas (`admin_sessions`)

```
admin_sessions(
  id uuid pk,
  user_id uuid,
  user_email text,
  user_role text,
  ip_address text,
  user_agent text,
  login_at timestamptz default now(),
  logout_at timestamptz,
  session_duration interval generated always as (logout_at - login_at) stored,
  created_at timestamptz default now()
)
```

- GRANT: leitura só `service_role` + admins via RLS `has_role(auth.uid(),'admin')`. Escrita só `service_role`.
- `recordLoginAttempt(success=true)` insere linha.
- Novo `recordLogout` atualiza `logout_at = now()` da última sessão aberta do usuário.
- Nova tela `/admin/sessoes` para admins.

---

## 7. Auditoria avançada (append-only, já existe)

- Adicionar novas ações ao enum `audit_action`:
  - `email_not_verified_login_attempt`
  - `brute_force_detected`, `account_locked`, `account_unlocked`
  - `captcha_failed`, `captcha_bypassed_attempt`, `login_blocked_by_captcha`
  - `mfa_enabled`, `mfa_disabled`, `mfa_success`, `mfa_failed`, `mfa_reset`
  - `admin_export` (item 12)
- Reforço: garantir ausência de policy de UPDATE/DELETE (já é o caso). Documentar no relatório.

---

## 8. RBAC — validação cruzada

- Auditoria das server-fns existentes (`admin.functions.ts`, `library.functions.ts`, `locations.functions.ts`, `users.functions.ts`, `content.functions.ts`) para garantir que **toda mutação** passa por `requireRole(['admin'])` ou `['admin','editor']` conforme matriz; **toda exclusão** exige `admin`; **publish/unpublish** aceita `admin|editor|revisor`.
- UI: ações condicionadas ao papel via `useRouteContext` (já existe parcial — completar).

---

## 9. Admin principal (usuário não existe)

- Migration **não cria usuário** (não dá pra inserir em `auth.users` via SQL com segurança). Em vez disso:
  - Server-fn one-shot `bootstrapPrimaryAdmin` que: se `luizotaviomscv@gmail.com` não existir, cria via `supabaseAdmin.auth.admin.createUser({ email, password: random, email_confirm: true })`, atribui papel `admin`, e dispara e-mail de recuperação para o usuário definir a própria senha. Roda automaticamente uma vez na primeira chamada do gate admin (idempotente).
  - Audit: `user_create` + `role_change`.
- Após confirmar acesso de Luiz, **não removo** automaticamente nenhum admin. Crio tela `/admin/usuarios` com flag "última atividade" para o Luiz revisar manualmente. Salvaguarda: server-fn `deleteUser` recusa se sobrar 0 admins.

---

## 10. Hardening de indexação

- `public/robots.txt`: adicionar
  ```
  Disallow: /admin
  Disallow: /admin/
  Disallow: /auth
  Disallow: /relatorio-seo
  ```
- `auth.tsx`, todas rotas sob `_authenticated/admin/`, e `relatorio-seo.tsx`: `head()` com `<meta name="robots" content="noindex,nofollow,noarchive,nosnippet">`. (Já existe em algumas; padronizar via helper `noIndexMeta()`.)
- `sitemap.xml`: confirmar que essas rotas **não** aparecem (já não aparecem).

---

## 11. Backup / export

- Tela `/admin/backup` (admin-only) com botões "Exportar X em CSV/JSON" para: artigos, biblioteca, mapa, usuários, auditoria.
- Server-fn `exportDataset({type, format})` com `requireRole('admin')`, retorna texto; client baixa via `Blob`. Audit `admin_export` com `target_type = type`.

---

## 12. Validação final

- Rodar `supabase--linter` no final.
- Checklist manual no relatório: RLS por tabela, ausência de policies de write em `audit_log`, GRANTs corretos, todas server-fns admin com `requireRole`, todas mutações auditadas, Turnstile validado server-side, MFA aal2 obrigatório, e-mail verificado obrigatório, robots/meta corretos.
- Testes XSS/CSRF: confirmar que `RichTextEditor`/`SafeHtml` sanitizam (revisar `SafeHtml.tsx`); server-fns são RPC POST → imunes a CSRF clássico; tokens em header.

---

## Detalhes técnicos / ordem de execução

1. **Migration única** (`supabase--migration`):
   - Tabelas `login_attempts`, `account_lockouts`, `admin_sessions`.
   - Novos valores no enum `audit_action`.
   - GRANTs + RLS conforme padrão (service_role total; admin SELECT onde aplicável).
2. **Auth config** (`supabase--configure_auth`): manter `disable_signup: true`, `password_hibp_enabled: true`.
3. **Social config** (`supabase--configure_social_auth`): `disable_providers: ["google"]`.
4. **Secrets**: pedir `VITE_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY`.
5. **Código**:
   - `src/lib/security.server.ts` (Turnstile verify, lockout check, attempt recorder).
   - `src/lib/security.functions.ts` (`checkLoginAllowed`, `recordLoginAttempt` v2, `bootstrapPrimaryAdmin`, `exportDataset`).
   - `src/lib/require-admin.ts` (`requireAdminContext`: email_verified + role + aal2).
   - `src/lib/audit.server.ts`: novas actions no tipo.
   - `src/routes/auth.tsx`: sem Google, com Turnstile, com etapa "código MFA" inline (challenge → verify) usando `supabase.auth.mfa`.
   - `src/routes/_authenticated/admin/route.tsx`: gate reforçado (verified + role + aal2 + bootstrap admin principal).
   - `src/routes/_authenticated/admin/mfa.tsx` (novo — enrollment).
   - `src/routes/_authenticated/admin/sessoes.tsx` (novo).
   - `src/routes/_authenticated/admin/backup.tsx` (novo).
   - `src/components/site/Turnstile.tsx` (widget).
   - `public/robots.txt`: bloqueios.
6. **Rodar linter** + apresentar relatório final.

---

## Pendências externas (precisam do usuário)

- Criar widget Turnstile no Cloudflare e entregar site key + secret quando solicitado pelo `add_secret`.
- Após login do Luiz, definir senha via link de recuperação e configurar MFA na primeira entrada.
- Revisar lista de administradores existentes em `/admin/usuarios` para decidir quem manter/remover.

## Itens explicitamente fora de escopo

- Não toco em layout, cores, fontes, conteúdo público ou estrutura SEO pública.
- Não removo páginas existentes do admin — só adiciono camadas de segurança.
- Não automatizo expurgo de logs antigos (mantém append-only sem TTL para preservar trilha).

Confirma para implementar?
