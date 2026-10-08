import Image from "next/image";
import Link from "next/link";
import BuscadorDestino, { type OpcionDestino } from "./BuscadorDestino";
import type { Idioma } from "@/lib/i18n/types";

const DICT = {
  es: {
    antetitulo: "Expertos locales · Reserva segura",
    titulo: "Tours, actividades y guías de España, con criterio",
    subtitulo:
      "Actividades seleccionadas, guías escritas por expertos locales y reserva segura en un solo lugar.",
    etiqueta: "¿A dónde vas?",
    placeholder: "Madrid, Granada, Tenerife…",
    boton: "Buscar",
    verDestinos: "O explora todos los destinos",
  },
  en: {
    antetitulo: "Local experts · Secure booking",
    titulo: "Spain tours, activities and travel guides, chosen with care",
    subtitulo:
      "Hand-picked activities, guides written by local experts and secure booking in one place.",
    etiqueta: "Where are you going?",
    placeholder: "Madrid, Granada, Tenerife…",
    boton: "Search",
    verDestinos: "Or browse all destinations",
  },
  de: {
    antetitulo: "Lokale Experten · Sichere Buchung",
    titulo: "Touren, Aktivitäten und Reiseführer für Spanien – mit Bedacht gewählt",
    subtitulo:
      "Ausgewählte Aktivitäten, Reiseführer von lokalen Experten und sichere Buchung an einem Ort.",
    etiqueta: "Wohin geht die Reise?",
    placeholder: "Madrid, Granada, Teneriffa…",
    boton: "Suchen",
    verDestinos: "Oder alle Reiseziele ansehen",
  },
} as const;

type Props = {
  idioma: Idioma;
  opciones: ReadonlyArray<OpcionDestino>;
  urlTodos: string;
  anclaDestinos: string;
};

export default function HeroHome({
  idioma,
  opciones,
  urlTodos,
  anclaDestinos,
}: Props) {
  const t = DICT[idioma === "en" ? "en" : idioma === "de" ? "de" : "es"];

  return (
    <section className="relative isolate overflow-hidden text-white">
      <Image
        src="/images/home/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_40%] -z-10"
      />
      {/* Velo oscuro hacia la izquierda: el texto siempre pasa contraste AA */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/20"
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-sky-200 mb-4">
          {t.antetitulo}
        </p>
        <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight max-w-3xl mb-5">
          {t.titulo}
        </h1>
        <p className="text-lg md:text-xl text-sky-50 leading-relaxed max-w-xl mb-9">
          {t.subtitulo}
        </p>
        <BuscadorDestino
          opciones={opciones}
          urlTodos={urlTodos}
          etiqueta={t.etiqueta}
          placeholder={t.placeholder}
          boton={t.boton}
        />
        <Link
          href={anclaDestinos}
          className="inline-flex items-center mt-5 text-sm font-semibold text-sky-100 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
        >
          {t.verDestinos} →
        </Link>
      </div>
    </section>
  );
}
