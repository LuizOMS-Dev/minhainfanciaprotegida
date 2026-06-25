import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/instagram/cron/publish-due")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const auth = request.headers.get("authorization") ?? "";

        if (!secret || auth !== `Bearer ${secret}`) {
          return Response.json(
            { ok: false, error: "unauthorized" },
            { status: 401 },
          );
        }

        if (process.env.INSTAGRAM_AUTO_PUBLISH_ENABLED !== "true") {
          return Response.json({
            ok: true,
            disabled: true,
            reason: "Instagram auto publishing is disabled by default.",
          });
        }

        return Response.json(
          {
            ok: false,
            error: "scheduler_not_homologated",
            reason:
              "Instagram scheduler is prepared but blocked until Meta OAuth, token vault, App Review and production approval are complete.",
          },
          { status: 423 },
        );
      },
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});
