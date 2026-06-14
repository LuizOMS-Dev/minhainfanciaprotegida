import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Sparkles } from "lucide-react";

const ALERTS = [
  { month: 0,  title: "Grooming",                        desc: "Como adultos abordam crianças online se passando por amigos.", to: "/riscos-online" as const },
  { month: 1,  title: "Discord — riscos invisíveis",     desc: "Servidores abertos, DMs e exposição de menores na plataforma.", to: "/riscos-online" as const },
  { month: 2,  title: "Roblox — o que os pais precisam saber", desc: "Configurações de segurança, chat e contatos com estranhos.", to: "/pais" as const },
  { month: 3,  title: "Cyberbullying",                    desc: "Ataques digitais, humilhação pública e impacto na saúde mental.", to: "/riscos-online" as const },
  { month: 4,  title: "Maio Laranja",                     desc: "Mês nacional de combate à violência sexual contra crianças.", to: "/maio-laranja" as const },
  { month: 5,  title: "Compartilhamento de imagens",       desc: "Riscos de fotos de crianças expostas em redes sociais.", to: "/pais" as const },
  { month: 6,  title: "Jogos online",                     desc: "Mecânicas predatórias, lives e contato com adultos desconhecidos.", to: "/riscos-online" as const },
  { month: 7,  title: "Redes sociais",                    desc: "Conta restrita, idade mínima e o que monitorar nas plataformas.", to: "/pais" as const },
  { month: 8,  title: "Chantagem virtual (sextortion)",   desc: "Como agressores coagem crianças com ameaças de divulgação.", to: "/sinais" as const },
  { month: 9,  title: "Privacidade digital",              desc: "O que sua família compartilha sem perceber e como proteger.", to: "/pais" as const },
  { month: 10, title: "Inteligência artificial e deepfakes", desc: "Imagens íntimas falsas geradas por IA atingem menores no Brasil.", to: "/riscos-online" as const },
  { month: 11, title: "Segurança nas férias",             desc: "Mais tempo conectado, mais riscos. Combinados claros funcionam.", to: "/pais" as const },
];

function getNow() {
  // Calculado no client para refletir a data atual sem cache
  if (typeof window === "undefined") return new Date();
  return new Date();
}

export function MonthlyAlert() {
  const now = getNow();
  const month = now.getMonth();
  const day = now.getDate();
  const isAwarenessDay = day === 18;
  const alert = ALERTS[month];

  return (
    <section
      aria-label={isAwarenessDay ? "Dia 18 — destaque de conscientização" : "Alerta do mês"}
      className="bg-background border-y border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div
          className={`rounded-2xl border bg-card p-6 sm:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center ${
            isAwarenessDay ? "border-[color:var(--orange)]" : "border-border"
          }`}
        >
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--orange)]">
              {isAwarenessDay ? (
                <>
                  <Sparkles className="size-3.5" aria-hidden />
                  Hoje é dia 18 · Dia Nacional de Combate ao Abuso e Exploração Sexual
                </>
              ) : (
                <>
                  <AlertTriangle className="size-3.5" aria-hidden />
                  Alerta do mês — {now.toLocaleDateString("pt-BR", { month: "long" })}
                </>
              )}
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold leading-tight text-[color:var(--navy-deep)]">
              {isAwarenessDay ? "Denuncie. É anônimo, gratuito e funciona 24 horas." : alert.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {isAwarenessDay
                ? "Em cada dia 18, reforçamos o que precisa ser dito o ano inteiro: proteger crianças é dever de todos. Ligue 100 ou denuncie por outros canais oficiais."
                : alert.desc}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAwarenessDay ? (
              <>
                <a
                  href="tel:100"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] text-white px-6 py-3 text-sm font-bold hover:opacity-95"
                >
                  Ligar 100
                </a>
                <Link
                  to="/denuncia"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy-deep)] text-[color:var(--navy-deep)] px-6 py-3 text-sm font-bold hover:bg-[color:var(--navy-deep)] hover:text-white transition-colors"
                >
                  Outros canais <ArrowRight className="size-4" />
                </Link>
              </>
            ) : (
              <Link
                to={alert.to}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--navy-deep)] text-[color:var(--navy-deep)] px-6 py-3 text-sm font-bold hover:bg-[color:var(--navy-deep)] hover:text-white transition-colors"
              >
                Saber mais <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
