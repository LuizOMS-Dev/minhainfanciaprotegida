import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Gamepad2, MessageCircle, ShieldCheck, Smartphone, Timer } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ReferencesBlock } from "@/components/site/ReferencesBlock";
import { JsonLd, articleSchema, breadcrumb } from "@/components/site/JsonLd";
import familyImg from "@/assets/family-dialogue.jpg";
import digitalImg from "@/assets/digital-safety.jpg";

export const Route = createFileRoute("/pais")({
  head: () => ({
    meta: [
      { title: "Guia para Pais e Responsáveis — Infância Protegida" },
      {
        name: "description",
        content:
          "Como proteger crianças e adolescentes na internet: controle parental, tempo de tela, configurações de Roblox, Discord, TikTok, Instagram e WhatsApp, sinais de alerta e como conversar.",
      },
      { property: "og:title", content: "Guia para Pais — Infância Protegida" },
      {
        property: "og:description",
        content: "Orientações práticas para famílias proteger crianças e adolescentes no ambiente digital.",
      },
      { property: "og:image", content: familyImg },
    ],
    links: [{ rel: "canonical", href: "/pais" }],
  }),
  component: Page,
});

const platforms = [
  {
    name: "Roblox",
    tips: [
      "Ative a conta dos pais e o PIN parental nas configurações.",
      "Restrinja chat: permita apenas com amigos confirmados.",
      "Desative pagamentos e compras de Robux sem aprovação.",
    ],
    url: "https://en.help.roblox.com/hc/pt-br",
  },
  {
    name: "Discord",
    tips: [
      "Ative o Family Center para acompanhar conversas e amizades.",
      "Filtre conteúdo explícito em Configurações → Privacidade.",
      "Bloqueie mensagens diretas de não-amigos.",
    ],
    url: "https://support.discord.com/hc/pt-br",
  },
  {
    name: "TikTok",
    tips: [
      "Use a Sincronização Familiar para vincular sua conta à do adolescente.",
      "Defina conta privada e limite quem pode comentar e enviar DMs.",
      "Ative o tempo de tela e filtros de conteúdo restrito.",
    ],
    url: "https://www.tiktok.com/safety/pt-br",
  },
  {
    name: "Instagram",
    tips: [
      "Use a Supervisão de Conta para menores de 18 anos.",
      "Defina conta privada; revise lista de seguidores periodicamente.",
      "Ative o filtro de mensagens diretas de desconhecidos.",
    ],
    url: "https://about.instagram.com/pt-br/community/parents",
  },
  {
    name: "WhatsApp",
    tips: [
      "Configure Privacidade → Grupos: somente contatos podem adicionar.",
      "Oriente sobre o reencaminhamento de imagens (também é crime, art. 241-A ECA).",
      "Bloqueie e denuncie qualquer abordagem suspeita.",
    ],
    url: "https://faq.whatsapp.com/general/security-and-privacy",
  },
];

const conversationTips = [
  "Escolha um momento tranquilo e sem distrações.",
  "Use linguagem adequada à idade — sem julgamentos.",
  "Faça perguntas abertas: \"como você se sente quando…?\"",
  "Reforce que o adulto é responsável, não a criança.",
  "Combine sinais combinados (palavra-código) para pedir ajuda.",
  "Lembre que ela pode contar com você — sempre, sem punição.",
];

function Page() {
  return (
    <>
      <JsonLd data={[
        breadcrumb([
          { name: "Início", url: "/" },
          { name: "Guia para Pais", url: "/pais" },
        ]),
        articleSchema({
          headline: "Guia para Pais e Responsáveis",
          description: "Orientações práticas para proteger crianças e adolescentes no ambiente digital.",
          datePublished: "2025-11-15",
          image: familyImg,
          url: "/pais",
        }),
      ]} />

      <section className="relative isolate overflow-hidden bg-[color:var(--navy-deep)] text-white py-20 sm:py-28">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{ backgroundImage: `url(${familyImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[color:var(--navy-deep)]/95 to-[color:var(--navy-deep)]/70" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Para pais e responsáveis"
            title="Conversar protege. Configurar previne."
            description="Um guia prático com configurações de privacidade nas principais plataformas usadas por crianças e adolescentes, sinais de alerta e como abrir o diálogo."
            invert
          />
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Controle parental", desc: "Ative supervisão, PIN e filtros em todos os dispositivos compartilhados." },
            { icon: Timer, title: "Tempo de tela", desc: "Limite diário por app, com pausas e horários sem tela (refeições, sono)." },
            { icon: Eye, title: "Privacidade", desc: "Contas privadas, listas de amigos revisadas e desligar geolocalização." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <article className="h-full rounded-2xl border border-border bg-card p-6 hover-lift">
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-orange text-[color:var(--navy-deep)]">
                  <c.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[color:var(--orange-soft)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Plataformas digitais"
            title="Configurações de privacidade por plataforma"
            description="Resumo das principais ações em apps usados por crianças e adolescentes. Sempre confira a página oficial para versões mais recentes."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 hover-lift">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[color:var(--navy-deep)] text-[color:var(--orange)]">
                      <Smartphone className="size-5" aria-hidden />
                    </span>
                    <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-foreground/85 leading-relaxed">
                    {p.tips.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--red-inst)]" aria-hidden />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--red-inst)] hover:underline"
                  >
                    Central oficial <ArrowRight className="size-3.5" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-elegant">
              <img src={digitalImg} alt="Família conversando com criança sobre uso do celular" loading="lazy" className="size-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--orange)]">
              <MessageCircle className="size-3.5" /> Como conversar
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold leading-tight">
              Diálogo aberto é a melhor proteção
            </h2>
            <ul className="mt-6 space-y-3">
              {conversationTips.map((t) => (
                <li key={t} className="flex gap-3 text-foreground/85">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--orange)]" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link to="/sinais" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-5 py-3 font-semibold">
                <Eye className="size-4" /> Sinais de alerta
              </Link>
              <Link to="/riscos-online" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-semibold">
                <Gamepad2 className="size-4" /> Riscos online
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ReferencesBlock
            primary={{
              label: "SaferNet Brasil — Centro de Orientação a Famílias",
              url: "https://new.safernet.org.br/familias",
            }}
            secondary={[
              { label: "Childhood Brasil — Publicações", url: "https://www.childhood.org.br/publicacao" },
              { label: "MDHC — Crianças e Adolescentes", url: "https://www.gov.br/mdh/pt-br/navegue-por-temas/crianca-e-adolescente" },
              { label: "UNICEF Brasil — Proteção", url: "https://www.unicef.org/brazil/protecao-de-criancas-e-adolescentes" },
            ]}
            lastVerified="2025-11-15"
          />
        </div>
      </section>
    </>
  );
}
