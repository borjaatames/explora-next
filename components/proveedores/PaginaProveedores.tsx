import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import { urlContacto } from "@/lib/i18n/utils";
import {
  PROVEEDORES_LOCALES,
  textoEn,
  urlActividadProveedor,
  urlProveedores,
} from "@/lib/proveedores";

type CopyProveedores = Readonly<{
  titulo: string;
  subtitulo: string;
  /** Metadescripción (140-160 caracteres); el subtítulo visible es más corto. */
  metaDescripcion: string;
  intro: string;
  visitarWeb: string;
  ciudades: string;
  nuestrasActividades: string;
  sumarseTitulo: string;
  sumarseTexto: string;
  sumarseBoton: string;
  inicio: string;
  migas: string;
  ariaMigas: string;
}>;

export const COPY_PROVEEDORES: Readonly<Record<Idioma, CopyProveedores>> = {
  es: {
    titulo: "Proveedores locales con los que trabajamos",
    subtitulo: "Las empresas que organizan muchas de las actividades que vendemos en ExploraSpain.",
    metaDescripcion:
      "Conoce las empresas locales que organizan las actividades de ExploraSpain: guías, bodegas, barcos y tours en Madrid, Barcelona, Sevilla, Canarias y más.",
    intro:
      "Muchas de las experiencias de nuestra web las organizan empresas locales. Aquí puedes conocerlas y visitar su web.",
    visitarWeb: "Visitar su web",
    ciudades: "Dónde trabajan",
    nuestrasActividades: "Sus actividades en ExploraSpain",
    sumarseTitulo: "¿Eres proveedor y trabajas con nosotros?",
    sumarseTexto:
      "Si vendemos tus actividades y quieres aparecer en esta página, escríbenos y te añadimos.",
    sumarseBoton: "Contactar",
    inicio: "Inicio",
    migas: "Proveedores locales",
    ariaMigas: "Migas de pan",
  },
  en: {
    titulo: "Local partners we work with",
    subtitulo: "The companies behind many of the activities we sell on ExploraSpain.",
    metaDescripcion:
      "Meet the local companies behind ExploraSpain's activities: guides, wineries, boat trips and tours in Madrid, Barcelona, Seville, the Canary Islands and more.",
    intro:
      "Many of the experiences on our site are run by local companies. Here you can get to know them and visit their websites.",
    visitarWeb: "Visit their website",
    ciudades: "Where they operate",
    nuestrasActividades: "Their activities on ExploraSpain",
    sumarseTitulo: "Are you a supplier working with us?",
    sumarseTexto:
      "If we sell your activities and you'd like to appear on this page, get in touch and we'll add you.",
    sumarseBoton: "Contact us",
    inicio: "Home",
    migas: "Local partners",
    ariaMigas: "Breadcrumb",
  },
  de: {
    titulo: "Lokale Partner, mit denen wir arbeiten",
    subtitulo: "Die Unternehmen hinter vielen der Aktivitäten, die wir bei ExploraSpain anbieten.",
    metaDescripcion:
      "Lernen Sie die lokalen Unternehmen hinter den Aktivitäten von ExploraSpain kennen: Guides, Weingüter, Bootstouren und Touren in ganz Spanien.",
    intro:
      "Viele Erlebnisse auf unserer Website werden von lokalen Unternehmen organisiert. Hier lernst du sie kennen und kannst ihre Websites besuchen.",
    visitarWeb: "Zur Website",
    ciudades: "Wo sie tätig sind",
    nuestrasActividades: "Ihre Aktivitäten bei ExploraSpain",
    sumarseTitulo: "Du bist Anbieter und arbeitest mit uns?",
    sumarseTexto:
      "Wenn wir deine Aktivitäten verkaufen und du auf dieser Seite erscheinen möchtest, schreib uns.",
    sumarseBoton: "Kontakt",
    inicio: "Startseite",
    migas: "Lokale Partner",
    ariaMigas: "Brotkrümelnavigation",
  },
  fr: {
    titulo: "Les partenaires locaux avec qui nous travaillons",
    subtitulo: "Les entreprises qui organisent une grande partie des activités que nous proposons sur ExploraSpain.",
    metaDescripcion:
      "Découvrez les entreprises locales qui organisent les activités d’ExploraSpain : guides, caves, sorties en bateau et visites à Madrid, Barcelone, Séville et plus.",
    intro:
      "Beaucoup des expériences de notre site sont organisées par des entreprises locales. Découvrez-les ici et visitez leur site web.",
    visitarWeb: "Visiter leur site",
    ciudades: "Où elles opèrent",
    nuestrasActividades: "Leurs activités sur ExploraSpain",
    sumarseTitulo: "Vous êtes un prestataire qui travaille avec nous ?",
    sumarseTexto:
      "Si nous vendons vos activités et que vous souhaitez apparaître sur cette page, écrivez-nous et nous vous ajouterons.",
    sumarseBoton: "Nous contacter",
    inicio: "Accueil",
    migas: "Partenaires locaux",
    ariaMigas: "Fil d’Ariane",
  },
  it: {
    titulo: "I partner locali con cui lavoriamo",
    subtitulo: "Le aziende che organizzano molte delle attività che vendiamo su ExploraSpain.",
    metaDescripcion:
      "Scopri le aziende locali che organizzano le attività di ExploraSpain: guide, cantine, gite in barca e tour a Madrid, Barcellona, Siviglia, Canarie e altro.",
    intro:
      "Molte delle esperienze del nostro sito sono organizzate da aziende locali. Qui puoi conoscerle e visitare il loro sito web.",
    visitarWeb: "Visita il loro sito",
    ciudades: "Dove operano",
    nuestrasActividades: "Le loro attività su ExploraSpain",
    sumarseTitulo: "Sei un fornitore che lavora con noi?",
    sumarseTexto:
      "Se vendiamo le tue attività e vuoi comparire in questa pagina, scrivici e ti aggiungiamo.",
    sumarseBoton: "Contattaci",
    inicio: "Home",
    migas: "Partner locali",
    ariaMigas: "Percorso di navigazione",
  },
  pt: {
    titulo: "Os parceiros locais com quem trabalhamos",
    subtitulo: "As empresas que organizam muitas das atividades que vendemos na ExploraSpain.",
    metaDescripcion:
      "Conheça as empresas locais que organizam as atividades da ExploraSpain: guias, adegas, passeios de barco e tours em Madrid, Barcelona, Sevilha e mais.",
    intro:
      "Muitas das experiências do nosso site são organizadas por empresas locais. Aqui pode conhecê-las e visitar o respetivo site.",
    visitarWeb: "Visitar o site",
    ciudades: "Onde atuam",
    nuestrasActividades: "As suas atividades na ExploraSpain",
    sumarseTitulo: "É fornecedor e trabalha connosco?",
    sumarseTexto:
      "Se vendemos as suas atividades e pretende aparecer nesta página, escreva-nos e acrescentamo-lo.",
    sumarseBoton: "Contactar",
    inicio: "Início",
    migas: "Parceiros locais",
    ariaMigas: "Navegação estrutural",
  },
};

export function copyProveedores(idioma: Idioma): CopyProveedores {
  return COPY_PROVEEDORES[idioma];
}

type Props = Readonly<{ idioma: Idioma; siteUrl: string }>;

export default function PaginaProveedores({ idioma, siteUrl }: Props) {
  const t = copyProveedores(idioma);
  const urlInicio = idioma === "es" ? "/" : `/${idioma}`;
  const urlPagina = urlProveedores(idioma);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.inicio, item: `${siteUrl}${urlInicio}` },
      { "@type": "ListItem", position: 2, name: t.migas, item: `${siteUrl}${urlPagina}` },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <nav aria-label={t.ariaMigas} className="text-sm text-anil-100 mb-4">
            <Link href={urlInicio} className="hover:text-white">
              {t.inicio}
            </Link>
            {" › "}
            <span className="text-white">{t.migas}</span>
          </nav>
          <h1 className="font-fraunces text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {t.titulo}
          </h1>
          <p className="text-lg md:text-xl text-anil-50">{t.subtitulo}</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <p className="max-w-3xl text-lg text-piedra-700 leading-relaxed mb-10">{t.intro}</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROVEEDORES_LOCALES.map((p) => {
            const actividades = p.actividades
              .map((a) => ({ a, url: urlActividadProveedor(idioma, a) }))
              .filter((x): x is { a: typeof x.a; url: string } => x.url !== null);

            return (
              <li key={p.id} className="border border-piedra-200 rounded-lg p-6">
                <h2 className="font-fraunces text-2xl font-bold text-piedra-900 mb-2">
                  {p.nombre}
                </h2>
                <p className="text-piedra-600 leading-relaxed mb-4">
                  {textoEn(idioma, p.descripcion)}
                </p>
                <p className="text-sm text-piedra-500 mb-4">
                  <span className="font-semibold text-piedra-700">{t.ciudades}:</span>{" "}
                  {textoEn(idioma, p.ciudades)}
                </p>

                {actividades.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-piedra-700 mb-1">
                      {t.nuestrasActividades}
                    </p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {actividades.map(({ a, url }) => (
                        <li key={a.slugEs}>
                          <Link
                            href={url}
                            prefetch={false}
                            className="text-anil-600 hover:text-anil-700 transition-colors"
                          >
                            {textoEn(idioma, a.nombre)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href={p.web}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center bg-white border border-piedra-300 hover:border-anil-400 text-piedra-900 font-semibold px-5 py-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
                >
                  {t.visitarWeb} ↗
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 p-8 bg-piedra-50 border border-piedra-200 rounded-lg">
          <h2 className="font-fraunces text-2xl font-bold text-piedra-900 mb-2">
            {t.sumarseTitulo}
          </h2>
          <p className="text-piedra-700 mb-4">{t.sumarseTexto}</p>
          <Link
            href={urlContacto(idioma)}
            className="inline-flex items-center text-anil-600 hover:text-anil-700 font-semibold transition-colors"
          >
            {t.sumarseBoton} →
          </Link>
        </div>
      </section>
    </main>
  );
}
