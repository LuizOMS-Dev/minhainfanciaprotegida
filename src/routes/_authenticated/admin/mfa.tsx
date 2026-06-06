import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordMfaEvent } from "@/lib/security.functions";

export const Route = createFileRoute("/_authenticated/admin/mfa")({
  head: () => ({
    meta: [
      { title: "Verificação em duas etapas — Painel" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  component: MfaPage,
});

interface EnrollState {
  factorId: string;
  qrCode: string;
  secret: string;
  uri: string;
}

function MfaPage() {
  const router = useRouter();
  const recordMfa = useServerFn(recordMfaEvent);

  const [enrolled, setEnrolled] = useState<{ id: string; createdAt: string | null } | null>(null);
  const [pending, setPending] = useState<{ id: string; createdAt: string | null } | null>(null);
  const [enroll, setEnroll] = useState<EnrollState | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const { data, error: e } = await supabase.auth.mfa.listFactors();
    if (e) {
      setError(e.message);
      setLoading(false);
      return;
    }
    const verified = (data?.totp ?? []).find((f) => f.status === "verified");
    const unverified = (data?.totp ?? []).find((f) => f.status === "unverified");
    setEnrolled(verified ? { id: verified.id, createdAt: verified.created_at } : null);
    setPending(unverified ? { id: unverified.id, createdAt: unverified.created_at } : null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function startEnroll() {
    setBusy(true);
    setError(null);
    // If a previous unverified factor exists, drop it first.
    if (pending) {
      try {
        await supabase.auth.mfa.unenroll({ factorId: pending.id });
      } catch {
        /* ignore */
      }
    }
    const { data, error: e } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (e || !data) {
      setError(e?.message ?? "Não foi possível iniciar a configuração.");
      setBusy(false);
      return;
    }
    setEnroll({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri,
    });
    setBusy(false);
  }

  async function verifyEnroll(e: FormEvent) {
    e.preventDefault();
    if (!enroll) return;
    setBusy(true);
    setError(null);
    const { data: ch, error: cErr } = await supabase.auth.mfa.challenge({
      factorId: enroll.factorId,
    });
    if (cErr || !ch) {
      setError(cErr?.message ?? "Falha ao desafiar o factor.");
      setBusy(false);
      return;
    }
    const { error: vErr } = await supabase.auth.mfa.verify({
      factorId: enroll.factorId,
      challengeId: ch.id,
      code: code.trim(),
    });
    if (vErr) {
      recordMfa({ data: { action: "mfa_failed" } }).catch(() => {});
      setError("Código inválido. Verifique o app e tente novamente.");
      setBusy(false);
      return;
    }
    recordMfa({ data: { action: "mfa_enabled" } }).catch(() => {});
    setEnroll(null);
    setCode("");
    setNotice("Verificação em duas etapas ativada com sucesso.");
    await refresh();
    router.invalidate();
    setBusy(false);
  }

  async function removeFactor() {
    if (!enrolled) return;
    if (
      !window.confirm(
        "Remover a verificação em duas etapas? Sua conta ficará menos segura e poderá ser bloqueada por políticas administrativas.",
      )
    )
      return;
    setBusy(true);
    const { error: e } = await supabase.auth.mfa.unenroll({ factorId: enrolled.id });
    if (e) {
      setError(e.message);
      setBusy(false);
      return;
    }
    recordMfa({ data: { action: "mfa_disabled" } }).catch(() => {});
    setNotice("MFA removido.");
    await refresh();
    router.invalidate();
    setBusy(false);
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }

  return (
    <section className="max-w-2xl space-y-6">
      <header>
        <h2 className="font-display text-xl font-semibold inline-flex items-center gap-2">
          <ShieldCheck className="size-5 text-emerald-600" /> Verificação em duas etapas
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione uma camada extra de segurança usando um app autenticador (Google Authenticator, Microsoft Authenticator, Authy ou similar).
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-[color:var(--red-inst)]/30 bg-[color:var(--red-inst)]/5 px-4 py-3 text-sm text-[color:var(--red-inst)]">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      )}

      {enrolled && !enroll && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">MFA ativo</p>
          <p className="text-sm text-muted-foreground">
            Configurado em{" "}
            {enrolled.createdAt ? new Date(enrolled.createdAt).toLocaleString("pt-BR") : "—"}.
          </p>
          <button
            onClick={removeFactor}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--red-inst)]/40 text-[color:var(--red-inst)] px-4 py-2 text-sm font-semibold"
          >
            <Trash2 className="size-4" /> Remover MFA
          </button>
        </div>
      )}

      {!enrolled && !enroll && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="font-semibold">Você ainda não configurou o MFA.</p>
          <p className="text-sm text-muted-foreground">
            Administradores precisam concluir esta etapa para acessar o painel.
          </p>
          <button
            onClick={startEnroll}
            disabled={busy}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--navy-deep)] text-white px-5 py-2 text-sm font-semibold"
          >
            Configurar agora
          </button>
        </div>
      )}

      {enroll && (
        <form
          onSubmit={verifyEnroll}
          className="rounded-2xl border border-border bg-card p-5 space-y-4"
        >
          <p className="font-semibold">1. Escaneie o QR code no seu app autenticador</p>
          <div className="flex flex-col items-center gap-3">
            <img
              src={enroll.qrCode}
              alt="QR code MFA"
              className="size-48 rounded-xl border border-border bg-white p-2"
            />
            <p className="text-xs text-muted-foreground">
              Ou digite manualmente o segredo:
            </p>
            <code className="text-xs font-mono bg-muted px-3 py-1.5 rounded-lg break-all">
              {enroll.secret}
            </code>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="otp">
              2. Insira o código de 6 dígitos exibido pelo app
            </label>
            <input
              id="otp"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="mt-1 w-full rounded-xl bg-background border border-border px-4 py-3 text-center text-2xl tracking-[0.4em]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--navy-deep)] text-white px-5 py-2 text-sm font-semibold disabled:opacity-60"
            >
              Confirmar e ativar
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await supabase.auth.mfa.unenroll({ factorId: enroll.factorId });
                } catch {
                  /* ignore */
                }
                setEnroll(null);
                setCode("");
                refresh();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
