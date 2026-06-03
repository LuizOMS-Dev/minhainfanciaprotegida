import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, ShieldAlert } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

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
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      navigate({ to: "/admin" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao autenticar");
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
      setError(result.error.message ?? "Falha no login com Google");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
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

        <div className="mt-6 flex gap-2 rounded-full bg-muted p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                mode === m ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {mode === "signup" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="name">
                Nome completo
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl bg-background border border-border px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--orange)]"
              />
            </div>
          )}
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
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
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
          O primeiro usuário cadastrado torna-se administrador automaticamente.
        </p>
      </div>
    </section>
  );
}
