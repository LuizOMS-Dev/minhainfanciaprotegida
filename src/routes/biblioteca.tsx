import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { BookMarked, ExternalLink, FileText, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { library, type LibraryItem } from "@/content/library";
import heroBiblioteca from "@/assets/hero-biblioteca.jpg";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca de materiais oficiais — Infância Protegida" },
      {
        name: "description",
        content:
          "Cartilhas, guias, pesquisas e estudos sobre proteção de crianças e adolescentes — UNICEF, SaferNet, MDHC, Childhood Brasil, MP e mais.",
      },
      { property: "og:title", content: "Biblioteca — Infância Protegida" },
      {
        property: "og:description",
        content: "Materiais oficiais para famílias, educadores e profissionais.",
      },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/biblioteca" }],
  }),
  component: Page,
});

const CATEGORIES = [
  "Todas",
  "Cartilha",
  "Guia",
  "Pesquisa",
  "Estudo",
  "Material educativo",
] as const;
const AUDIENCES = [
  "Todos",
  "Famílias",
  "Educadores",
  "Profissionais",
  "Adolescentes",
  "Geral",
] as const;

function Page() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todas");
  const [aud, setAud] = useState<(typeof AUDIENCES)[number]>("Todos");

  const list = useMemo<LibraryItem[]>(() => {
    return library
      .filter((i) => (cat === "Todas" ? true : i.category === cat))
      .filter((i) => (aud === "Todos" ? true : i.audience === aud))
      .filter((i) => {
        if (!q.trim()) return true;
        const s = `${i.title} ${i.description} ${i.sourceOrg}`.toLowerCase();
        return s.includes(q.trim().toLowerCase());
      })
      .sort((a, b) => b.year - a.year);
  }, [q, cat, aud]);

  return (
    <>
      <PageHero
        image={heroBiblioteca}
        eyebrow="Biblioteca digital"
        icon={<BookMarked className="size-3.5 text-[color:var(--orange)]" />}
        title="Materiais oficiais para estudo e ação"
        description="Cartilhas, leis, guias, pesquisas e estudos publicados por órgãos oficiais e organizações de referência. Tudo verificado e atualizado."
      />

      <section className="py-12 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar título, descrição ou fonte..."
              aria-label="Buscar materiais"
              className="w-full rounded-full bg-card border border-border pl-11 pr-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2">
            <Filter className="size-4 text-muted-foreground" aria-hidden />
            <label className="sr-only" htmlFor="cat">
              Categoria
            </label>
            <select
              id="cat"
              value={cat}
              onChange={(e) => setCat(e.target.value as (typeof CATEGORIES)[number])}
              className="bg-transparent text-sm focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2">
            <label className="sr-only" htmlFor="aud">
              Público
            </label>
            <select
              id="aud"
              value={aud}
              onChange={(e) => setAud(e.target.value as (typeof AUDIENCES)[number])}
              className="bg-transparent text-sm focus:outline-none"
            >
              {AUDIENCES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((i, idx) => (
              <Reveal key={i.slug} delay={idx * 40}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 hover-lift flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-orange text-[color:var(--navy-deep)]">
                      <FileText className="size-5" aria-hidden />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {i.category} · {i.year}
                    </span>
                  </div>
                  <Link
                    to="/biblioteca/$slug"
                    params={{ slug: i.slug }}
                    className="mt-4 font-display text-lg font-semibold leading-snug hover:text-[color:var(--orange)] transition-colors"
                  >
                    {i.title}
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                    {i.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground min-w-0">
                      <span className="font-semibold text-foreground block truncate">
                        {i.sourceOrg}
                      </span>
                      Público: {i.audience}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to="/biblioteca/$slug"
                        params={{ slug: i.slug }}
                        className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                      >
                        Ver
                      </Link>
                      <a
                        href={i.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-3 py-1.5 text-xs font-semibold hover:opacity-95"
                        aria-label={`Acessar ${i.title} (fonte oficial)`}
                      >
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {list.length === 0 && (
            <p className="text-center text-muted-foreground py-16">
              Nenhum material encontrado com esses filtros.
            </p>
          )}
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ReferencesBlock
            primary={{
              label: "Centrais de conteúdo oficiais — MDHC, UNICEF, SaferNet, Childhood, MPF",
              url: "https://www.gov.br/mdh/pt-br/centrais-de-conteudo",
            }}
            secondary={[
              {
                label: "SaferNet Brasil — Biblioteca",
                url: "https://new.safernet.org.br/biblioteca",
              },
              {
                label: "UNICEF Brasil — Publicações",
                url: "https://www.unicef.org/brazil/relatorios",
              },
              {
                label: "Childhood Brasil — Publicações",
                url: "https://www.childhood.org.br/publicacao",
              },
            ]}
            lastVerified="2025-11-15"
          />
        </div>
      </section>
    </>
  );
}
