import { Phone, AlertCircle, ShieldCheck, MapPin, Scale, Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionLabel } from "./SectionLabel";

const ITEMS = [
  {
    label: "Disque 100",
    sub: "Denúncia 24h, gratuita e anônima",
    href: "tel:100",
    icon: Phone,
    accent: "primary" as const,
    badge: "24h",
  },
  {
    label: "Emergência 190",
    sub: "Risco imediato — Polícia Militar",
    href: "tel:190",
    icon: AlertCircle,
    accent: "urgent" as const,
    badge: "Urgente",
  },
  {
    label: "Conselho Tutelar",
    sub: "Órgão local de proteção da criança",
    href: "/mapa",
    icon: MapPin,
  },
  {
    label: "Polícia Civil",
    sub: "Delegacias especializadas em crimes contra crianças",
    href: "/mapa",
    icon: ShieldCheck,
  },
  {
    label: "Ministério Público",
    sub: "Promotorias da Infância e Juventude",
    href: "/mapa",
    icon: Scale,
  },
  {
    label: "SaferNet",
    sub: "Denúncia de crimes online contra crianças",
    href: "https://new.safernet.org.br/denuncie",
    icon: Globe,
  },
];

export function ProtectionNetwork({ number = 8 }: { number?: number }) {
  return (
    <section aria-label="Rede de proteção" className="mt-16">
      <SectionLabel
        number={number}
        eyebrow="Rede de proteção"
        title="Para onde recorrer"
        description="Em situações de risco ou suspeita, esses são os canais oficiais. A denúncia pode ser anônima e o sigilo é garantido por lei."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const isExt = it.href.startsWith("http");
          const isTel = it.href.startsWith("tel:");
          const cls =
            it.accent === "primary"
              ? "border-[color:var(--orange)] bg-[color:var(--orange-soft)]"
              : it.accent === "urgent"
                ? "border-[color:var(--red-inst)]/40 bg-[color:var(--red-inst)]/5"
                : "border-border bg-card hover:border-[color:var(--navy-deep)]/30";
          const inner = (
            <div className={`group flex h-full items-start gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 ${cls}`}>
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--navy-deep)] text-[color:var(--orange)]">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-bold text-[color:var(--navy-deep)] leading-tight">
                    {it.label}
                  </p>
                  {it.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-1.5 py-0.5 bg-[color:var(--navy-deep)] text-[color:var(--orange)]">
                      {it.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">{it.sub}</p>
              </div>
            </div>
          );
          if (isExt)
            return (
              <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                {inner}
              </a>
            );
          if (isTel)
            return (
              <a key={it.label} href={it.href} className="block h-full">
                {inner}
              </a>
            );
          return (
            <Link key={it.label} to={it.href as "/mapa"} className="block h-full">
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
