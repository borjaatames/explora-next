/**
 * Audit del mapa de parejas i18n.
 *
 * Se ejecuta como prebuild (ver `package.json > scripts.prebuild`). Falla
 * el build si detecta inconsistencias entre los `.md` del directorio
 * `content/` y la asunción del `LanguageSwitcher` de tener parejas
 * declaradas explícitamente.
 *
 * Reglas que aplica:
 *
 *   1. Todo `.md` de `content/actividades/<idioma>/...` y
 *      `content/guias/<idioma>/...` debe declarar bloque `slugs:` en
 *      frontmatter. Ausencia del bloque = ERROR (caso "olvido" del
 *      handoff de hoy).
 *
 *   2. Si declara `slugs:`, debe contener al menos la entrada del idioma
 *      propio (`es:` para .md ES, `en:` para .md EN). Si falta,
 *      probablemente es una incoherencia humana = ERROR.
 *
 *   3. Si la pareja existe en disco (i.e. el .md correspondiente en el
 *      otro idioma existe físicamente), `slugs.[idiomaOpuesto]` debe
 *      declararse y debe coincidir con el slug real del archivo opuesto.
 *      Si no coincide, ERROR.
 *
 *   4. Si la pareja NO existe en disco, omitir `slugs.[idiomaOpuesto]`
 *      es válido (caso "single-language intencional", regla operativa
 *      4 mayo). Solo se loguea como INFO.
 *
 *   5. Las ciudades NO entran en este audit. Por convención del proyecto
 *      las ciudades usan slug invariante y `slugParejaCiudad` resuelve
 *      por existencia física del archivo (ver lib/i18n/slugs.ts).
 *
 *   6. (Solo actividades) Si una ficha tiene gemelo ES↔EN en disco, ambas
 *      versiones deben compartir EXACTAMENTE el mismo hero (`imagen`) y la
 *      misma galería (lista de `src`). Las fotos son las mismas; solo el
 *      `alt` cambia de idioma. Divergencia = ERROR. La comprobación se hace
 *      una vez por pareja, desde el lado ES.
 *
 * Plantillas (`_TEMPLATE.md`, archivos cuyo nombre empiece por "_") se
 * excluyen siempre.
 *
 * Uso:
 *   - `npm run audit:parejas`        ejecuta el audit aislado.
 *   - `npm run build`                lo ejecuta automáticamente vía prebuild.
 *   - exit code 0 si OK, 1 si hay errores.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Idioma = "es" | "en";
const IDIOMAS: readonly Idioma[] = ["es", "en"] as const;

const ROOT = path.join(process.cwd(), "content");
const ACTIVIDADES_ROOT = path.join(ROOT, "actividades");
const GUIAS_ROOT = path.join(ROOT, "guias");

type Hallazgo = {
  nivel: "error" | "info";
  archivo: string;
  mensaje: string;
};

const hallazgos: Hallazgo[] = [];

function leerFrontmatter(
  fullPath: string
): Record<string, unknown> | null {
  try {
    const contenido = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(contenido);
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

function esArchivoPlantilla(nombre: string): boolean {
  return nombre.startsWith("_");
}

/**
 * Recorre recursivamente un directorio y devuelve rutas absolutas de
 * archivos `.md` no-plantilla.
 */
function listarMarkdowns(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const resultados: string[] = [];
  const entradas = fs.readdirSync(dir, { withFileTypes: true });
  for (const entrada of entradas) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      resultados.push(...listarMarkdowns(ruta));
    } else if (
      entrada.isFile() &&
      entrada.name.endsWith(".md") &&
      !esArchivoPlantilla(entrada.name)
    ) {
      resultados.push(ruta);
    }
  }
  return resultados;
}

/**
 * Para un .md dado, deduce el idioma propio y devuelve el path equivalente
 * en el idioma opuesto (sin garantizar que exista).
 */
function calcularPathOpuesto(
  fullPath: string,
  raiz: string,
  slugOpuesto: string
): { idiomaActual: Idioma; idiomaOpuesto: Idioma; pathOpuesto: string } | null {
  const relativo = path.relative(raiz, fullPath);
  const partes = relativo.split(path.sep);
  if (partes.length < 2) return null;
  const idiomaActual = partes[0] as Idioma;
  if (!IDIOMAS.includes(idiomaActual)) return null;
  const idiomaOpuesto: Idioma = idiomaActual === "es" ? "en" : "es";
  const restoPartes = partes.slice(1, -1); // categoría/ciudad
  const nuevoNombre = `${slugOpuesto}.md`;
  const pathOpuesto = path.join(raiz, idiomaOpuesto, ...restoPartes, nuevoNombre);
  return { idiomaActual, idiomaOpuesto, pathOpuesto };
}

function nombreSinExtension(fullPath: string): string {
  return path.basename(fullPath, ".md");
}

/**
 * Extrae el hero (`imagen`) y la lista ordenada de `src` de la galería de
 * un frontmatter de actividad. La galería puede ser lista de objetos
 * `{ src, alt }` o lista de strings.
 */
function extraerImagenes(
  data: Record<string, unknown>
): { hero: string | null; galeria: string[] } {
  const hero = typeof data.imagen === "string" ? data.imagen : null;
  const galRaw = Array.isArray(data.galeria) ? data.galeria : [];
  const galeria = galRaw.map((it) => {
    if (it && typeof it === "object" && "src" in it) {
      return String((it as { src: unknown }).src);
    }
    return String(it);
  });
  return { hero, galeria };
}

/**
 * Regla 6: una pareja de actividades ES↔EN debe compartir el mismo hero y
 * la misma galería (mismos `src`, mismo orden). Se llama una vez por pareja
 * desde el lado ES. Si alguna versión está sin publicar, se omite.
 */
function compararImagenesPareja(esPath: string, enPath: string): void {
  const a = leerFrontmatter(esPath);
  const b = leerFrontmatter(enPath);
  if (!a || !b) return;
  if (a.publicada === false || b.publicada === false) return;
  const ia = extraerImagenes(a);
  const ib = extraerImagenes(b);
  if (ia.hero !== ib.hero) {
    hallazgos.push({
      nivel: "error",
      archivo: enPath,
      mensaje: `hero (imagen) distinto al gemelo ES. ES="${ia.hero}" · EN="${ib.hero}". Los gemelos deben usar la misma imagen de portada.`,
    });
  }
  if (JSON.stringify(ia.galeria) !== JSON.stringify(ib.galeria)) {
    hallazgos.push({
      nivel: "error",
      archivo: enPath,
      mensaje: `galería distinta al gemelo ES (ES ${ia.galeria.length} foto(s), EN ${ib.galeria.length}). Ambas versiones deben listar los mismos \`src\` en el mismo orden; solo el \`alt\` cambia de idioma.`,
    });
  }
}

function auditarMarkdown(fullPath: string, raiz: string): void {
  const data = leerFrontmatter(fullPath);
  const slugFichero = nombreSinExtension(fullPath);

  if (!data) {
    hallazgos.push({
      nivel: "error",
      archivo: fullPath,
      mensaje: "no se pudo leer frontmatter",
    });
    return;
  }

  // Si la ficha está marcada como no publicada, la saltamos. No tiene
  // sentido bloquear el build por una ficha en draft.
  if (data.publicada === false) return;

  const slugs = data.slugs as Partial<Record<Idioma, string>> | undefined;

  if (!slugs || typeof slugs !== "object") {
    hallazgos.push({
      nivel: "error",
      archivo: fullPath,
      mensaje:
        "no declara bloque `slugs:` en frontmatter. Añade `slugs:` con al menos la clave del idioma propio.",
    });
    return;
  }

  const meta = calcularPathOpuesto(fullPath, raiz, slugFichero);
  if (!meta) {
    hallazgos.push({
      nivel: "error",
      archivo: fullPath,
      mensaje: "estructura de carpetas inesperada (no idioma/ subdir)",
    });
    return;
  }
  const { idiomaActual, idiomaOpuesto } = meta;

  // Regla 2: el idioma propio debe estar declarado y coincidir con el slug
  // físico del archivo.
  const slugPropio = slugs[idiomaActual];
  if (!slugPropio) {
    hallazgos.push({
      nivel: "error",
      archivo: fullPath,
      mensaje: `slugs.${idiomaActual} no declarado. Añade \`${idiomaActual}: ${slugFichero}\`.`,
    });
  } else if (slugPropio !== slugFichero) {
    hallazgos.push({
      nivel: "error",
      archivo: fullPath,
      mensaje: `slugs.${idiomaActual} = "${slugPropio}" no coincide con el nombre del archivo "${slugFichero}".`,
    });
  }

  // Regla 3 y 4: pareja en idioma opuesto.
  const slugOpuestoDeclarado = slugs[idiomaOpuesto];

  if (slugOpuestoDeclarado) {
    // Comprobamos que el archivo opuesto existe y se llama así.
    const metaOpuesto = calcularPathOpuesto(fullPath, raiz, slugOpuestoDeclarado);
    if (!metaOpuesto) {
      hallazgos.push({
        nivel: "error",
        archivo: fullPath,
        mensaje: `no se pudo calcular path opuesto para slugs.${idiomaOpuesto}`,
      });
      return;
    }
    if (!fs.existsSync(metaOpuesto.pathOpuesto)) {
      hallazgos.push({
        nivel: "error",
        archivo: fullPath,
        mensaje: `slugs.${idiomaOpuesto} = "${slugOpuestoDeclarado}" pero no existe el archivo ${path.relative(process.cwd(), metaOpuesto.pathOpuesto)}.`,
      });
    } else if (raiz === ACTIVIDADES_ROOT && idiomaActual === "es") {
      // Regla 6: la pareja existe → hero y galería deben coincidir.
      compararImagenesPareja(fullPath, metaOpuesto.pathOpuesto);
    }
  } else {
    // No declara pareja. Comprobamos si existe en disco un .md "candidato
    // sospechoso" con el mismo slug que el actual (típico despiste:
    // se hace la pareja con el mismo slug pero no se declara).
    const candidatoMismoSlug = path.join(
      raiz,
      idiomaOpuesto,
      ...path.relative(raiz, fullPath).split(path.sep).slice(1, -1),
      `${slugFichero}.md`
    );
    if (fs.existsSync(candidatoMismoSlug)) {
      hallazgos.push({
        nivel: "error",
        archivo: fullPath,
        mensaje: `existe pareja en disco (${path.relative(process.cwd(), candidatoMismoSlug)}) pero no se declara slugs.${idiomaOpuesto}. Si es deliberado, declara expicítamente y añade el slug; si no, este archivo está incoherente.`,
      });
    } else {
      hallazgos.push({
        nivel: "info",
        archivo: fullPath,
        mensaje: `single-language ${idiomaActual} (no declara slugs.${idiomaOpuesto}).`,
      });
    }
  }
}

/**
 * Este audit solo entiende parejas ES↔EN (ver docstring superior). Idiomas
 * añadidos después (de/fr/it/pt) usan `slugs:` con más claves pero su
 * pareja se resuelve en build vía `lib/i18n/parejas.ts` (MapaParejas, por
 * existencia física de archivo), no por este script. Por eso limitamos el
 * recorrido a las subcarpetas `es/` y `en/` explícitamente: cualquier otro
 * idioma queda fuera de este audit a propósito, en vez de producir un falso
 * "estructura de carpetas inesperada".
 */
function auditarRaiz(raiz: string, etiqueta: string): void {
  const archivos = IDIOMAS.flatMap((idioma) =>
    listarMarkdowns(path.join(raiz, idioma))
  );
  console.log(`\n[audit-parejas] ${etiqueta}: ${archivos.length} .md analizados`);
  for (const archivo of archivos) {
    auditarMarkdown(archivo, raiz);
  }
}

function main(): void {
  console.log("[audit-parejas] iniciando…");

  auditarRaiz(ACTIVIDADES_ROOT, "actividades");
  auditarRaiz(GUIAS_ROOT, "guías");

  const errores = hallazgos.filter((h) => h.nivel === "error");
  const infos = hallazgos.filter((h) => h.nivel === "info");

  if (infos.length > 0) {
    console.log(`\n[audit-parejas] ${infos.length} ficha(s) single-language detectada(s):`);
    for (const info of infos) {
      console.log(`  · ${path.relative(process.cwd(), info.archivo)} — ${info.mensaje}`);
    }
  }

  if (errores.length > 0) {
    console.error(`\n[audit-parejas] ❌ ${errores.length} error(es):`);
    for (const err of errores) {
      console.error(`  ✗ ${path.relative(process.cwd(), err.archivo)}`);
      console.error(`      ${err.mensaje}`);
    }
    console.error("\n[audit-parejas] build abortado. Corrige los frontmatters y reintenta.");
    process.exit(1);
  }

  console.log("\n[audit-parejas] ✅ todas las parejas son consistentes.");
}

main();
