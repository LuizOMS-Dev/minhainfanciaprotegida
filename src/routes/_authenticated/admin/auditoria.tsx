import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Calendar, ScrollText, ShieldAlert, User } from "lucide-react";
import { listAuditLog, type AuditActionType, type AuditLogRow } from "@/lib/audit.functions";
import { AdminError, AdminSkeleton, SectionCard } from "@/components/admin/AdminUI";

export const Route = createFileRoute("/_authenticated/admin/auditoria")({
  component: AuditoriaPage,
});

const ACTION_LABEL: Record<AuditActionType, string> = {
  login: "Login",
  logout: "Logout",
  login_failed: "Falha de login",
  unauthorized_access: "Acesso negado",
  content_create: "Conteúdo criado",
  content_update: "Conteúdo editado",
  content_delete: "Conteúdo excluído",
  content_publish: "Publicação",
  content_unpublish: "Despublicação",
  user_create: "Usuário criado",
  user_update: "Usuário atualizado",
  user_delete: "Usuário excluído",
  role_change: "Papel alterado",
  password_reset: "Redefinição de senha",
  csv_import: "Importação CSV",
  library_change: "Biblioteca",
  location_change: "Mapa de ajuda",
  email_not_verified_login_attempt: "E-mail não verificado",
  brute_force_detected: "Força bruta detectada",
  account_locked: "Conta bloqueada",
  account_unlocked: "Conta desbloqueada",
  captcha_failed: "Falha de CAPTCHA",
  captcha_bypassed_attempt: "Tentativa de burlar CAPTCHA",
  login_blocked_by_captcha: "Login bloqueado por CAPTCHA",
  mfa_enabled: "MFA habilitado",
  mfa_disabled: "MFA desabilitado",
  mfa_success: "MFA validado",
  mfa_failed: "MFA falhou",
  mfa_reset: "MFA resetado",
  admin_export: "Exportação administrativa",
  recovery_code_generated: "Recovery codes gerados",
  recovery_code_regenerated: "Recovery codes regerados",
  recovery_code_used: "Recovery code usado",
  csp_violation: "Violação de CSP",
};

type Category = "all" | "auth" | "mfa" | "users" | "content" | "system" | "security";

const CATEGORY_BY_ACTION: Record<AuditActionType, Category> = {
  login: "auth",
  logout: "auth",
  login_failed: "auth",
  unauthorized_access: "security",
  email_not_verified_login_attempt: "auth",
  brute_force_detected: "security",
  account_locked: "security",
  account_unlocked: "security",
  captcha_failed: "security",
  captcha_bypassed_attempt: "security",
  login_blocked_by_captcha: "security",
  csp_violation: "security",
  mfa_enabled: "mfa",
  mfa_disabled: "mfa",
  mfa_success: "mfa",
  mfa_failed: "mfa",
  mfa_reset: "mfa",
  recovery_code_generated: "mfa",
  recovery_code_regenerated: "mfa",
  recovery_code_used: "mfa",
  user_create: "users",
  user_update: "users",
  user_delete: "users",
  role_change: "users",
  password_reset: "users",
  content_create: "content",
  content_update: "content",
  content_delete: "content",
  content_publish: "content",
  content_unpublish: "content",
  csv_import: "content",
  library_change: "content",
  location_change: "content",
  admin_export: "system",
};

const CATEGORY_LABEL: Record<Category, string> = {
  all: "Todas",
  auth: "Autenticação",
  mfa: "MFA",
  users: "Usuários",
  content: "Publicações",
  system: "Sistema",
  security: "Segurança",
};

const CATEGORY_COLOR: Record<Category, string> = {
  all: "bg-muted text-muted-foreground",
  auth: "bg-blue-50 text-blue-700",
  mfa: "bg-purple-50 text-purple-700",
  users: "bg-amber-50 text-amber-700",
  content: "bg-emerald-50 text-emerald-700",
  system: "bg-zinc-100 text-zinc-700",
  security: "bg-[color:var(--red-inst)]/10 text-[color:var(--red-inst)]",
};

const CRITICAL = new Set<AuditActionType>([
  "brute_force_detected",
  "account_locked",
  "unauthorized_access",
  "captcha_failed",
  "captcha_bypassed_attempt",
  "csp_violation",
  "mfa_failed",
  "mfa_disabled",
  "mfa_reset",
  "user_delete",
  "role_change",
]);

function fmtDay(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function AuditoriaPage() {
  const listFn = useServerFn(listAuditLog);
  const [category, setCategory] = useState<Category>("all");
  const [action, setAction] = useState<AuditActionType | "">("");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<"all" | "24h" | "7d" | "30d">("all");
  const [page, setPage] = useState(1);

  const fromDate = useMemo(() => {
    if (range === "all") return undefined;
    const days = range === "24h" ? 1 : range === "7d" ? 7 : 30;
    return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  }, [range]);

  const q = useQuery({
    queryKey: ["audit-log", action, search, fromDate, page],
    queryFn: () =>
      listFn({
        data: {
          action: action || undefined,
          search: search || undefined,
          fromDate,
          page,
          pageSize: 100,
        },
      }),
    placeholderData: (prev) => prev,
  });

  const rawRows: AuditLogRow[] = q.data?.rows ?? [];
  const rows = useMemo(
    () =>
      category === "all"
        ? rawRows
        : rawRows.filter((r) => CATEGORY_BY_ACTION[r.action] === category),
    [rawRows, category],
  );
  const total = q.data?.total ?? 0;
  const pageSize = q.data?.pageSize ?? 100;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Group by day
  const grouped = useMemo(() => {
    const map = new Map<string, AuditLogRow[]>();
    for (const r of rows) {
      const day = r.created_at.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(r);
    }
    return Array.from(map.entries());
  }, [rows]);

  const categories: Category[] = ["all", "auth", "mfa", "users", "content", "system", "security"];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold inline-flex items-center gap-2">
          <ScrollText className="size-5" /> Auditoria
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Linha do tempo somente leitura — eventos não podem ser editados nem excluídos.
        </p>
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCategory(c);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              category === c
                ? "bg-[color:var(--navy-deep)] text-white"
                : `${CATEGORY_COLOR[c]} hover:opacity-80`
            }`}
          >
            {CATEGORY_LABEL[c]}
          </button>
        ))}
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "24h", "7d", "30d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRange(r);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                range === r
                  ? "bg-[color:var(--orange)] text-[color:var(--navy-deep)]"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {r === "all" ? "Tudo" : r}
            </button>
          ))}
        </div>
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value as AuditActionType | "");
            setPage(1);
          }}
          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs"
        >
          <option value="">Todas ações</option>
          {(Object.keys(ACTION_LABEL) as AuditActionType[]).map((a) => (
            <option key={a} value={a}>
              {ACTION_LABEL[a]}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="e-mail, título…"
          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs flex-1 min-w-[180px]"
        />
      </div>

      {q.isError && <AdminError message="Falha ao carregar auditoria." />}
      {q.isLoading && <AdminSkeleton rows={6} />}
      {!q.isLoading && grouped.length === 0 && (
        <SectionCard title="Sem eventos">
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum evento corresponde aos filtros.
          </p>
        </SectionCard>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {grouped.map(([day, items]) => (
          <div key={day} className="rounded-3xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <Calendar className="size-3.5" /> {fmtDay(day)}
            </div>
            <ul className="divide-y divide-border">
              {items.map((r) => {
                const cat = CATEGORY_BY_ACTION[r.action];
                const isCritical = CRITICAL.has(r.action);
                return (
                  <li key={r.id} className="px-5 py-3 flex items-start gap-3">
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CATEGORY_COLOR[cat]}`}
                    >
                      {CATEGORY_LABEL[cat]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-sm font-medium ${isCritical ? "text-[color:var(--red-inst)]" : ""}`}
                      >
                        {isCritical && <ShieldAlert className="inline size-3.5 mr-1 -mt-0.5" />}
                        {ACTION_LABEL[r.action] ?? r.action}
                        {r.target_title && (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            · {r.target_title}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-3">
                        <span className="inline-flex items-center gap-1">
                          <User className="size-3" /> {r.user_email ?? "sistema"}
                          {r.user_role && (
                            <span className="ml-1 uppercase font-semibold">{r.user_role}</span>
                          )}
                        </span>
                        {r.ip_address && <span>IP {r.ip_address}</span>}
                        {r.target_type && <span>tipo {r.target_type}</span>}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {fmtTime(r.created_at)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {total} eventos · página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-full border border-border px-3 py-1 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-full border border-border px-3 py-1 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  );
}
