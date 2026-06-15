import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config para testes E2E + auditoria de acessibilidade (axe).
 *
 * Uso:
 *   bun run test:e2e          # roda todos os projetos
 *   bun run test:a11y         # roda apenas a suíte de acessibilidade
 *   bun run test:e2e:ui       # modo interativo
 *
 * Em CI, defina PLAYWRIGHT_BASE_URL para apontar para o preview deploy
 * (ex.: https://id-preview--<id>.lovable.app) e o webServer é ignorado.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const useLocalServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile-small",
      use: { ...(devices["iPhone SE (3rd gen)"] ?? devices["iPhone SE"]) },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
    },
    {
      name: "mobile-large",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "tablet",
      use: { ...devices["iPad (gen 7)"] },
    },
    {
      name: "tablet-landscape",
      use: { ...devices["iPad (gen 7) landscape"] },
    },
  ],
  webServer: useLocalServer
    ? {
        command: "bun run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
