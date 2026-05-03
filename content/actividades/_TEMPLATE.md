---
# ═════════════════════════════════════════════════════════════════════════════
#  PLANTILLA DE ACTIVIDAD — ExploraSpain
# ═════════════════════════════════════════════════════════════════════════════
#
#  CÓMO USARLA
#  -----------
#  1. Copia este archivo a `content/actividades/es/{ciudad}/{slug}.md`.
#     Ejemplo: content/actividades/es/madrid/tapas-la-latina.md
#  2. Sustituye TODOS los placeholders <ENTRE ÁNGULOS> por valores reales.
#  3. Borra los comentarios `#` que ya no necesites (los del usuario, no estos).
#  4. Verifica que `publicada` sea `true` ANTES de hacer commit.
#  5. Las imágenes deben existir en /public/images/actividades/{ciudad}/{lugar}/
#     antes del commit, si no la galería no carga.
#
#  REGLAS DE NEGOCIO (no negociables)
#  ----------------------------------
#  · NO inventar precios, ratings ni nº de opiniones. Sacar SIEMPRE del PDF
#    oficial de la página de Viator (descargado con dd_referrer en la URL).
#  · NO copiar opiniones individuales (plagio + no somos operadores).
#  · El rating es agregado: "★ 4,8 · 549 opiniones" sí, frases textuales no.
#  · Solo activar `idiomas` que el operador realmente ofrece (no "es" si no
#    hay guía en español; pierdes credibilidad).
#  · `opinionEditorial` debe ser opinión REAL: para quién sí, para quién no.
#    No marketing.
# ═════════════════════════════════════════════════════════════════════════════

# ─── 1. IDENTIDAD ──────────────────────────────────────────────────────────
# Título comercial. Máx 60 caracteres (regla SEO + Metadata API).
# Bueno: "Visita guiada al Museo del Prado con entrada sin colas"
# Malo:  "TOUR DEL PRADO!! El MEJOR de Madrid 2026 BARATO" (clickbait → no)
titulo: "<TÍTULO COMERCIAL — máx 60 chars>"

# Slug en kebab-case. DEBE coincidir con el nombre del archivo sin .md.
# Ejemplos buenos: "tapas-la-latina", "excursion-toledo", "flamenco-cardamomo"
slug: "<slug-en-kebab-case>"

# Una de: "madrid", "barcelona", "sevilla", "granada", "salamanca".
# Debe coincidir con la carpeta donde vive este archivo.
ciudad: "<madrid|barcelona|sevilla|granada|salamanca>"

# Descripción comercial. 140-160 caracteres (regla meta description SEO).
# Debe explicar qué es la actividad y cuál es el gancho de valor.
descripcion: "<DESCRIPCIÓN — 140-160 caracteres con gancho concreto>"


# ─── 2. DATOS COMERCIALES (sacar del PDF de Viator) ────────────────────────
# duración: formato "Xh Ymin" o "X horas". Lo que aparece en Viator.
duracion: "<duración legible — ej: 1h 30min, 5 horas>"

# duracionMinutos: el mismo valor en minutos enteros. Útil para schema.
duracionMinutos: <NÚMERO sin comillas — ej: 90, 300>

# precioDesde: precio mínimo POR PERSONA tal como aparece en Viator.
# Si Viator dice "desde 39 €", aquí pones 39 (sin comillas, sin €).
precioDesde: <NÚMERO sin comillas — ej: 39>

# Por defecto EUR. Si la actividad cobra en otra moneda, ajustar.
moneda: "EUR"

# Códigos ISO 639-1 de los idiomas en que se ofrece la actividad.
# Solo incluir los que REALMENTE están disponibles según Viator.
# Ejemplos: ["es", "en", "it"]  /  ["en", "fr"]  /  ["es"]
idiomas: ["<es>", "<en>"]

# Por ahora solo "viator" está activo. Cuando se aprueben Civitatis o GYG
# se ampliará la lista en lib/afiliados.ts.
proveedor: "viator"

# URL de Viator del producto SIN parámetros adicionales (lib/afiliados.ts
# añadirá automáticamente el PID P00298823).
# Ejemplo: https://www.viator.com/tours/{Ciudad}/{Slug-Producto}/d566-XXXXX
urlReserva: "<URL Viator del producto, sin pid ni dd_referrer>"

# Cancelación: la mayoría de tours Viator tienen cancelación gratuita 24h.
# Verificar en el PDF. Si NO la tiene, poner false y omitir horasCancelacion.
cancelacionGratuita: <true|false>
horasCancelacion: <24 si aplica, omitir si no hay cancelación gratuita>


# ─── 3. CONTENIDO COMERCIAL ────────────────────────────────────────────────
# Highlights: 3-5 frases cortas con los argumentos de venta.
# Cada uno debe ser CONCRETO y verificable en el PDF de Viator.
highlights:
  - "<Highlight 1 — ej: Acceso preferente sin colas>"
  - "<Highlight 2 — ej: Guía oficial en español>"
  - "<Highlight 3>"
  - "<Highlight 4>"

# Lista cerrada de lo que entra en el precio. Sacar del bloque
# "What's Included" del PDF de Viator.
incluye:
  - "<Servicio incluido 1 — ej: Guía profesional>"
  - "<Servicio incluido 2 — ej: Entrada sin colas al museo>"
  - "<Servicio incluido 3>"

# Lista cerrada de lo que NO entra. Sacar del bloque "What's Included"
# (los marcados con X). Suele incluir comida, transporte, propinas.
noIncluye:
  - "<Servicio no incluido 1 — ej: Comida y bebida>"
  - "<Servicio no incluido 2>"


# ─── 4. PUNTO DE ENCUENTRO ─────────────────────────────────────────────────
# Punto de encuentro estructurado: texto + descripción visual del guía
# + coordenadas para el mapa OpenStreetMap.
puntoEncuentro:
  texto: "<DIRECCIÓN exacta del punto de encuentro>"
  descripcionGuia: "<INSTRUCCIÓN concreta — quién te recibe, dónde, cómo identificarlo, llega 15 min antes, etc.>"
  # Coordenadas en grados decimales. Sacar de Google Maps:
  # botón derecho sobre el punto exacto → "¿Qué hay aquí?" → copiar lat/lng
  latitud: <COORDENADA — ej: 40.4145>
  longitud: <COORDENADA — ej: -3.6921>
  # 17 es buen zoom por defecto (calle reconocible).
  zoom: 17


# ─── 5. DETALLES PRÁCTICOS ─────────────────────────────────────────────────
# Detalles prácticos granulares. Booleanos según el PDF de Viator.
# Si un dato no está claro, omitir esa línea (no inventar).
detallesPracticos:
  ticketMovil: <true|false>
  confirmacionInmediata: <true|false>
  accesibleSilla: <true|false>
  # 0 = sin edad mínima. Para tours nocturnos/cata de vinos suele ser 18.
  edadMinima: <NÚMERO — ej: 0, 18>
  mascotasPermitidas: <true|false>


# ─── 6. INFORMACIÓN IMPORTANTE (3 columnas) ────────────────────────────────
# Información importante mostrada en 3 columnas (Qué traer / No apto para
# / A tener en cuenta). Cualquiera puede estar vacía o ausente.
informacionImportante:
  queTraer:
    - "<Item 1 — ej: Documento de identidad>"
    - "<Item 2 — ej: Calzado cómodo>"
  noAptoPara:
    - "<Restricción 1 — ej: Carritos de bebé grandes>"
  aTenerEnCuenta:
    - "<Aviso editorial 1 — ej: El grupo puede ser de unas 15-20 personas>"
    - "<Aviso editorial 2 — ej: No se permiten fotografías en las salas>"


# ─── 7. ACCESIBILIDAD Y CANCELACIÓN ────────────────────────────────────────
# Frase global sobre accesibilidad. Sacar del bloque "Additional Info"
# del PDF (líneas con "wheelchair accessible", "stroller accessible", etc.).
# Si la actividad NO es accesible, decirlo claramente.
accesibilidad: "<FRASE sobre accesibilidad — ej: El museo es totalmente accesible en silla de ruedas. Indícalo al reservar.>"

# Política de cancelación en lenguaje natural. Concreta los plazos.
politicaCancelacion: "<POLÍTICA — ej: Cancela gratis hasta 24h antes de la actividad y recibirás el reembolso completo.>"


# ─── 8. PREGUNTAS FRECUENTES ───────────────────────────────────────────────
# 3-5 preguntas reales que un viajero se haría ANTES de reservar.
# No usar preguntas de marketing ("¿es una experiencia inolvidable?" no).
# Sí preguntas operativas: precio, duración, qué pasa si llego tarde,
# diferencia con otra opción, idioma, accesibilidad, comida.
preguntasFrecuentes:
  - pregunta: "<Pregunta 1 — ej: ¿La entrada está incluida?>"
    respuesta: "<Respuesta clara y honesta. Sin marketing.>"
  - pregunta: "<Pregunta 2 — ej: ¿Cuántas personas hay en el grupo?>"
    respuesta: "<Respuesta específica con números si aplica.>"
  - pregunta: "<Pregunta 3>"
    respuesta: "<Respuesta>"


# ─── 9. RELACIONES CON OTRAS ACTIVIDADES ───────────────────────────────────
# Slugs de OTRAS actividades publicadas en la misma ciudad que se mostrarán
# en el carrusel "Otras formas de visitar X". Lista vacía [] si no aplica.
# Importante: usar slugs que YA existen y están publicados, si no, no
# aparecerán (se descartan silenciosamente).
variantes: ["<slug-actividad-relacionada-1>", "<slug-actividad-relacionada-2>"]


# ─── 10. EDITORIAL (lo que diferencia ExploraSpain) ────────────────────────
# Opinión editorial honesta. Es el campo más importante: dice POR QUÉ
# alguien debería elegir esta actividad y POR QUÉ no debería.
# Estructura recomendada:
#   1) Para quién es la opción acertada (1-2 frases)
#   2) Cuál es el matiz / la pega real (1-2 frases)
#   3) Comparación con otras alternativas si las hay (1-2 frases)
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
# · excursion    → escapadas de día desde la ciudad (Toledo, Segovia)
# · familiar     → actividades pensadas para niños
categoria: "<cultural|gastronomico|aireLibre|nocturno|excursion|familiar>"

# Keywords: 5-8 términos en minúsculas, sin tildes ni caracteres especiales.
# Mezclar términos genéricos (alta búsqueda) y específicos (alta intención).
keywords: ["<keyword principal>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]


# ─── 12. IMÁGENES ──────────────────────────────────────────────────────────
# Las imágenes deben EXISTIR en /public/images/actividades/{ciudad}/{lugar}/
# antes del commit. Si no, fallan en producción aunque el build pase.
# Formato: WebP, 1600×1200 px, calidad 80, ~200 KB.
# Workflow: Pexels/Unsplash/Pixabay → squoosh.app → mover a /public/.
imagen: "/images/actividades/<ciudad>/<lugar>/<hero>.webp"
imagenAlt: "<ALT honesto y descriptivo, no decorativo>"

# Galería: 3-5 imágenes adicionales. Cada una con su alt.
# Recomendación: incluir variedad (exterior, interior, ambiente, detalle).
galeria:
  - src: "/images/actividades/<ciudad>/<lugar>/<imagen-1>.webp"
    alt: "<ALT imagen 1>"
  - src: "/images/actividades/<ciudad>/<lugar>/<imagen-2>.webp"
    alt: "<ALT imagen 2>"
  - src: "/images/actividades/<ciudad>/<lugar>/<imagen-3>.webp"
    alt: "<ALT imagen 3>"


# ─── 13. RATING AGREGADO (sacar del PDF de Viator) ─────────────────────────
# Rating numérico tal como aparece en Viator. Decimal con punto (4.8, no 4,8).
# El frontend formatea a "4,8" automáticamente con locale es-ES.
ratingProveedor: <NÚMERO con punto decimal — ej: 4.8>

# Número entero de opiniones tal como aparece en Viator.
# Si la actividad tiene <10 opiniones, considerar NO publicarla todavía
# (poco rating = poca señal de calidad para el viajero).
numeroOpiniones: <NÚMERO entero — ej: 549>


# ─── 14. ESTADO ────────────────────────────────────────────────────────────
# IMPORTANTE: por defecto false en la plantilla. Solo poner true cuando:
#   · Todos los campos de arriba están rellenos.
#   · Las imágenes existen en /public/.
#   · El cuerpo Markdown de abajo está redactado.
#   · `npm run build` pasa sin errores localmente.
publicada: false

# destacada=true sube esta actividad al carrusel "Destacadas" de la home
# de la ciudad. Limitar a 1-2 destacadas por ciudad.
destacada: false

# Fecha en formato ISO YYYY-MM-DD. Es la fecha de publicación,
# no la de modificación. Útil para ordenar el listado.
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

- Si <contraindicación 1 — ej: ya has hecho esto varias veces>. <Alternativa concreta>.
- Si <contraindicación 2 — ej: vas con niños pequeños>. <Alternativa concreta>.
- Si <contraindicación 3 — ej: solo quieres ver una cosa específica>. <Alternativa concreta>.
