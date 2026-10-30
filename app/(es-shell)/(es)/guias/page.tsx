import SeccionesTipoGuia, { tituloPorCiudad } from "@/components/guia/SeccionesTipoGuia";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { obtenerCiudad } from "@/lib/ciudades";
import { obtenerCiudadesConGuias } from "@/lib/guias";
import {
  hreflangAlternates,
  urlGuiasDeCiudad,
  urlIndiceGuias,
} from "@/lib/i18n/utils";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

export const metadata: Metadata = {
  title: "Guías de viaje por España",
  description:
    "Rutas con criterio, selección honesta y consejos prácticos para viajar por España. Sin postureo turístico.",
  alternates: {
    canonical: `${SITE_URL}${urlIndiceGuias("es")}`,
    languages: hreflangAlternates((l) => urlIndiceGuias(l)),
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${urlIndiceGuias("es")}`,
    title: "Guías de viaje por España | ExploraSpain",
    description:
      "Rutas con criterio, selección honesta y consejos prácticos para viajar por España.",
    siteName: "ExploraSpain",
    locale: "es_ES",
  },
};

type CiudadConDatos = {
  slug: string;
  nombre: string;
  total: number;
  imagen?: string;
  imagenAlt?: string;
};

async function obtenerHubCiudades(): Promise<CiudadConDatos[]> {
  const ciudadesConGuias = obtenerCiudadesConGuias("es");
  const resultado: CiudadConDatos[] = [];

  for (const { ciudad, total } of ciudadesConGuias) {
    const ciudadCompleta = await obtenerCiudad("es", ciudad);
    if (!ciudadCompleta) continue;

    resultado.push({
      slug: ciudad,
      nombre: ciudadCompleta.nombre,
      total,
      imagen: ciudadCompleta.imagenGuias ?? ciudadCompleta.imagen,
      imagenAlt:
        ciudadCompleta.imagenGuiasAlt ??
        ciudadCompleta.imagenAlt ??
        ciudadCompleta.nombre,
    });
  }

  return resultado;
}

export default async function GuiasHubPage() {
  const ciudades = await obtenerHubCiudades();

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <nav aria-label="Migas de pan" className="text-sm text-anil-100 mb-4">
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
            {" › "}
            <span className="text-white">Guías</span>
          </nav>

          <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-3">
            Guías de viaje
          </h1>
          <p className="text-lg md:text-xl text-anil-50">
            Excursiones, itinerarios, comparativas y qué hacer si se agotan las entradas, ciudad a ciudad.
          </p>
        </div>
      </section>

      <SeccionesTipoGuia idioma={"es"} />

      <section aria-labelledby="guias-por-ciudad" className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h2 id="guias-por-ciudad" className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-6">
          {tituloPorCiudad("es")}
        </h2>
        {ciudades.length === 0 ? (
          <div className="text-center py-12 text-piedra-500 text-lg">
            Próximamente publicaremos nuestras primeras guías. Vuelve pronto.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ciudades.map((c) => (
              <TarjetaCiudadGuias key={c.slug} ciudad={c} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TarjetaCiudadGuias({ ciudad }: { ciudad: CiudadConDatos }) {
  const href = urlGuiasDeCiudad("es", ciudad.slug);
  const textoTotal =
    ciudad.total === 1 ? "1 guía" : `${ciudad.total} guías`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-piedra-200 bg-white shadow-sm transition hover:border-anil-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
    >
      {ciudad.imagen ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-piedra-100">
          <Image
            src={ciudad.imagen}
            alt={ciudad.imagenAlt ?? ciudad.nombre}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-piedra-100" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-fraunces text-xl md:text-2xl font-bold text-piedra-900 group-hover:text-anil-700 transition-colors">
          {ciudad.nombre}
        </h2>
        <p className="mt-2 text-sm text-piedra-500">{textoTotal}</p>
        <span
          aria-hidden="true"
          className="mt-auto pt-6 text-sm font-semibold text-anil-600 group-hover:text-anil-700"
        >
          Ver guías →
        </span>
      </div>
    </Link>
  );
}
