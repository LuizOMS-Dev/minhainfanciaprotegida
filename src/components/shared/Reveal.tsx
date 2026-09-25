import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }
    // Rede de segurança: se o observer nunca disparar (JS parcial,
    // chunk bloqueado, aba em background), revela após 2.5s + delay.
    const fallback = window.setTimeout(() => node.classList.add("is-visible"), 2500 + delay);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            window.setTimeout(() => el.classList.add("is-visible"), delay);
            window.clearTimeout(fallback);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(node);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, [delay]);

  return (
    // @ts-expect-error generic tag ref typing
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
