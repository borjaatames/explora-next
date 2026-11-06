import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PaginaPlanificador, { TEXTOS_PLANIFICADOR } from "@/components/planificador/PaginaPlanificador";
import { urlPlanificador } from "@/lib/planificador";
import { IDIOMAS_ACTIVOS, IDIOMA_LOCALE } from "@/lib/i18n/config";
import { hreflangAlternates } from "@/lib/i18n/utils";
import { obtenerCiudadesPlanificador } from "@/lib/planificadorDatos";
import type { Idioma } from "@/lib/i18n/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

type Props = { params: { lang: string } };
type IdiomaNoEs = Exclude<Idioma, "es">;

export const dynamicParams = false;

const IDIOMAS: ReadonlyArray<IdiomaNoEs> = IDIOMAS_ACTIVOS.filter((l): l is IdiomaNoEs => l !== "es");

const DESCRIPCION: Record<IdiomaNoEs, (n: number) => string> = {
  en: (n) =>
    `Pick a city, who you're travelling with and your budget, and we'll suggest the activities that fit best: tours, tapas, flamenco, day trips and private tours in ${n} Spanish cities.`,
  de: (n) =>
    `Wähle Stadt, Reisebegleitung und Budget, und wir schlagen dir die passenden Aktivitäten vor: Führungen, Tapas, Flamenco, Tagesausflüge und Privattouren in ${n} spanischen Städten.`,
  fr: (n) =>
    `Choisissez la ville, avec qui vous voyagez et votre budget : nous vous proposons les activités les plus adaptées, visites, tapas, flamenco, excursions et visites privées dans ${n} villes d’Espagne.`,
  it: (n) =>
    `Scegli città, compagni di viaggio e budget e ti proponiamo le attività più adatte: visite, tapas, flamenco, escursioni e tour privati in ${n} città spagnole.`,
  pt: (n) =>
    `Escolha a cidade, com quem viaja e o orçamento e propomos as atividades mais adequadas: visitas, tapas, flamenco, excursões e visitas privadas em ${n} cidades de Espanha.`,
};

function idiomaValido(lang: string): IdiomaNoEs | null {
  return IDIOMAS.find((l) => l === lang) ?? null;
}

export function generateStaticParams(): { lang: string }[] {
  return IDIOMAS.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: Props): Metadata {
  const lang = idiomaValido(params.lang);
  if (!lang) return { title: "Not found" };
  const t = TEXTOS_PLANIFICADOR[lang];
  const url = `${SITE_URL}${urlPlanificador(lang)}`;
  const descripcion = DESCRIPCION[lang](obtenerCiudadesPlanificador(lang).length);
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    title: t.metaTitulo,
    description: descripcion,
    robots: { index: allowIndexing, follow: allowIndexing },
    alternates: {
      canonical: url,
      languages: hreflangAlternates((l) => urlPlanificador(l)),
    },
    openGraph: {
      type: "website",
      url,
      title: `${t.metaTitulo} | ExploraSpain`,
      description: descripcion,
      siteName: "ExploraSpain",
      locale: IDIOMA_LOCALE[lang].replace("-", "_"),
    },
  };
}

export default function PlannerPage({ params }: Props) {
  const lang = idiomaValido(params.lang);
  if (!lang) notFound();
  return <PaginaPlanificador idioma={lang} />;
}
