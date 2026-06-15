import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, BookMarked, Calendar, Download, ExternalLink, Tag, Users } from "lucide-react";
import { library } from "@/content/library";
import { SafeHtml } from "@/components/site/SafeHtml";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { JsonLd } from "@/components/site/JsonLd";
import { ShareButtons } from "@/components/site/ShareButtons";

const SITE = "https://minhainfanciaprotegida.com.br";

export const Route = createFileRoute("/biblioteca/$slug")({
  loader: ({ params }) => {
    const item = library.find((i) => i.slug === params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const i = loaderData?.item;
    if (!i) return { meta: [{ title: "Material — Biblioteca" }] };
    return {
      meta: [
        { title: `${i.title} — Biblioteca | Infância Protegida` },
        { name: "description", content: i.description },
        { property: "og:title", content: i.title },
        { property: "og:description", content: i.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${SITE}/biblioteca/${i.slug}` },
      ],
      links: [{ rel: "canonical", href: `${SITE}/biblioteca/${i.slug}` }],
    };
  },
  component: LibraryDetail,
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Não foi possível carregar este material</h1>
      <Link to="/biblioteca" className="mt-6 inline-block text-[color:var(--red-inst)] underline">
        Voltar para Biblioteca
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Material não encontrado</h1>
      <Link to="/biblioteca" className="mt-6 inline-block text-[color:var(--red-inst)] underline">
        Voltar para Biblioteca
      </Link>
    </div>
  ),
});

function LibraryDetail() {
  const { item } = Route.useLoaderData();
  const url = `${SITE}/biblioteca/${item.slug}`;

  return (
    <article className="bg-background">
      <header className="border-b border-border bg-[color:var(--navy-deep)] text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            to="/biblioteca"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden /> Biblioteca
          </Link>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <BookMarked className="size-3.5 text-[color:var(--orange)]" aria-hidden />
            {item.category}
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-tight text-balance">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-white/85 leading-relaxed">{item.description}</p>
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <div className="inline-flex items-center gap-1.5">
              <Tag className="size-4" aria-hidden /> {item.sourceOrg}
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" aria-hidden /> {item.year}
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Users className="size-4" aria-hidden /> {item.audience}
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-4 py-2 text-sm font-semibold hover:opacity-95"
            >
              <Download className="size-4" /> Acessar material oficial
              <ExternalLink className="size-3.5" />
            </a>
            <ShareButtons title={item.title} url={url} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {item.body ? (
          <SafeHtml
            html={item.body}
            className="prose prose-neutral max-w-none text-foreground/90 leading-relaxed"
          />
        ) : (
          <p className="text-muted-foreground">{item.description}</p>
        )}

        <div className="mt-12">
          <ReferencesBlock
            primary={{ label: `${item.sourceOrg} — Publicação oficial`, url: item.url }}
            lastVerified="2025-11-15"
          />
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: item.title,
          description: item.description,
          datePublished: String(item.year),
          url,
          publisher: { "@type": "Organization", name: item.sourceOrg },
          audience: { "@type": "Audience", audienceType: item.audience },
        }}
      />
    </article>
  );
}
