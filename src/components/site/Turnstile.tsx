import { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string | null;
  onToken: (token: string | null) => void;
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
        },
      ) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
    __turnstileLoading?: boolean;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (window.__turnstileLoading) {
    return new Promise((resolve) => {
      const t = setInterval(() => {
        if (window.turnstile) {
          clearInterval(t);
          resolve();
        }
      }, 50);
    });
  }
  window.__turnstileLoading = true;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile script load failed"));
    document.head.appendChild(s);
  });
}

export function Turnstile({ siteKey, onToken, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !window.turnstile || !containerRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onToken(token),
          "error-callback": () => onToken(null),
          "expired-callback": () => onToken(null),
          theme: "auto",
        });
      })
      .catch(() => onToken(null));
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, [siteKey, onToken]);

  if (!siteKey) {
    return (
      <p className={`text-xs text-muted-foreground ${className ?? ""}`}>CAPTCHA não configurado.</p>
    );
  }
  return <div ref={containerRef} className={className} />;
}
