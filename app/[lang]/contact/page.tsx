import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import {
  hreflangAlternates,
  urlContacto,
  urlAvisoLegal,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

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

  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
  const canonicalUrl = `${siteUrl}${urlContacto(lang)}`;
  const languages = hreflangAlternates((l) => urlContacto(l));

  return {
    title: "Contact | ExploraSpain",
    description:
      "Suggestions, corrections or partnerships? Write to us. We reply within 2-3 business days.",
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
      title: "Contact | ExploraSpain",
      description:
        "Get in touch with the ExploraSpain team for suggestions, corrections or partnerships.",
    },
  };
}

export default function ContactPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://exploraspain.com";
  const pageUrl = `${siteUrl}${urlContacto(lang)}`;
  const homeUrl = `${siteUrl}${prefijoIdioma(lang) || "/"}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      { "@type": "ListItem", position: 2, name: "Contact", item: pageUrl },
    ],
  };

  // ContactPage Schema.org for SEO
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact | ExploraSpain",
    url: pageUrl,
    inLanguage: IDIOMA_LOCALE[lang],
    mainEntity: {
      "@type": "Organization",
      name: "SKYWARD PARTNERS, S.L.",
      email: "contacto@exploraspain.com",
      url: siteUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle Castelló 117",
        postalCode: "28006",
        addressLocality: "Madrid",
        addressCountry: "ES",
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-sky-500 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Contact
          </h1>
          <p className="text-lg md:text-xl text-sky-50">
            Suggestions, corrections, partnerships. We read everything.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Main email block */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-8 mb-12">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Write to us directly
          </h2>
          <p className="text-slate-700 mb-6">
            The fastest way to get in touch is by email. We reply within{" "}
            <strong>2-3 business days</strong>.
          </p>
          <a
            href="mailto:contacto@exploraspain.com"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-lg"
          >
            contacto@exploraspain.com
          </a>
        </div>

        {/* Categories of messages */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              Spotted an error?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Outdated prices, changed opening hours, an inaccurate detail.
              Let us know and we&rsquo;ll fix it. Please include the URL of
              the guide and what&rsquo;s wrong.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              Guide suggestion?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              If you&rsquo;re missing a destination, route or specific
              recommendation, tell us. The best ideas come from people who are
              actually traveling.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              Partnerships?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Press, media, tourism partners, editorial proposals. Briefly
              explain who you are and what you&rsquo;re proposing.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-lg">
            <h3 className="font-playfair text-xl font-bold text-slate-900 mb-2">
              Bookings and tours?
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              For questions about activities, changes or issues with a
              booking, please include the booking number and the date of the
              activity in your message.
            </p>
          </div>
        </div>

        {/* Company info */}
        <div className="p-6 bg-slate-50 rounded-lg text-sm text-slate-600 leading-relaxed">
          <p className="mb-2">
            <strong className="text-slate-900">Company information:</strong>
          </p>
          <p>
            SKYWARD PARTNERS, S.L. · Tax ID B26629576 · Calle Castelló 117,
            28006 Madrid, Spain.
          </p>
          <p className="mt-3">
            More information in the{" "}
            <Link
              href={urlAvisoLegal(lang)}
              className="text-sky-600 hover:underline"
            >
              legal notice
            </Link>
            .
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-12 text-center">
          <Link
            href={`/${lang}`}
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
