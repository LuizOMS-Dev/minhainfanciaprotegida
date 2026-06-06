import { test, expect } from "@playwright/test";

/**
 * E2E: SiteHeader em mobile/tablet
 * Valida header fixo, busca, hambúrguer e botão "Denuncie" em diferentes
 * larguras (configuradas em playwright.config.ts via projects).
 */

test.describe("SiteHeader — mobile/tablet", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("header permanece fixo no topo ao rolar a página", async ({ page }) => {
    const header = page.locator("header").first();
    await expect(header).toBeVisible();

    const initialBox = await header.boundingBox();
    expect(initialBox?.y).toBeLessThanOrEqual(64); // logo abaixo da faixa Disque 100

    // Rola bastante a página e confirma que o header ainda está no topo do viewport
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(200);

    const scrolledBox = await header.boundingBox();
    expect(scrolledBox).not.toBeNull();
    expect(scrolledBox!.y).toBeLessThanOrEqual(8); // sticky encostado no topo

    // Altura não muda entre estados (sem "pular")
    expect(Math.round(scrolledBox!.height)).toBe(Math.round(initialBox!.height));
  });

  test("botão de busca está acessível e abre o diálogo de busca", async ({
    page,
    isMobile,
  }) => {
    // Em telas menores existe um botão somente-ícone com aria-label "Abrir busca"
    const searchBtn = isMobile
      ? page.getByRole("button", { name: /abrir busca/i }).first()
      : page.getByRole("button", { name: /abrir busca global/i });

    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    // O diálogo de busca expõe um aria-label "Busca global"
    const dialog = page.getByRole("dialog", { name: /busca global/i });
    await expect(dialog).toBeVisible();

    // Fecha com Escape
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("hambúrguer abre/fecha o menu e expõe estado via aria-expanded", async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 0) >= 1024, "Apenas em mobile/tablet (<1024px)");

    const burger = page.getByRole("button", {
      name: /abrir menu de navegação/i,
    });
    await expect(burger).toBeVisible();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(burger).toHaveAttribute("aria-controls", "mobile-nav");

    // Tap target mínimo 44x44
    const box = await burger.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);

    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible();
    await expect(
      mobileNav.getByRole("link", { name: /início/i }),
    ).toBeVisible();
    await expect(
      mobileNav.getByRole("link", { name: /denunciar agora/i }),
    ).toBeVisible();

    // Escape fecha o menu
    await page.keyboard.press("Escape");
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(mobileNav).toBeHidden();
  });

  test("botão Denuncie aparece de acordo com o breakpoint", async ({
    page,
    viewport,
  }) => {
    const width = viewport?.width ?? 0;
    const denuncieDesktop = page
      .locator("header")
      .getByRole("link", { name: /denuncie agora/i });

    if (width >= 768) {
      await expect(denuncieDesktop).toBeVisible();
      await expect(denuncieDesktop).toHaveAttribute("href", "/denuncia");
    } else {
      // Em telas pequenas o CTA fica dentro do menu mobile
      await expect(denuncieDesktop).toBeHidden();
      await page
        .getByRole("button", { name: /abrir menu de navegação/i })
        .click();
      const cta = page
        .locator("#mobile-nav")
        .getByRole("link", { name: /denunciar agora/i });
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute("href", "/denuncia");
    }
  });

  test("faixa permanente do Disque 100 está visível e clicável", async ({
    page,
  }) => {
    const tel = page.getByRole("link", { name: /disque 100/i }).first();
    await expect(tel).toBeVisible();
    await expect(tel).toHaveAttribute("href", "tel:100");
  });
});
