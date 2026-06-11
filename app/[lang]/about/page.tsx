import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import { hreflangAlternates } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type AboutCopy = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: React.ReactNode;
  whatWeDo: { heading: string; lead: string; items: React.ReactNode[] };
  whyWeBuilt: { heading: string; body: React.ReactNode };
  editorial: { heading: string; body: React.ReactNode };
  funding: {
    heading: string;
    lead: string;
    items: React.ReactNode[];
    body: React.ReactNode;
  };
  company: { heading: string; body: React.ReactNode };
  contact: { heading: string; body: React.ReactNode };
  cta: { heading: string; body: string; button: string; href: string };
  breadcrumbHome: string;
  breadcrumbSelf: string;
};

function getCopy(lang: Idioma): AboutCopy {
  if (lang === "en") {
    return {
      metaTitle: "About ExploraSpain | Who we are",
      metaDescription:
        "ExploraSpain is a SKYWARD PARTNERS, S.L. project: curated tours and activities across Spain plus honest editorial travel guides — no fluff, real opinions.",
      ogTitle: "About ExploraSpain",
      ogDescription:
        "A SKYWARD PARTNERS, S.L. project. Tours, activities and honest editorial guides for traveling Spain.",
      heroTitle: "About ExploraSpain",
      heroSubtitle:
        "Tours, activities and honest travel guides for visiting Spain.",
      intro: (
        <>
          ExploraSpain is a project by{" "}
          <strong>SKYWARD PARTNERS, S.L.</strong> offering tours and
          activities in Spain&rsquo;s main cities, alongside independent
          editorial content about traveling the country.
        </>
      ),
      whatWeDo: {
        heading: "What we do",
        lead: "Two things, both with the same standard:",
        items: [
          <>
            <strong>Tours and experiences</strong>: we curate activities in
            Spain&rsquo;s main cities and make them available to travelers.
            We prioritize experiences with real value rather than listing
            anything that&rsquo;s out there.
          </>,
          <>
            <strong>Editorial guides</strong>: opinionated routes, honest editorial picks and practical advice so you can decide what&rsquo;s
            worth your time, your days and your budget &mdash; without
            endless lists or postcard-tourism filler.
          </>,
        ],
      },
      whyWeBuilt: {
        heading: "Why we built this",
        body: (
          <>
            There&rsquo;s no shortage of information about what to see in
            Spain. There&rsquo;s very little about{" "}
            <strong>what&rsquo;s actually worth your time</strong>, depending
            on how many days you have, what you genuinely care about and
            what you want to spend. ExploraSpain fills that gap with
            specific content and a carefully chosen activity catalog.
          </>
        ),
      },
      editorial: {
        heading: "Our editorial standards",
        body: (
          <>
            <p>
              We&rsquo;re specific and we say things plainly. If something
              isn&rsquo;t worth it, we say so. If two options are roughly
              equivalent, we say that too. A grounded recommendation beats
              a list where everything looks equally important.
            </p>
            <p>
              Practical details (prices, opening hours, durations) are
              checked against official sources before we publish. If
              something changes and we catch it, we update. If a reader
              spots an error, they can flag it and we fix it.
            </p>
          </>
        ),
      },
      funding: {
        heading: "How we make money",
        lead: "ExploraSpain earns revenue in two ways:",
        items: [
          <>
            <strong>Selling tours and activities</strong> in the cities
            where we operate, either directly or through trusted travel
            partners.
          </>,
          <>
            <strong>Affiliate links</strong> to platforms like Viator and
            GetYourGuide for experiences we don&rsquo;t offer directly. If
            you book through one of these links, we earn a small commission
            at no extra cost to you.
          </>,
        ],
        body: (
          <>
            How we make money doesn&rsquo;t shape our editorial picks. An
            activity gets recommended because it makes sense for the
            reader&rsquo;s trip, not because it pays a higher commission.
            If something isn&rsquo;t worth it, we say so &mdash; even if
            it&rsquo;s sitting in our affiliate feed or our own catalog.
          </>
        ),
      },
      company: {
        heading: "Company information",
        body: (
          <>
            ExploraSpain is operated by SKYWARD PARTNERS, S.L., tax ID
            B26629576, registered office at Calle Castelló 117, 28006
            Madrid, Spain. For full legal details, see the{" "}
            <Link href={`/${lang}/legal-notice`}>legal notice</Link>.
          </>
        ),
      },
      contact: {
        heading: "Contact",
        body: (
          <>
            For suggestions, corrections, partnerships or pitches, email us
            at{" "}
            <a
              href="mailto:contacto@exploraspain.com"
              className="font-semibold"
              aria-label="Email us at contacto@exploraspain.com"
            >
              contacto@exploraspain.com
            </a>{" "}
            or visit{" "}
            <Link href="/contacto" className="font-semibold">
              the contact page
            </Link>
            .
          </>
        ),
      },
      cta: {
        heading: "Start here",
        body: "Take a look at the published guides to see the kind of content we make.",
        button: "Browse all guides →",
        href: "/en/guides",
      },
      breadcrumbHome: "Home",
      breadcrumbSelf: "About",
    };
  }

  // ES (default — defensa en profundidad; la ruta ES real es /sobre-nosotros)
  return {
    metaTitle: "Sobre ExploraSpain | Quiénes somos",
    metaDescription:
      "ExploraSpain es un proyecto de SKYWARD PARTNERS, S.L. dedicado a la comercialización de tours y actividades turísticas en España y a la publicación de contenido editorial honesto sobre viajes.",
    ogTitle: "Sobre ExploraSpain",
    ogDescription:
      "Proyecto de SKYWARD PARTNERS, S.L. Tours, actividades y guías editoriales sobre viajes por España.",
    heroTitle: "Sobre ExploraSpain",
    heroSubtitle:
      "Tours, actividades y guías con criterio para viajar por España.",
    intro: (
      <>
        ExploraSpain es un proyecto de{" "}
        <strong>SKYWARD PARTNERS, S.L.</strong> que ofrece tours y
        actividades en distintas ciudades de España, junto con contenido
        editorial independiente sobre viajes por el país.
      </>
    ),
    whatWeDo: {
      heading: "Qué hacemos",
      lead: "Dos cosas, y las dos con el mismo criterio:",
      items: [
        <>
          <strong>Tours y experiencias</strong>: seleccionamos actividades
          turísticas en las principales ciudades españolas y las ponemos a
          disposición del viajero. Priorizamos experiencias con valor real,
          no cualquier actividad disponible.
        </>,
        <>
          <strong>Guías editoriales</strong>: publicamos rutas con criterio,
          selección honesta y consejos prácticos para que cada viajero
          pueda decidir qué merece la pena en su caso, sin listados
          interminables ni el tono hinchado del turismo de postal.
        </>,
      ],
    },
    whyWeBuilt: {
      heading: "Por qué existe",
      body: (
        <>
          Hay mucha información disponible sobre qué visitar en España. Poca
          sobre <strong>qué merece la pena en cada caso</strong>, según
          cuántos días se tengan, qué interese de verdad y qué presupuesto
          se maneje. ExploraSpain cubre ese hueco con contenido concreto y
          una oferta de actividades cuidada.
        </>
      ),
    },
    editorial: {
      heading: "Nuestro criterio editorial",
      body: (
        <>
          <p>
            Somos concretos y decimos las cosas claras. Si algo no merece la
            pena, lo decimos. Si dos opciones son equivalentes, también. Una
            recomendación con fundamento es más útil que un listado donde
            todo parece igual de importante.
          </p>
          <p>
            Los datos prácticos (precios, horarios, duraciones) se verifican
            en fuentes oficiales antes de publicar. Si algo cambia y lo
            detectamos, se actualiza. Si un lector detecta un error, puede
            avisarnos y lo corregimos.
          </p>
        </>
      ),
    },
    funding: {
      heading: "Cómo nos financiamos",
      lead: "ExploraSpain genera ingresos a través de dos vías:",
      items: [
        <>
          <strong>Venta de tours y actividades</strong> en las ciudades
          donde operamos, directamente o a través de partners turísticos de
          confianza.
        </>,
        <>
          <strong>Enlaces de afiliación</strong> a plataformas como Viator o
          GetYourGuide en aquellas experiencias que no ofrecemos
          directamente. Si se reserva a través de estos enlaces, recibimos
          una pequeña comisión sin coste adicional para el usuario.
        </>,
      ],
      body: (
        <>
          El modelo de ingresos no condiciona las recomendaciones
          editoriales. Una actividad se menciona porque tiene sentido para
          el viaje del lector, no por pagar más comisión. Si algo no merece
          la pena, se dice aunque esté disponible para afiliación o en
          nuestro catálogo.
        </>
      ),
    },
    company: {
      heading: "Información de la empresa",
      body: (
        <>
          ExploraSpain es operado por SKYWARD PARTNERS, S.L., con NIF
          B26629576 y domicilio social en Calle Castelló 117, 28006 Madrid.
          Para detalles legales completos, consulta el{" "}
          <Link href="/aviso-legal">aviso legal</Link>.
        </>
      ),
    },
    contact: {
      heading: "Contacto",
      body: (
        <>
          Para sugerencias, correcciones, colaboraciones o propuestas,
          escríbenos a{" "}
          <a
            href="mailto:contacto@exploraspain.com"
            className="font-semibold"
            aria-label="Escríbenos a contacto@exploraspain.com"
          >
            contacto@exploraspain.com
          </a>{" "}
          o visita{" "}
          <Link href="/contacto" className="font-semibold">
            la página de contacto
          </Link>
          .
        </>
      ),
    },
    cta: {
      heading: "Empieza por aquí",
      body: "Echa un vistazo a las guías publicadas y verás el tipo de contenido que hacemos.",
      button: "Ver todas las guías →",
      href: "/guias",
    },
    breadcrumbHome: "Inicio",
    breadcrumbSelf: "Sobre nosotros",
  };
}

export function generateStaticParams(): Array<{ lang: Idioma }> {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    return {};
  }

  const copy = getCopy(lang);
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";

  // /about en EN, /sobre-nosotros en ES (legacy). Si en el futuro
  // creamos /de/about, /fr/about, etc., la convención EN se mantiene.
  const rutaPorIdioma = (l: Idioma): string =>
    l === "es" ? "/sobre-nosotros" : `/${l}/about`;

  const canonicalUrl = `${siteUrl}${rutaPorIdioma(lang)}`;
  const languages = hreflangAlternates(rutaPorIdioma);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: { index: allowIndexing, follow: allowIndexing },
    },
    openGraph: {
      type: "website",
      locale: IDIOMA_LOCALE[lang],
      url: canonicalUrl,
      siteName: "ExploraSpain",
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
  };
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    notFound();
  }

  const copy = getCopy(lang);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
  const pageUrl = `${siteUrl}/${lang}/about`;
  const homeUrl = `${siteUrl}/${lang}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: copy.breadcrumbHome,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.breadcrumbSelf,
        item: pageUrl,
      },
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ExploraSpain",
    legalName: "SKYWARD PARTNERS, S.L.",
    url: siteUrl,
    email: "contacto@exploraspain.com",
    taxID: "B26629576",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Castelló 117",
      postalCode: "28006",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      {/* Hero */}
      <section className="bg-sky-500 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            {copy.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-sky-50">{copy.heroSubtitle}</p>
        </div>
      </section>

      {/* Contenido principal */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline">
          <p className="text-xl leading-relaxed text-slate-700">{copy.intro}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.whatWeDo.heading}
          </h2>
          <p>{copy.whatWeDo.lead}</p>
          <ul className="space-y-2">
            {copy.whatWeDo.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.whyWeBuilt.heading}
          </h2>
          <p>{copy.whyWeBuilt.body}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.editorial.heading}
          </h2>
          {copy.editorial.body}

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.funding.heading}
          </h2>
          <p>{copy.funding.lead}</p>
          <ul className="space-y-2">
            {copy.funding.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{copy.funding.body}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.company.heading}
          </h2>
          <p>{copy.company.body}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.contact.heading}
          </h2>
          <p>{copy.contact.body}</p>
        </div>

        {/* CTA final */}
        <div className="mt-16 p-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-2">
            {copy.cta.heading}
          </h3>
          <p className="text-slate-700 mb-4">{copy.cta.body}</p>
          <Link
            href={copy.cta.href}
            className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
          >
            {copy.cta.button}
          </Link>
        </div>
      </article>
    </main>
  );
}
