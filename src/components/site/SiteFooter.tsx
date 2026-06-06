import { Link } from "@tanstack/react-router";
import { ExternalLink, Phone, ShieldAlert } from "lucide-react";

const orgs = [
  { name: "Ministério dos Direitos Humanos e da Cidadania", url: "https://www.gov.br/mdh/pt-br" },
  { name: "Disque 100 — Disque Direitos Humanos", url: "https://www.gov.br/mdh/pt-br/disque100" },
  { name: "UNICEF Brasil", url: "https://www.unicef.org/brazil/" },
  { name: "Childhood Brasil", url: "https://www.childhood.org.br/" },
  { name: "CONANDA", url: "https://www.gov.br/participamaisbrasil/conanda" },
  { name: "Estatuto da Criança e do Adolescente (Lei 8.069/90)", url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm" },
  { name: "Ministério Público Federal", url: "https://www.mpf.mp.br/" },
  { name: "Polícia Federal", url: "https://www.gov.br/pf/pt-br" },
  { name: "ONU — Convenção sobre os Direitos da Criança", url: "https://www.unicef.org/brazil/convencao-sobre-os-direitos-da-crianca" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--navy-deep)] text-[color:var(--navy-foreground)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-orange">
              <ShieldAlert className="size-5 text-[color:var(--navy-deep)]" aria-hidden />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">Infância Protegida</p>
              <p className="text-xs uppercase tracking-[0.18em] opacity-70">
                Campanha de conscientização — Maio Laranja
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed opacity-80 max-w-md">
            Iniciativa educativa de conscientização sobre o enfrentamento à violência sexual contra
            crianças e adolescentes no Brasil. Conteúdo informativo baseado exclusivamente em fontes
            oficiais.
          </p>
          <a
            href="tel:100"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-5 py-3 font-semibold hover:opacity-95"
          >
            <Phone className="size-4" /> Ligar 100 — gratuito e anônimo
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-80">
            Navegar
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Início"],
              ["/maio-laranja", "Maio Laranja"],
              ["/sinais", "Identificar sinais"],
              ["/riscos-online", "Riscos online"],
              ["/pais", "Para pais"],
              ["/escolas", "Para escolas"],
              ["/biblioteca", "Biblioteca"],
              ["/casos", "Casos reais"],
              ["/noticias", "Notícias"],
              ["/como-ajudar", "Como ajudar"],
              ["/denuncia", "Denúncia"],
              ["/legislacao", "Legislação"],
              ["/mapa", "Mapa de ajuda"],
              
              ["/faq", "FAQ"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="opacity-80 hover:opacity-100 hover:text-[color:var(--orange)] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-80">
            Fontes oficiais
          </h3>
          <ul className="space-y-2 text-sm">
            {orgs.map((o) => (
              <li key={o.url}>
                <a
                  href={o.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 opacity-80 hover:opacity-100 hover:text-[color:var(--orange)] transition-colors"
                >
                  <span>{o.name}</span>
                  <ExternalLink className="size-3 mt-0.5 shrink-0" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70">
          <p>
            Este site é uma iniciativa educativa independente. Não substitui canais oficiais. Em
            caso de emergência, ligue 190 (Polícia Militar) ou 100 (Disque Direitos Humanos).
          </p>
          <p>© {new Date().getFullYear()} Infância Protegida · Conteúdo livre para fins educativos.</p>
        </div>
      </div>
    </footer>
  );
}
