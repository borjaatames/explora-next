import fs from "fs";
import path from "path";

/**
 * Server Component que inlinea el CSS del lightbox (yet-another-react-lightbox)
 * directamente en el HTML como <style>. Esto elimina la petición HTTP externa
 * de ~2 KB que PSI marcaba como render-blocking (coste real: ~450 ms en mobile
 * 3G por el overhead TLS). Al estar inline no hay request adicional.
 *
 * Se monta una sola vez en la página de ficha (layout del shell de fichas o
 * directamente en la page.tsx). Solo importar donde se use GaleriaActividad.
 */
function getLightboxCss(): string {
  try {
    const cssPath = path.join(
      process.cwd(),
      "node_modules",
      "yet-another-react-lightbox",
      "dist",
      "styles.css"
    );
    return fs.readFileSync(cssPath, "utf8");
  } catch {
    return "";
  }
}

// Leemos el CSS en build time (Server Component = sin overhead en runtime).
const LIGHTBOX_CSS = getLightboxCss();

export default function LightboxStyles() {
  if (!LIGHTBOX_CSS) return null;
  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: CSS estático de npm, sin input de usuario
      dangerouslySetInnerHTML={{ __html: LIGHTBOX_CSS }}
    />
  );
}
