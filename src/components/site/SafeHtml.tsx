import { useMemo } from "react";
import { sanitizeArticleHtml } from "@/lib/sanitize-html";

/**
 * Renderiza HTML salvo pelo editor de admin com sanitização ISOMÓRFICA
 * (sanitize-html) — funciona idêntico em SSR e no browser. Defesa em
 * profundidade contra XSS persistido caso conteúdo malicioso entre na base.
 * Compatível com bodies legados em texto puro (sem tags).
 */
export function SafeHtml({ html, className }: { html: string; className?: string }) {
  const clean = useMemo(() => {
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(html);
    const normalized = looksLikeHtml
      ? html
      : `<p>${html
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n\n+/g, "</p><p>")
          .replace(/\n/g, "<br />")}</p>`;
    return sanitizeArticleHtml(normalized);
  }, [html]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}

export function readingTimeMinutes(html: string | null | undefined): number {
  if (!html) return 1;
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
