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

const SLUG = 'tour-tapas-madrid';

export async function generateMetadata(): Promise<Metadata> {
  const landing = obtenerLandingSem(SLUG);
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
      locale: 'es_ES',
    },
  };
}

export default function Page() {
  const landing = obtenerLandingSem(SLUG);
  if (!landing) notFound();

  const tourAncla = landing.tours.find((t) => t.ancla) ?? landing.tours[0];

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
        idioma="es"
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

      <SemPieTransparencia idioma="es" />

      <SemStickyMobile
        label={landing.sticky_cta.label}
        textoBoton={landing.sticky_cta.texto_boton}
        tourAncla={tourAncla}
        landingSlug={landing.slug}
        idioma="es"
        etiquetaSuperior={landing.sticky_cta.etiqueta_superior}
      />
    </>
  );
}
