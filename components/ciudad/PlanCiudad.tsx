import Link from "next/link";
import type { Idioma } from "@/lib/i18n/types";
import type { GuiaListItem } from "@/lib/guias";
import { enTemporadaNavidad, guiasDeTipo, type TipoGuiaPlan } from "@/lib/descubrir";

const CLASE_BOTON =
  "inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-piedra-900";

const T_BOTONES = {
  es: { navidad: "Navidad en la ciudad", crucero: "¿Llegas en crucero?" },
  en: { navidad: "Christmas in the city", crucero: "Arriving by cruise ship?" },
  de: { navidad: "Weihnachten in der Stadt", crucero: "Mit dem Kreuzfahrtschiff?" },
  fr: { navidad: "Noël en ville", crucero: "Vous arrivez en croisière ?" },
  it: { navidad: "Natale in città", crucero: "Arrivi in crociera?" },
  pt: { navidad: "Natal na cidade", crucero: "Chega de cruzeiro?" },
} as const satisfies Record<Idioma, unknown>;

/** Botones de la cabecera de ciudad: Navidad (en temporada) y guía del puerto. */
export function BotonesGuiasCiudad({ idioma, ciudad }: { idioma: Idioma; ciudad: string }) {
  const t = T_BOTONES[idioma];
  const navidad = enTemporadaNavidad() ? guiasDeTipo(idioma, ciudad, "navidad")[0] : undefined;
  const crucero = guiasDeTipo(idioma, ciudad, "crucero")[0];
  return (
    <>
      {navidad && (
        <Link href={navidad.url} className={CLASE_BOTON}>
          {t.navidad} →
        </Link>
      )}
      {crucero && (
        <Link href={crucero.url} className={CLASE_BOTON}>
          {t.crucero} →
        </Link>
      )}
    </>
  );
}

const GRUPOS: ReadonlyArray<{ tipo: TipoGuiaPlan; titulo: Record<Idioma, string> }> = [
  {
    tipo: "itinerario",
    titulo: {
      es: "Rutas por días",
      en: "Itineraries",
      de: "Routen nach Tagen",
      fr: "Itinéraires",
      it: "Itinerari",
      pt: "Roteiros",
    },
  },
  {
    tipo: "comparativa",
    titulo: {
      es: "¿Qué opción compensa?",
      en: "Which option is worth it?",
      de: "Welche Option lohnt sich?",
      fr: "Quelle option choisir ?",
      it: "Quale opzione conviene?",
      pt: "Que opção compensa?",
    },
  },
  {
    tipo: "ocasion",
    titulo: {
      es: "Según con quién vas",
      en: "Depending on who you're with",
      de: "Je nachdem, mit wem du reist",
      fr: "Selon avec qui vous voyagez",
      it: "A seconda di con chi viaggi",
      pt: "Conforme com quem viaja",
    },
  },
  {
    tipo: "familia",
    titulo: { es: "Con niños", en: "With kids", de: "Mit Kindern", fr: "Avec des enfants", it: "Con bambini", pt: "Com crianças" },
  },
];

const T_BLOQUE = {
  es: { titulo: "Planifica tu viaje", subtitulo: "Itinerarios, comparativas de precio y planes según con quién viajas." },
  en: { titulo: "Plan your trip", subtitulo: "Itineraries, price comparisons and plans for whoever you're travelling with." },
  de: { titulo: "Plane deine Reise", subtitulo: "Reiserouten, Preisvergleiche und Pläne je nachdem, mit wem du reist." },
  fr: { titulo: "Préparez votre voyage", subtitulo: "Itinéraires, comparatifs de prix et idées selon avec qui vous voyagez." },
  it: { titulo: "Organizza il tuo viaggio", subtitulo: "Itinerari, confronti di prezzo e idee a seconda di con chi viaggi." },
  pt: { titulo: "Planeie a sua viagem", subtitulo: "Roteiros, comparações de preço e planos conforme com quem viaja." },
} as const satisfies Record<Idioma, unknown>;

/** Bloque de la página de ciudad con sus guías de planificación. */
export function PlanificaCiudad({ idioma, ciudad }: { idioma: Idioma; ciudad: string }) {
  const t = T_BLOQUE[idioma];
  const vistas = new Set<string>();
  const grupos = GRUPOS.map((g) => {
    const guias: GuiaListItem[] = guiasDeTipo(idioma, ciudad, g.tipo)
      .filter((x) => !vistas.has(x.url))
      .slice(0, 4);
    guias.forEach((x) => vistas.add(x.url));
    return { ...g, guias };
  }).filter((g) => g.guias.length > 0);
  if (vistas.size < 2) return null;

  return (
    <section aria-labelledby="planifica-ciudad" className="border-t border-piedra-200">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <h2 id="planifica-ciudad" className="font-fraunces text-2xl md:text-3xl font-bold text-piedra-900 mb-2">
          {t.titulo}
        </h2>
        <p className="text-piedra-600 mb-8">{t.subtitulo}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {grupos.map((g) => (
            <div key={g.tipo}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-piedra-500 mb-3">
                {g.titulo[idioma]}
              </h3>
              <ul className="space-y-3">
                {g.guias.map((guia) => (
                  <li key={guia.url}>
                    <Link
                      href={guia.url}
                      className="group block bg-white border border-piedra-200 rounded-lg p-4 hover:border-anil-400 hover:shadow-md transition-all"
                    >
                      <span className="font-semibold text-piedra-900 group-hover:text-anil-700 transition-colors line-clamp-2">
                        {guia.titulo}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
