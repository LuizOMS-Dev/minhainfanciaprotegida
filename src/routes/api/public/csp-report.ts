import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/csp-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.text();
          let payload: unknown = raw;
          try {
            payload = JSON.parse(raw);
          } catch {
            /* keep as text */
          }
          // Normalise both legacy ("csp-report") and Reporting-API formats.
          const report = (payload as { "csp-report"?: unknown })?.["csp-report"] ?? payload;
          const { logAudit } = await import("@/lib/audit.server");
          await logAudit({
            action: "csp_violation",
            metadata: { report: report as never },
          });
        } catch (e) {
          console.warn("[csp-report] failed", e);
        }
        return new Response(null, { status: 204 });
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
    },
  },
});
