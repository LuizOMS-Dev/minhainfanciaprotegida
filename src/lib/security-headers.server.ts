// Builds the Content-Security-Policy and other security headers applied to
// every HTTP response by the request middleware in `src/start.ts`.
//
// Whitelist rationale:
// - 'self' covers our own origin (preview, production, custom domains).
// - Supabase: REST/Realtime/Storage on *.supabase.co, *.supabase.in.
// - Cloudflare Turnstile: challenges.cloudflare.com (script + frame).
// - Google Analytics 4: googletagmanager.com (script), google-analytics.com,
//   analytics.google.com, *.google-analytics.com (connect + img beacon).
// - Microsoft Clarity: clarity.ms + *.clarity.ms (script, connect, img).
// - Google Fonts: fonts.googleapis.com (style) + fonts.gstatic.com (font).
// 'unsafe-inline' for styles is required by GA, Clarity and Tailwind-emitted
// inline styles; we keep script-src strict (no 'unsafe-inline' for scripts
// would require nonces, which TanStack does not yet emit — so we allow inline
// scripts but restrict their sources tightly via the rest of the policy).
const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://challenges.cloudflare.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://*.clarity.ms",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
  ],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https:",
  ],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "connect-src": [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://*.supabase.in",
    "wss://*.supabase.in",
    "https://challenges.cloudflare.com",
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://*.clarity.ms",
  ],
  "frame-src": ["'self'", "https://challenges.cloudflare.com"],
  "frame-ancestors": ["'none'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "upgrade-insecure-requests": [],
};

export function buildCsp(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}

const STATIC_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  // COEP intentionally omitted: 'require-corp' breaks 3rd-party iframes
  // (Turnstile, Analytics). Set to a permissive value for documentation.
  "Cross-Origin-Embedder-Policy": "unsafe-none",
  "X-DNS-Prefetch-Control": "on",
  "X-Permitted-Cross-Domain-Policies": "none",
};

export function applySecurityHeaders(headers: Headers, options?: { reportOnly?: boolean }) {
  for (const [k, v] of Object.entries(STATIC_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  const csp = buildCsp() + "; report-uri /api/public/csp-report";
  const cspHeader = options?.reportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";
  if (!headers.has(cspHeader)) headers.set(cspHeader, csp);
}
