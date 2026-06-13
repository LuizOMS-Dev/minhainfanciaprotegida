interface Props<T extends string> {
  categories: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}

export function CategoryChips<T extends string>({ categories, value, onChange, label }: Props<T>) {
  return (
    <div className="sticky top-[60px] z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-background/85 backdrop-blur border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
        <div
          className="flex gap-2 overflow-x-auto scrollbar-none"
          role="tablist"
          aria-label={label}
        >
          {categories.map((c) => {
            const active = value === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={active}
                onClick={() => onChange(c)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)] ${
                  active
                    ? "bg-[color:var(--navy-deep)] text-white border-[color:var(--navy-deep)]"
                    : "bg-card text-[color:var(--navy-deep)]/80 border-border hover:border-[color:var(--navy-deep)]/40"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
