import type { Metadata } from "next";
import Link from "next/link";
import { hreflangAlternates, urlContacto } from "@/lib/i18n/utils";

export async function generateMetadata(): Promise<Metadata> {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
  const canonicalUrl = `${siteUrl}${urlContacto("es")}`;
  const languages = hreflangAlternates((l) => urlContacto(l));

  return {
    title: "Contacto | ExploraSpain",
    description:
      "¿Sugerencias, correcciones o colaboraciones? Escríbenos. Respondemos en 2-3 días laborables.",
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
    },
    openGraph: {
      title: "Contacto | ExploraSpain",
      description:
        "Escríbenos con sugerencias, correcciones o colaboraciones.",
      url: canonicalUrl,
      siteName: "ExploraSpain",
      locale: "es_ES",
      type: "website",
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-sky-500 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Contacto
          </h1>
          <p className="text-lg md:text-xl text-sky-50">
            Sugerencias, correcciones, colaboraciones. Leemos todo.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Bloque email principal */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-8 mb-12">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Escríbenos directamente
          </h2>
          <p className="text-slate-700 mb-6">
            La forma más rápida de contactar es por correo. Respondemos en{" "}
            <strong>2-3 días laborables</strong>.
          </p>
          <a
            href="mailto:contacto@exploraspain.com"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-lg"
          >
            contacto@exploraspain.com
          </a>
        </div>

        {/* Para qué tipo de mensajes */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              ¿Has visto un error?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Precios desactualizados, horarios que han cambiado, un dato
              incorrecto. Avísanos y lo corregimos. Indica la URL de la guía y
              qué falla.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              ¿Sugerencia de guía?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Si echas en falta un destino, ruta o recomendación concreta,
              cuéntanoslo. Las mejores ideas vienen de quien está viajando.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              ¿Colaboraciones?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Prensa, medios, partners turísticos, propuestas editoriales.
              Explica brevemente quién eres y qué propones.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              ¿Reservas y tours?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Para consultas sobre actividades, cambios o incidencias con una
              reserva, indica en el mensaje el número de reserva y la fecha de
              la actividad.
            </p>
          </div>
        </div>

        {/* Datos empresa */}
        <div className="p-6 bg-slate-50 rounded-lg text-sm text-slate-600 leading-relaxed">
          <p className="mb-2">
            <strong className="text-slate-900">Datos de la empresa:</strong>
          </p>
          <p>
            SKYWARD PARTNERS, S.L. · NIF B26629576 · Calle Castelló 117, 28006
            Madrid, España.
          </p>
          <p className="mt-3">
            Más información en el{" "}
            <Link href="/aviso-legal" className="text-sky-600 hover:underline">
              aviso legal
            </Link>
            .
          </p>
        </div>

        {/* Volver */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sky-600 hover:text-sky-700 font-semibold"
          >
            ← Volver a la portada
          </Link>
        </div>
      </section>
    </main>
  );
}
