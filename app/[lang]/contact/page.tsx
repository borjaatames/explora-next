import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
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
      "Questions about an activity or booking, suggestions or partnerships? Message us via the form or WhatsApp and we'll get back to you as soon as possible.",
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
            Questions, suggestions, corrections, partnerships. We read
            everything.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* Quick access via WhatsApp */}
        <div className="bg-[#25D366]/10 border border-[#25D366]/40 rounded-lg p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="font-playfair text-xl md:text-2xl font-bold text-slate-900 mb-1">
              Quick questions? Message us on WhatsApp
            </h2>
            <p className="text-slate-700 text-sm">
              Direct help with activities and bookings. We&apos;ll reply as
              soon as possible.
            </p>
          </div>
          <a
            href="https://wa.me/34917647730?text=Hi%2C%20I%20have%20a%20question%20about%20ExploraSpain%27s%20experiences."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold px-6 py-3 rounded-lg whitespace-nowrap transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Main email block */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-8 mb-12">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Write to us directly
          </h2>
          <p className="text-slate-700 mb-6">
            Fill in the form and we&apos;ll get back to you as soon as possible.
          </p>
          <ContactForm idioma="en" />
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
            className="text-sky-600 hover:text-sky-700 font-semibold"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
