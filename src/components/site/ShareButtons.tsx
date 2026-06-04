import { Facebook, Link2, MessageCircle, Twitter, Check } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  };

  const btn =
    "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card hover:bg-muted transition text-foreground/80 hover:text-foreground";

  return (
    <div className="flex items-center gap-2" aria-label="Compartilhar">
      <span className="text-xs uppercase tracking-wider text-muted-foreground mr-1">Compartilhar</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Compartilhar no WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="size-4" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Compartilhar no X / Twitter"
        title="X / Twitter"
      >
        <Twitter className="size-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Compartilhar no Facebook"
        title="Facebook"
      >
        <Facebook className="size-4" />
      </a>
      <button onClick={copy} className={btn} aria-label="Copiar link" title="Copiar link" type="button">
        {copied ? <Check className="size-4 text-emerald-600" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
