import Image from "next/image";
import Link from "next/link";
import type { ActividadListItem } from "@/lib/actividades";
import type { Hotel, HotelCompleto, IdiomaHotel } from "@/lib/hoteles";
import { ZONAS_HOTELES, urlFotoHotel } from "@/lib/hoteles";
import { aCardData } from "@/lib/cardActividad";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import FaqActividad from "@/components/FaqActividad";
import Estrellas from "@/components/hoteles/Estrellas";
import { TEXTOS_HOTELES } from "@/components/hoteles/textos";
import type { Miga } from "@/components/hoteles/PaginaHotelesCiudad";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = {
  idioma: IdiomaHotel;
  hotel: HotelCompleto;
  nombreCiudad: string;
  migas: Miga[];
  otros: Hotel[];
  actividades: ActividadListItem[];
  urlActividades: string | null;
};

const BOTON_RESERVA =
  "inline-flex items-center justify-center rounded-lg bg-azafran-500 px-6 py-3 font-semibold text-piedra-900 transition-colors hover:bg-azafran-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azafran-500 focus-visible:ring-offset-2";

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-piedra-200 pt-8">
      <h2 className="mb-4 font-fraunces text-2xl font-bold text-piedra-900">{titulo}</h2>
      {children}
    </section>
  );
}

export default function PaginaHotel({ idioma, hotel, nombreCiudad, migas, otros, actividades, urlActividades }: Props) {
  const t = TEXTOS_HOTELES[idioma];
  const zona = ZONAS_HOTELES[hotel.ciudad]?.zonas.find((z) => z.id === hotel.zona);
  const mapa = `https://www.google.com/maps/search/?api=1&query=${hotel.lat},${hotel.lng}`;
  const [principal, ...resto] = hotel.fotos;
  const mosaico = resto.slice(0, 4);

  const hotelLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.nombre,
    url: `${SITE_URL}${hotel.url}`,
    description: hotel.descripcion,
    image: hotel.fotos.slice(0, 5).map((f) => urlFotoHotel(f.src)),
    starRating: { "@type": "Rating", ratingValue: hotel.estrellas },
    address: { "@type": "PostalAddress", streetAddress: hotel.direccion, addressCountry: "ES" },
    geo: { "@type": "GeoCoordinates", latitude: hotel.lat, longitude: hotel.lng },
    ...(hotel.entrada ? { checkinTime: hotel.entrada } : {}),
    ...(hotel.salida ? { checkoutTime: hotel.salida } : {}),
  };
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

  const practica: { k: string; v: string }[] = [
    ...(hotel.entrada ? [{ k: t.entrada, v: hotel.entrada }] : []),
    ...(hotel.salida ? [{ k: t.salida, v: hotel.salida }] : []),
    ...(hotel.regimen ? [{ k: t.regimen, v: hotel.regimen }] : []),
    { k: t.publico, v: hotel.soloAdultos ? t.soloAdultos : t.todosPublicos },
  ];

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />

      <header className="mx-auto max-w-6xl px-4 pt-8">
        <nav aria-label={t.migas} className="mb-4 text-sm text-piedra-600">
          {migas.map((m, i) => (
            <span key={`${m.label}-${i}`}>
              {i > 0 ? " › " : null}
              {m.href ? (
                <Link href={m.href} className="text-anil-600 hover:text-anil-700">
                  {m.label}
                </Link>
              ) : (
                <span className="text-piedra-900">{m.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="mb-3 flex flex-wrap gap-2">
          {zona ? (
            <span className="inline-block rounded bg-anil-50 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-anil-700">
              {zona.nombre[idioma]}
            </span>
          ) : null}
          {hotel.soloAdultos ? (
            <span className="inline-block rounded bg-azafran-100 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-piedra-900">
              {t.soloAdultos}
            </span>
          ) : null}
        </div>
        <h1 className="font-fraunces text-3xl font-bold leading-tight text-piedra-900 md:text-5xl">{hotel.nombre}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-piedra-600">
          <Estrellas n={hotel.estrellas} etiqueta={t.estrellas(hotel.estrellas)} />
          <span>{hotel.direccion}</span>
          <a href={mapa} target="_blank" rel="noopener" className="font-semibold text-anil-600 hover:text-anil-700">
            {t.verMapa}
          </a>
        </p>
      </header>

      {principal ? (
        <div className="mx-auto mt-6 max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-2">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg md:row-span-2 md:aspect-auto">
              <Image src={urlFotoHotel(principal.src)} alt={principal.alt} fill priority sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
            </div>
            {mosaico.map((f) => (
              <div key={f.src} className="relative hidden aspect-[16/9] overflow-hidden rounded-lg md:block">
                <Image src={urlFotoHotel(f.src)} alt={f.alt} fill sizes="280px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="rounded-lg border border-anil-200 bg-anil-50 p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-anil-700">{t.enResumen}</h2>
            <p className="text-lg leading-relaxed text-piedra-900">{hotel.resumen}</p>
            <p className="mt-2 text-piedra-700">
              <span className="font-semibold">{t.idealPara}:</span> {hotel.idealPara}
            </p>
          </div>

          {hotel.servicios.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {hotel.servicios.slice(0, 6).map((s) => (
                <li key={s} className="rounded-lg border border-piedra-200 px-3 py-3 text-sm font-semibold text-piedra-900">
                  {s}
                </li>
              ))}
            </ul>
          ) : null}

          <Seccion titulo={t.esParaTi}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-cobre-700">{t.siSi}</h3>
                <ul className="space-y-2 text-piedra-700">
                  {hotel.siEsParaTi.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden="true" className="text-cobre-600">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-teja-700">{t.mejorOtro}</h3>
                <ul className="space-y-2 text-piedra-700">
                  {hotel.mejorOtro.map((s) => (
                    <li key={s} className="flex gap-2">
                      <span aria-hidden="true" className="text-teja-600">–</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Seccion>

          <Seccion titulo={t.porQue}>
            <div className="prose prose-guia max-w-none" dangerouslySetInnerHTML={{ __html: hotel.contenidoHtml }} />
          </Seccion>

          {hotel.servicios.length > 6 ? (
            <Seccion titulo={t.servicios}>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-2 text-piedra-700 sm:grid-cols-2">
                {hotel.servicios.slice(6).map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden="true" className="text-anil-500">·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Seccion>
          ) : null}

          {hotel.habitaciones.length > 0 ? (
            <Seccion titulo={t.habitaciones}>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {hotel.habitaciones.map((h) => (
                  <li key={h.nombre} className="rounded-lg border border-piedra-200 p-4">
                    <p className="font-semibold text-piedra-900">{h.nombre}</p>
                    {h.m2 ? <p className="text-sm text-piedra-600">{h.m2} m²</p> : null}
                    {h.nota ? <p className="mt-1 text-sm text-piedra-600">{h.nota}</p> : null}
                  </li>
                ))}
              </ul>
            </Seccion>
          ) : null}

          <Seccion titulo={t.ubicacion}>
            {hotel.distancias.length > 0 ? (
              <ul className="mb-4 divide-y divide-piedra-200 rounded-lg border border-piedra-200">
                {hotel.distancias.map((d) => (
                  <li key={d.lugar} className="flex justify-between gap-4 px-4 py-3">
                    <span className="text-piedra-700">{d.lugar}</span>
                    <span className="font-semibold text-piedra-900">{d.valor}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <a href={mapa} target="_blank" rel="noopener" className="font-semibold text-anil-600 hover:text-anil-700">
              {t.verMapa} →
            </a>
          </Seccion>

          <Seccion titulo={t.infoPractica}>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {practica.map((p) => (
                <div key={p.k} className="rounded-lg bg-piedra-50 p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-piedra-600">{p.k}</dt>
                  <dd className="mt-1 text-piedra-900">{p.v}</dd>
                </div>
              ))}
            </dl>
          </Seccion>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-lg border border-piedra-200 p-5">
            <p className="mb-4 text-sm text-piedra-600">{t.precioAviso}</p>
            <a href={hotel.urlReserva} target="_blank" rel="sponsored nofollow noopener" data-reserva="ficha-hotel" className={`${BOTON_RESERVA} w-full`}>
              {t.verPrecios}
            </a>
            {hotel.porQue.length > 0 ? (
              <ul className="mt-5 space-y-2 text-sm text-piedra-700">
                {hotel.porQue.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className="text-azafran-500">★</span>
                    {p}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-5 text-xs text-piedra-500">{t.avisoAfiliado}</p>
          </div>
          {otros.length > 0 ? (
            <div className="mt-6 rounded-lg border border-piedra-200 p-5">
              <h2 className="mb-3 font-fraunces text-lg font-bold text-piedra-900">{t.otrosHoteles(nombreCiudad)}</h2>
              <ul className="space-y-2 text-sm">
                {otros.map((o) => (
                  <li key={o.slug}>
                    <Link href={o.url} className="text-anil-600 transition-colors hover:text-anil-700">
                      {o.nombre}
                    </Link>
                    <span className="ml-1 text-piedra-500">· {o.lugar}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
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

      {hotel.faq.length > 0 ? (
        <section className="border-t border-piedra-200">
          <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
            <FaqActividad idioma={idioma} preguntas={hotel.faq} />
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-piedra-200 bg-white px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <span className="truncate font-semibold text-piedra-900">{hotel.nombre}</span>
          <a href={hotel.urlReserva} target="_blank" rel="sponsored nofollow noopener" className={`${BOTON_RESERVA} shrink-0 px-4 py-2.5 text-sm`}>
            {t.verPrecios}
          </a>
        </div>
      </div>
    </main>
  );
}
