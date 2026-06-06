import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";
import { applySecurityHeaders } from "@/lib/security-headers.server";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
    applySecurityHeaders(headers);
    return new Response(renderErrorPage(), { status: 500, headers });
  }
});

const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  try {
    const response = (result as { response?: Response })?.response;
    if (response && response.headers) {
      applySecurityHeaders(response.headers);
    }
  } catch (e) {
    console.warn("[security-headers] failed to apply", e);
  }
  return result;
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, securityHeadersMiddleware],
}));

