import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/public/SiteHeader";
import { FloatingAssistant } from "@/components/public/FloatingAssistant";
import { SiteFooter } from "@/components/public/SiteFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { PublicLayout } from "../components/layout/PublicLayout";
import { AuthLayout } from "../components/layout/AuthLayout";
import {
  organizationSchema,
  websiteSchema,
  maioLaranjaEventSchema,
  definedTermsSchema,
  siteNavigationSchema,
} from "../lib/structured-data";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 py-16">
      <div className="max-w-xl text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-muted/50">
          <span className="font-display text-4xl font-bold text-muted-foreground">404</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Página não encontrada</h1>
        <p className="mt-4 text-base text-muted-foreground">
          O conteúdo que você procura não existe ou foi movido. Explore os links abaixo para encontrar informações importantes.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--orange)] px-6 py-3 text-sm font-bold text-[color:var(--navy-deep)] hover:opacity-95 transition"
          >
            Voltar para o início
          </Link>
          <Link
            to="/biblioteca"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            Acessar Biblioteca
          </Link>
          <Link
            to="/sinais"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            Sinais de Alerta
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    // Treat errors locally
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/10"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0b1a3a" },
      { name: "author", content: "Infância Protegida" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "application-name", content: "Infância Protegida" },
      { name: "apple-mobile-web-app-title", content: "Infância Protegida" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "format-detection", content: "telephone=yes" },
      { property: "og:site_name", content: "Infância Protegida" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      // Defaults — every leaf route overrides title / description / og:* with route-specific values.
      { title: "Infância Protegida — Proteção Infantil, Maio Laranja e Disque 100" },
      {
        name: "description",
        content:
          "Portal brasileiro de conscientização, prevenção e combate ao abuso e à exploração sexual de crianças e adolescentes. Sinais, leis, riscos online e Disque 100.",
      },
    ],

    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Work+Sans:wght@400;500;600;700;800&display=swap",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
    scripts: [
      // Marca HTML como .js o mais cedo possível — o CSS só esconde
      // .reveal quando essa classe existe. Sem JS, conteúdo fica visível.
      {
        children: "document.documentElement.classList.add('js');",
      },      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema,
          websiteSchema,
          maioLaranjaEventSchema,
          definedTermsSchema,
          siteNavigationSchema,
        ]),
      },
      // Google Analytics 4
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-7ND7LLCYQW",
      },
      {
        children:
          "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7ND7LLCYQW',{anonymize_ip:true});",
      },
      // Microsoft Clarity
      {
        children:
          "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src=\"https://www.clarity.ms/tag/\"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,\"clarity\",\"script\",\"x1038ndzes\");",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <style>{`html.js .reveal,.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <SkipLink />
      
      {(() => {
        const path = router.state.location.pathname;
        if (path.startsWith("/admin")) {
          // AdminLayout is rendered inside _authenticated/admin/route.tsx
          return <Outlet />;
        }
        if (path.startsWith("/auth")) {
          return (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          );
        }
        return (
          <PublicLayout>
            <Outlet />
          </PublicLayout>
        );
      })()}

      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  );
}
