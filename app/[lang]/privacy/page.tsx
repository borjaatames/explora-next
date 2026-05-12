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
  urlPrivacidad,
  prefijoIdioma,
} from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

const LAST_UPDATED = "April 24, 2026";

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
  const canonicalUrl = `${siteUrl}${urlPrivacidad(lang)}`;
  const languages = hreflangAlternates((l) => urlPrivacidad(l));

  return {
    title: "Privacy Policy | ExploraSpain",
    description:
      "Information about how ExploraSpain processes personal data, in compliance with the GDPR (EU Regulation 2016/679) and the Spanish Data Protection Act (LOPDGDD).",
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
      title: "Privacy Policy | ExploraSpain",
      description:
        "How ExploraSpain processes personal data, under GDPR and LOPDGDD.",
    },
  };
}

export default function PrivacyPage({
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
  const pageUrl = `${siteUrl}${urlPrivacidad(lang)}`;
  const homeUrl = `${siteUrl}${prefijoIdioma(lang) || "/"}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: pageUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-sky-50">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
          <p className="text-xl leading-relaxed text-slate-700">
            At ExploraSpain we take your privacy seriously. This policy
            explains what data we process, for what purpose, and what rights
            you have, in compliance with the GDPR (EU Regulation 2016/679)
            and the Spanish Organic Law 3/2018 on Personal Data Protection
            (LOPDGDD).
          </p>

          <h2>1. Data controller</h2>
          <ul>
            <li>
              <strong>Controller</strong>: SKYWARD PARTNERS, S.L.
            </li>
            <li>
              <strong>Tax ID (NIF)</strong>: B26629576
            </li>
            <li>
              <strong>Registered office</strong>: Calle Castelló 117, 28006
              Madrid, Spain
            </li>
            <li>
              <strong>Email</strong>: contacto@exploraspain.com
            </li>
            <li>
              <strong>Website</strong>: https://exploraspain.com
            </li>
          </ul>

          <h2>2. What data we process</h2>
          <p>
            Depending on how you interact with the website, we may process
            the following data:
          </p>
          <ul>
            <li>
              <strong>Contact data</strong>: when you write to us by email,
              we process the data you choose to provide voluntarily (name,
              email, message content).
            </li>
            <li>
              <strong>Browsing data</strong>: when you visit the site,
              technical data is collected such as IP address, browser type,
              operating system, pages visited, time spent and referrer,
              through cookies and analytics tools, if you accept them.
            </li>
          </ul>
          <p>
            <strong>
              The website does not currently offer user registration, a
              checkout form or newsletter subscription.
            </strong>{" "}
            If these features are added in the future, this policy will be
            updated accordingly.
          </p>

          <h2>3. Purpose and legal basis for processing</h2>
          <ul>
            <li>
              <strong>Responding to your inquiries</strong>: when you write
              to us, we use your email and message data only to reply. Legal
              basis: user&rsquo;s consent when sending the message.
            </li>
            <li>
              <strong>Site usage analytics</strong>: to understand how the
              site is used and improve the content. Legal basis: consent
              given through the cookie banner.
            </li>
            <li>
              <strong>Compliance with legal obligations</strong>: to comply
              with applicable regulations where appropriate. Legal basis:
              legal obligation.
            </li>
          </ul>

          <h2>4. Retention period</h2>
          <p>
            Contact data is retained for as long as necessary to handle your
            inquiry and, afterwards, for the legal period applicable to
            address potential liabilities.
          </p>
          <p>
            Browsing data is retained for the period set out in the cookie
            policy for each tool.
          </p>

          <h2>5. Recipients and international transfers</h2>
          <p>
            Your data is not shared with third parties except where legally
            required. However, the website uses services from providers that
            may have access to browsing data as data processors:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (USA): website hosting. Transfer
              covered by the European Commission&rsquo;s Standard Contractual
              Clauses.
            </li>
            <li>
              <strong>Google LLC</strong> (USA): web analytics, if you accept
              analytics cookies. Transfer covered by the EU-U.S. Data Privacy
              Framework.
            </li>
            <li>
              <strong>Affiliate platforms</strong> (Viator, GetYourGuide or
              others): when you click an affiliate link, you will be
              redirected to their website, which applies its own privacy
              policy.
            </li>
          </ul>

          <h2>6. Your rights</h2>
          <p>
            As a data subject, you have the following rights, recognized by
            the GDPR and LOPDGDD:
          </p>
          <ul>
            <li>
              <strong>Access</strong>: to know what data we process about you.
            </li>
            <li>
              <strong>Rectification</strong>: to correct inaccurate or
              incomplete data.
            </li>
            <li>
              <strong>Erasure</strong> (&ldquo;right to be forgotten&rdquo;):
              to request that we delete your data when it is no longer
              necessary.
            </li>
            <li>
              <strong>Objection</strong>: to object to certain processing
              activities.
            </li>
            <li>
              <strong>Restriction</strong>: to ask us to restrict processing
              in certain cases.
            </li>
            <li>
              <strong>Portability</strong>: to receive your data in a
              structured format and transfer it to another controller.
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time, without
              affecting the lawfulness of prior processing.
            </li>
          </ul>
          <p>
            To exercise these rights, write to us at{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            indicating which right you wish to exercise and, if necessary,
            providing proof of your identity.
          </p>
          <p>
            If you believe that the processing of your data does not comply
            with regulations, you may file a complaint with the{" "}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spanish Data Protection Agency (AEPD)
            </a>
            .
          </p>

          <h2>7. Security measures</h2>
          <p>
            We apply reasonable technical and organizational measures to
            protect your data against unauthorized access, loss or
            destruction. The website uses encrypted connection (HTTPS) and
            the contracted services apply industry-standard security
            measures.
          </p>

          <h2>8. Changes to this policy</h2>
          <p>
            This policy may be updated to reflect legislative, operational or
            service changes. The version in force will always be the one
            published on this page, with the last-updated date shown at the
            top.
          </p>

          <h2>9. Contact</h2>
          <p>
            For any questions about privacy, write to us at{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            or through the <Link href="/contacto">contact page</Link>.
          </p>
        </div>

        {/* Cláusula prevails — caja gris fuera del prose */}
        <aside
          className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
          aria-label="Language version disclaimer"
        >
          <p className="font-semibold text-slate-900 mb-2">
            Language version disclaimer
          </p>
          <p>
            This English version is provided solely for the convenience of
            non-Spanish-speaking users. The original Spanish version of this
            document is the legally binding one. In case of any discrepancy
            or conflict between the two versions, the Spanish version shall
            prevail. The original Spanish version is available at{" "}
            <Link
              href="/privacidad"
              className="text-sky-600 hover:text-sky-700 underline"
            >
              /privacidad
            </Link>
            .
          </p>
        </aside>

        <div className="mt-12 text-center">
          <Link
            href={`/${lang}`}
            className="text-sky-600 hover:text-sky-700 font-semibold"
          >
            ← Back to home
          </Link>
        </div>
      </article>
    </main>
  );
}
