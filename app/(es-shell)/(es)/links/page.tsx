import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ENLACES_REDES, MAX_ENLACES } from "@/lib/enlacesRedes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

// Página de enlace en la bio: no aporta nada en buscadores.
export const metadata: Metadata = {
  title: "ExploraSpain · Links",
  description:
    "Our latest guides and activities from Instagram, Facebook and Pinterest. Nuestras últimas guías y actividades de redes sociales.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/links` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/links`,
    title: "ExploraSpain · Links",
    description: "Our latest guides and activities · Nuestras últimas guías y actividades",
    siteName: "ExploraSpain",
    locale: "en_US",
  },
};

export default function LinksPage() {
  const enlaces = ENLACES_REDES.slice(0, MAX_ENLACES);
  return (
    <main className="min-h-screen bg-piedra-50">
      <header className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="font-fraunces text-3xl md:text-4xl font-bold mb-3">
            ExploraSpain
          </h1>
          <p className="text-lg text-anil-50">
            Our latest posts · Nuestras últimas publicaciones
          </p>
        </div>
      </header>

      <section className="max-w-xl mx-auto px-4 py-10 md:py-12">
        <ul className="space-y-4">
          {enlaces.map((e, i) => (
            <li key={e.urlEn}>
              <article className="bg-white border border-piedra-200 rounded-lg overflow-hidden flex">
                <Image
                  src={e.imagen}
                  alt={e.imagenAlt}
                  width={160}
                  height={120}
                  priority={i === 0}
                  className="w-28 sm:w-36 h-auto object-cover shrink-0"
                />
                <div className="p-4 flex flex-col justify-center gap-2 min-w-0">
                  <h2 className="font-fraunces text-lg font-bold text-piedra-900 leading-snug">
                    {e.tituloEn}
                  </h2>
                  <p className="text-sm text-piedra-600">{e.tituloEs}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
                    <Link
                      href={e.urlEn}
                      className="text-anil-600 hover:text-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
                    >
                      English →
                    </Link>
                    {e.urlEs && (
                      <Link
                        href={e.urlEs}
                        className="text-anil-600 hover:text-anil-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
                      >
                        Español →
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="text-center mt-10">
          <Link
            href="/en"
            className="inline-flex items-center text-anil-600 hover:text-anil-700 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded"
          >
            exploraspain.com →
          </Link>
        </p>
      </section>
    </main>
  );
}
