import Link from "next/link";
import Image from "next/image";
import type { PreguntaFrecuente } from "@/lib/actividades";
import FaqActividad from "@/components/FaqActividad";
import { CardActividad } from "@/components/ciudad/ActividadesFiltradas";
import { aCardData } from "@/lib/cardActividad";
import {
  EXCURSIONES_DESDE_PUERTO,
  actividadPorSlugEs,
  guiasDePuertos,
  urlCruceros,
} from "@/lib/descubrir";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Fila = { criterio: string; barco: string; grupo: string; privada: string };

export const TEXTOS_CRUCEROS = {
  es: {
    metaTitulo: "Excursiones en crucero por España: guía por puertos (2026)",
    metaDescripcion:
      "Qué hacer en tu escala en Barcelona, Málaga, Cádiz, Valencia, Palma, Tenerife, Las Palmas y Bilbao: cómo llegar del muelle al centro, qué ver en 4, 6 u 8 horas y excursiones con recogida en el puerto.",
    titulo: "Excursiones en crucero: qué hacer en cada puerto de España",
    intro:
      "Cómo ir del muelle al centro, qué da tiempo a ver según las horas de escala y qué excursiones te recogen en el mismo puerto. Una guía por puerto, actualizada para 2026.",
    migas: [{ label: "Inicio", href: "/" }, { label: "Cruceros" }],
    migasAria: "Migas de pan",
    puertos: "Guías por puerto",
    verGuia: "Ver guía del puerto",
    comparativa: "¿Excursión del barco, en grupo o privada?",
    comparativaIntro:
      "Las tres sirven; lo que cambia es el precio, el ritmo y quién responde si algo se retrasa.",
    columnas: { criterio: "", barco: "Excursión del barco", grupo: "En grupo por tu cuenta", privada: "Privada con recogida en el muelle" },
    filas: [
      {
        criterio: "Precio",
        barco: "El más alto por persona",
        grupo: "El más bajo",
        privada: "Se paga por grupo: cuantos más seáis, más barata sale por persona",
      },
      {
        criterio: "Recogida",
        barco: "Al pie del barco",
        grupo: "Tienes que llegar al punto de encuentro",
        privada: "En la terminal o el muelle (indica el barco al reservar)",
      },
      {
        criterio: "Si hay retraso",
        barco: "El barco espera a sus excursiones",
        grupo: "Corre de tu cuenta volver a tiempo",
        privada: "La vuelta se pacta con margen sobre tu hora de embarque",
      },
      {
        criterio: "Ritmo y grupo",
        barco: "Autobuses grandes",
        grupo: "Grupo mediano, horario fijo",
        privada: "Solo vosotros, a vuestro ritmo",
      },
    ] satisfies Fila[],
    excursiones: "Excursiones que te recogen en el puerto",
    excursionesIntro:
      "Fichas en las que el operador confirma la recogida en el muelle. Indica el nombre del barco al reservar.",
    tarjeta: { desde: "Desde", verActividad: "Ver actividad", cancelacionGratuita: "Cancelación gratis" },
    locale: "es-ES",
    faq: [
      {
        pregunta: "¿Cuánto tiempo hace falta para una excursión desde el puerto?",
        respuesta:
          "Para ver el centro de la ciudad del puerto bastan 4 horas. Para ir a otra ciudad (de Cádiz a Sevilla o de Málaga a Granada) necesitas una escala de al menos 9 o 10 horas, porque la excursión dura unas 8 horas y conviene volver con margen.",
      },
      {
        pregunta: "¿Qué pasa si la excursión llega tarde y el barco se va?",
        respuesta:
          "El barco solo espera a las excursiones que vende la naviera. En una excursión independiente la vuelta es responsabilidad tuya, por eso conviene pactar el regreso con margen sobre la hora de embarque.",
      },
      {
        pregunta: "¿Puedo ir por libre del muelle al centro?",
        respuesta:
          "En casi todos los puertos sí: hay lanzaderas, autobús urbano o se llega andando. En la guía de cada puerto explicamos la opción más rápida y cuánto cuesta.",
      },
      {
        pregunta: "¿Hay que reservar la excursión antes del crucero?",
        respuesta:
          "Conviene. Las fechas con varios barcos en puerto se llenan, y en las privadas el operador necesita saber el nombre del barco y la hora de llegada para organizar la recogida.",
      },
    ] satisfies PreguntaFrecuente[],
  },
  en: {
    metaTitulo: "Spain cruise excursions: port-by-port guide (2026)",
    metaDescripcion:
      "What to do on your port day in Barcelona, Málaga, Cádiz, Valencia, Palma, Tenerife, Las Palmas and Bilbao: getting from the pier to town, what to see in 4, 6 or 8 hours, and tours with port pickup.",
    titulo: "Cruise excursions: what to do in each Spanish port",
    intro:
      "How to get from the pier to town, what you can see depending on your time ashore, and which tours pick you up at the port. One guide per port, updated for 2026.",
    migas: [{ label: "Home", href: "/en" }, { label: "Cruise excursions" }],
    migasAria: "Breadcrumb",
    puertos: "Port guides",
    verGuia: "Read the port guide",
    comparativa: "Ship excursion, group tour or private tour?",
    comparativaIntro:
      "All three work; what changes is the price, the pace and who is responsible if something runs late.",
    columnas: { criterio: "", barco: "Ship excursion", grupo: "Group tour on your own", privada: "Private tour with pier pickup" },
    filas: [
      {
        criterio: "Price",
        barco: "Highest per person",
        grupo: "Lowest",
        privada: "Priced per group: the more of you, the cheaper per person",
      },
      {
        criterio: "Pickup",
        barco: "Next to the ship",
        grupo: "You make your own way to the meeting point",
        privada: "At the terminal or pier (give your ship's name when booking)",
      },
      {
        criterio: "If it runs late",
        barco: "The ship waits for its own excursions",
        grupo: "Getting back on time is up to you",
        privada: "The return is agreed with a margin before all-aboard time",
      },
      {
        criterio: "Pace and group",
        barco: "Large coaches",
        grupo: "Medium group, fixed schedule",
        privada: "Just your party, at your own pace",
      },
    ] satisfies Fila[],
    excursiones: "Tours that pick you up at the port",
    excursionesIntro:
      "Tours where the operator confirms pickup at the pier. Give your ship's name when you book.",
    tarjeta: { desde: "From", verActividad: "View tour", cancelacionGratuita: "Free cancellation" },
    locale: "en-GB",
    faq: [
      {
        pregunta: "How much time do I need for a shore excursion?",
        respuesta:
          "Four hours is enough to see the centre of the port city. To visit another city (Cádiz to Seville or Málaga to Granada) you need at least 9 or 10 hours in port, because the tour lasts about 8 hours and you want a margin to get back.",
      },
      {
        pregunta: "What happens if my tour is late and the ship leaves?",
        respuesta:
          "Ships only wait for excursions sold by the cruise line. On an independent tour, getting back is your responsibility, so agree a return time with a comfortable margin before all-aboard.",
      },
      {
        pregunta: "Can I get from the pier to town on my own?",
        respuesta:
          "In almost every port, yes: there are shuttles, city buses or you can walk. Each port guide explains the quickest option and what it costs.",
      },
      {
        pregunta: "Should I book my excursion before the cruise?",
        respuesta:
          "It's a good idea. Days with several ships in port fill up, and for private tours the operator needs your ship's name and arrival time to arrange the pickup.",
      },
    ] satisfies PreguntaFrecuente[],
  },
} as const;

export default function PaginaCruceros({ idioma }: { idioma: "es" | "en" }) {
  const t = TEXTOS_CRUCEROS[idioma];
  const puertos = guiasDePuertos(idioma);
  const excursiones = EXCURSIONES_DESDE_PUERTO.flatMap(({ ciudad, slugEs }) => {
    const a = actividadPorSlugEs(idioma, ciudad, slugEs);
    return a ? [a] : [];
  });

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: t.migas.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.label,
      item: `${SITE_URL}${"href" in m ? m.href : urlCruceros(idioma)}`,
    })),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
  const columnas = ["barco", "grupo", "privada"] as const;

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="bg-anil-500 py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <nav aria-label={t.migasAria} className="mb-4 text-sm text-anil-100">
            {t.migas.map((m, i) => (
              <span key={m.label}>
                {i > 0 ? " › " : null}
                {"href" in m ? (
                  <Link href={m.href} className="hover:text-white">
                    {m.label}
                  </Link>
                ) : (
                  <span className="text-white">{m.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mb-4 font-fraunces text-3xl font-bold leading-tight md:text-5xl">{t.titulo}</h1>
          <p className="max-w-3xl text-lg text-anil-50 md:text-xl">{t.intro}</p>
        </div>
      </header>

      <section aria-labelledby="puertos" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 id="puertos" className="mb-6 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
          {t.puertos}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {puertos.map((p) => (
            <Link
              key={p.guia.url}
              href={p.guia.url}
              className="group block overflow-hidden rounded-lg border border-piedra-200 transition-all hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.guia.imagen_portada || p.guia.imagen || "/images/home/hero.jpg"}
                  alt={p.guia.imagen_alt ?? p.puerto}
                  fill
                  sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-fraunces text-xl font-bold text-piedra-900 transition-colors group-hover:text-anil-700">
                  {p.puerto}
                </h3>
                <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-piedra-600">{p.guia.descripcion}</p>
                <span className="text-sm font-semibold text-anil-600">{t.verGuia} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="comparativa" className="border-y border-piedra-200 bg-piedra-50">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
          <h2 id="comparativa" className="mb-3 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
            {t.comparativa}
          </h2>
          <p className="mb-6 text-piedra-600">{t.comparativaIntro}</p>
          <div className="overflow-x-auto rounded-lg border border-piedra-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-piedra-100 text-piedra-900">
                <tr>
                  <th scope="col" className="p-4">
                    <span className="sr-only">{idioma === "en" ? "Criterion" : "Criterio"}</span>
                  </th>
                  {columnas.map((c) => (
                    <th key={c} scope="col" className="p-4 font-semibold">
                      {t.columnas[c]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.filas.map((f) => (
                  <tr key={f.criterio} className="border-t border-piedra-200">
                    <th scope="row" className="p-4 font-semibold text-piedra-900">
                      {f.criterio}
                    </th>
                    {columnas.map((c) => (
                      <td key={c} className="p-4 text-piedra-700">
                        {f[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {excursiones.length > 0 && (
        <section aria-labelledby="excursiones-puerto" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 id="excursiones-puerto" className="mb-3 font-fraunces text-2xl font-bold text-piedra-900 md:text-3xl">
            {t.excursiones}
          </h2>
          <p className="mb-6 text-piedra-600">{t.excursionesIntro}</p>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {excursiones.map((a) => (
              <CardActividad key={a.url} actividad={aCardData(a)} strings={t.tarjeta} locale={t.locale} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-piedra-200">
        <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
          <FaqActividad idioma={idioma} preguntas={[...t.faq]} />
        </div>
      </section>
    </main>
  );
}
