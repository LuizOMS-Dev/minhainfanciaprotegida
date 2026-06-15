import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildSitemapXml, articlePathFor, type SitemapEntry } from "@/lib/sitemap-xml";

const BASE_URL = "https://minhainfanciaprotegida.com.br";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: SitemapEntry[] = [
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
          { path: "/sobre", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/objetivos", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/metodologia", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/fontes", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/atualizacoes", changefreq: "monthly", priority: "0.7", lastmod: today },
        ];

        // Conteúdo dinâmico — Notícias e Casos publicados no banco.
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin
            .from("articles")
            .select("slug, type, updated_at, publish_at, status")
            .eq("status", "published")
            .or(`publish_at.is.null,publish_at.lte.${new Date().toISOString()}`);
          if (error) {
            console.error("[sitemap] supabase error", error);
          } else if (data) {
            for (const row of data) {
              const path = articlePathFor(row.type as "news" | "case", row.slug);
              if (!path) continue;
              const lastmod = (row.updated_at ?? row.publish_at ?? "").slice(0, 10) || today;
              entries.push({
                path,
                lastmod,
                changefreq: "weekly",
                priority: row.type === "news" ? "0.8" : "0.7",
              });
            }
          }
        } catch (e) {
          console.error("[sitemap] dynamic fetch failed", e);
        }

        const xml = buildSitemapXml(BASE_URL, entries);
        const headers = new Headers();
        headers.set("Content-Type", "application/xml; charset=utf-8");
        headers.set("Cache-Control", "public, max-age=300, s-maxage=600");
        headers.set("X-Content-Type-Options", "nosniff");
        return new Response(xml, { status: 200, headers });
      },
    },
  },
});
