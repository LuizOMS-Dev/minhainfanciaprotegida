import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { Lock, ShieldAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  checkLoginAllowed,
  recordLoginAttemptV2,
  recordMfaEvent,
  recordSuccessfulLogin,
} from "@/services/authService";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  component: AuthPage,
});

type Step = "credentials" | "mfa";

function AuthPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // MFA challenge state
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  const checkAllowed = useServerFn(checkLoginAllowed);
  const recordV2 = useServerFn(recordLoginAttemptV2);
  const recordMfa = useServerFn(recordMfaEvent);
  const recordLoginSuccess = useServerFn(recordSuccessfulLogin);
  const bootstrap = useServerFn(bootstrapPrimaryAdmin);

  // Idempotent: ensure primary admin exists. Runs once when /auth mounts.
  useEffect(() => {
    bootstrap().catch(() => {});
  }, [bootstrap]);

  async function submitCredentials(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      // 1) Lockout check
      const lock = await checkAllowed({ data: { email } });
      if (lock.locked) {
        setError(
          `Conta temporariamente bloqueada. Tente novamente em ${lock.minutes_remaining ?? 15} minutos.`,
        );
        setLoading(false);
        return;
      }

      // 2) Try password sign-in
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        recordV2({
          data: { email, success: false, reason: err.message },
        }).catch(() => {});
        setError("E-mail ou senha inválidos.");
        setLoading(false);
        return;
      }

      // 3) Check if user has MFA enrolled
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verifiedTotp = factors?.totp?.find((f) => f.status === "verified");

      if (verifiedTotp) {
        // Require MFA challenge before continuing
        const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({
          factorId: verifiedTotp.id,
        });
        if (chErr || !ch) {
          setError("Falha ao iniciar verificação em duas etapas.");
          setLoading(false);
          return;
        }
        setMfaFactorId(verifiedTotp.id);
        setMfaChallengeId(ch.id);
        setStep("mfa");
        setLoading(false);
        return;
      }

      // 4) No MFA factor → record login + send to admin (gate will force enrollment)
      await recordLoginSuccess().catch(() => {});
      router.invalidate();
      navigate({ to: "/admin" });
    } catch (e) {
      console.warn("[auth] submit", e);
      setError("Não foi possível concluir o acesso. Tente novamente.");
      setLoading(false);
    }
  }

  async function submitMfa(e: FormEvent) {
    e.preventDefault();
    if (!mfaFactorId || !mfaChallengeId) return;
    setError(null);
    setLoading(true);
    try {
      const { error: vErr } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId,
        code: mfaCode.trim(),
      });
      if (vErr) {
        recordMfa({ data: { action: "mfa_failed" } }).catch(() => {});
        setError("Código inválido. Tente novamente.");
        setLoading(false);
        return;
      }
      recordMfa({ data: { action: "mfa_success" } }).catch(() => {});
      await recordLoginSuccess().catch(() => {});
      router.invalidate();
      navigate({ to: "/admin" });
    } catch (e) {
      console.warn("[auth] mfa", e);
      setError("Falha na verificação. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[80vh] grid place-items-center bg-background py-16 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-elegant">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-orange text-[color:var(--navy-deep)]">
            <ShieldAlert className="size-5" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold">Painel editorial</p>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Acesso restrito
            </p>
          </div>
        </div>

        {step === "credentials" && (
          <form className="mt-6 space-y-4" onSubmit={submitCredentials}>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 w-full rounded-xl bg-background border border-border px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl bg-background border border-border px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              />
            </div>

            {error && <p className="text-sm text-[color:var(--red-inst)]">{error}</p>}
            {info && <p className="text-sm text-muted-foreground">{info}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--navy-deep)] text-white px-5 py-3 font-semibold disabled:opacity-60"
            >
              <Lock className="size-4" />
              {loading ? "Aguarde..." : "Entrar"}
            </button>
          </form>
        )}

        {step === "mfa" && (
          <form className="mt-6 space-y-4" onSubmit={submitMfa}>
            <p className="text-sm text-muted-foreground">
              Insira o código de 6 dígitos do seu aplicativo autenticador (Google Authenticator, Authy, Microsoft Authenticator…).
            </p>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="mfa">
                Código de verificação
              </label>
              <input
                id="mfa"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                required
                autoFocus
                className="mt-1 w-full rounded-xl bg-background border border-border px-4 py-3 text-center text-2xl tracking-[0.4em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              />
            </div>
            {error && <p className="text-sm text-[color:var(--red-inst)]">{error}</p>}
            <button
              type="submit"
              disabled={loading || mfaCode.length !== 6}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--navy-deep)] text-white px-5 py-3 font-semibold disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Verificar e entrar"}
            </button>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                setStep("credentials");
                setMfaCode("");
                setMfaFactorId(null);
                setMfaChallengeId(null);
              }}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Cancelar e voltar
            </button>
          </form>
        )}

        <p className="mt-6 text-xs text-muted-foreground text-center">
          Acesso restrito. Não há cadastro público — solicite a um administrador a criação do seu usuário.
        </p>
      </div>
    </section>
  );
}
