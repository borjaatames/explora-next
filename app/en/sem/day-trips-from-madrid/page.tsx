import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { obtenerLandingSem } from '@/lib/sem/landings';
import GclidCapture from '@/components/sem/GclidCapture';
import SemHero from '@/components/sem/SemHero';
import SemComparador from '@/components/sem/SemComparador';
import SemTourGrid from '@/components/sem/SemTourGrid';
import SemGarantias from '@/components/sem/SemGarantias';
import SemFAQ from '@/components/sem/SemFAQ';
import SemCTAFinal from '@/components/sem/SemCTAFinal';
import SemPieTransparencia from '@/components/sem/SemPieTransparencia';
import SemStickyMobile from '@/components/sem/SemStickyMobile';

const SLUG = 'day-trips-from-madrid';
const IDIOMA = 'en' as const;

export async function generateMetadata(): Promise<Metadata> {
  const landing = obtenerLandingSem(SLUG, IDIOMA);
  if (!landing) return {};

  return {
    title: landing.meta_titulo,
    description: landing.meta_descripcion,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: landing.meta_titulo,
      description: landing.meta_descripcion,
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default function Page() {
  const landing = obtenerLandingSem(SLUG, IDIOMA);
  if (!landing) notFound();

  // El tour ancla es el que tiene `ancla: true` en el frontmatter
  const tourAncla = landing.tours.find((t) => t.ancla) ?? landing.tours[0];

  // `<main className="pb-24 md:pb-0">` and the brand strip live in
  // `app/en/sem/layout.tsx` (rule §8 of reglas-proyecto-exploraspain.md:
  // chrome lives in the shell, not in pages).
  return (
    <>
      <GclidCapture />

      <SemHero
        titulo={landing.titulo}
        subtitulo={landing.subtitulo}
        pruebaSocialTitular={landing.prueba_social_titular}
        trustSignals={landing.trust_signals}
      />

      <SemComparador
        titulo={landing.comparador.titulo}
        categorias={landing.comparador.categorias}
      />

      <SemTourGrid
        tours={landing.tours}
        landingSlug={landing.slug}
        idioma={IDIOMA}
        fichaCiudad={landing.ficha_ciudad}
      />

      <SemGarantias
        titulo={landing.garantias.titulo}
        items={landing.garantias.items}
      />

      <SemFAQ
        titulo={landing.faqs.titulo}
        items={landing.faqs.items}
      />

      <SemCTAFinal
        titulo={landing.cta_final.titulo}
        subtitulo={landing.cta_final.subtitulo}
        textoBoton={landing.cta_final.texto_boton}
      />

      <SemPieTransparencia idioma={IDIOMA} />

      <SemStickyMobile
        label={landing.sticky_cta.label}
        textoBoton={landing.sticky_cta.texto_boton}
        tourAncla={tourAncla}
        landingSlug={landing.slug}
        idioma={IDIOMA}
        etiquetaSuperior={landing.sticky_cta.etiqueta_superior}
      />
    </>
  );
}
