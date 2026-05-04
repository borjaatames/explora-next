---
# ═════════════════════════════════════════════════════════════════════════════
#  PLANTILLA DE ACTIVIDAD (ES) — ExploraSpain
#  Última revisión: 2026-05-04 (refactor i18n bilingüe + audit de parejas)
# ═════════════════════════════════════════════════════════════════════════════
#
#  CÓMO USARLA
#  -----------
#  1. Copia este archivo a `content/actividades/es/{ciudad}/{slug}.md`.
#     Ejemplo: content/actividades/es/madrid/tour-tapas-vinos-barrio-letras.md
#  2. Sustituye TODOS los placeholders <ENTRE ÁNGULOS> por valores reales.
#  3. Borra los comentarios `#` que ya no necesites.
#  4. Verifica que `publicada` sea `true` ANTES de hacer commit.
#  5. Las imágenes deben existir en /public/images/actividades/{ciudad}/{lugar}/
#     antes del commit, si no la galería no carga.
#  6. Si la actividad TAMBIÉN existe en EN, redacta la versión EN en
#     `content/actividades/en/{ciudad}/{slug-en}.md` y declara la pareja en
#     el bloque `slugs:` de AMBOS archivos. El audit de parejas (prebuild)
#     valida la consistencia.
#
#  REGLAS DE NEGOCIO (no negociables)
#  ----------------------------------
#  · NO inventar precios, ratings ni nº de opiniones. Sacar SIEMPRE del PDF
#    oficial de Viator.
#  · NO copiar opiniones individuales (plagio + no somos operadores).
#  · El rating es agregado: "★ 4,8 · 549 opiniones" sí, frases textuales no.
#  · Solo declarar `idiomas` que el operador realmente ofrece (no "es" si no
#    hay guía en español; pierdes credibilidad).
#  · `opinionEditorial` debe ser opinión REAL: para quién sí, para quién no.
#    No marketing.
#  · NO usar imágenes de Viator (copyright). Solo Pexels/Unsplash/Pixabay
#    o fotos propias.
#
#  REGLA OPERATIVA — IDIOMA DE LA FICHA
#  ------------------------------------
#  El idioma de la ficha lo determina el idioma del GUÍA del tour, no el
#  idioma del visitante de la web:
#  · Tour con guía en ES + EN  → 2 fichas (ES + EN), pareja declarada en `slugs:`.
#  · Tour con guía solo en EN  → 1 ficha (EN). NO publicar versión ES.
#  · Tour con guía solo en ES  → 1 ficha (ES). NO publicar versión EN.
# ═════════════════════════════════════════════════════════════════════════════

# ─── 1. IDENTIDAD ──────────────────────────────────────────────────────────
# Título comercial. Máx 60 caracteres (regla SEO + Metadata API).
titulo: "<TÍTULO COMERCIAL — máx 60 chars>"

# Slug en kebab-case. DEBE coincidir con el nombre del archivo sin .md.
slug: "<slug-en-kebab-case>"

# Una de: "madrid", "barcelona", "sevilla", "granada", "salamanca".
# Debe coincidir con la carpeta donde vive este archivo.
ciudad: "<madrid|barcelona|sevilla|granada|salamanca>"

# Descripción comercial. 140-160 caracteres (regla meta description SEO).
descripcion: "<DESCRIPCIÓN — 140-160 caracteres con gancho concreto>"


# ─── 1b. SLUGS POR IDIOMA (i18n hreflang) ──────────────────────────────────
# Bloque clave para hreflang recíproco. Reglas (validadas por
# scripts/audit-parejas.ts en prebuild):
#  · `slugs.es` debe coincidir con el filename de ESTA ficha.
#  · Si existe pareja EN en disco, declarar `slugs.en` con su slug exacto.
#  · Si NO existe pareja EN, omitir la línea `en:` (single-language intencional).
slugs:
  es: "<slug-es-igual-al-filename>"
  en: "<slug-en-de-la-pareja>"   # omitir esta línea si no hay pareja EN


# ─── 2. DATOS COMERCIALES (sacar del PDF de Viator) ────────────────────────
# duracion: formato legible. Lo que aparece en Viator.
duracion: "<duración legible — ej: 1h 30min, 5 horas>"

# duracionMinutos: el mismo valor en minutos enteros. Útil para schema.
duracionMinutos: <NÚMERO sin comillas — ej: 90, 300>

# precioDesde: precio mínimo POR PERSONA tal como aparece en Viator.
precioDesde: <NÚMERO sin comillas — ej: 39>

# Por defecto EUR.
moneda: "EUR"

# Códigos ISO 639-1 de los idiomas en que se ofrece la actividad.
# Solo incluir los que REALMENTE están disponibles según Viator.
idiomas: ["es"]

# Por ahora solo "viator" está activo.
proveedor: "viator"

# URL completa de Viator del producto CON tracking ya construido.
# Formato ES: https://www.viator.com/tours/{Ciudad}/{Slug-Producto}/d566-{CÓDIGO}?pid=P00298823&mcid=42383&medium=link
#
# IMPORTANTE: el tracking se mete aquí literalmente. NO se añade en runtime.
urlReserva: "<URL Viator completa con ?pid=P00298823&mcid=42383&medium=link>"

# Cancelación: la mayoría de tours Viator tienen cancelación gratuita 24h.
# Verificar en el PDF. Si NO la tiene, poner false y omitir horasCancelacion.
cancelacionGratuita: <true|false>
horasCancelacion: <24 si aplica, omitir si no hay cancelación gratuita>


# ─── 3. CONTENIDO COMERCIAL ────────────────────────────────────────────────
# Highlights: 3-5 frases cortas con argumentos de venta concretos.
highlights:
  - "<Highlight 1 — ej: Acceso preferente sin colas>"
  - "<Highlight 2 — ej: Guía oficial en español>"
  - "<Highlight 3>"
  - "<Highlight 4>"

# Lista cerrada de lo que entra en el precio. Sacar del bloque
# "What's Included" del PDF de Viator (los marcados con ✓).
incluye:
  - "<Servicio incluido 1>"
  - "<Servicio incluido 2>"
  - "<Servicio incluido 3>"

# Lista cerrada de lo que NO entra. Sacar del bloque "What's Included"
# (los marcados con ✗).
noIncluye:
  - "<Servicio no incluido 1 — ej: Comida y bebida>"
  - "<Servicio no incluido 2 — ej: Propinas>"


# ─── 4. PUNTO DE ENCUENTRO ─────────────────────────────────────────────────
# Punto de encuentro estructurado para el componente MapaPuntoEncuentro.
puntoEncuentro:
  texto: "<DIRECCIÓN exacta del punto de encuentro>"
  descripcionGuia: "<INSTRUCCIÓN concreta — quién te recibe, dónde, cómo identificarlo, llegar 15 min antes, etc.>"
  # Coordenadas en grados decimales. Sacar de Google Maps.
  latitud: <COORDENADA — ej: 40.4145>
  longitud: <COORDENADA — ej: -3.6921>
  # 17 es buen zoom por defecto (calle reconocible).
  zoom: 17


# ─── 5. DETALLES PRÁCTICOS ─────────────────────────────────────────────────
# Booleanos según el PDF de Viator. Si un dato no está claro, omitir.
detallesPracticos:
  ticketMovil: <true|false>
  confirmacionInmediata: <true|false>
  accesibleSilla: <true|false>
  edadMinima: <NÚMERO — ej: 0, 4, 18>
  mascotasPermitidas: <true|false>


# ─── 6. INFORMACIÓN IMPORTANTE (3 columnas) ────────────────────────────────
informacionImportante:
  queTraer:
    - "<Item 1 — ej: Documento de identidad>"
    - "<Item 2 — ej: Calzado cómodo>"
  noAptoPara:
    - "<Restricción 1 — ej: Carritos de bebé grandes>"
  aTenerEnCuenta:
    - "<Aviso 1 — ej: El grupo puede ser de 15-20 personas>"
    - "<Aviso 2 — ej: No se permiten fotografías en las salas>"


# ─── 7. ACCESIBILIDAD Y CANCELACIÓN ────────────────────────────────────────
# Frase global sobre accesibilidad. Si NO es accesible, decirlo claramente.
accesibilidad: "<FRASE sobre accesibilidad>"

# Política de cancelación en lenguaje natural. Concreta plazos.
politicaCancelacion: "<POLÍTICA — ej: Cancela gratis hasta 24h antes y recibirás el reembolso completo.>"


# ─── 8. PREGUNTAS FRECUENTES ───────────────────────────────────────────────
# 3-5 preguntas reales que un viajero se haría ANTES de reservar.
# Operativas (precio, duración, idioma, accesibilidad, comida), no marketing.
preguntasFrecuentes:
  - pregunta: "<Pregunta 1>"
    respuesta: "<Respuesta clara y honesta. Sin marketing.>"
  - pregunta: "<Pregunta 2>"
    respuesta: "<Respuesta específica con números si aplica.>"
  - pregunta: "<Pregunta 3>"
    respuesta: "<Respuesta>"


# ─── 9. RELACIONES CON OTRAS ACTIVIDADES ───────────────────────────────────
# Slugs de OTRAS actividades publicadas en la misma ciudad y MISMO idioma
# que se mostrarán en el carrusel "Otras formas de visitar X".
# Lista vacía [] si no aplica. Slugs no publicados se descartan silenciosamente.
variantes: ["<slug-actividad-relacionada-1>", "<slug-actividad-relacionada-2>"]


# ─── 10. EDITORIAL (lo que diferencia ExploraSpain) ────────────────────────
# Opinión editorial honesta. El campo más importante: dice POR QUÉ alguien
# debería elegir esta actividad y POR QUÉ no debería. NO marketing.
opinionEditorial: |
  <PÁRRAFO 1 — Para quién es la opción acertada y por qué.>

  <PÁRRAFO 2 — Pega real, matiz, lo que el marketing no te cuenta.>


# ─── 11. CATEGORIZACIÓN Y SEO ──────────────────────────────────────────────
# Una de las 6 categorías. Debe coincidir con CATEGORIAS_ACTIVIDAD en
# lib/actividades.ts y con dict.actividades.categorias.
# · cultural     → museos, tours guiados, monumentos
# · gastronomico → tapas, cata vinos, comida regional
# · aireLibre    → senderismo, parques naturales, kayak
# · nocturno     → flamenco, conciertos, vida nocturna
# · excursion    → escapadas de día desde la ciudad
# · familiar     → actividades pensadas para niños
categoria: "<cultural|gastronomico|aireLibre|nocturno|excursion|familiar>"

# Keywords: 5-8 términos en minúsculas, sin tildes ni caracteres especiales.
# Mezclar términos genéricos (alta búsqueda) y específicos (alta intención).
keywords: ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]


# ─── 12. IMÁGENES ──────────────────────────────────────────────────────────
# Las imágenes deben EXISTIR en /public/images/actividades/{ciudad}/{lugar}/
# antes del commit. Formato: WebP, 1600×1200 px, calidad 80, ~200 KB.
# Las imágenes pueden compartirse entre las versiones ES y EN de la pareja.
imagen: "/images/actividades/<ciudad>/<lugar>/<hero>.webp"
imagenAlt: "<ALT honesto y descriptivo, no decorativo>"

galeria:
  - src: "/images/actividades/<ciudad>/<lugar>/<imagen-1>.webp"
    alt: "<ALT imagen 1>"
  - src: "/images/actividades/<ciudad>/<lugar>/<imagen-2>.webp"
    alt: "<ALT imagen 2>"
  - src: "/images/actividades/<ciudad>/<lugar>/<imagen-3>.webp"
    alt: "<ALT imagen 3>"


# ─── 13. RATING AGREGADO (sacar del PDF de Viator) ─────────────────────────
# Decimal con punto (4.8, no 4,8). El frontend formatea según locale.
ratingProveedor: <NÚMERO con punto decimal — ej: 4.8>

# Número entero de opiniones tal como aparece en Viator.
# Si <10 opiniones, considerar NO publicar todavía.
numeroOpiniones: <NÚMERO entero — ej: 549>


# ─── 14. ESTADO ────────────────────────────────────────────────────────────
# IMPORTANTE: por defecto false. Solo true cuando todo está listo y
# `npm run build` pasa sin errores localmente (incluido el audit de parejas).
publicada: false

# destacada=true sube esta actividad al carrusel "Destacadas" de la home
# de la ciudad. Limitar a 1-2 destacadas por ciudad.
destacada: false

# Fecha en formato ISO YYYY-MM-DD. Fecha de publicación, no de modificación.
fecha: "<YYYY-MM-DD>"
---

## Qué vas a ver

<2-3 frases que enmarquen el producto. Qué cubre, qué destaca. Sin
adjetivos vacíos. Datos concretos siempre que se pueda.>

- **<Bloque temático 1>:** <descripción concreta con ejemplos>.
- **<Bloque temático 2>:** <descripción concreta con ejemplos>.
- **<Bloque temático 3>:** <descripción concreta con ejemplos>.

## Cómo funciona

<Narrativa operativa: dónde te recibe el guía, cómo entras, qué pasa al
final. 2-3 párrafos. El objetivo es que el lector sepa EXACTAMENTE qué
va a pasar el día de la visita y reduzca incertidumbre antes de reservar.>

<Si hay detalles importantes — entrada con auriculares, taxi incluido,
acceso libre tras el tour, etc. — mencionarlos aquí en negrita.>

## A quién se lo recomiendo

- Si <perfil 1 — ej: es tu primera vez en Madrid>.
- Si <perfil 2 — ej: vas con poco tiempo>.
- Si <perfil 3 — ej: prefieres guía en español>.

## A quién NO se lo recomiendo

- Si <contraindicación 1>. <Alternativa concreta>.
- Si <contraindicación 2>. <Alternativa concreta>.
- Si <contraindicación 3>. <Alternativa concreta>.
