# Plano tecnico: Integracao oficial com Instagram

Data: 2026-06-17
Projeto: Minha Infancia Protegida
Escopo: Admin Instagram, publicacoes, rascunhos, agendamento, historico, logs e seguranca.

## 1. Fontes oficiais consultadas

Base oficial:
- https://developers.facebook.com/docs/instagram-platform/
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/
- https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app/
- https://developers.facebook.com/docs/instagram-platform/content-publishing/
- https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media/
- https://developers.facebook.com/docs/instagram-platform/app-review/

Observacao: algumas paginas oficiais da Meta exigem login para leitura completa no navegador. A decisao tecnica abaixo usa somente a rota oficial documentada pela Meta e deve ser reconfirmada no painel Meta Developers durante a configuracao real do app.

## 2. Diagnostico do projeto atual

Stack identificada:
- React 19.
- TanStack Start/Router/Query.
- Vite.
- Supabase para backend, auth e banco.
- Vercel para hospedagem.
- Painel admin existente em `src/routes/_authenticated/admin`.
- Servicos separados em `src/services`.
- Variaveis de ambiente documentadas em `.env.example`.
- Nao foi identificado modulo Instagram existente.
- Nao foi identificado endpoint publico Instagram existente.

Conclusao:
- O projeto suporta bem uma integracao modular com Instagram.
- A implementacao deve ficar separada em rotas admin, servicos server-side, tabelas Supabase e logs seguros.
- Publicacao real nao deve ser implementada diretamente no frontend.

## 3. Viabilidade sem Facebook Page

Caminho recomendado:
- Instagram API with Instagram Login.
- Business Login for Instagram.
- Conta profissional Instagram do tipo Business ou Creator.

A conta informada e do tipo Creator. A documentacao oficial da Meta indica que a API moderna com Instagram Login atende contas profissionais, incluindo creators. Portanto, a estrategia correta e nao comecar pela integracao antiga baseada em Facebook Login + Facebook Page.

Estado da viabilidade:
- Viavel para iniciar arquitetura e painel admin.
- Viavel para OAuth oficial quando houver Meta App configurado.
- Viavel para publicacao somente apos confirmar permissoes, app review/acesso avancado e capacidades reais da conta no painel Meta.

## 4. Conta Creator atende ao objetivo?

Atende parcialmente ao objetivo principal:
- Rascunhos: sim, controlado pelo nosso banco.
- Agendamento: sim, controlado pelo nosso backend/cron.
- Feed: sim, quando permissao de publicacao estiver aprovada.
- Carrossel: sim, quando permissao de publicacao estiver aprovada.
- Reels: sim, quando permissao de publicacao estiver aprovada.
- Stories: tratar como recurso condicionado. A referencia de media da Meta inclui container de stories, mas a disponibilidade real deve ser confirmada com a conta Creator, permissoes e produto liberado no Meta App. Ate confirmar, o painel deve bloquear stories com mensagem clara.

Mensagem recomendada no painel para recurso bloqueado:
"Stories ainda nao estao habilitados para esta conta/permissao. Este recurso sera liberado somente quando a Meta confirmar suporte para esta conta Creator e app aprovado."

## 5. Recursos suportados e bloqueios

| Recurso | Decisao inicial | Motivo |
|---|---|---|
| Feed imagem unica | Suportar | Content Publishing oficial cobre publicacao de imagem unica. |
| Feed video unico | Suportar com validacoes | Content Publishing oficial cobre video unico. |
| Carrossel | Suportar | Content Publishing oficial cobre carousel posts. |
| Reels | Suportar | Content Publishing oficial cobre reels. |
| Stories | Bloquear ate confirmacao real | Media endpoint cita stories, mas a conta/permissao/produto precisam confirmar suporte. |
| Comentarios | Fora do escopo inicial | Exige permissoes adicionais. |
| Mensagens | Fora do escopo inicial | Exige permissoes adicionais e aumenta risco. |
| Insights | Futuro | Nao necessario para publicacao. |

## 6. Permissoes provaveis

Para a fase de conexao/publicacao:
- `instagram_business_basic`.
- `instagram_business_content_publish`.

Possiveis permissoes conforme produto/rota no painel Meta:
- `instagram_basic`, se exigido pelo fluxo/endpoint selecionado no app.
- Permissoes de comentarios/mensagens somente se virarem escopo futuro.

Regra:
- Solicitar somente o minimo necessario.
- Nao pedir mensagens/comentarios/insights na primeira versao.

## 7. App Review e requisitos Meta

Para ambiente de desenvolvimento:
- Pode ser possivel testar com usuarios vinculados ao app Meta, dependendo da configuracao do Meta Developers.

Para producao:
- Deve ser esperado App Review para acesso avancado.
- Deve ser esperado processo de validacao do app/produto pela Meta.
- Business Verification pode ser exigida conforme o produto/permissao/endpoints.

Conclusao:
- Nao prometer publicacao em producao antes de passar pelo painel Meta Developers e pela revisao exigida.

## 8. Arquitetura recomendada

Camadas:
- UI admin: telas de conexao, nova publicacao, calendario e historico.
- API/server functions: rotas protegidas por admin e MFA.
- Servico Instagram: OAuth, token exchange, teste de conexao, criacao de container, publish container, status e limites.
- Banco Supabase: contas conectadas, posts, logs.
- Storage/media: upload local no projeto, URL publica/controlada para a Meta durante publicacao.
- Scheduler: Vercel Cron ou Supabase Scheduled Function.

Recomendacao inicial:
- Usar Vercel Cron chamando endpoint interno protegido por `CRON_SECRET`, porque o projeto ja esta hospedado na Vercel.
- Guardar tokens somente server-side, criptografados em banco.
- Nunca expor token ao navegador.
- Manter automacao real desligada por padrao com `INSTAGRAM_AUTO_PUBLISH_ENABLED=false`.

## 9. Variaveis de ambiente futuras

Nao criar agora sem necessidade real.

Quando chegar na fase OAuth/publicacao:
- `INSTAGRAM_APP_ID`.
- `INSTAGRAM_APP_SECRET`.
- `INSTAGRAM_REDIRECT_URI`.
- `INSTAGRAM_TOKEN_ENCRYPTION_KEY`.
- `INSTAGRAM_AUTO_PUBLISH_ENABLED=false`.
- `CRON_SECRET`.

Regras:
- Nenhuma dessas variaveis pode usar prefixo `VITE_` se for secreta.
- `INSTAGRAM_APP_SECRET`, token de acesso e chave de criptografia nunca podem ir para frontend.

## 10. Tabelas propostas

### `social_accounts`

Campos:
- `id uuid primary key`.
- `provider text` com valor `instagram`.
- `ig_user_id text`.
- `username text`.
- `account_name text`.
- `account_type text`.
- `scopes text[]` ou `jsonb`.
- `token_ciphertext text`.
- `refresh_token_ciphertext text null`, se a Meta retornar no fluxo aplicavel.
- `token_expires_at timestamptz null`.
- `status text`.
- `last_test_at timestamptz null`.
- `last_error text null`.
- `connected_by uuid references auth.users(id)`.
- `created_at timestamptz`.
- `updated_at timestamptz`.
- `disconnected_at timestamptz null`.

### `instagram_posts`

Campos:
- `id uuid primary key`.
- `social_account_id uuid references social_accounts(id)`.
- `type text` com valores `feed`, `carousel`, `reel`, `story`.
- `title text`.
- `caption text`.
- `hashtags text[]` ou `jsonb`.
- `media jsonb`.
- `preview jsonb`.
- `scheduled_at timestamptz null`.
- `status text` com valores `draft`, `review`, `scheduled`, `publishing`, `published`, `failed`, `cancelled`.
- `review_required boolean default true`.
- `publish_lock text null`.
- `publish_attempts int default 0`.
- `instagram_container_id text null`.
- `instagram_media_id text null`.
- `permalink text null`.
- `last_error text null`.
- `created_by uuid references auth.users(id)`.
- `approved_by uuid references auth.users(id) null`.
- `published_by uuid references auth.users(id) null`.
- `created_at timestamptz`.
- `updated_at timestamptz`.
- `published_at timestamptz null`.

### `instagram_publish_logs`

Campos:
- `id uuid primary key`.
- `post_id uuid references instagram_posts(id)`.
- `social_account_id uuid references social_accounts(id)`.
- `action text`.
- `status text`.
- `request_payload_safe jsonb null`.
- `response_payload_safe jsonb null`.
- `error_code text null`.
- `error_message text null`.
- `created_by uuid references auth.users(id) null`.
- `created_at timestamptz`.

RLS:
- Admin only.
- Escrita de publicacao exige admin + MFA.
- Scheduler usa service role ou funcao segura server-side.
- Logs nunca gravam tokens.

## 11. Endpoints propostos

Admin/OAuth:
- `GET /api/admin/instagram/status`.
- `GET /api/admin/instagram/connect`.
- `GET /api/admin/instagram/callback`.
- `POST /api/admin/instagram/test-connection`.
- `POST /api/admin/instagram/disconnect`.

Posts:
- `POST /api/admin/instagram/posts`.
- `GET /api/admin/instagram/posts`.
- `GET /api/admin/instagram/posts/:id`.
- `PATCH /api/admin/instagram/posts/:id`.
- `DELETE /api/admin/instagram/posts/:id`.
- `POST /api/admin/instagram/posts/:id/publish`.
- `POST /api/admin/instagram/posts/:id/retry`.
- `POST /api/admin/instagram/posts/:id/cancel`.

Scheduler:
- `POST /api/admin/instagram/cron/publish-due` protegido por `CRON_SECRET`.

Meta endpoints esperados:
- OAuth authorization URL do Instagram Login.
- Token exchange endpoint do Instagram Login.
- Consulta de conta profissional.
- Criacao de media container.
- Publicacao do media container.
- Consulta de status/permalink.
- Consulta de limite de publicacao, se disponivel para a conta.

## 12. Telas admin propostas

### Tela 1: Conexao Instagram

Componentes:
- Botao `Conectar Instagram`.
- Status da conexao.
- Username/account name.
- IG user ID.
- Tipo da conta.
- Permissoes concedidas.
- Expiracao do token.
- Botao `Testar conexao`.
- Botao `Desconectar`.

### Tela 2: Nova publicacao

Campos:
- Tipo: feed, carousel, reel, story.
- Bloqueio visual para story se nao confirmado.
- Titulo interno.
- Legenda.
- Hashtags.
- Upload/selecionar midia.
- Preview.
- Data/hora de agendamento.
- Status.

Acoes:
- Salvar rascunho.
- Enviar para revisao.
- Agendar.
- Publicar agora, com confirmacao explicita.

### Tela 3: Calendario

Recursos:
- Visualizacao por mes/semana/lista.
- Posts agendados.
- Filtros por status/tipo.
- Alertas de falha.

### Tela 4: Historico/logs

Recursos:
- Publicacoes realizadas.
- Falhas.
- Tentativas.
- Retry.
- Respostas seguras da Meta sem tokens.

## 13. Validacoes obrigatorias

Antes de publicar:
- Admin autenticado.
- MFA ativo para publicacao real.
- Conta Instagram conectada.
- Permissao de publicacao presente.
- Automacao habilitada explicitamente.
- Midia valida por tipo.
- URL da midia acessivel para a Meta.
- Caption dentro de limite.
- Hashtags normalizadas.
- Conta dentro do limite de publicacao.
- Post nao publicado anteriormente.
- Lock/idempotencia ativo para evitar duplicidade.

## 14. Seguranca

Regras obrigatorias:
- Nunca guardar token no frontend.
- Nunca expor token em logs.
- Nunca criar variavel secreta com prefixo `VITE_`.
- Criptografar token antes de salvar.
- Proteger endpoints admin com role admin + MFA.
- RLS admin only nas tabelas.
- Separar payload seguro e payload sensivel.
- Usar confirmacao humana para publicacao imediata.
- Manter `INSTAGRAM_AUTO_PUBLISH_ENABLED=false` ate homologacao.
- Bloquear stories ate confirmacao real de suporte.
- Nao usar browser automation, scraping, senha do Instagram, bot ou metodo nao oficial.

## 15. Riscos

Riscos externos:
- Meta pode exigir App Review antes de producao.
- Meta pode exigir verificacao empresarial.
- Meta pode alterar permissoes/endpoints.
- Stories podem nao estar disponiveis para a conta/permissao.
- URLs de midia precisam ser acessiveis pela Meta.
- Token pode expirar ou ser revogado.

Riscos internos:
- Publicacao duplicada se scheduler nao tiver lock.
- Vazamento de token se logs nao forem saneados.
- Publicacao acidental se fluxo nao exigir revisao.
- Midia inadequada para projeto sensivel envolvendo protecao infantil.

Mitigacoes:
- Lock/idempotencia.
- Logs seguros.
- Review required por padrao.
- MFA para publicacao.
- Automacao desligada por padrao.
- Capability flags por recurso.

## 16. Plano em fases

### Fase 1: Modulo visual admin sem publicacao

Criar:
- Rota admin Instagram.
- Tela de conexao mockada/sem token.
- Tela de nova publicacao em modo rascunho visual.
- Tela calendario placeholder.
- Tela historico placeholder.
- Mensagem clara sobre App Review e OAuth pendente.

Sem banco, sem Meta, sem deploy.

### Fase 2: Banco e rascunhos/agendamento

Criar migrations:
- `social_accounts`.
- `instagram_posts`.
- `instagram_publish_logs`.

Implementar:
- CRUD de rascunho.
- Agendamento local no banco.
- RLS admin only.

Requer confirmacao antes de aplicar no Supabase.

### Fase 3: OAuth Instagram Login

Implementar:
- Connect.
- Callback.
- Token exchange server-side.
- Criptografia do token.
- Status da conexao.

Requer:
- Meta App ID.
- Meta App Secret.
- Redirect URI.
- Configuracao no Meta Developers.

### Fase 4: Teste de conexao

Implementar:
- Validar token.
- Validar IG user ID.
- Validar account type.
- Validar scopes.
- Validar capacidade de publicacao.

### Fase 5: Publicacao manual suportada

Implementar:
- Feed.
- Carousel.
- Reels.
- Stories somente se confirmado.
- Logs seguros.
- Retry manual.

### Fase 6: Agendamento automatico

Implementar:
- Vercel Cron ou Supabase Scheduled Function.
- Lock/idempotencia.
- Retry controlado.
- Logs.

Requer confirmacao antes de deploy/producao.

### Fase 7: Historico, retry e protecoes

Implementar:
- Historico completo.
- Retry por erro recuperavel.
- Cancelamento.
- Alertas admin.
- Auditoria.

### Fase 8: Testes em dev antes de producao

Validar:
- OAuth.
- Token seguro.
- RLS.
- Fluxo admin.
- Publicacao manual em conta de teste.
- Scheduler em ambiente controlado.
- Build.
- Logs.

## 17. Decisao tecnica final desta etapa

A integracao e tecnicamente recomendada, mas deve ser feita por fases.
A primeira implementacao segura e a Fase 1 visual/admin sem publicacao.
Banco, OAuth, tokens, scheduler e deploy devem acontecer somente depois de confirmacao separada e credenciais corretas no ambiente seguro.

## 18. Status local em 2026-06-19

Implementado localmente:
- Fase 1: rota admin visual em `src/routes/_authenticated/admin/instagram.tsx`.
- Fase 2 local: migration `supabase/migrations/20260619090000_instagram_admin_module.sql`.
- Fase 2 local: servico `src/services/instagramService.ts` com status, listagem, rascunho, agendamento, cancelamento, retry, exclusao controlada e logs seguros.
- Fase 6 local: endpoint seguro de cron `src/routes/api/admin/instagram/cron/publish-due.ts`, bloqueado por `CRON_SECRET` e por `INSTAGRAM_AUTO_PUBLISH_ENABLED=false`.
- Fase OAuth local: callback oficial, estados OAuth com hash, token vault criptografado e botao Conectar Instagram preparados.
- Variaveis server-side documentadas em `.env.example`.

Ainda bloqueado de proposito:
- Configurar Meta App ID/Secret.
- Salvar token real ate o OAuth real ser concluido no painel Meta.
- Publicacao real na Meta.
- Vercel Cron em producao.

Motivo do bloqueio:
- Essas etapas tocam banco, credenciais, Meta App Review, automacao e producao.
- Devem ser ativadas apenas com confirmacao separada e ambiente seguro.
