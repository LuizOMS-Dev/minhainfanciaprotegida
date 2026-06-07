/**
 * Helpers puros para gerar URLs de compartilhamento social.
 * Testáveis sem DOM ou rede.
 */

export interface ShareTarget {
  title: string;
  url: string;
  description?: string;
}

export type ShareNetwork =
  | "whatsapp"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "telegram";

export function buildShareLink(network: ShareNetwork, t: ShareTarget): string {
  const title = encodeURIComponent(t.title);
  const url = encodeURIComponent(t.url);
  const desc = encodeURIComponent(t.description ?? "");
  switch (network) {
    case "whatsapp":
      return `https://wa.me/?text=${title}%20${url}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "telegram":
      return `https://t.me/share/url?url=${url}&text=${title}${desc ? `%20-%20${desc}` : ""}`;
  }
}

export function buildAllShareLinks(t: ShareTarget): Record<ShareNetwork, string> {
  return {
    whatsapp: buildShareLink("whatsapp", t),
    twitter: buildShareLink("twitter", t),
    facebook: buildShareLink("facebook", t),
    linkedin: buildShareLink("linkedin", t),
    telegram: buildShareLink("telegram", t),
  };
}
