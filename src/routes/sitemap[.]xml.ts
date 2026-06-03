import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/maio-laranja", changefreq: "monthly", priority: "0.9" },
          { path: "/sinais", changefreq: "monthly", priority: "0.9" },
          { path: "/como-ajudar", changefreq: "monthly", priority: "0.9" },
          { path: "/denuncia", changefreq: "monthly", priority: "1.0" },
          { path: "/legislacao", changefreq: "monthly", priority: "0.8" },
          { path: "/mapa", changefreq: "monthly", priority: "0.7" },
          { path: "/galeria", changefreq: "monthly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.7" },
          { path: "/casos", changefreq: "weekly", priority: "0.9" },
          { path: "/noticias", changefreq: "weekly", priority: "0.9" },
          { path: "/riscos-online", changefreq: "weekly", priority: "0.9" },
          { path: "/pais", changefreq: "monthly", priority: "0.9" },
          { path: "/escolas", changefreq: "monthly", priority: "0.9" },
          { path: "/biblioteca", changefreq: "weekly", priority: "0.8" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
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

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
