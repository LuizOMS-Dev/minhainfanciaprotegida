## Objetivo

Fechar o painel administrativo: remover cadastro público, garantir RBAC, e implementar auditoria completa. Sem alterações em layout público ou UX do portal.

---

## 1. Bloquear cadastro público

**`src/routes/auth.tsx`**
- Remover modo `signup`: tirar toggle "Entrar / Criar conta", o campo nome, a chamada `supabase.auth.signUp` e o `state` `mode`.
- Manter apenas formulário de login (email + senha) + botão Google.
- Mensagem de rodapé: "Acesso restrito. Solicite a um administrador a criação do seu usuário."

**Supabase Auth**
- Chamar `supabase--configure_auth` com `disable_signup: true` para travar signup também no nível do servidor (defesa em profundidade — Google OAuth continua funcionando para usuários já provisionados; novos usuários Google sem registro prévio serão bloqueados pela ausência de papel em `user_roles`).

**Gate de papel** (já existe em `_authenticated/route.tsx` via `requireSupabaseAuth`?). Reforçar em `_authenticated/admin/route.tsx`: redirecionar para `/auth` se o usuário autenticado não tiver nenhum papel (`admin | editor | revisor`), registrando o evento `unauthorized_admin_access` no audit log.

---

## 2. RBAC — validação final

Revisar `src/lib/require-role.ts` e funções server:
- `admin`: tudo (CRUD usuários, papéis, exclusão de conteúdo, auditoria).
- `editor`: criar/editar conteúdo, biblioteca, mapa — sem deletar usuários nem alterar papéis.
- `revisor`: somente leitura + aprovar (mudar status `draft → published`).
- `visitante` (sem papel): redirect para `/auth`.

UI do admin (`_authenticated/admin/index.tsx`) já esconde ações por papel; confirmar e ajustar onde faltar.

---

## 3. Tabela `audit_log` (migration)

```sql
CREATE TYPE audit_action AS ENUM (
  'login','logout','login_failed','unauthorized_access',
  'content_create','content_update','content_delete',
  'content_publish','content_unpublish',
  'user_create','user_update','user_delete',
  'role_change','password_reset','csv_import',
  'library_change','location_change'
);

CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text,
  user_role text,
  action audit_action NOT NULL,
  target_type text,
  target_id text,
  target_title text,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON public.audit_log (created_at DESC);
CREATE INDEX ON public.audit_log (user_id);
CREATE INDEX ON public.audit_log (action);

GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Somente admin lê; ninguém via Data API escreve/edita/deleta.
CREATE POLICY "Admins read audit" ON public.audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- Sem policies de INSERT/UPDATE/DELETE → bloqueado para authenticated.
-- Escrita exclusiva via service_role (server functions).
```

Logs são **append-only** por contrato (sem policies de UPDATE/DELETE para nenhum papel).

---

## 4. Registro de eventos

**`src/lib/audit.server.ts`** — helper `logAudit({ action, target, metadata }, context)` usando `supabaseAdmin`. Captura IP via `getRequestHeader('x-forwarded-for')` e `user-agent`.

Instrumentar:
- `src/routes/auth.tsx` — login sucesso/falha (via nova server fn `recordLoginAttempt`).
- Listener `onAuthStateChange` no `__root.tsx` — `SIGNED_OUT` → server fn `recordLogout`.
- `admin.functions.ts`, `library.functions.ts`, `locations.functions.ts`, `users.functions.ts`, `content.functions.ts` — todas as mutações chamam `logAudit` após sucesso.
- Gate admin — registra `unauthorized_access` quando papel falta.

---

## 5. Tela de auditoria

**`src/routes/_authenticated/admin/auditoria.tsx`** (somente admin via `requireRole('admin')` no loader + server fn `listAuditLog`):
- Tabela paginada (50/página) com colunas: data, usuário, papel, ação, alvo, IP.
- Filtros: usuário (select), ação (select), intervalo de datas, tipo de alvo.
- Busca textual em `target_title` / `user_email`.
- Link no menu lateral do admin (visível só para admin).

---

## 6. Relatório final

Após implementar, entregar resumo:
- Pontos onde signup foi removido (auth.tsx + Supabase config).
- Novo fluxo de criação (admin → `/admin/usuarios` → cria + atribui papel).
- Matriz de papéis aplicada.
- DDL da `audit_log` + policies.
- Lista de eventos monitorados.
- Riscos eliminados (auto-cadastro, escalada de papel, edição/remoção de logs).
- Nível de segurança antes/depois.

---

## Detalhes técnicos

- Sem alterações no portal público.
- `disable_signup` na Auth do Supabase é mudança de config (não migration).
- Audit log usa `supabaseAdmin` server-side; nunca exposto ao cliente.
- IP/UA capturados em server fn — nunca via cliente.
- Política RLS proíbe UPDATE/DELETE em `audit_log` por construção (ausência de policies = bloqueio).

## Pergunta antes de implementar

Há alguma ação adicional específica do seu fluxo (ex.: exportação CSV de logs, retenção/expiração automática de logs antigos, webhook de alerta para múltiplas falhas de login) que devo incluir? Se não, prossigo com o escopo acima.