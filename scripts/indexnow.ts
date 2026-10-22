/**
 * Avisa a Bing (y al resto de buscadores IndexNow: Yandex, Seznam, Naver)
 * de las URLs nuevas o cambiadas. Ejecutar DESPUÉS de que Vercel publique:
 *
 *   npm run indexnow                 → URLs con lastmod en los últimos 3 días
 *   npm run indexnow -- --dias=30    → ventana más amplia
 *   npm run indexnow -- --todas      → todo el sitemap (solo la primera vez)
 *   npm run indexnow -- --url=https://www.exploraspain.com/guias/...  (repetible)
 *
 * La clave es pública por diseño: el buscador comprueba que
 * https://www.exploraspain.com/<clave>.txt devuelve la misma clave.
 */
const SITE = "https://www.exploraspain.com";
const HOST = "www.exploraspain.com";
const CLAVE = "846d59a980eb7b5b0a15cac0f72be5a7";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_POR_ENVIO = 10_000;

type EntradaSitemap = { url: string; lastmod: Date | null };

function leerArgs(): { todas: boolean; dias: number; urls: string[] } {
  const args = process.argv.slice(2);
  const dias = Number(
    args.find((a) => a.startsWith("--dias="))?.split("=")[1] ?? "3"
  );
  return {
    todas: args.includes("--todas"),
    dias: Number.isFinite(dias) && dias > 0 ? dias : 3,
    urls: args
      .filter((a) => a.startsWith("--url="))
      .map((a) => a.slice("--url=".length)),
  };
}

async function leerSitemap(): Promise<EntradaSitemap[]> {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml → HTTP ${res.status}`);
  const xml = await res.text();
  const entradas: EntradaSitemap[] = [];
  for (const bloque of xml.split("<url>").slice(1)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(bloque)?.[1];
    if (!loc) continue;
    const mod = /<lastmod>([^<]+)<\/lastmod>/.exec(bloque)?.[1];
    entradas.push({ url: loc.trim(), lastmod: mod ? new Date(mod) : null });
  }
  return entradas;
}

async function enviar(urls: string[]): Promise<void> {
  for (let i = 0; i < urls.length; i += MAX_POR_ENVIO) {
    const lote = urls.slice(i, i + MAX_POR_ENVIO);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: CLAVE,
        keyLocation: `${SITE}/${CLAVE}.txt`,
        urlList: lote,
      }),
    });
    // 200 = recibido, 202 = recibido y clave pendiente de validar.
    console.log(`[indexnow] ${lote.length} URLs → HTTP ${res.status}`);
    if (res.status >= 400) console.log(await res.text());
  }
}

async function main(): Promise<void> {
  const { todas, dias, urls } = leerArgs();
  let lista = urls;
  if (lista.length === 0) {
    const entradas = await leerSitemap();
    const limite = Date.now() - dias * 24 * 60 * 60 * 1000;
    lista = entradas
      .filter((e) => todas || (e.lastmod !== null && e.lastmod.getTime() >= limite))
      .map((e) => e.url);
  }
  lista = Array.from(new Set(lista)).filter((u) => u.startsWith(SITE));
  if (lista.length === 0) {
    console.log("[indexnow] nada que enviar");
    return;
  }
  await enviar(lista);
}

main().catch((err: unknown) => {
  console.error("[indexnow] error:", err);
  process.exit(1);
});
