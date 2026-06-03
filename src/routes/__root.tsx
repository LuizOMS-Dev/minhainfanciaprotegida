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

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site/SiteHeader";
import { SiteFooter } from "../components/site/SiteFooter";
import { SkipLink } from "../components/site/SkipLink";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--orange)] text-[color:var(--navy-deep)] px-5 py-2.5 text-sm font-semibold hover:opacity-95"
          >
            Voltar para o início
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
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
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
      { title: "Infância Protegida | Maio Laranja | Combate ao Abuso Infanti" },
      {
        name: "description",
        content:
          "Campanha educativa pelo enfrentamento da violência sexual contra crianças e adolescentes no Brasil. Disque 100. Dados de fontes oficiais: MDHC, UNICEF, Childhood Brasil, ECA.",
      },
      { name: "author", content: "Infância Protegida" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Infância Protegida | Maio Laranja | Combate ao Abuso Infanti" },
      {
        property: "og:description",
        content:
          "Uma infância protegida muda o futuro de uma sociedade. Informação, atenção e denúncia salvam vidas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Infância Protegida | Maio Laranja | Combate ao Abuso Infanti" },
      { name: "description", content: "Informação, prevenção e denúncia. Conheça os sinais, direitos, riscos online, canais oficiais de ajuda e conteúdos educativos para proteger crianças e adolescen" },
      { property: "og:description", content: "Informação, prevenção e denúncia. Conheça os sinais, direitos, riscos online, canais oficiais de ajuda e conteúdos educativos para proteger crianças e adolescen" },
      { name: "twitter:description", content: "Informação, prevenção e denúncia. Conheça os sinais, direitos, riscos online, canais oficiais de ajuda e conteúdos educativos para proteger crianças e adolescen" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/dIthxDk1U7cPxVmxiEiawtmAk1z2/social-images/social-1780446924477-ChatGPT_Image_2_de_jun._de_2026,_21_34_29.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/dIthxDk1U7cPxVmxiEiawtmAk1z2/social-images/social-1780446924477-ChatGPT_Image_2_de_jun._de_2026,_21_34_29.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Infância Protegida",
          description:
            "Campanha educativa de conscientização sobre o enfrentamento à violência sexual contra crianças e adolescentes.",
          areaServed: "BR",
          sameAs: [
            "https://www.gov.br/mdh/pt-br/disque100",
            "https://www.unicef.org/brazil/",
            "https://www.childhood.org.br/",
          ],
        }),
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-dvh flex-col">
        <SkipLink />
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
