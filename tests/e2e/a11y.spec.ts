import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Auditoria automatizada de acessibilidade (axe-core) — foco no header e na
 * navegação mobile/tablet. Falha o build em violações sérias/críticas das
 * regras WCAG 2.0/2.1 A e AA.
 *
 * Rodar localmente: bun run test:a11y
 * Em CI esses testes integram o gate de qualidade do build.
 */

const ROUTES_TO_AUDIT = ["/", "/sobre", "/objetivos", "/denuncia"];

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

function failingViolations(results: { violations: Array<{ impact?: string | null; id: string; help: string; nodes: unknown[] }> }) {
  return results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
}

test.describe("Acessibilidade — varredura global por rota", () => {
  for (const route of ROUTES_TO_AUDIT) {
    test(`axe: ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(AXE_TAGS)
        .analyze();

      const blocking = failingViolations(results);
      if (blocking.length) {
        console.log(
          "Violações axe encontradas:\n" +
            JSON.stringify(
              blocking.map((v) => ({
                id: v.id,
                impact: v.impact,
                help: v.help,
                nodes: v.nodes.length,
              })),
              null,
              2,
            ),
        );
      }
      expect(blocking, "Violações sérias/críticas de acessibilidade").toEqual(
        [],
      );
    });
  }
});

test.describe("Acessibilidade — header e navegação mobile", () => {
  test("header (estado padrão) não tem violações sérias", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .include("header")
      .withTags(AXE_TAGS)
      .analyze();
    expect(failingViolations(results)).toEqual([]);
  });

  test("menu mobile aberto não tem violações sérias", async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 0) >= 1024, "Apenas em mobile/tablet");
    await page.goto("/");
    await page
      .getByRole("button", { name: /abrir menu de navegação/i })
      .click();
    await expect(page.locator("#mobile-nav")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include("header")
      .include("#mobile-nav")
      .withTags(AXE_TAGS)
      .analyze();
    expect(failingViolations(results)).toEqual([]);
  });
});
