/**
 * Construtor puro de XML do sitemap. Sem I/O — testável isoladamente.
 */

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemapXml(baseUrl: string, entries: SitemapEntry[]): string {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${escapeXml(`${baseUrl}${e.path}`)}</loc>`,
      e.lastmod ? `    <lastmod>${escapeXml(e.lastmod)}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

export function articlePathFor(type: "news" | "case" | "risk" | "guide", slug: string): string | null {
  switch (type) {
    case "news":
      return `/noticias/${slug}`;
    case "case":
      return `/casos/${slug}`;
    default:
      // risk = catálogo estático (/riscos-online); guide = biblioteca estática.
      // Não emitimos URL por slug do banco para esses tipos.
      return null;
  }
}
