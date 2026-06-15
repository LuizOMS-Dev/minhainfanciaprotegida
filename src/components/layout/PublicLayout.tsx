import type { ReactNode } from "react";
import { SiteHeader } from "../site/SiteHeader";
import { SiteFooter } from "../site/SiteFooter";
import { FloatingAssistant } from "../site/FloatingAssistant";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <FloatingAssistant />
    </div>
  );
}
