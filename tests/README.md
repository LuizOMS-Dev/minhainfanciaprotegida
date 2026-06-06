# Testes E2E e auditoria de acessibilidade

Esta pasta contém os testes end-to-end do portal **Infância Protegida**,
executados com [Playwright](https://playwright.dev) e a integração
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) para
auditoria automática de acessibilidade.

## Estrutura

- `e2e/header.spec.ts` — valida o cabeçalho fixo, busca, hambúrguer e o botão
  **Denuncie Agora** em diferentes larguras de mobile e tablet.
- `e2e/a11y.spec.ts` — roda o axe-core nas principais rotas e no header
  (estado padrão e menu mobile aberto). Falha se houver violações
  `serious` ou `critical` das regras **WCAG 2.0/2.1 A e AA**.

Os breakpoints testados são configurados em `playwright.config.ts`
(`projects`): `iPhone SE`, `iPhone 13`, `Pixel 7`, `iPad` retrato e paisagem.

## Pré-requisitos

Os navegadores do Playwright precisam ser baixados na primeira execução:

```bash
bunx playwright install --with-deps
```

## Scripts disponíveis

| Script              | Descrição                                                |
| ------------------- | -------------------------------------------------------- |
| `bun run test:e2e`  | Roda todos os testes E2E em todos os projetos.           |
| `bun run test:a11y` | Roda apenas a suíte de acessibilidade (axe).             |
| `bun run test:e2e:ui` | Abre o modo interativo do Playwright.                  |
| `bun run ci:build`  | Roda `build` + `test:e2e` (gate de qualidade para CI).   |

O `playwright.config.ts` sobe automaticamente o `bun run dev` em
`http://localhost:3000`. Para apontar para um deploy de preview, defina
`PLAYWRIGHT_BASE_URL` e o servidor local é ignorado:

```bash
PLAYWRIGHT_BASE_URL=https://id-preview--<id>.lovable.app bun run test:e2e
```

## Integração no build

Para bloquear merges com regressões de acessibilidade, conecte o pipeline
de CI ao script `ci:build` (ou separadamente: `bun run build` seguido de
`bun run test:a11y`). Em GitHub Actions o reporter `github` já é ativado
automaticamente quando `process.env.CI` está definido.
