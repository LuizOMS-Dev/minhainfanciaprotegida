import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Brain,
  CloudRain,
  Frown,
  GraduationCap,
  Lock,
  Phone,
  Sparkles,
  UserMinus,
  Waves,
} from "lucide-react";
import listeningImg from "@/assets/listening.jpg";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FaqBlock } from "@/components/public/ArticleBlocks";

export const Route = createFileRoute("/sinais")({
  head: () => ({
    meta: [
      { title: "Sinais de Alerta — Identifique o abuso a tempo" },
      {
        name: "description",
        content:
          "Mudanças bruscas de comportamento, medos incomuns, isolamento, queda escolar, ansiedade e tristeza excessiva podem ser sinais. Aprenda a reconhecer.",
      },
      { property: "og:title", content: "Identificar Sinais de Abuso" },
      { property: "og:description", content: "Comportamentos que merecem atenção segundo UNICEF e Childhood Brasil." },
      { property: "og:url", content: "https://minhainfanciaprotegida.com.br/sinais" },
    ],
    links: [{ rel: "canonical", href: "https://minhainfanciaprotegida.com.br/sinais" }],
  }),
  component: Page,
});

const signs = [
  { icon: Sparkles, title: "Mudanças bruscas de comportamento", desc: "Alterações repentinas de humor, agressividade ou apatia sem causa aparente." },
  { icon: AlertTriangle, title: "Medos incomuns", desc: "Medo excessivo de uma pessoa específica, de lugares ou de ficar sozinho." },
  { icon: UserMinus, title: "Isolamento", desc: "Afastamento de amigos, familiares e atividades que antes gostava." },
  { icon: GraduationCap, title: "Queda no rendimento escolar", desc: "Dificuldade súbita de concentração, faltas e queda nas notas." },
  { icon: Brain, title: "Ansiedade", desc: "Inquietação, dores de cabeça e de estômago recorrentes sem causa médica." },
  { icon: CloudRain, title: "Tristeza excessiva", desc: "Choro frequente, desânimo persistente e sintomas depressivos." },
  { icon: Frown, title: "Comportamentos regressivos", desc: "Voltar a fazer xixi na cama, chupar dedo ou falar como bebê após já ter superado." },
  { icon: Lock, title: "Segredos e silêncio", desc: "Demonstra ter um segredo importante envolvendo um adulto e demonstra culpa ou vergonha." },
  { icon: Waves, title: "Conhecimento sexual incompatível", desc: "Demonstra conhecimento ou comportamento sexual além do esperado para a idade." },
];

function Page() {
  return (
    <div className="bg-background">
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden bg-[color:var(--background)] pt-16 md:pt-24 lg:pt-32 pb-16 lg:pb-24 border-b border-border">
        {/* Subtle blur background */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 opacity-40 mix-blend-multiply pointer-events-none" aria-hidden>
          <div className="w-[500px] h-[500px] rounded-full bg-blue-50/50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy)]/10 bg-[color:var(--navy)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] shadow-sm">
              <AlertTriangle className="size-3.5 text-[color:var(--orange)]" /> Sinais de Alerta
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-8 font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] tracking-tight text-[color:var(--navy-deep)] text-balance">
              Aprenda a enxergar o que muitas vezes não é dito
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A maioria das crianças que sofrem violência sexual não verbaliza o que aconteceu. O
              corpo e o comportamento, no entanto, falam. Reconhecer os sinais é proteger.
            </p>
          </Reveal>
        </div>
      </section>

      {/* GRID DE SINAIS */}
      <section className="py-20 sm:py-28 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Comportamentos de alerta"
            title="Sinais que exigem observação"
            description="Nenhum sinal isolado é prova definitiva de violência, mas a combinação de comportamentos persistentes deve ser acompanhada de perto. Em caso de suspeita fundamentada, busque a rede de proteção."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signs.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <article className="group h-full rounded-xl border border-border bg-background p-8 hover-lift hover:border-[color:var(--navy)]/20 transition-all shadow-sm hover:shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[color:var(--orange)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[color:var(--navy)]/5 border border-[color:var(--navy)]/10 text-[color:var(--navy-deep)] group-hover:bg-[color:var(--navy)] group-hover:text-white transition-colors">
                    <s.icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-[color:var(--navy-deep)]">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 border-t border-border/50 text-xs text-muted-foreground font-medium">
              <span>Referências Oficiais:</span>
              <a className="hover:text-[color:var(--navy)] transition-colors inline-flex items-center gap-1" href="https://www.unicef.org/brazil" target="_blank" rel="noopener noreferrer">UNICEF Brasil</a>
              <a className="hover:text-[color:var(--navy)] transition-colors inline-flex items-center gap-1" href="https://www.childhood.org.br/" target="_blank" rel="noopener noreferrer">Childhood Brasil</a>
              <a className="hover:text-[color:var(--navy)] transition-colors inline-flex items-center gap-1" href="https://www.gov.br/mdh" target="_blank" rel="noopener noreferrer">MDHC / Disque 100</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Sinais */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Dúvidas Frequentes"
            title="Como agir diante da suspeita"
            description="Entenda os limites da observação e o papel do adulto na proteção imediata da criança."
          />
          <div className="mt-12">
            <FaqBlock
              items={[
                {
                  q: "Meu filho apresentou um desses sinais. É certeza que algo grave aconteceu?",
                  a: "Não. Sinais de ansiedade, mudanças de humor ou queda de rendimento escolar podem ter diversas causas, como bullying, mudança de escola ou conflitos familiares. O importante é não ignorar a mudança, oferecer um ambiente de escuta livre de julgamentos e buscar apoio psicológico ou escolar para investigar a raiz do problema.",
                },
                {
                  q: "E se a criança negar ou ficar calada ao ser perguntada?",
                  a: "Nunca force a criança a falar nem realize interrogatórios domésticos. O medo e as ameaças do agressor muitas vezes impõem o silêncio absoluto. Deixe claro que ela está segura e que você acredita nela. Procure profissionais (psicólogos, Conselho Tutelar) capacitados para realizar a escuta protegida (Lei 13.431/2017).",
                },
                {
                  q: "A criança apontou alguém da família ou pessoa próxima. Devo acreditar?",
                  a: "Sim. A grande maioria dos casos de abuso ocorre dentro do círculo de confiança e convivência da criança. Desacreditar a vítima para proteger um adulto ou a imagem pública da família a deixa em situação de extremo risco. Acolha o relato e busque ajuda da rede de proteção imediatamente.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-[color:var(--navy)] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white to-transparent opacity-50 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
              A suspeita fundamentada basta para denunciar.
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Você não precisa ser investigador ou ter provas materiais. A denúncia ao Disque 100 transfere a responsabilidade da apuração para as autoridades competentes.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="tel:100" className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--red-inst)] text-white px-8 py-3.5 font-bold shadow-sm hover:bg-[color:var(--red-inst)]/90 transition-colors">
                <Phone className="size-5" /> Ligar 100 (Anonimamente)
              </a>
              <Link to="/denuncia" className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-3.5 font-semibold hover:bg-white/10 transition-colors">
                Rede de Proteção
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
