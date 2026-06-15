import { createFileRoute } from "@tanstack/react-router";
import { Building2, ExternalLink, Globe, MessageCircle, Phone, Shield, ShieldAlert, Siren } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqBlock } from "@/components/public/ArticleBlocks";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/public/PageHero";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/denuncia")({
  head: () => ({
    meta: [
      { title: "Denunciar — Canais oficiais 24h, gratuitos e anônimos" },
      {
        name: "description",
        content:
          "Disque 100, Polícia Militar 190, Polícia Civil 197, SAMU 192, Conselho Tutelar e Ministério Público. Telefones reais que abrem o discador no celular.",
      },
      { property: "og:title", content: "Canais Oficiais de Denúncia" },
      { property: "og:description", content: "Disque 100, 190, 192, Conselho Tutelar, MP. Ligue agora." },
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/denuncia" },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/denuncia" }],
  }),
  component: Page,
});

const primary = [
  {
    number: "100",
    name: "Disque Direitos Humanos",
    desc: "Disque 100 — Atende denúncias de violações contra crianças e adolescentes. 24h, gratuito e anônimo.",
    url: "https://www.gov.br/mdh/pt-br/disque100",
    accent: "orange" as const,
    kind: "denuncia" as const,
  },
  {
    number: "190",
    name: "Polícia Militar",
    desc: "Emergências policiais em qualquer local do Brasil. Atende 24h.",
    url: "https://www.gov.br/pt-br/servicos-estaduais/seguranca-publica",
    accent: "red" as const,
    kind: "emergencia" as const,
  },
  {
    number: "192",
    name: "SAMU",
    desc: "Urgência e emergência médica. Ligue em situações que exigem atendimento de saúde.",
    url: "https://www.gov.br/saude/pt-br/composicao/saes/dahu/samu-192",
    accent: "red" as const,
    kind: "emergencia" as const,
  },
  {
    number: "197",
    name: "Polícia Civil",
    desc: "Registro de boletim e investigação. Disponível na maioria dos estados brasileiros.",
    url: "https://www.gov.br/pf/pt-br",
    accent: "navy" as const,
    kind: "denuncia" as const,
  },
  {
    number: "181",
    name: "Disque-Denúncia",
    desc: "Denúncia anônima em diversos estados brasileiros. Verifique a disponibilidade local.",
    url: "https://www.gov.br/pt-br",
    accent: "navy" as const,
    kind: "denuncia" as const,
  },
  {
    number: "153",
    name: "Guarda Municipal",
    desc: "Atendimento em diversas cidades. Verifique a disponibilidade no seu município.",
    url: "https://www.gov.br/pt-br",
    accent: "navy" as const,
    kind: "denuncia" as const,
  },
];

const institutions = [
  {
    icon: Shield,
    name: "Conselho Tutelar",
    desc: "Órgão municipal responsável por zelar pelos direitos da criança e do adolescente. Procure o Conselho Tutelar da sua cidade.",
    cta: "Localizar Conselho Tutelar",
    url: "https://www.gov.br/mdh/pt-br/navegue-por-temas/crianca-e-adolescente/conselhos-tutelares",
  },
  {
    icon: Building2,
    name: "Ministério Público",
    desc: "Atua na defesa dos direitos da criança e do adolescente. Possui ouvidorias em todos os estados.",
    cta: "Acessar MPF",
    url: "https://www.mpf.mp.br/servicos/sala-de-atendimento-ao-cidadao",
  },
  {
    icon: Siren,
    name: "Polícia Federal",
    desc: "Investiga crimes cibernéticos contra crianças, exploração sexual online e tráfico de pessoas.",
    cta: "Denunciar à PF",
    url: "https://www.gov.br/pf/pt-br/canais_atendimento",
  },
  {
    icon: Globe,
    name: "SaferNet Brasil",
    desc: "Canal nacional de denúncias de crimes e violações de Direitos Humanos na Internet.",
    cta: "Denunciar na internet",
    url: "https://new.safernet.org.br/denuncie",
  },
];

const channelAccents: Record<string, string> = {
  orange: "bg-[color:var(--orange)] text-[color:var(--navy-deep)]",
  red: "bg-[color:var(--red-inst)] text-white",
  navy: "bg-[color:var(--navy)] text-white",
};

function ChannelCard({ p }: { p: (typeof primary)[number] }) {
  return (
    <a
      href={`tel:${p.number}`}
      className="group block h-full rounded-2xl overflow-hidden border border-border bg-card hover-lift"
      aria-label={`Ligar para ${p.name} no número ${p.number}`}
    >
      <div className={`p-6 ${channelAccents[p.accent]} flex items-end justify-between`}>
        <span className="font-display text-5xl font-semibold leading-none">{p.number}</span>
        <Phone className="size-6 opacity-80 group-hover:translate-x-1 transition" aria-hidden />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold">{p.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--navy)]">
          Tocar para ligar →
        </span>
      </div>
    </a>
  );
}

function Page() {
  const [city, setCity] = useState("");

  const faqData = [
    {
      q: "A denúncia é realmente anônima?",
      a: "Sim. O Disque 100 garante o anonimato absoluto. O atendente não solicita seus dados pessoais, a não ser que você queira se identificar. O foco é na informação sobre a suspeita, não em quem está denunciando.",
    },
    {
      q: "Quando devo ligar para o 190 (Polícia Militar) e quando ligo para o 100?",
      a: "O 190 deve ser acionado em situações de emergência, quando o crime está ocorrendo naquele momento e há risco imediato à vida. O Disque 100 é voltado para denúncias investigativas de violações de direitos (suspeitas, situações recorrentes ou passadas) e para receber orientação.",
    },
    {
      q: "Preciso ter certeza absoluta ou provas antes de denunciar?",
      a: "Não. Você não precisa ser o investigador. Se você tem uma suspeita fundamentada ou notou sinais de alerta persistentes, o papel da rede de proteção (Conselho Tutelar, Polícia) é investigar. A sua ligação pode ser o único socorro da criança.",
    },
    {
      q: "O que acontece depois que eu denuncio no Disque 100?",
      a: "A central analisa o relato e o encaminha, em poucas horas, para a rede de proteção do município correspondente (geralmente o Conselho Tutelar e/ou a Polícia local) para que as providências sejam tomadas.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Canais oficiais · 24h e gratuitos"
        icon={<ShieldAlert className="size-3.5 text-[color:var(--orange)]" />}
        title="Como denunciar e onde pedir ajuda"
        description="Os canais abaixo são oficiais e funcionam 24 horas. A denúncia ao Disque 100 é gratuita e pode ser anônima. Em caso de risco imediato à vida, ligue 190."
        breadcrumb={[
          { label: "Início", to: "/" },
          { label: "Denúncia" },
        ]}
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="denuncia" size="xl">
            <a href="tel:100">
              <Phone aria-hidden />
              Ligar 100
            </a>
          </Button>
          <Button asChild variant="outlineNavy" size="xl">
            <a href="#canais">Ver todos os canais</a>
          </Button>
        </div>
      </PageHero>

      <section id="canais" className="py-20 sm:py-28 bg-background scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div>
            <SectionHeader
              eyebrow="Risco imediato à vida"
              title="Emergência — ligue agora"
              description="Quando o crime está acontecendo neste momento ou há perigo imediato. Atendimento 24 horas."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {primary
                .filter((p) => p.kind === "emergencia")
                .map((p, i) => (
                  <Reveal key={p.number} delay={i * 60}>
                    <ChannelCard p={p} />
                  </Reveal>
                ))}
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Suspeita, orientação e denúncia"
              title="Denúncia — pode ser anônima"
              description="Para suspeitas, situações recorrentes ou passadas e para receber orientação. O Disque 100 é gratuito e mantém o anonimato."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {primary
                .filter((p) => p.kind === "denuncia")
                .map((p, i) => (
                  <Reveal key={p.number} delay={i * 60}>
                    <ChannelCard p={p} />
                  </Reveal>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Disque 100 */}
      <section className="py-16 bg-[color:var(--orange-soft)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Prefere mensagem? O Disque 100 também atende pelo WhatsApp.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Envie sua denúncia pelo WhatsApp oficial do Disque Direitos Humanos —{" "}
              <strong>(61) 99656-5008</strong> ou pelo Telegram <strong>@DH100Brasil_bot</strong>.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <a
              href="https://wa.me/5561996565008"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 font-semibold"
            >
              <MessageCircle className="size-5" /> WhatsApp Disque 100
            </a>
          </Reveal>
        </div>
      </section>

      {/* INSTITUIÇÕES */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Instituições oficiais"
            title="Órgãos de proteção e investigação"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {institutions.map((inst, i) => (
              <Reveal key={inst.name} delay={i * 70}>
                <article className="rounded-2xl border border-border bg-card p-6 hover-lift flex gap-5">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--navy)] text-white">
                    <inst.icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{inst.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{inst.desc}</p>
                    <a
                      href={inst.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--red-inst)] hover:underline"
                    >
                      {inst.cta} <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Telefone local dinâmico */}
      <section className="py-16 bg-[color:var(--navy-deep)] text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Conselho Tutelar do seu município</h2>
            <p className="mt-3 text-white/80">
              Digite sua cidade ou estado para localizar o Conselho Tutelar mais próximo no portal
              oficial do Ministério dos Direitos Humanos.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Recife, PE"
                aria-label="Cidade ou estado"
                className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-[color:var(--orange)]"
              />
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent("conselho tutelar " + (city || "minha cidade"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-6 py-3 font-semibold"
              >
                Buscar
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FaqBlock items={faqData} />
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqData.map((qa) => ({
            "@type": "Question",
            name: qa.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: qa.a,
            },
          })),
        }}
      />
    </>
  );
}
