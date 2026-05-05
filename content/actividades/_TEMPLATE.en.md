---
# ═════════════════════════════════════════════════════════════════════════════
#  ACTIVITY TEMPLATE (EN) — ExploraSpain
#  Last revision: 2026-05-04 (i18n bilingual refactor + parejas audit)
# ═════════════════════════════════════════════════════════════════════════════
#
#  HOW TO USE
#  ----------
#  1. Copy this file to `content/actividades/en/{ciudad}/{slug}.md`.
#     Example: content/actividades/en/madrid/madrid-wine-and-tapas-tour.md
#  2. Replace ALL placeholders <IN ANGLE BRACKETS> with real values.
#  3. Delete the `#` comments you don't need.
#  4. Verify `publicada: true` BEFORE committing.
#  5. Images must exist at /public/images/actividades/{ciudad}/{lugar}/
#     before the commit, otherwise the gallery won't render.
#  6. If the activity ALSO has a Spanish version, write the ES file at
#     `content/actividades/es/{ciudad}/{slug-es}.md` and declare the pair
#     in the `slugs:` block of BOTH files. The parejas audit (prebuild)
#     validates consistency.
#
#  BUSINESS RULES (non-negotiable)
#  -------------------------------
#  · Never invent prices, ratings or review counts. Always pull from the
#    official Viator PDF.
#  · Never copy individual reviews (plagiarism + we are not the operator).
#  · Aggregate rating only: "★ 4.8 · 549 reviews" yes, verbatim quotes no.
#  · Only declare `idiomas` actually offered by the operator. Never list
#    "es" if there's no Spanish-speaking guide.
#  · `opinionEditorial` must be a real opinion: who's it for, who isn't it for.
#    No marketing fluff.
#  · No Viator imagery (copyright). Pexels / Unsplash / Pixabay or own photos.
#
#  OPERATIONAL RULE — ACTIVITY LANGUAGE
#  -------------------------------------
#  The language of the activity file is determined by the language of the
#  GUIDE, not by the language of the website visitor:
#  · Tour with EN + ES guide → 2 files (ES + EN), pair declared in `slugs:`.
#  · Tour with EN-only guide → 1 file (EN). Do NOT publish a Spanish version.
#  · Tour with ES-only guide → 1 file (ES). Do NOT publish an English version.
# ═════════════════════════════════════════════════════════════════════════════

# ─── 1. IDENTITY ───────────────────────────────────────────────────────────
# Commercial title. Max 60 characters (SEO + Metadata API rule).
titulo: "<COMMERCIAL TITLE — max 60 chars>"

# Slug in kebab-case. MUST match the filename without .md.
slug: "<slug-in-kebab-case>"

# One of: "madrid", "barcelona", "sevilla", "granada", "salamanca".
# Note: city slugs are invariant ES (no "seville", "barcelone", etc.).
# Must match the folder this file lives in.
ciudad: "<madrid|barcelona|sevilla|granada|salamanca>"

# Commercial description. 140-160 characters (meta description SEO rule).
descripcion: "<DESCRIPTION — 140-160 chars with a concrete hook>"


# ─── 1b. SLUGS BY LANGUAGE (i18n hreflang) ─────────────────────────────────
# Critical block for reciprocal hreflang. Rules (validated by
# scripts/audit-parejas.ts at prebuild):
#  · `slugs.en` must match THIS file's filename.
#  · If an ES pair exists on disk, declare `slugs.es` with its exact slug.
#  · If NO ES pair exists, omit the `es:` line (intentional single-language).
slugs:
  en: "<slug-en-matching-filename>"
  es: "<slug-es-of-the-pair>"   # remove this line if there is no ES pair


# ─── 2. COMMERCIAL DATA (from the Viator PDF) ──────────────────────────────
# Human-readable duration as it appears on Viator.
duracion: "<readable duration — e.g., 1h 30min, 5 hours, 3 hours>"

# Same value as integer minutes. Used for schema.org duration.
duracionMinutos: <NUMBER without quotes — e.g., 90, 300>

# Minimum price PER PERSON as shown on Viator.
precioDesde: <NUMBER without quotes — e.g., 39>

# EUR by default.
moneda: "EUR"

# ISO 639-1 codes of the languages the activity is actually offered in.
# Only include languages the operator confirms. Be honest.
idiomas: ["en"]

# "viator" is the only active provider for now.
proveedor: "viator"

# Full Viator URL with tracking already built in.
#
# ⚠️  CRITICAL RULE — EN FICHA (this template):
# The URL must NOT include /es-ES/. It is a neutral URL with primaryLanguage=en
# in the query string so Viator displays in English. See
# docs/RUNBOOK-FICHAS.md section 2.
#
# Correct EN format:
#   https://www.viator.com/tours/{City}/{Product-Slug}/d566-{CODE}?pid=P00298823&mcid=42383&medium=link&primaryLanguage=en
#
# Wrong EN format (do NOT add /es-ES/ to EN listings):
#   https://www.viator.com/es-ES/tours/...
#
# Tracking is hardcoded here. The runtime code does NOT transform the path:
# it reads urlReserva literally from the .md.
urlReserva: "<Full Viator URL with ?pid=P00298823&mcid=42383&medium=link&primaryLanguage=en>"

# Cancellation: most Viator tours offer free 24h cancellation.
# Verify in the PDF. If not, set false and omit horasCancelacion.
cancelacionGratuita: <true|false>
horasCancelacion: <24 if applicable, omit otherwise>


# ─── 3. COMMERCIAL CONTENT ─────────────────────────────────────────────────
# Highlights: 3-5 short, concrete, verifiable selling points.
highlights:
  - "<Highlight 1 — e.g., Skip-the-line entry>"
  - "<Highlight 2 — e.g., Official English-speaking guide>"
  - "<Highlight 3>"
  - "<Highlight 4>"

# What's included. Pull from the "What's Included" block (✓ items) of the PDF.
incluye:
  - "<Included service 1>"
  - "<Included service 2>"
  - "<Included service 3>"

# What's not included (✗ items in the PDF).
noIncluye:
  - "<Not included 1 — e.g., Food and drinks>"
  - "<Not included 2 — e.g., Gratuities>"


# ─── 4. MEETING POINT ──────────────────────────────────────────────────────
# Structured meeting point for the MapaPuntoEncuentro component.
puntoEncuentro:
  texto: "<EXACT meeting address>"
  descripcionGuia: "<CONCRETE instruction — who meets you, where, how to spot them, arrive 15 min early, etc.>"
  # Decimal degrees. Pull from Google Maps.
  latitud: <COORDINATE — e.g., 40.4145>
  longitud: <COORDINATE — e.g., -3.6921>
  # 17 is a good default zoom (street-level recognition).
  zoom: 17


# ─── 5. PRACTICAL DETAILS ──────────────────────────────────────────────────
# Booleans per the Viator PDF. Omit any field that's unclear (don't invent).
detallesPracticos:
  ticketMovil: <true|false>
  confirmacionInmediata: <true|false>
  accesibleSilla: <true|false>
  edadMinima: <NUMBER — e.g., 0, 4, 18>
  mascotasPermitidas: <true|false>


# ─── 6. IMPORTANT INFO (3 columns) ─────────────────────────────────────────
informacionImportante:
  queTraer:
    - "<Item 1 — e.g., ID document>"
    - "<Item 2 — e.g., Comfortable shoes>"
  noAptoPara:
    - "<Restriction 1 — e.g., Large strollers>"
  aTenerEnCuenta:
    - "<Note 1 — e.g., Group size up to 12 people>"
    - "<Note 2 — e.g., Photography not allowed inside>"


# ─── 7. ACCESSIBILITY AND CANCELLATION ─────────────────────────────────────
# Single sentence on accessibility. If NOT accessible, say it clearly.
accesibilidad: "<ACCESSIBILITY sentence>"

# Cancellation policy in plain language. Be specific about timing.
politicaCancelacion: "<POLICY — e.g., Cancel free up to 24 hours before the experience for a full refund.>"


# ─── 8. FAQ ────────────────────────────────────────────────────────────────
# 3-5 real questions a traveler would ask BEFORE booking.
# Operational ones (price, duration, language, accessibility, food).
# No marketing fluff.
preguntasFrecuentes:
  - pregunta: "<Question 1>"
    respuesta: "<Clear, honest answer. No marketing.>"
  - pregunta: "<Question 2>"
    respuesta: "<Specific answer with numbers if applicable.>"
  - pregunta: "<Question 3>"
    respuesta: "<Answer>"


# ─── 9. RELATED ACTIVITIES ─────────────────────────────────────────────────
# Slugs of OTHER published activities in the same city and SAME language
# shown in the "Other ways to visit X" carousel.
# Empty list [] if not applicable. Unpublished slugs are dropped silently.
variantes: ["<related-activity-slug-1>", "<related-activity-slug-2>"]


# ─── 10. EDITORIAL (what makes ExploraSpain different) ─────────────────────
# Honest editorial opinion. The most important field: WHY someone should
# book this and WHY they shouldn't. NO marketing.
opinionEditorial: |
  <PARAGRAPH 1 — Who this is the right call for, and why.>

  <PARAGRAPH 2 — The real catch, the nuance, what marketing won't tell you.>


# ─── 11. CATEGORIZATION AND SEO ────────────────────────────────────────────
# One of 6 categories. MUST match CATEGORIAS_ACTIVIDAD in lib/actividades.ts.
# Category keys are invariant Spanish (do not translate them):
# · cultural     → museums, guided tours, monuments
# · gastronomico → tapas, wine tastings, regional food
# · aireLibre    → hiking, nature parks, kayaking
# · nocturno     → flamenco, concerts, nightlife
# · excursion    → day trips from the city
# · familiar     → kid-focused activities
categoria: "<cultural|gastronomico|aireLibre|nocturno|excursion|familiar>"

# 5-8 lowercase keywords, no accents or special characters.
# Mix high-volume generics with high-intent specifics. Use English keywords.
keywords: ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]


# ─── 12. IMAGES ────────────────────────────────────────────────────────────
# Images must EXIST at /public/images/actividades/{ciudad}/{lugar}/ before
# committing. Format: WebP, 1600×1200 px, quality 80, ~200 KB.
# Images can be shared with the ES counterpart of the pair.
imagen: "/images/actividades/<ciudad>/<lugar>/<hero>.webp"
imagenAlt: "<Honest, descriptive ALT — not decorative>"

galeria:
  - src: "/images/actividades/<ciudad>/<lugar>/<image-1>.webp"
    alt: "<ALT image 1>"
  - src: "/images/actividades/<ciudad>/<lugar>/<image-2>.webp"
    alt: "<ALT image 2>"
  - src: "/images/actividades/<ciudad>/<lugar>/<image-3>.webp"
    alt: "<ALT image 3>"


# ─── 13. AGGREGATE RATING (from the Viator PDF) ────────────────────────────
# Decimal with a dot (4.8, not 4,8). Frontend formats per locale.
ratingProveedor: <NUMBER with decimal point — e.g., 4.8>

# Integer review count exactly as shown on Viator.
# If <10 reviews, consider NOT publishing yet (low signal of quality).
numeroOpiniones: <INTEGER — e.g., 549>


# ─── 14. STATUS ────────────────────────────────────────────────────────────
# Default false. Only set to true when all fields above are filled, images
# exist under /public/, the body Markdown below is written, and `npm run build`
# passes locally (including the parejas audit).
publicada: false

# destacada=true puts this activity in the city's "Featured" carousel.
# Limit to 1-2 featured activities per city.
destacada: false

# ISO date YYYY-MM-DD. Publication date, not modification date.
fecha: "<YYYY-MM-DD>"

# ─── ✅ PRE-COMMIT CHECKLIST ───────────────────────────────────────────────
# Before flipping `publicada: false` to `publicada: true`, confirm:
#
#  [ ] Guide language verified on Viator (English literal or "English and X more").
#  [ ] urlReserva does NOT include /es-ES/ and DOES include primaryLanguage=en.
#  [ ] urlReserva has all 4 params: pid=P00298823, mcid=42383, medium=link, primaryLanguage=en.
#  [ ] Commercial data sourced from Viator PDF, nothing invented.
#  [ ] If ES pair exists, slugs.es declared and ES file present on disk.
#  [ ] Valid category from lib/actividades.ts (cultural|gastronomico|aireLibre|nocturno|excursion|familiar).
#  [ ] Images exist in /public/images/actividades/{city}/{place}/.
#  [ ] `npm run build` passes locally (incl. pair audit).
#
# Full runbook: docs/RUNBOOK-FICHAS.md
---

## What you'll see

<2-3 sentences that frame the product. What it covers, what stands out.
No empty adjectives. Concrete data wherever possible.>

- **<Theme block 1>:** <concrete description with examples>.
- **<Theme block 2>:** <concrete description with examples>.
- **<Theme block 3>:** <concrete description with examples>.

## How it works

<Operational narrative: where the guide meets you, how you enter, what
happens at the end. 2-3 paragraphs. The goal is that the reader knows
EXACTLY what's going to happen on the day of the tour and reduces
booking uncertainty.>

<If there are important details — audio guides, taxi included, free
access after the tour — mention them here in bold.>

## Who I'd recommend it to

- If <profile 1 — e.g., it's your first time in Madrid>.
- If <profile 2 — e.g., you're short on time>.
- If <profile 3 — e.g., you prefer a small-group setting>.

## Who I would NOT recommend it to

- If <contraindication 1>. <Concrete alternative>.
- If <contraindication 2>. <Concrete alternative>.
- If <contraindication 3>. <Concrete alternative>.
