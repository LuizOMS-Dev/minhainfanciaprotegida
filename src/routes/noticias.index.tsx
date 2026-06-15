import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Newspaper, ArrowRight, ShieldCheck, Scale, BookOpen, Phone } from "lucide-react";
import { news } from "@/content/news";
import { FaqBlock } from "@/components/public/ArticleBlocks";
import { ArticleCard } from "@/components/public/ArticleCard";
import { Reveal } from "@/components/shared/Reveal";
import { PageHero } from "@/components/public/PageHero";
import { listPublishedArticles } from "@/services/articleService";
import journalismImg from "@/assets/journalism.jpg";
import heroNoticias from "@/assets/hero-noticias.jpg";

export const Route = createFileRoute("/noticias/")({
  head: () => ({
    meta: [
      { title: "Notícias e conscientização — Infância Protegida" },
      {
        name: "description",
        content:
          "Atualizações, pesquisas, novas leis e ações sobre o combate à violência sexual contra crianças e adolescentes. Conteúdo atualizado e baseado em fontes oficiais.",
      },
      { property: "og:title", content: "Notícias — Infância Protegida" },
      {
        property: "og:description",
        content: "Acompanhe pesquisas, leis e mobilizações pelo direito à infância protegida.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/noticias" },
      { property: "og:image", content: "https://minhainfanciaprotegida.com.br/hero-noticias.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Notícias — Infância Protegida" },
      {
        name: "twitter:description",
        content: "Acompanhe pesquisas, leis e mobilizações pelo direito à infância protegida.",
      },
      { name: "twitter:image", content: "https://minhainfanciaprotegida.com.br/hero-noticias.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/noticias" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Notícias — Infância Protegida",
          "url": "https://minhainfanciaprotegida.com.br/noticias",
          "description": "Atualizações, pesquisas, novas leis e ações sobre o combate à violência sexual contra crianças e adolescentes.",
          "isPartOf": { "@id": "https://minhainfanciaprotegida.com.br/#website" }
        })
      }
    ]
  }),
  component: NoticiasPage,
});

const CATEGORIES = ["Todas", "Legislação", "Campanha", "Pesquisa", "Internet", "Direitos"] as const;

function NoticiasPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todas");
  const fetchPublished = useServerFn(listPublishedArticles);
  const { data: published } = useQuery({
    queryKey: ["published-articles", "news"],
    queryFn: () => fetchPublished({ data: { type: "news", limit: 50 } }),
  });

  const dbList = useMemo(() => {
    const items = published?.articles ?? [];
    return cat === "Todas" ? items : items.filter((n) => n.category === cat);
  }, [published, cat]);

  const staticList = useMemo(() => {
    const filtered = cat === "Todas" ? news : news.filter((n) => n.category === cat);
    return [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [cat]);

  return (
    <div className="bg-background">
      <PageHero
        image={heroNoticias}
        eyebrow="Notícias e conscientização"
        icon={<Newspaper className="size-3.5 text-[color:var(--orange)]" />}
        title="O que está acontecendo agora"
        description="Notícias verificadas, pesquisas e atualizações legais. Esta área é atualizada continuamente pelo painel editorial."
      />

      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* CATEGORY TABS - REDESIGNED */}
          <div className="flex flex-wrap gap-2 mb-12" role="tablist" aria-label="Filtrar por categoria">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--navy)] ${
                  cat === c
                    ? "bg-[color:var(--navy)] text-white border-[color:var(--navy)] shadow-sm"
                    : "bg-transparent text-muted-foreground border-border hover:border-[color:var(--navy)]/30 hover:text-[color:var(--navy-deep)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dbList.map((a, i) => (
              <Reveal key={a.id} delay={i * 60}>
                <Link to="/noticias/$slug" params={{ slug: a.slug }} className="block h-full">
                  <ArticleCard
                    title={a.title}
                    date={a.publish_at ?? a.updated_at}
                    excerpt={a.subtitle ?? ""}
                    image={a.cover_url || journalismImg}
                    tag={a.category ?? "Notícia"}
                    source={{
                      name: a.primary_source_label ?? "Infância Protegida",
                      url: a.primary_source_url ?? "/noticias",
                    }}
                  />
                </Link>
              </Reveal>
            ))}
            {staticList.map((n, i) => (
              <Reveal key={n.slug} delay={(dbList.length + i) * 60}>
                <Link to="/noticias/$slug" params={{ slug: n.slug }} className="block h-full">
                  <ArticleCard
                    title={n.title}
                    date={n.date}
                    excerpt={n.excerpt}
                    image={n.image}
                    tag={n.category}
                    source={n.source}
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-card border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-[color:var(--navy-deep)] mb-8 text-center">Critérios Editoriais</h2>
          </Reveal>
          <FaqBlock
            items={[
              {
                q: "Qual a fonte das notícias publicadas aqui?",
                a: "Apenas fontes oficiais, como Ministérios (MDHC, Ministério da Justiça), Polícia Federal, ONGs reconhecidas (SaferNet, Childhood Brasil) e portais governamentais.",
              },
              {
                q: "Vocês publicam casos em andamento?",
                a: "Para proteger as vítimas e não atrapalhar investigações, não fazemos cobertura jornalística de casos em tempo real. Publicamos apenas atualizações legislativas, operações policiais deflagradas ou pesquisas consolidadas.",
              },
              {
                q: "Como posso denunciar algo que vi nas notícias?",
                a: "Qualquer violação de direitos humanos na internet pode ser denunciada anonimamente pelo portal da SaferNet ou pelo Disque 100. Em caso de emergência, ligue 190.",
              },
            ]}
          />
        </div>
      </section>

      <InstitutionalStripe />
    </div>
  );
}

function InstitutionalStripe() {
  return (
    <section className="bg-[color:var(--navy)] text-white py-16 sm:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="stripe-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stripe-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3 relative z-10">
        <StripeCard
          icon={ShieldCheck}
          title="Nossa metodologia"
          description="Entenda os critérios de seleção e curadoria do conteúdo antes da publicação."
          to="/metodologia"
          cta="Ver metodologia"
        />
        <StripeCard
          icon={Phone}
          title="Canais de denúncia"
          description="Saiba como e onde denunciar anonimamente situações de risco ou suspeitas."
          to="/denuncia"
          cta="Acessar canais"
        />
        <StripeCard
          icon={Scale}
          title="Legislação"
          description="O que dizem as leis brasileiras sobre os crimes relatados."
          to="/legislacao"
          cta="Ver leis"
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-white/60 font-semibold relative z-10">
        <BookOpen className="size-4 text-[color:var(--orange)]" aria-hidden />
        Portal educativo e independente · Sem fins lucrativos
      </div>
    </section>
  );
}

function StripeCard({
  icon: Icon,
  title,
  description,
  to,
  cta,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  to: string;
  cta: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col h-full rounded-xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[color:var(--orange)] text-[color:var(--navy-deep)] mb-6 shadow-sm">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="font-display text-2xl font-semibold leading-tight text-white">{title}</h3>
      <p className="mt-3 text-sm text-white/80 leading-relaxed flex-grow">{description}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--orange)]">
        {cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
