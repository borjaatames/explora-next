import Link from "next/link";
import type { ActividadListItem, PreguntaFrecuente } from "@/lib/actividades";
import type { Idioma } from "@/lib/i18n/types";
import { aCardData } from "@/lib/cardActividad";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import FaqActividad from "@/components/FaqActividad";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export type Miga = { label: string; href?: string };

export type GrupoPrivados = {
  titulo?: string;
  /** Enlace «ver todas» del grupo (en el hub, a la página de la ciudad). */
  url?: string;
  textoUrl?: string;
  actividades: ActividadListItem[];
};

type Props = {
  idioma: Idioma;
  titulo: string;
  intro: string;
  migas: ReadonlyArray<Miga>;
  grupos: ReadonlyArray<GrupoPrivados>;
  faq: PreguntaFrecuente[];
  /** Máximo de tarjetas por grupo (hub); sin límite en la página de ciudad. */
  maxPorGrupo?: number;
};

const TEXTOS = {
  es: {
    migas: "Migas de pan",
    garantias: ["Solo tu grupo", "Reserva directa, sin intermediarios", "Pago con tarjeta en la pasarela segura de Bókun", "Te atendemos por WhatsApp"],
    tarjeta: { desde: "Desde", verActividad: "Ver actividad", cancelacionGratuita: "Cancelación gratis" },
    locale: "es-ES",
  },
  en: {
    migas: "Breadcrumb",
    garantias: ["Just your group", "Book direct, no middlemen", "Card payment through Bókun's secure gateway", "We help on WhatsApp"],
    tarjeta: { desde: "From", verActividad: "View tour", cancelacionGratuita: "Free cancellation" },
    locale: "en-GB",
  },
} as const;

export default function PaginaPrivados({ idioma, titulo, intro, migas, grupos, faq, maxPorGrupo }: Props) {
  const t = idioma === "es" ? TEXTOS.es : TEXTOS.en;
  const todas = grupos.flatMap((g) => g.actividades);

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.label,
      ...(m.href ? { item: `${SITE_URL}${m.href}` } : {}),
    })),
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: todas.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${a.url}`,
      name: a.titulo,
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <header className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label={t.migas} className="text-sm text-anil-100 mb-4">
            {migas.map((m, i) => (
              <span key={`${m.label}-${i}`}>
                {i > 0 ? " › " : null}
                {m.href ? (
                  <Link href={m.href} className="hover:text-white">
                    {m.label}
                  </Link>
                ) : (
                  <span className="text-white">{m.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="font-fraunces text-3xl md:text-5xl font-bold mb-4 leading-tight">{titulo}</h1>
          <p className="max-w-3xl text-lg md:text-xl text-anil-50">{intro}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-anil-50">
            {t.garantias.map((g) => (
              <li key={g} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-azafran-300">
                  ✓
                </span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {grupos.map((g, i) => {
        const visibles = maxPorGrupo ? g.actividades.slice(0, maxPorGrupo) : g.actividades;
        return (
          <section key={g.titulo ?? i} className={i % 2 === 1 ? "bg-piedra-50 border-y border-piedra-200" : ""}>
            <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
              {g.titulo ? (
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900">{g.titulo}</h2>
                  {g.url && g.textoUrl ? (
                    <Link href={g.url} className="text-sm font-semibold text-anil-600 hover:text-anil-700 transition-colors">
                      {g.textoUrl} →
                    </Link>
                  ) : null}
                </div>
              ) : null}
              <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {visibles.map((a) => (
                  <CardActividad key={a.url} actividad={aCardData(a)} strings={t.tarjeta} locale={t.locale} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-piedra-200">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <FaqActividad idioma={idioma} preguntas={faq} />
        </div>
      </section>
    </main>
  );
}
