import Link from "next/link";
import type { ActividadListItem, PreguntaFrecuente } from "@/lib/actividades";
import type { Hotel, IdiomaHotel } from "@/lib/hoteles";
import { agruparPorZona, ETIQUETAS_HOTEL, ZONAS_HOTELES } from "@/lib/hoteles";
import { aCardData } from "@/lib/cardActividad";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import FaqActividad from "@/components/FaqActividad";
import TarjetaHotel from "@/components/hoteles/TarjetaHotel";
import FiltroHoteles from "@/components/hoteles/FiltroHoteles";
import { TEXTOS_HOTELES } from "@/components/hoteles/textos";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export type Miga = { label: string; href?: string };

type Props = {
  idioma: IdiomaHotel;
  ciudad: string;
  nombreCiudad: string;
  hoteles: Hotel[];
  migas: Miga[];
  actividades: ActividadListItem[];
  urlActividades: string | null;
  faq: PreguntaFrecuente[];
};

export default function PaginaHotelesCiudad({ idioma, ciudad, nombreCiudad, hoteles, migas, actividades, urlActividades, faq }: Props) {
  const t = TEXTOS_HOTELES[idioma];
  const grupos = agruparPorZona(ciudad, hoteles);
  const intro = ZONAS_HOTELES[ciudad]?.intro[idioma];
  const etiquetasPresentes = ETIQUETAS_HOTEL.filter((e) => hoteles.some((h) => h.etiquetas.includes(e)));
  const vistazo = etiquetasPresentes
    .map((e) => ({ etiqueta: t.etiquetas[e], hoteles: hoteles.filter((h) => h.etiquetas.includes(e)) }))
    .filter((f) => f.hoteles.length < hoteles.length || hoteles.length === 1);

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
    itemListElement: hoteles.map((h, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}${h.url}`, name: h.nombre })),
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <header className="bg-piedra-900 py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <nav aria-label={t.migas} className="mb-4 text-sm text-piedra-300">
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
          <h1 className="mb-4 font-fraunces text-3xl font-bold leading-tight md:text-5xl">{t.listadoTitulo(nombreCiudad)}</h1>
          {intro ? <p className="max-w-3xl text-lg text-piedra-100 md:text-xl">{intro}</p> : null}
          <p className="mt-6 max-w-3xl text-sm text-piedra-300">
            {t.avisoAfiliado} {t.avisoSoloIberostar}
          </p>
        </div>
      </header>

      {grupos.length > 1 ? (
        <section className="border-b border-piedra-200 bg-piedra-50">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3">
            {grupos.map((g) => (
              <a
                key={g.zona.id}
                href={`#zona-${g.zona.id}`}
                className="block rounded-lg border border-piedra-200 bg-white p-5 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
              >
                <span className="font-fraunces text-lg font-bold text-piedra-900">{g.zona.nombre[idioma]}</span>
                <span className="ml-2 text-sm text-piedra-600">· {t.hotelesEnZona(g.hoteles.length)}</span>
                <p className="mt-2 text-sm leading-relaxed text-piedra-600">{g.zona.texto[idioma]}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1fr_300px]">
        <FiltroHoteles
          grupos={grupos.map((g) => ({
            id: g.zona.id,
            titulo: g.zona.nombre[idioma],
            texto: g.zona.texto[idioma],
            tarjetas: g.hoteles.map((h) => ({ etiquetas: h.etiquetas, nodo: <TarjetaHotel hotel={h} t={t} /> })),
          }))}
          etiquetas={etiquetasPresentes.map((e) => ({ id: e, texto: t.etiquetas[e] }))}
          textoTodos={t.todos}
          textoFiltros={t.filtros}
          sinResultados={t.sinResultados}
        />

        {vistazo.length > 0 ? (
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg border border-piedra-200 p-5">
              <h2 className="mb-3 font-fraunces text-xl font-bold text-piedra-900">{t.deUnVistazo}</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-piedra-200 text-left text-piedra-600">
                    <th scope="col" className="pb-2 font-semibold">{t.busco}</th>
                    <th scope="col" className="pb-2 font-semibold">{t.hotel}</th>
                  </tr>
                </thead>
                <tbody>
                  {vistazo.map((f) => (
                    <tr key={f.etiqueta} className="border-b border-piedra-200 align-top last:border-0">
                      <th scope="row" className="py-2 pr-3 font-semibold text-piedra-900">{f.etiqueta}</th>
                      <td className="py-2">
                        <ul className="space-y-1">
                          {f.hoteles.map((h) => (
                            <li key={h.slug}>
                              <Link href={h.url} className="text-anil-600 transition-colors hover:text-anil-700">
                                {h.nombre.replace(/^Iberostar (Heritage |Selection |Waves )?/, "")}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
        ) : null}
      </div>

      {actividades.length > 0 ? (
        <section className="border-t border-piedra-200 bg-piedra-50">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">{t.queHacer(nombreCiudad)}</h2>
              {urlActividades ? (
                <Link href={urlActividades} className="text-sm font-semibold text-anil-600 transition-colors hover:text-anil-700">
                  {t.verActividades} →
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {actividades.map((a) => (
                <CardActividad key={a.url} actividad={aCardData(a)} strings={t.tarjeta} locale={t.locale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {faq.length > 0 ? (
        <section className="border-t border-piedra-200">
          <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
            <FaqActividad idioma={idioma} preguntas={faq} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
