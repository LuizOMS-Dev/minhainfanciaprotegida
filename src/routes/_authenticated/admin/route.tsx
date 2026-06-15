import {
  createFileRoute,
  isRedirect,
  redirect,
} from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/services/articleService";
import { recordUnauthorizedAccess } from "@/services/auditService";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel administrativo — Infância Protegida" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    // 1. FAST PATH: Is there a session?
    const { data: userRes, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userRes.user) throw redirect({ to: "/auth", search: { redirect: location.pathname } });
    
    // 2. Verified email check
    if (!userRes.user.email_confirmed_at) {
      recordUnauthorizedAccess({
        data: { path: `email_not_verified:${location.pathname}` },
      }).catch(() => {});
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }

    // 3. SSR Role verification guard
    try {
      const { roles } = await getMyRoles();
      if (!roles || roles.length === 0 || roles.includes("viewer")) {
        // Viewers are authenticated but strictly blocked from /admin
        recordUnauthorizedAccess({ data: { path: location.pathname } }).catch(() => {});
        throw redirect({ to: "/" }); // Send to public site
      }
    } catch (e) {
      if (isRedirect(e)) throw e;
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <ProtectedRoute allowedRoles={["admin", "editor", "reviewer"]} requireMfa={true}>
      <AdminLayout />
    </ProtectedRoute>
  ),
});
