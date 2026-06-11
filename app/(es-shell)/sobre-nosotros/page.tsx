import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre ExploraSpain | Quiénes somos",
  description:
    "ExploraSpain es un proyecto de SKYWARD PARTNERS, S.L. dedicado a la comercialización de tours y actividades turísticas en España y a la publicación de contenido editorial honesto sobre viajes.",
  robots: {
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  openGraph: {
    title: "Sobre ExploraSpain",
    description:
      "Proyecto de SKYWARD PARTNERS, S.L. Tours, actividades y guías editoriales sobre viajes por España.",
    url: "https://exploraspain.com/sobre-nosotros",
    siteName: "ExploraSpain",
    locale: "es_ES",
    type: "website",
  },
  alternates: {
    canonical: "https://exploraspain.com/sobre-nosotros",
  },
};

export default function SobreNosotrosPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero de la página */}
      <section className="bg-sky-500 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Sobre ExploraSpain
          </h1>
          <p className="text-lg md:text-xl text-sky-50">
            Tours, actividades y guías con criterio para viajar por España.
          </p>
        </div>
      </section>

      {/* Contenido principal */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline">
          <p className="text-xl leading-relaxed text-slate-700">
            ExploraSpain es un proyecto de{" "}
            <strong>SKYWARD PARTNERS, S.L.</strong> que ofrece tours y
            actividades en distintas ciudades de España, junto con contenido
            editorial independiente sobre viajes por el país.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            Qué hacemos
          </h2>
          <p>
            Dos cosas, y las dos con el mismo criterio:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Tours y experiencias</strong>: seleccionamos actividades
              turísticas en las principales ciudades españolas y las ponemos a
              disposición del viajero. Priorizamos experiencias con valor real,
              no cualquier actividad disponible.
            </li>
            <li>
              <strong>Guías editoriales</strong>: publicamos rutas con
              criterio, selección honesta y consejos prácticos para que cada
              viajero pueda decidir qué merece la pena en su caso, sin
              listados interminables ni el tono hinchado del turismo de postal.
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            Por qué existe
          </h2>
          <p>
            Hay mucha información disponible sobre qué visitar en España. Poca
            sobre <strong>qué merece la pena en cada caso</strong>, según
            cuántos días se tengan, qué interese de verdad y qué presupuesto se
            maneje. ExploraSpain cubre ese hueco con contenido concreto y una
            oferta de actividades cuidada.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            Nuestro criterio editorial
          </h2>
          <p>
            Somos concretos y decimos las cosas claras. Si algo no merece la
            pena, lo decimos. Si dos opciones son equivalentes, también. Una
            recomendación con fundamento es más útil que un listado donde todo
            parece igual de importante.
          </p>
          <p>
            Los datos prácticos (precios, horarios, duraciones) se verifican en
            fuentes oficiales antes de publicar. Si algo cambia y lo
            detectamos, se actualiza. Si un lector detecta un error, puede
            avisarnos y lo corregimos.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            Cómo nos financiamos
          </h2>
          <p>
            ExploraSpain genera ingresos a través de dos vías:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Venta de tours y actividades</strong> en las ciudades
              donde operamos, directamente o a través de partners turísticos de
              confianza.
            </li>
            <li>
              <strong>Enlaces de afiliación</strong> a plataformas como Viator
              o GetYourGuide en aquellas experiencias que no ofrecemos
              directamente. Si se reserva a través de estos enlaces, recibimos
              una pequeña comisión sin coste adicional para el usuario.
            </li>
          </ul>
          <p>
            El modelo de ingresos no condiciona las recomendaciones
            editoriales. Una actividad se menciona porque tiene sentido para el
            viaje del lector, no por pagar más comisión. Si algo no merece la
            pena, se dice aunque esté disponible para afiliación o en nuestro
            catálogo.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            Información de la empresa
          </h2>
          <p>
            ExploraSpain es operado por SKYWARD PARTNERS, S.L., con NIF
            B26629576 y domicilio social en Calle Castelló 117, 28006 Madrid.
            Para detalles legales completos, consulta el{" "}
            <Link href="/aviso-legal">aviso legal</Link>.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            Contacto
          </h2>
          <p>
            Para sugerencias, correcciones, colaboraciones o propuestas,
            escríbenos a{" "}
            <a href="mailto:contacto@exploraspain.com" className="font-semibold">
              contacto@exploraspain.com
            </a>{" "}
            o visita{" "}
            <Link href="/contacto" className="font-semibold">
              la página de contacto
            </Link>
            .
          </p>
        </div>

        {/* CTA final */}
        <div className="mt-16 p-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-2">
            Empieza por aquí
          </h3>
          <p className="text-slate-700 mb-4">
            Echa un vistazo a las guías publicadas y verás el tipo de contenido
            que hacemos.
          </p>
          <Link
            href="/guias"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Ver todas las guías →
          </Link>
        </div>
      </article>
    </main>
  );
}
