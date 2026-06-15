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
    <div className="sticky top-[70px] md:top-[80px] z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 mb-12 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filtrar por categoria">
            {categories.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={category === t}
                onClick={() => onCategoryChange(t)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] ${
                  category === t
                    ? "bg-[color:var(--navy)] text-white border-[color:var(--navy)] shadow-sm"
                    : "bg-white/50 text-[color:var(--navy-deep)] border-border hover:border-[color:var(--navy)]/30 hover:bg-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-md">
            {filtered === total ? `${total} casos` : `${filtered} de ${total} casos`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-[color:var(--orange)] transition-colors" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar por título ou palavras-chave…"
              aria-label="Buscar casos"
              className="w-full rounded-lg border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--orange)] focus:border-transparent transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 border border-border rounded-lg bg-card p-1 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">Gravidade:</span>
            {(Object.keys(SEVERITY_LABELS) as SeverityFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => onSeverityChange(s)}
                aria-pressed={severity === s}
                className={`px-3 py-1.5 rounded text-[11px] font-semibold transition-colors ${
                  severity === s
                    ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)] shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background"
                }`}
              >
                {SEVERITY_LABELS[s]}
              </button>
            ))}
          </div>

          {years.length > 0 && (
            <div className="relative border border-border rounded-lg bg-white shadow-sm hover:border-[color:var(--navy)]/30 transition-colors">
              <select
                value={year}
                onChange={(e) => onYearChange(e.target.value === "all" ? "all" : Number(e.target.value))}
                aria-label="Filtrar por ano"
                className="appearance-none bg-transparent pl-4 pr-8 py-2.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--navy-deep)] focus:outline-none focus:ring-2 focus:ring-[color:var(--orange)] rounded-lg cursor-pointer"
              >
                <option value="all">Todos os anos</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={() => {
                onCategoryChange("Todos");
                onSeverityChange("all");
                onYearChange("all");
                onQueryChange("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--red-inst)] hover:bg-[color:var(--red-inst)]/10 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="size-3.5" aria-hidden /> Limpar Filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
