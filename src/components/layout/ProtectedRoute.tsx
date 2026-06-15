import { Navigate, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2, ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("admin" | "editor" | "reviewer" | "viewer")[];
  requireMfa?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, requireMfa }: ProtectedRouteProps) {
  const { user, loading: authLoading, needsMfa } = useAuth();
  const { roles, isLoading: rolesLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || rolesLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 animate-spin text-[color:var(--orange)]" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Verificando segurança...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" search={{ redirect: location.pathname }} replace />;
  }

  // MFA block explicitly on the route
  if (requireMfa && needsMfa) {
    // If we're already on the MFA page, allow it to render
    if (location.pathname !== "/admin/mfa") {
      return <Navigate to="/admin/mfa" replace />;
    }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some((role) => roles.includes(role));
    if (!hasAllowedRole) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-4 text-center">
          <div className="rounded-full bg-red-100 p-4">
            <ShieldAlert className="size-10 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-[color:var(--navy-deep)]">Acesso Negado</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Sua conta não possui as permissões (roles) necessárias para acessar esta página do painel administrativo.
          </p>
          <a
            href="/"
            className="mt-6 rounded-full bg-[color:var(--navy-deep)] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--navy-deep)]/90"
          >
            Voltar para o site público
          </a>
        </div>
      );
    }
  }

  return <>{children}</>;
}
