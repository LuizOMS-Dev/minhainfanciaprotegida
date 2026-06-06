## Painel Administrativo V3 — plano de execução

Mantém intactos: segurança (MFA, Turnstile, rate-limit, CSP, headers, auditoria), SEO público, site público e identidade visual. Toda a reformulação é interna ao `/admin`, reaproveitando os tokens visuais já usados na tela "Conteúdos" (gradiente navy, chips laranja, cards arredondados, KPIs).

### 1. Shell do painel
- Reescrever a barra lateral de `src/routes/_authenticated/admin/route.tsx` em grupos:
  - **Visão geral** → Dashboard
  - **Publicações** (expansível) → Todos · Notícias · Casos · Riscos · Guias · Para Pais · Para Escolas
  - **Conteúdo institucional** → Biblioteca · Mapa de ajuda
  - **Operação** → Usuários · Auditoria · Sessões · Segurança · Backup
  - **Conta** → Verificação MFA · Sair
- "Para Pais" / "Para Escolas" são filtros baseados em `articles.category` (sem migração).
- Header ganha: **busca global** (Cmd/Ctrl K), atalhos rápidos e badge do papel.

### 2. Dashboard executivo (`/admin`)
- Substituir a tabela de conteúdos pelo dashboard real.
- Nova server fn `getAdminOverview` agrega contagens: publicados, revisão, agendados, rascunhos, biblioteca, locais, usuários ativos (profiles), sessões admin (24 h e ativas), tentativas de login (24 h), bloqueios ativos.
- Grid de KPIs (mesmo estilo dos atuais) + bloco **Atividade recente** (últimos 15 eventos do `audit_log` com ícone por categoria, link para auditoria).
- Bloco **Ações rápidas**: Nova publicação · Novo material · Novo local · Novo usuário · Auditoria · Segurança.

### 3. Central Editorial
- Nova rota `/admin/publicacoes` (lista master com filtros por tipo + categoria + status + busca; reaproveita layout/tabela atual de "Conteúdos").
- Sub-rotas filtradas (`/admin/publicacoes/noticias`, `/casos`, `/riscos`, `/guias`, `/para-pais`, `/para-escolas`) — apenas pré-aplicam filtro/categoria.
- Editor (`article.$id.tsx`) ganha barra de status com fluxo visual **Rascunho → Revisão → Agendamento → Publicação** e botão **Pré-visualizar** (abre artigo público em nova aba; só publicados/agendados respeitam RLS).

### 4. Central de Segurança (nova) `/admin/seguranca`
- Server fn `getSecurityOverview`: contadores de bloqueios ativos, tentativas falhas 24 h, eventos críticos 7 d, últimos logins.
- Painel com selos: MFA · Turnstile · Rate limit · E-mail verificado · CSP · Security Headers · Auditoria · Backup (cada selo lê configuração real, não hard-coded).
- Listas: contas bloqueadas (`account_lockouts`), top IPs com falhas, últimos eventos críticos, últimos logins (`login_attempts` success=true).

### 5. Auditoria visual `/admin/auditoria`
- Refazer a tela com **timeline** (agrupada por dia), chips de categoria (Autenticação · MFA · Usuários · Publicações · Sistema · Segurança), filtros rápidos (24 h / 7 d / 30 d) e filtros avançados (usuário, ação, alvo, intervalo).
- Eventos críticos (`brute_force_detected`, `unauthorized_access`, `csp_violation`, `role_change`, etc.) ganham realce vermelho.
- Paginação server-side via nova server fn `listAuditEvents({ filters, page })`.

### 6. Central de Usuários `/admin/usuarios`
- Visual em cards/tabela com avatar (iniciais), badges coloridos por papel, status MFA, e-mail verificado, último login (`login_attempts` mais recente success), data de criação.
- Server fn `listAdminUsers` une `profiles` + `user_roles` + último `login_attempts` + flag MFA (via admin client).

### 7. Biblioteca premium `/admin/biblioteca`
- Toggle **Cards ↔ Tabela** (persistido em `localStorage`).
- Filtros: categoria, ano, público-alvo, fonte; busca por título.
- Cards com capa/ícone, metadados e ações editar/excluir.

### 8. Mapa de ajuda profissional `/admin/mapa`
- Cabeçalho de stats: total de locais, estados cobertos, categorias.
- Filtros: estado, cidade, categoria.
- Estrutura visual idêntica à de "Conteúdos" (KPIs + tabela + chips).

### 9. Central de Backup `/admin/backup`
- Tela com cards por dataset (Artigos · Biblioteca · Usuários · Auditoria · Locais), botões CSV/JSON, indicação do registro.
- **Histórico** lê `audit_log` filtrando `action = 'admin_export'` (sem nova tabela), com quem exportou, dataset, formato e data.

### 10. Sessões administrativas `/admin/sessoes`
- Cards/tabela com usuário, papel, IP, navegador (parse simples do user-agent), login, logout, **duração**, badge **Ativa** vs **Encerrada**.
- Fonte: `admin_sessions`.

### 11. Pesquisa global
- Componente `<GlobalSearch />` no header (atalho ⌘K) que chama `adminGlobalSearch({ q })` — busca em artigos, biblioteca, locais, usuários e auditoria, retornando top 5 por categoria com link direto.

### 12. Estados visuais e responsividade
- Componentes utilitários `<AdminSkeleton />`, `<AdminEmpty />`, `<AdminError />`, `<AdminSuccessToast />` (reusa shadcn `Skeleton`, `Alert`, `sonner`).
- Layout do shell migra para grid responsivo: sidebar vira drawer no mobile (≤ md), grid de KPIs colapsa 2→3→4→5 colunas, tabelas usam `overflow-x-auto`; todas as novas telas auditadas em desktop/notebook/tablet/mobile.

### 13. Correção final de XSS
- Reauditar `src/lib/sanitize-html.ts`, `src/components/site/SafeHtml.tsx` e `upsertAdminArticle` (sanitização server-side já adicionada no turno anterior).
- Adicionar teste manual: salvar artigo com payload `<script>` e validar que o HTML persistido está limpo.
- Reexecutar `security--run_security_scan`.

### 14. Findings RLS atuais (write policies)
Os 4 warnings `MISSING_RLS_PROTECTION` (`account_lockouts`, `admin_sessions`, `login_attempts`, `mfa_recovery_codes`) são por design — todas as escritas passam pelo `service_role` em server fns, RLS bloqueia escrita anon/authenticated por default. Vão ser marcados como **ignored** com justificativa e registrados na `@security-memory`.

### 15. Relatório final
Ao concluir, entrego:
- telas reformuladas e novas rotas
- novas server fns criadas
- melhorias de UX/editoriais/visuais/produtividade
- resultado do novo scan de segurança
- pendências e recomendações futuras

---

### Resumo técnico (rápido)

**Arquivos novos**
- `src/lib/admin-overview.functions.ts` (dashboard + segurança + global search + auditoria paginada + usuários enriquecidos)
- `src/components/admin/` → `AdminSidebar.tsx`, `AdminHeader.tsx`, `GlobalSearch.tsx`, `QuickActions.tsx`, `RecentActivity.tsx`, `KpiCard.tsx`, `StatusFlow.tsx`, `SecurityBadge.tsx`, `AuditTimeline.tsx`, `UserCard.tsx`, `LibraryCard.tsx`, `SessionCard.tsx`, `AdminSkeleton.tsx`, `AdminEmpty.tsx`, `AdminError.tsx`
- Rotas: `/admin/seguranca`, `/admin/publicacoes`, `/admin/publicacoes/$tipo` (ou 6 arquivos filtrados), `/admin/dashboard` (caso o usuário prefira manter `/admin` listando conteúdo — proposta atual: `/admin` = dashboard)
- Reescrita: `route.tsx`, `index.tsx`, `auditoria.tsx`, `backup.tsx`, `sessoes.tsx`, `usuarios/index.tsx`, `biblioteca/index.tsx`, `mapa/index.tsx`

**Banco**: nenhuma migração necessária (apenas leituras agregadas).

**Segurança**: sem alterações em RLS/MFA/CSP/headers; só correções/justificativas.
