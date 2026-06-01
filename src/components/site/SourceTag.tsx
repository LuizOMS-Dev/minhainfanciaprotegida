import { ExternalLink } from "lucide-react";

interface SourceTagProps {
  source: string;
  year: string | number;
  url: string;
  label?: string;
}

export function SourceTag({ source, year, url, label = "Fonte" }: SourceTagProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-start gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-[color:var(--orange)] transition-colors"
    >
      <span className="font-semibold">{label}:</span>
      <span>
        {source} ({year})
      </span>
      <ExternalLink className="size-3 mt-0.5 shrink-0" aria-hidden />
    </a>
  );
}
