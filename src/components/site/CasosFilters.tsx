import { Search, X } from "lucide-react";

export type SeverityFilter = "all" | "alto" | "medio" | "baixo";

interface CasosFiltersProps {
  categories: string[];
  category: string;
  onCategoryChange: (c: string) => void;
  severity: SeverityFilter;
  onSeverityChange: (s: SeverityFilter) => void;
  years: number[];
  year: number | "all";
  onYearChange: (y: number | "all") => void;
  query: string;
  onQueryChange: (q: string) => void;
  total: number;
  filtered: number;
}

const SEVERITY_LABELS: Record<SeverityFilter, string> = {
  all: "Todas",
  alto: "Alta",
  medio: "Média",
  baixo: "Baixa",
};

/**
 * Barra de filtros sticky para o grid de casos.
 * Premium: chips por categoria + severidade, busca por título e contador.
 */
export function CasosFilters({
  categories,
  category,
  onCategoryChange,
  severity,
  onSeverityChange,
  years,
  year,
  onYearChange,
  query,
  onQueryChange,
  total,
  filtered,
}: CasosFiltersProps) {
  const hasActiveFilters = category !== "Todos" || severity !== "all" || year !== "all" || query.trim().length > 0;

  return (
    <div className="sticky top-[120px] z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-10 backdrop-blur-md bg-[color:var(--dossier-cream)]/85 border-y border-[color:var(--dossier-rule)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoria">
            {categories.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={category === t}
                onClick={() => onCategoryChange(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] ${
                  category === t
                    ? "bg-[color:var(--navy-deep)] text-white border-[color:var(--navy-deep)]"
                    : "bg-white/70 text-[color:var(--navy-deep)] border-[color:var(--dossier-rule)] hover:border-[color:var(--navy-deep)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--navy-deep)]/70">
            {filtered === total ? `${total} casos` : `${filtered} de ${total} casos`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[color:var(--navy-deep)]/50" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar por título…"
              aria-label="Buscar casos"
              className="w-full rounded-full border border-[color:var(--dossier-rule)] bg-white/80 pl-9 pr-3 py-2 text-sm text-[color:var(--dossier-ink)] placeholder:text-[color:var(--navy-deep)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--orange)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--navy-deep)]/60">Gravidade</span>
            {(Object.keys(SEVERITY_LABELS) as SeverityFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => onSeverityChange(s)}
                aria-pressed={severity === s}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                  severity === s
                    ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] border-[color:var(--orange)]"
                    : "bg-white/60 text-[color:var(--navy-deep)] border-[color:var(--dossier-rule)] hover:border-[color:var(--orange)]"
                }`}
              >
                {SEVERITY_LABELS[s]}
              </button>
            ))}
          </div>

          {years.length > 0 && (
            <select
              value={year}
              onChange={(e) => onYearChange(e.target.value === "all" ? "all" : Number(e.target.value))}
              aria-label="Filtrar por ano"
              className="rounded-md border border-[color:var(--dossier-rule)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[color:var(--navy-deep)] focus:outline-none focus:ring-2 focus:ring-[color:var(--orange)]"
            >
              <option value="all">Todos os anos</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => {
                onCategoryChange("Todos");
                onSeverityChange("all");
                onYearChange("all");
                onQueryChange("");
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--red-inst)] hover:underline"
            >
              <X className="size-3.5" aria-hidden /> Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
