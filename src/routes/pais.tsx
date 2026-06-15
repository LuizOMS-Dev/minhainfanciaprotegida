import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Gamepad2, MessageCircle, ShieldCheck, Smartphone, Timer } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqBlock } from "@/components/public/ArticleBlocks";
import { ReferencesBlock } from "@/components/public/ReferencesBlock";
import { JsonLd, articleSchema, breadcrumb } from "@/components/shared/JsonLd";
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
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/pais" }],
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
    <div className="bg-background">
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

      {/* HEADER SECTION */}
      <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/4 opacity-30 mix-blend-multiply pointer-events-none" aria-hidden>
          <div className="w-[600px] h-[600px] rounded-full bg-[color:var(--orange)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
                Para pais e responsáveis
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
                Conversar protege. Configurar previne.
              </h1>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Um guia prático com configurações de privacidade nas principais plataformas usadas por crianças e adolescentes, sinais de alerta e como abrir o diálogo.
              </p>
            </Reveal>
          </div>
          
          <Reveal delay={300} className="lg:justify-self-end">
            <div className="relative aspect-[4/3] w-full max-w-lg rounded-2xl overflow-hidden shadow-elegant border border-border/50">
              <img
                src={familyImg}
                alt="Família conversando de forma aberta e acolhedora"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/20 to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PILARES DE PROTEÇÃO */}
      <section className="py-20 sm:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Pilares da segurança"
            title="Atenção constante no digital"
            description="Proteção no ambiente virtual exige o mesmo cuidado que no ambiente físico."
          />
          <div className="mt-16 grid lg:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Controle parental", desc: "Ative supervisão, PIN e filtros em todos os dispositivos compartilhados." },
              { icon: Timer, title: "Tempo de tela", desc: "Limite diário por app, com pausas e horários sem tela (refeições, sono)." },
              { icon: Eye, title: "Privacidade", desc: "Contas privadas, listas de amigos revisadas e desligar geolocalização." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <article className="h-full rounded-xl border border-border bg-background p-8 hover-lift hover:border-[color:var(--navy)]/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[color:var(--orange)]/5 rounded-bl-full transition-transform group-hover:scale-150" />
                  <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[color:var(--navy)]/5 border border-[color:var(--navy)]/10 text-[color:var(--navy-deep)] mb-6 group-hover:bg-[color:var(--navy)] group-hover:text-white transition-colors">
                    <c.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[color:var(--navy-deep)]">{c.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLATAFORMAS DIGITAIS */}
      <section className="py-20 sm:py-28 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Plataformas digitais"
            title="Configurações por aplicativo"
            description="Resumo das principais ações em plataformas comuns. Sempre confira as páginas de suporte oficial."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p, i) => (
              <Reveal key={p.name} delay={i * 60}>
                <article className="flex flex-col h-full rounded-xl border border-border bg-card p-8 hover:border-[color:var(--navy)]/20 shadow-sm group">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[color:var(--navy)] text-white shadow-sm">
                      <Smartphone className="size-5" aria-hidden />
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[color:var(--navy-deep)]">{p.name}</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed flex-grow">
                    {p.tips.map((t) => (
                      <li key={t} className="flex gap-2.5">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--orange)] opacity-80" aria-hidden />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-4 border-t border-border">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--navy)] hover:text-[color:var(--orange)] transition-colors"
                    >
                      Central Oficial <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DIÁLOGO ABERTO */}
      <section className="py-20 sm:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--orange)] mb-6">
              <MessageCircle className="size-4" /> Como conversar
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-[color:var(--navy-deep)]">
              Diálogo aberto é a melhor proteção
            </h2>
            <ul className="mt-8 space-y-4">
              {conversationTips.map((t) => (
                <li key={t} className="flex gap-3 text-lg text-muted-foreground">
                  <span className="mt-2.5 size-2 shrink-0 rounded-full bg-[color:var(--orange)]" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Link to="/sinais" className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--navy)] text-white px-6 py-3.5 font-semibold shadow-sm hover:bg-[color:var(--navy-deep)] transition-colors">
                <Eye className="size-4" /> Sinais de alerta
              </Link>
              <Link to="/riscos-online" className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--navy)]/20 px-6 py-3.5 font-semibold text-[color:var(--navy-deep)] hover:bg-[color:var(--navy)]/5 transition-colors">
                <Gamepad2 className="size-4" /> Riscos online
              </Link>
            </div>
          </Reveal>
          
          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-elegant border border-border/50">
              <img src={digitalImg} alt="Família conversando com criança sobre uso do celular" loading="lazy" className="size-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Pais */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dúvidas comuns"
            title="Perguntas Frequentes"
          />
          <div className="mt-12">
            <FaqBlock
              items={[
                {
                  q: "A partir de que idade devo me preocupar com o que meu filho acessa?",
                  a: "Desde o primeiro contato com telas. Crianças pequenas podem acessar acidentalmente conteúdos inapropriados no YouTube ou jogos. A supervisão deve ser constante e adaptada à idade.",
                },
                {
                  q: "Proibir o uso do celular ou videogame é a melhor solução?",
                  a: "A proibição total muitas vezes leva o adolescente a usar escondido, sem a sua supervisão. O melhor caminho é o diálogo aberto, regras claras (como tempo de tela) e usar o controle parental.",
                },
                {
                  q: "E se eu descobrir que meu filho está conversando com um adulto estranho?",
                  a: "Mantenha a calma. Não brigue nem culpe a criança. Faça capturas de tela (prints) das conversas, não apague o aplicativo, bloqueie o contato e denuncie imediatamente (SaferNet ou Disque 100).",
                },
                {
                  q: "Como configuro o controle parental?",
                  a: "Cada sistema (Android via Family Link, iOS via Tempo de Uso) e aplicativo (Roblox, TikTok) tem suas próprias configurações nas abas de Privacidade ou Controle Parental. Use nosso guia acima para links diretos.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
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
    </div>
  );
}
