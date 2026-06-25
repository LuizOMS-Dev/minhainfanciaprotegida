import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/instagram/connect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const redirectUrl = new URL("/admin/instagram", request.url);
        redirectUrl.searchParams.set("instagram", "use_admin_button");
        return Response.redirect(redirectUrl, 302);
      },
    },
  },
});
