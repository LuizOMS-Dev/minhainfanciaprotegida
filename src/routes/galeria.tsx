import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import heroImg from "@/assets/hero-protection.jpg";
import silenceImg from "@/assets/silence.jpg";
import ribbonImg from "@/assets/ribbon.jpg";
import joyImg from "@/assets/children-joy.jpg";
import listeningImg from "@/assets/listening.jpg";
import supportImg from "@/assets/support.jpg";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Imagens da campanha Maio Laranja" },
      {
        name: "description",
        content: "Galeria visual da campanha Infância Protegida — proteção, escuta, acolhimento e mobilização.",
      },
      { property: "og:title", content: "Galeria — Infância Protegida" },
      { property: "og:description", content: "Imagens humanizadas sobre proteção da infância." },
      { property: "og:url", content: "/galeria" },
    ],
    links: [{ rel: "canonical", href: "/galeria" }],
  }),
  component: Page,
});

const items = [
  { src: heroImg, alt: "Mãos de adulto e criança entrelaçadas ao pôr do sol — proteção", tag: "Proteção" },
  { src: joyImg, alt: "Crianças sorrindo em um parque", tag: "Infância" },
  { src: silenceImg, alt: "Silhueta de criança em janela ao entardecer", tag: "Conscientização" },
  { src: listeningImg, alt: "Adulto escutando atentamente uma criança", tag: "Escuta" },
  { src: supportImg, alt: "Educadora abraçando criança em sala de aula", tag: "Apoio" },
  { src: ribbonImg, alt: "Laço laranja, símbolo do Maio Laranja", tag: "Maio Laranja" },
];

function Page() {
  return (
    <>
      <section className="bg-[color:var(--navy-deep)] text-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              Galeria
            </span>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl font-semibold leading-tight text-balance">
              Imagens de uma causa que precisa de todos
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-lg text-white/85 max-w-2xl">
              Cada imagem representa um aspecto da proteção integral à infância: escuta, acolhimento,
              educação, família e mobilização.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Mosaico" title="Olhar humanizado" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:18rem]">
            {items.map((it, i) => (
              <Reveal
                key={it.src}
                delay={i * 70}
                className={`group relative overflow-hidden rounded-3xl ${i % 5 === 0 ? "sm:row-span-2 sm:[grid-row:span_2]" : ""}`}
              >
                <img
                  src={it.src}
                  alt={it.alt}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--navy-deep)]/85 via-[color:var(--navy-deep)]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[color:var(--orange)] font-semibold">
                    <span className="h-px w-6 bg-[color:var(--orange)]" /> {it.tag}
                  </span>
                  <p className="mt-2 font-display text-lg leading-snug max-w-xs">{it.alt}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-8 text-xs text-muted-foreground text-center">
              Imagens conceituais geradas para fins ilustrativos desta campanha educativa.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
