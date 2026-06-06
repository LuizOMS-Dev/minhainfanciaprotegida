import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, ShieldAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { recordLoginAttempt } from "@/lib/audit.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audit = useServerFn(recordLoginAttempt);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        // Audit the failed attempt (fire-and-forget)
        audit({ data: { email, success: false, provider: "password", reason: err.message } }).catch(
          () => {},
        );
        throw err;
      }
      audit({ data: { email, success: true, provider: "password" } }).catch(() => {});
      navigate({ to: "/admin" });
    } catch (e: unknown) {
      if (e instanceof Error) console.warn("[auth] submit error:", e.message);
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin`,
    });
    if (result.error) {
      audit({ data: { success: false, provider: "google", reason: result.error.message } }).catch(
        () => {},
      );
      setError(result.error.message ?? "Falha no login com Google");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    audit({ data: { success: true, provider: "google" } }).catch(() => {});
    navigate({ to: "/admin" });
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

        <form className="mt-6 space-y-4" onSubmit={submit}>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--navy-deep)] text-white px-5 py-3 font-semibold disabled:opacity-60"
          >
            <Lock className="size-4" />
            {loading ? "Aguarde..." : "Entrar"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
        </div>
        <button
          onClick={google}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 font-semibold hover:bg-muted disabled:opacity-60"
        >
          Entrar com Google
        </button>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          Acesso restrito. Não há cadastro público — solicite a um administrador a criação do seu usuário.
        </p>
      </div>
    </section>
  );
}
