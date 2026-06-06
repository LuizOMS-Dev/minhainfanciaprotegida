import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://minhainfanciaprotegida.com.br";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: SitemapEntry[] = [
          // Páginas principais
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
          { path: "/maio-laranja", changefreq: "monthly", priority: "0.9", lastmod: today },
          { path: "/sinais", changefreq: "monthly", priority: "0.9", lastmod: today },
          { path: "/riscos-online", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/pais", changefreq: "monthly", priority: "0.9", lastmod: today },
          { path: "/escolas", changefreq: "monthly", priority: "0.9", lastmod: today },
          { path: "/biblioteca", changefreq: "weekly", priority: "0.8", lastmod: today },
          { path: "/casos", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/noticias", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/como-ajudar", changefreq: "monthly", priority: "0.9", lastmod: today },
          { path: "/denuncia", changefreq: "monthly", priority: "1.0", lastmod: today },
          { path: "/legislacao", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/mapa", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/faq", changefreq: "monthly", priority: "0.7", lastmod: today },
          // Institucionais
          { path: "/sobre", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/objetivos", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/metodologia", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/fontes", changefreq: "monthly", priority: "0.6", lastmod: today },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        const headers = new Headers();
        headers.set("Content-Type", "application/xml; charset=utf-8");
        headers.set("Cache-Control", "public, max-age=3600");
        headers.set("X-Content-Type-Options", "nosniff");
        return new Response(xml, { status: 200, headers });
      },
    },
  },
});
