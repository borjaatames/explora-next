import Image from "next/image";
import Link from "next/link";
import FaqActividad from "@/components/FaqActividad";
import OpcionesAtraccion, { type OpcionCard } from "@/components/atraccion/OpcionesAtraccion";
import { aCardData } from "@/lib/cardActividad";
import { actividadPorSlugEs } from "@/lib/descubrir";
import { IDIOMA_LOCALE } from "@/lib/i18n/config";
import { prefijoIdioma, urlAtraccionesDeCiudad } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";
import type { GuiaListItem } from "@/lib/guias";
import type { Atraccion, OpcionAtraccion, TipoOpcion } from "@/lib/atracciones";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Textos = {
  inicio: string;
  atracciones: string;
  migas: string;
  verOpciones: string;
  agotadas: string;
  datos: string;
  sobre: (nombre: string) => string;
  todasLasFormas: (nombre: string) => string;
  todasIntro: string;
  filtrar: string;
  todas: string;
  verTodas: string;
  tipos: Record<TipoOpcion, string>;
  queOpcion: string;
  queOpcionIntro: string;
  siBuscas: string;
  recomendamos: string;
  valoracion: string;
  desde: string;
  practico: string;
  guiasAFondo: string;
  guia: string;
  masAtracciones: (ciudad: string) => string;
  tarjeta: { desde: string; verActividad: string; cancelacionGratuita: string };
};

const ES: Textos = {
  inicio: "Inicio",
  atracciones: "Atracciones",
  migas: "Migas de pan",
  verOpciones: "Ver las opciones",
  agotadas: "¿Entradas agotadas?",
  datos: "Datos clave",
  sobre: (n) => `Sobre ${n.replace(/^La /, "la ").replace(/^El /, "el ")}`,
  todasLasFormas: (n) => `Todas las formas de visitar ${n.replace(/^La /, "la ").replace(/^El /, "el ")}`,
  todasIntro: "Entradas y visitas con cupo propio: siguen disponibles aunque la web oficial esté agotada.",
  filtrar: "Filtrar por tipo de visita",
  todas: "Todas",
  verTodas: "Ver las {n} opciones",
  tipos: {
    entrada: "Entrada sin guía",
    guiada: "Visita guiada",
    privada: "Privada",
    nocturna: "Nocturna",
    jardines: "Solo jardines",
    excursion: "Excursión de un día",
  },
  queOpcion: "¿Qué opción te conviene?",
  queOpcionIntro: "Nuestra recomendación según lo que busques.",
  siBuscas: "Si buscas…",
  recomendamos: "Te recomendamos",
  valoracion: "Valoración",
  desde: "Desde",
  practico: "Lo práctico",
  guiasAFondo: "Guías a fondo",
  guia: "Guía",
  masAtracciones: (c) => `Más atracciones en ${c}`,
  tarjeta: { desde: "Desde", verActividad: "Ver actividad", cancelacionGratuita: "Cancelación gratis" },
};

const EN: Textos = {
  inicio: "Home",
  atracciones: "Attractions",
  migas: "Breadcrumb",
  verOpciones: "See the options",
  agotadas: "Tickets sold out?",
  datos: "Key facts",
  sobre: (n) => `About ${n.replace(/^The /, "the ")}`,
  todasLasFormas: (n) => `Every way to visit ${n.replace(/^The /, "the ")}`,
  todasIntro: "Tickets and tours with their own allocation: still available when the official site is sold out.",
  filtrar: "Filter by type of visit",
  todas: "All",
  verTodas: "See all {n} options",
  tipos: {
    entrada: "Ticket only",
    guiada: "Guided tour",
    privada: "Private",
    nocturna: "Night visit",
    jardines: "Gardens only",
    excursion: "Day trip",
  },
  queOpcion: "Which option suits you?",
  queOpcionIntro: "Our pick depending on what you're after.",
  siBuscas: "If you want…",
  recomendamos: "We recommend",
  valoracion: "Rating",
  desde: "From",
  practico: "Practical info",
  guiasAFondo: "In-depth guides",
  guia: "Guide",
  masAtracciones: (c) => `More attractions in ${c}`,
  tarjeta: { desde: "From", verActividad: "View activity", cancelacionGratuita: "Free cancellation" },
};

const TEXTOS: Record<Idioma, Textos> = { es: ES, en: EN, de: EN, fr: EN, it: EN, pt: EN };

export type Cercana = { nombre: string; descripcion: string; url: string };

type Props = {
  idioma: Idioma;
  atraccion: Atraccion;
  ciudad: { slug: string; nombre: string; url: string };
  opciones: OpcionAtraccion[];
  guias: GuiaListItem[];
  cercanas: Cercana[];
  /** Guía de «entradas agotadas», para el botón del hero. */
  urlAgotadas?: string;
};

export default function PaginaAtraccion({ idioma, atraccion, ciudad, opciones, guias, cercanas, urlAgotadas }: Props) {
  const t = TEXTOS[idioma];
  const locale = IDIOMA_LOCALE[idioma];
  const numero = (n: number, dec = 0) =>
    n.toLocaleString(locale, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const precio = (n: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

  const cards: OpcionCard[] = opciones.map((o) => ({ card: aCardData(o.actividad), tipo: o.tipo }));
  const recomendaciones = atraccion.recomendaciones.flatMap((r) => {
    const a = actividadPorSlugEs(idioma, atraccion.ciudad, r.ficha);
    return a ? [{ busca: r.busca, a }] : [];
  });
  const urlListado = urlAtraccionesDeCiudad(idioma, ciudad.slug);
  const inicio = prefijoIdioma(idioma) || "/";

  const migas = [
    { nombre: t.inicio, url: inicio },
    { nombre: ciudad.nombre, url: ciudad.url },
    { nombre: t.atracciones, url: urlListado },
    { nombre: atraccion.nombre, url: atraccion.url },
  ];
  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.nombre,
      item: `${SITE_URL}${m.url === "/" ? "" : m.url}`,
    })),
  };
  const atraccionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: atraccion.nombre,
    description: atraccion.metaDescription,
    url: `${SITE_URL}${atraccion.url}`,
    image: `${SITE_URL}${atraccion.imagen}`,
    ...(atraccion.latitud && atraccion.longitud
      ? { geo: { "@type": "GeoCoordinates", latitude: atraccion.latitud, longitude: atraccion.longitud } }
      : {}),
    address: { "@type": "PostalAddress", addressLocality: ciudad.nombre, addressCountry: "ES" },
  };

  // FAQPage solo con 4+ preguntas reales (guía de estilo).
  const faqLd =
    atraccion.faq.length >= 4
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: atraccion.faq.map((p) => ({
            "@type": "Question",
            name: p.pregunta,
            acceptedAnswer: { "@type": "Answer", text: p.respuesta },
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(atraccionLd) }} />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}

      <header className="relative overflow-hidden text-white">
        <Image
          src={atraccion.imagen}
          alt={atraccion.imagenAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-piedra-950/60" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <nav aria-label={t.migas} className="mb-4 text-sm text-anil-100">
            {migas.slice(0, -1).map((m) => (
              <span key={m.url}>
                <Link href={m.url} className="hover:text-white">
                  {m.nombre}
                </Link>
                {" › "}
              </span>
            ))}
            <span className="text-white">{atraccion.nombre}</span>
          </nav>
          <span className="mb-4 inline-block rounded bg-azafran-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-piedra-900">
            {atraccion.distintivo}
          </span>
          <h1 className="mb-4 max-w-3xl font-fraunces text-3xl font-bold leading-tight md:text-5xl">{atraccion.titulo}</h1>
          <p className="mb-6 max-w-2xl text-lg text-anil-50 md:text-xl">
            {atraccion.subtitulo.replace("{n}", String(opciones.length))}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#opciones"
              className="inline-flex items-center justify-center rounded-lg bg-azafran-500 px-6 py-3 font-semibold text-piedra-900 transition-colors hover:bg-azafran-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2"
            >
              {t.verOpciones}
            </a>
            {urlAgotadas ? (
              <Link
                href={urlAgotadas}
                className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-piedra-900"
              >
                {t.agotadas}
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <section aria-label={t.datos} className="bg-piedra-900 text-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-4 md:grid-cols-5">
          {atraccion.datosClave.map((d) => (
            <div key={d.etiqueta} className="border-piedra-800 py-4 pr-4 md:border-r md:px-4 md:last:border-r-0">
              <dt className="text-xs uppercase tracking-wider text-piedra-400">{d.etiqueta}</dt>
              <dd className="mt-1 text-lg font-bold">{d.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="sobre" className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 md:grid-cols-[1.6fr_1fr] md:pt-16">
        <div>
          <h2 id="sobre" className="mb-4 font-fraunces text-3xl font-bold text-piedra-900">
            {t.sobre(atraccion.nombre)}
          </h2>
          <div className="prose-guia" dangerouslySetInnerHTML={{ __html: atraccion.descripcionHtml }} />
          <div className="mt-6 grid grid-cols-3 gap-3">
            {atraccion.fotos.map((f) => (
              <figure key={f.src} className="m-0">
                <Image
                  src={f.src}
                  alt={f.alt}
                  width={400}
                  height={300}
                  sizes="(min-width: 768px) 220px, 33vw"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <figcaption className="mt-1.5 text-xs text-piedra-500 md:text-sm">{f.pie}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <aside aria-label={t.datos} className="self-start rounded-xl border border-piedra-200 bg-piedra-50 p-6">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm md:text-base">
            {atraccion.ficha.map((d) => (
              <div key={d.etiqueta} className="contents">
                <dt className="text-piedra-500">{d.etiqueta}</dt>
                <dd className="font-semibold text-piedra-900">{d.valor}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section id="opciones" aria-labelledby="opciones-titulo" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 md:py-16">
        <div className="mb-5 max-w-3xl">
          <h2 id="opciones-titulo" className="mb-2 font-fraunces text-3xl font-bold text-piedra-900">
            {t.todasLasFormas(atraccion.nombre)}
          </h2>
          <p className="text-lg text-piedra-600">{t.todasIntro}</p>
        </div>
        <OpcionesAtraccion
          opciones={cards}
          etiquetasTipo={t.tipos}
          textos={{ todas: t.todas, verTodas: t.verTodas, filtrar: t.filtrar }}
          strings={t.tarjeta}
          locale={locale}
        />
      </section>

      {recomendaciones.length > 0 ? (
        <section aria-labelledby="que-opcion" className="mx-auto max-w-6xl px-4 pb-14 md:pb-16">
          <h2 id="que-opcion" className="mb-2 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
            {t.queOpcion}
          </h2>
          <p className="mb-5 text-piedra-600">{t.queOpcionIntro}</p>
          <div className="overflow-x-auto rounded-xl border border-piedra-200">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm md:text-base">
              <thead className="bg-piedra-50">
                <tr>
                  <th scope="col" className="px-4 py-3">{t.siBuscas}</th>
                  <th scope="col" className="px-4 py-3">{t.recomendamos}</th>
                  <th scope="col" className="px-4 py-3">{t.valoracion}</th>
                  <th scope="col" className="px-4 py-3 text-right">{t.desde}</th>
                </tr>
              </thead>
              <tbody>
                {recomendaciones.map(({ busca, a }) => (
                  <tr key={a.url} className="border-t border-piedra-100">
                    <td className="px-4 py-3 text-piedra-600">{busca}</td>
                    <td className="px-4 py-3">
                      <Link href={a.url} className="font-semibold text-anil-600 hover:text-anil-700">
                        {a.titulo}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {typeof a.ratingProveedor === "number" ? (
                        <>
                          {numero(a.ratingProveedor, 1)} <span className="text-azafran-600" aria-hidden="true">★</span>
                          {typeof a.numeroOpiniones === "number" ? ` (${numero(a.numeroOpiniones)})` : ""}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-bold">{precio(a.precioDesde)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="border-y border-piedra-200 bg-piedra-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr] md:py-16">
          <div>
            <h2 className="mb-5 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">{t.practico}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {atraccion.practico.map((b) => (
                <div key={b.titulo} className="rounded-xl border border-piedra-200 bg-white p-5">
                  <h3 className="mb-1.5 font-semibold text-piedra-900">{b.titulo}</h3>
                  <p className="text-sm leading-relaxed text-piedra-700">{b.texto}</p>
                </div>
              ))}
            </div>
          </div>
          {guias.length > 0 ? (
            <div>
              <h2 className="mb-5 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">{t.guiasAFondo}</h2>
              <div className="flex flex-col gap-4">
                {guias.map((g) => (
                  <Link
                    key={g.url}
                    href={g.url}
                    className="group block rounded-xl border border-piedra-200 bg-white p-5 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
                  >
                    <span className="mb-2 inline-block rounded bg-anil-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-anil-700">
                      {t.guia}
                    </span>
                    <h3 className="mb-1 font-fraunces text-lg font-bold text-piedra-900 transition-colors group-hover:text-anil-700">
                      {g.titulo}
                    </h3>
                    <p className="line-clamp-2 text-sm text-piedra-600">{g.descripcion}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {atraccion.faq.length > 0 ? (
        <section className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <FaqActividad idioma={idioma} preguntas={atraccion.faq} />
        </section>
      ) : null}

      {cercanas.length > 0 ? (
        <section className="border-t border-piedra-200 bg-piedra-50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
            <h2 className="mb-5 font-fraunces text-2xl font-bold text-piedra-900">{t.masAtracciones(ciudad.nombre)}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cercanas.map((c) => (
                <Link
                  key={c.nombre}
                  href={c.url}
                  className="block rounded-xl border border-piedra-200 bg-white p-5 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
                >
                  <h3 className="mb-1 font-semibold text-piedra-900">{c.nombre}</h3>
                  <p className="line-clamp-2 text-sm text-piedra-600">{c.descripcion}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
