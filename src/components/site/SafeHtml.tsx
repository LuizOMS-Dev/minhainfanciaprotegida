import DOMPurify from "dompurify";
import { useMemo } from "react";

/**
 * Renderiza HTML salvo pelo editor de admin com sanitização.
 * - Em SSR (sem window) confia no HTML pois o editor já sanitiza ao salvar.
 * - Em CSR aplica DOMPurify como defesa em profundidade.
 * - Compatível com body legado em texto puro (sem tags) — converte em <p>.
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

    if (typeof window === "undefined") return normalized;
    return DOMPurify.sanitize(normalized, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "u", "s", "code", "pre", "blockquote",
        "h1", "h2", "h3", "h4", "ul", "ol", "li", "a", "img", "hr",
        "figure", "figcaption", "iframe",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "width", "height", "allowfullscreen", "frameborder"],
      ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/)/i,
    });
  }, [html]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}

export function readingTimeMinutes(html: string | null | undefined): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
