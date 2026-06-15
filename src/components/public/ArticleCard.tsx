import { ArrowUpRight, Calendar } from "lucide-react";
import { SourceTag } from "@/components/shared/SourceTag";

interface ArticleCardProps {
  title: string;
  date: string; // ISO
  excerpt: string;
  image: string;
  tag?: string;
  source: { name: string; url: string };
  href?: string;
}

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export function ArticleCard({ title, date, excerpt, image, tag, source, href }: ArticleCardProps) {
  const dateLabel = fmt.format(new Date(date));
  const Wrapper: React.ElementType = href ? "a" : "article";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer", "aria-label": title }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group block h-full rounded-2xl overflow-hidden bg-card border border-border hover-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/60 via-transparent" />
        {tag && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            {tag}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3">
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5" aria-hidden /> <time dateTime={date}>{dateLabel}</time>
        </p>
        <h3 className="font-display text-xl font-semibold leading-snug text-balance group-hover:text-[color:var(--red-inst)] transition-colors">
          {title}
          {href && <ArrowUpRight className="inline-block ml-1 size-4 align-text-top opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{excerpt}</p>
        <div className="mt-2 pt-3 border-t border-border">
          <SourceTag source={source.name} year={new Date(date).getFullYear()} url={source.url} asText={!href} />
        </div>
      </div>
    </Wrapper>
  );
}
