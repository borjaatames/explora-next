/**
 * Perfiles oficiales de ExploraSpain en redes sociales.
 * Fuente única: footer, página de contacto y `sameAs` del JSON-LD Organization.
 * Si cambia un usuario o se abre una red nueva, se toca solo aquí.
 */

export type RedSocialId = "instagram" | "facebook" | "pinterest";

export interface RedSocial {
  id: RedSocialId;
  nombre: string;
  url: string;
}

export const REDES_SOCIALES: readonly RedSocial[] = [
  {
    id: "instagram",
    nombre: "Instagram",
    url: "https://www.instagram.com/exploraspain.official/",
  },
  {
    id: "facebook",
    nombre: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61596373916026",
  },
  {
    id: "pinterest",
    nombre: "Pinterest",
    url: "https://www.pinterest.com/exploraspain/",
  },
] as const;

/** URLs para la propiedad `sameAs` del JSON-LD Organization. */
export const SAME_AS_REDES: string[] = REDES_SOCIALES.map((r) => r.url);
