import type { SupabaseClient } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor" | "revisor";

/**
 * Server-side role enforcement helper.
 * Throws if the user does not have ANY of the required roles.
 * Use inside server-fn handlers after `requireSupabaseAuth`.
 */
export async function requireRole(
  supabase: SupabaseClient,
  userId: string,
  roles: AppRole | AppRole[],
): Promise<void> {
  const wanted = Array.isArray(roles) ? roles : [roles];
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", wanted);
  if (error) {
    console.error("[requireRole] supabase error", error);
    throw new Error("Falha ao validar permissão.");
  }
  if (!data || data.length === 0) {
    throw new Error("Acesso restrito: você não tem permissão para esta ação.");
  }
}
