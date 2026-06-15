import { ExternalLink } from "lucide-react";

interface SourceTagProps {
  source: string;
  year: string | number;
  url: string;
  label?: string;
  /** When true, render as a plain span (use inside another anchor/Link). */
  asText?: boolean;
}

export function SourceTag({ source, year, url, label = "Fonte", asText = false }: SourceTagProps) {
  const content = (
    <>
      <span className="font-semibold">{label}:</span>
      <span>
        {source} ({year})
      </span>
      {!asText && <ExternalLink className="size-3 mt-0.5 shrink-0" aria-hidden />}
    </>
  );
  const cls =
    "inline-flex items-start gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-[color:var(--orange)] transition-colors";
  if (asText) return <span className={cls}>{content}</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cls}>
      {content}
    </a>
  );
}
