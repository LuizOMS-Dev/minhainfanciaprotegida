import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  ExternalLink,
  Globe,
  Info,
  MessageCircle,
  Phone,
  Shield,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { InstitutionalHero } from "@/components/site/InstitutionalHero";
import { useState } from "react";

export const Route = createFileRoute("/denuncia")({
  head: () => ({
    meta: [
      { title: "Como Denunciar — Canais oficiais 24h, gratuitos e anônimos" },
      {
        name: "description",
        content:
          "Disque 100, 190 em emergências, Conselho Tutelar, Polícia Civil, Ministério Público e delegacias virtuais. Saiba como agir com responsabilidade e proteger a criança.",
      },
      { property: "og:title", content: "Como Denunciar — Infância Protegida" },
      { property: "og:description", content: "Canais oficiais e orientação responsável para denunciar." },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/denuncia" }],
  }),
  component: Page,
});

const phones = [
  {
    number: "100",
    name: "Disque Direitos Humanos",
    desc: "Recebe denúncias de violações contra crianças e adolescentes em todo o Brasil. 24h, gratuito e anônimo.",
    url: "https://www.gov.br/mdh/pt-br/disque100",
  },
  {
    number: "190",
    name: "Polícia Militar — Emergência",
    desc: "Acione em situações de risco imediato à vida ou à integridade da criança.",
    url: "https://www.gov.br/pt-br/servicos-estaduais/seguranca-publica",
  },
  {
    number: "197",
    name: "Polícia Civil",
    desc: "Registro de boletim e investigação. Disponível na maioria dos estados.",
    url: "https://www.gov.br/pf/pt-br",
  },
  {
    number: "192",
    name: "SAMU",
    desc: "Urgência e emergência médica. Acione se houver necessidade de atendimento de saúde.",
    url: "https://www.gov.br/saude/pt-br/composicao/saes/dahu/samu-192",
  },
];

const institutions = [
  {
    icon: Shield,
    name: "Conselho Tutelar",
    desc: "Órgão municipal responsável por zelar pelos direitos da criança e do adolescente. É o primeiro caminho para situações que não exigem polícia.",
    cta: "Localizar Conselho Tutelar",
    url: "https://www.gov.br/mdh/pt-br/navegue-por-temas/crianca-e-adolescente/conselhos-tutelares",
  },
  {
    icon: Building2,
    name: "Delegacias especializadas",
    desc: "DEAM, DPCA e Delegacias da Mulher atendem crimes contra crianças e adolescentes. Procure a unidade da sua cidade.",
    cta: "Procurar delegacia",
    url: "https://www.gov.br/mj/pt-br",
  },
  {
    icon: Siren,
    name: "Ministério Público",
    desc: "Atua na defesa dos direitos da criança e do adolescente. Possui ouvidorias em todos os estados.",
    cta: "Acessar MPF",
    url: "https://www.mpf.mp.br/servicos/sala-de-atendimento-ao-cidadao",
  },
  {
    icon: Globe,
    name: "Delegacia Virtual",
    desc: "Quando aplicável, permite registrar ocorrências pela internet. Disponibilidade varia por estado — verifique no portal da Polícia Civil local.",
    cta: "Verificar disponibilidade",
    url: "https://www.gov.br/pt-br/servicos-estaduais/seguranca-publica",
  },
];

const responsibility = [
  {
    icon: ShieldCheck,
    title: "Não exponha a criança",
    text: "Evite divulgar nome, foto, escola ou endereço. A proteção da identidade é parte da proteção da vítima.",
  },
  {
    icon: Info,
    title: "Não conduza a investigação",
    text: "Não interrogue a criança nem confronte o suspeito. Apurar é papel da autoridade competente.",
  },
  {
    icon: MessageCircle,
    title: "Registre o que foi dito",
    text: "Anote o relato espontâneo com data e hora, sem induzir respostas. Esse registro auxilia o atendimento.",
  },
  {
    icon: Phone,
    title: "Acione os canais oficiais",
    text: "Em risco imediato, ligue 190. Em outras situações, Disque 100 ou Conselho Tutelar são os primeiros caminhos.",
  },
];

function Page() {
  const [city, setCity] = useState("");

  return (
    <>
      <InstitutionalHero
        eyebrow="Como denunciar"
        title="Sua denúncia é anônima, gratuita e funciona 24 horas"
        description="Use qualquer um dos canais oficiais abaixo. Em emergências com risco imediato à vida, ligue 190 antes de qualquer outra ação."
        actions={
          <>
            <a
              href="tel:100"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-white px-6 py-3.5 text-sm font-bold hover:opacity-95"
            >
              <Phone className="size-4" /> Ligar 100
            </a>
            <a
              href="tel:190"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy-deep)] text-[color:var(--navy-deep)] px-6 py-3.5 text-sm font-bold hover:bg-[color:var(--navy-deep)] hover:text-white transition-colors"
            >
              <Phone className="size-4" /> 190 — Emergência
            </a>
          </>
        }
      />

      {/* Telefones */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Canais imediatos"
            title="Telefones oficiais — toque para ligar"
            description="No celular, tocar no número abre o discador automaticamente. Todos os canais abaixo funcionam em todo o Brasil."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {phones.map((p, i) => (
              <Reveal key={p.number} delay={i * 60}>
                <a
                  href={`tel:${p.number}`}
                  className="group block h-full rounded-2xl border border-border bg-card p-6 transition-all hover:border-[color:var(--navy-deep)]/30 hover:-translate-y-1 hover:shadow-elegant"
                >
                  <p className="font-display text-5xl font-semibold text-[color:var(--navy-deep)] leading-none">
                    {p.number}
                  </p>
                  <h3 className="mt-5 font-display text-lg font-semibold text-[color:var(--navy-deep)]">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[color:var(--orange)]">
                    Toque para ligar →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Disque 100 */}
      <section className="py-12 sm:py-16 bg-[color:var(--surface-soft)] border-y border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[color:var(--navy-deep)] leading-tight">
              Prefere mensagem? O Disque 100 também atende pelo WhatsApp.
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Envie sua denúncia pelo WhatsApp oficial — <strong className="text-[color:var(--navy-deep)]">(61) 99656-5008</strong>{" "}
              ou pelo Telegram <strong className="text-[color:var(--navy-deep)]">@DH100Brasil_bot</strong>.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <a
              href="https://wa.me/5561996565008"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 font-semibold"
            >
              <MessageCircle className="size-5" /> WhatsApp Disque 100
            </a>
          </Reveal>
        </div>
      </section>

      {/* Instituições */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Instituições oficiais"
            title="Para além do telefone"
            description="Conselho Tutelar, delegacias especializadas, Ministério Público e canais virtuais — onde acionar conforme a situação."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {institutions.map((inst, i) => (
              <Reveal key={inst.name} delay={i * 70}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 flex gap-5">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[color:var(--surface-soft)] text-[color:var(--navy-deep)]">
                    <inst.icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-[color:var(--navy-deep)]">
                      {inst.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{inst.desc}</p>
                    <a
                      href={inst.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--orange)] hover:underline"
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

      {/* Agir com responsabilidade */}
      <section className="py-20 sm:py-24 bg-[color:var(--surface-soft)] border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Orientação responsável"
            title="Denunciar com cuidado é proteger duas vezes"
            description="A forma como agimos diante de uma suspeita influencia diretamente a proteção da criança. Siga as orientações abaixo."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {responsibility.map((r, i) => (
              <Reveal key={r.title} delay={i * 60}>
                <article className="h-full rounded-2xl border border-border bg-card p-6">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[color:var(--orange-soft)] text-[color:var(--orange)]">
                    <r.icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-[color:var(--navy-deep)]">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Localizador Conselho Tutelar */}
      <section className="py-16 bg-[color:var(--navy-deep)] text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--orange)]">
              Conselho Tutelar
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold leading-tight">
              Encontre o Conselho Tutelar da sua cidade
            </h2>
            <p className="mt-3 text-white/80 leading-relaxed">
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
    </>
  );
}
