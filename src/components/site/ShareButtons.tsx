import { Facebook, Link2, Linkedin, MessageCircle, Send, Share2, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { buildAllShareLinks, type ShareTarget } from "@/lib/share-urls";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    setHasNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const target: ShareTarget = { title, url, description };
  const links = buildAllShareLinks(target);

  const btn =
    "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card hover:bg-muted transition text-foreground/80 hover:text-foreground";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: description ?? title, url });
    } catch {
      /* usuário cancelou */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Ferramentas de compartilhamento">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mr-1"
        title="Estas plataformas são apenas ferramentas de compartilhamento e não são canais oficiais do projeto."
      >
        Compartilhar
      </span>
      {hasNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          className={btn}
          aria-label="Compartilhar"
          title="Compartilhar"
        >
          <Share2 className="size-4" />
        </button>
      )}
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="size-4" />
      </a>
      <a
        href={links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="X / Twitter"
        title="X / Twitter"
      >
        <Twitter className="size-4" />
      </a>
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Facebook"
        title="Facebook"
      >
        <Facebook className="size-4" />
      </a>
      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="LinkedIn"
        title="LinkedIn"
      >
        <Linkedin className="size-4" />
      </a>
      <a
        href={links.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Telegram"
        title="Telegram"
      >
        <Send className="size-4" />
      </a>
      <button
        onClick={copy}
        className={btn}
        aria-label="Copiar link"
        title="Copiar link"
        type="button"
      >
        <Link2 className="size-4" />
      </button>
    </div>
  );
}
