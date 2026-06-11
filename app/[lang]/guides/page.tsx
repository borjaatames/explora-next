import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { obtenerCiudad } from "@/lib/ciudades";
import { obtenerCiudadesConGuias } from "@/lib/guias";
import {
  esIdiomaActivo,
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import {
  hreflangAlternates,
  prefijoIdioma,
  urlGuiasDeCiudad,
  urlIndiceGuias,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

type Props = {
  params: { lang: string };
};

export function generateStaticParams() {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

type Strings = {
  hubSubtitulo: string;
  vacio: string;
  contadorUno: string;
  contadorN: (n: number) => string;
  cta: string;
};

function getStrings(lang: Idioma): Strings {
  if (lang === "en") {
    return {
      hubSubtitulo: "Each city has its own routes and advice. Pick where to start.",
      vacio: "We'll publish our first guides soon. Check back shortly.",
      contadorUno: "1 guide",
      contadorN: (n) => `${n} guides`,
      cta: "View guides",
    };
  }
  return {
    hubSubtitulo: "Cada ciudad tiene sus rutas y consejos propios. Elige por dónde empezar.",
    vacio: "Próximamente publicaremos nuestras primeras guías. Vuelve pronto.",
    contadorUno: "1 guía",
    contadorN: (n) => `${n} guías`,
    cta: "Ver guías",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    return { title: "Not found" };
  }
  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const canonical = `${SITE_URL}${urlIndiceGuias(lang)}`;
  return {
    title: dict.guias.tituloIndice,
    description: dict.guias.descripcionIndice,
    alternates: {
      canonical,
      languages: hreflangAlternates((l) => urlIndiceGuias(l)),
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: dict.guias.tituloIndice,
      description: dict.guias.descripcionIndice,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang],
    },
  };
}

type CiudadConDatos = {
  slug: string;
  nombre: string;
  total: number;
  imagen?: string;
  imagenAlt?: string;
};

async function obtenerHubCiudades(lang: Idioma): Promise<CiudadConDatos[]> {
  const ciudadesConGuias = obtenerCiudadesConGuias(lang);
  const resultado: CiudadConDatos[] = [];

  for (const { ciudad, total } of ciudadesConGuias) {
    const ciudadCompleta = await obtenerCiudad(lang, ciudad);
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

export default async function GuiasHubPage({ params }: Props) {
  if (!esIdiomaActivo(params.lang) || params.lang === "es") {
    notFound();
  }

  const lang: Idioma = params.lang;
  const dict = getDictionary(lang);
  const strings = getStrings(lang);
  const ciudades = await obtenerHubCiudades(lang);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-sky-100 mb-4">
            <Link href={prefijoIdioma(lang) || "/"} className="hover:text-white">
              {dict.navegacion.inicio}
            </Link>
            {" › "}
            <span className="text-white">{dict.navegacion.guias}</span>
          </nav>

          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-3">
            {dict.guias.tituloIndice}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">{strings.hubSubtitulo}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        {ciudades.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-lg">
            {strings.vacio}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ciudades.map((c) => (
              <TarjetaCiudadGuias
                key={c.slug}
                lang={lang}
                ciudad={c}
                contador={
                  c.total === 1 ? strings.contadorUno : strings.contadorN(c.total)
                }
                cta={strings.cta}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TarjetaCiudadGuias({
  lang,
  ciudad,
  contador,
  cta,
}: {
  lang: Idioma;
  ciudad: CiudadConDatos;
  contador: string;
  cta: string;
}) {
  const href = urlGuiasDeCiudad(lang, ciudad.slug);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    >
      {ciudad.imagen ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={ciudad.imagen}
            alt={ciudad.imagenAlt ?? ciudad.nombre}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-slate-100" aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
          {ciudad.nombre}
        </h2>
        <p className="mt-2 text-sm text-slate-500">{contador}</p>
        <span
          aria-hidden="true"
          className="mt-auto pt-6 text-sm font-semibold text-sky-600 group-hover:text-sky-700"
        >
          {cta} →
        </span>
      </div>
    </Link>
  );
}
