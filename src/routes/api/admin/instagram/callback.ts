import { createFileRoute } from "@tanstack/react-router";
import { completeInstagramOAuthCallback } from "@/services/instagramService";

export const Route = createFileRoute("/api/admin/instagram/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const result = await completeInstagramOAuthCallback(request.url);
        const redirectUrl = new URL("/admin/instagram", request.url);
        redirectUrl.searchParams.set("instagram", result.ok ? "connected" : "error");
        if (!result.ok) redirectUrl.searchParams.set("reason", result.code);
        return Response.redirect(redirectUrl, 302);
      },
    },
  },
});
