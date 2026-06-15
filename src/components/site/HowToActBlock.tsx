import { Link } from "@tanstack/react-router";
import {
  Phone,
  MapPin,
  HeartHandshake,
  NotebookPen,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface Step {
  step?: number;
  title: string;
  description: string;
}

interface HowToActBlockProps {
  steps?: Step[] | null;
}

const DEFAULT_STEPS: Step[] = [
  {
    title: "Acolha sem julgar",
    description:
      "Escute com calma, valide os sentimentos da criança ou adolescente e garanta que ela está em local seguro.",
  },
  {
    title: "Registre o que sabe",
    description:
      "Anote datas, locais, pessoas envolvidas e qualquer evidência (mensagens, prints, áudios) — sem expor a vítima.",
  },
  {
    title: "Denuncie pelos canais oficiais",
    description:
      "Ligue para o Disque 100 (24h, anônimo e gratuito). Em risco imediato, ligue 190. Procure também a Polícia Civil.",
  },
  {
    title: "Encaminhe para a rede de proteção",
    description:
      "Acione o Conselho Tutelar do município, CREAS ou Delegacia da Criança e do Adolescente mais próxima.",
  },
];

const ICONS = [HeartHandshake, NotebookPen, Phone, MapPin];

/**
 * Bloco "Como agir agora" — passo a passo prático com CTAs para Disque 100, /denuncia e /mapa.
 * Usa steps fornecidos ou um fallback padrão alinhado ao Sistema de Garantia de Direitos.
 */
export function HowToActBlock({ steps }: HowToActBlockProps) {
  const list = steps && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section
      aria-label="Como agir agora"
      className="mt-12 rounded-3xl border-2 border-[color:var(--red-inst)]/30 bg-gradient-to-br from-white to-[color:var(--dossier-cream)] p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--red-inst)] text-white">
          <AlertTriangle className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--red-inst)]">
            Ação imediata
          </p>
          <h2 className="font-display text-2xl font-bold leading-tight text-[color:var(--navy-deep)]">
            Como agir agora
          </h2>
          <p className="mt-2 text-sm text-[color:var(--dossier-ink)]/80 max-w-2xl">
            Em situações de suspeita ou risco, siga o passo a passo abaixo. A denúncia é anônima,
            gratuita e funciona 24 horas por dia.
          </p>
        </div>
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {list.map((s, i) => {
          const Icon = ICONS[i % ICONS.length];
          const n = s.step ?? i + 1;
          return (
            <li
              key={i}
              className="relative flex gap-4 rounded-2xl border border-[color:var(--dossier-rule)] bg-white p-4 sm:p-5"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-[color:var(--navy-deep)] text-[color:var(--orange)] font-display text-lg font-bold">
                  {n}
                </span>
                <Icon className="size-4 text-[color:var(--navy-deep)]/40" aria-hidden />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold text-[color:var(--navy-deep)] leading-tight">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-[color:var(--dossier-ink)]/85 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="tel:100"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--red-inst)] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:brightness-110 transition"
        >
          <Phone className="size-4" aria-hidden /> Ligar Disque 100
        </a>
        <Link
          to="/denuncia"
          className="inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--navy-deep)] bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[color:var(--navy-deep)] hover:bg-[color:var(--navy-deep)] hover:text-white transition"
        >
          Canais oficiais <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          to="/mapa"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--dossier-rule)] bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-[color:var(--navy-deep)] hover:border-[color:var(--orange)] transition"
        >
          <MapPin className="size-4" aria-hidden /> Conselho Tutelar perto de você
        </Link>
      </div>
    </section>
  );
}
