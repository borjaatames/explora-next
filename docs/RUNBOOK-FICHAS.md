---
title: Runbook editorial de fichas de actividad
ultimaRevision: 2026-05-05
proposito: Fuente de verdad para crear cualquier ficha de actividad en ExploraSpain.
---

# Runbook · Fichas de actividad

Este documento es la **única fuente de verdad** para crear, editar y publicar
fichas de actividad en ExploraSpain. Si algo de aquí entra en conflicto con
otro documento del repo, **gana este**.

> **Cuándo consultarlo:** antes de empezar cualquier ficha nueva, y siempre
> antes de hacer `git push` de una ficha modificada.

---

## 1. Gate previo · Verificar idioma del guía en Viator

**Antes de redactar una sola línea**, abre la página de Viator del producto
y verifica el idioma del guía. La regla es estricta:

| Lo que dice Viator                       | Qué hacer                                  |
|------------------------------------------|--------------------------------------------|
| "Español" (literal)                      | Publicar ficha **ES**.                     |
| "Inglés" (literal)                       | Publicar ficha **EN**.                     |
| "Español y 1 más" / "Español y X más"    | Publicar **ES**. Si confirmas que el "más" es inglés, publicar también **EN** y declarar pareja. |
| "Inglés y 1 más" sin desplegar           | **Descartar**. No asumir que incluye español. |
| "Italiano, francés…" sin español/inglés  | **Descartar**.                             |

**Regla de oro:** el idioma de la ficha lo determina el idioma del **guía del
tour**, no el idioma del visitante de la web. Una ficha ES describe un tour
con guía en español; una ficha EN describe un tour con guía en inglés. Si
ambos existen → 2 fichas + pareja declarada en `slugs:`.

---

## 2. Construcción de la URL de afiliado · Viator

Esta es la sección que blinda el bug del 4-5 mayo 2026 (URLs Prado ES sin
`/es-ES/`). **Lee este apartado cada vez** que crees una ficha hasta que lo
tengas mecanizado.

### 2.1 Formato exacto según idioma de la ficha

**Ficha ES** → la URL DEBE incluir `/es-ES/` en el path:

```
https://www.viator.com/es-ES/tours/{Ciudad}/{slug-del-producto}/d566-{CÓDIGO}?pid=P00298823&mcid=42383&medium=link
```

**Ficha EN** → la URL es neutra (sin prefijo de idioma) + `primaryLanguage=en`:

```
https://www.viator.com/tours/{Ciudad}/{slug-del-producto}/d566-{CÓDIGO}?pid=P00298823&mcid=42383&medium=link&primaryLanguage=en
```

### 2.2 Cómo construirla paso a paso

1. **Copia la URL** que te da Viator desde la página del producto.
2. **Quita** cualquier query param que traiga (todo lo que esté después de `?`).
3. **Si es ficha ES** y la URL no tiene `/es-ES/` justo después de `viator.com`,
   **insértalo a mano**. Ejemplo:
   - Recibes: `https://www.viator.com/tours/Madrid/Prado/d566-8512P83`
   - Quedas:  `https://www.viator.com/es-ES/tours/Madrid/Prado/d566-8512P83`
4. **Añade el tracking** según el idioma de la ficha (ver tablas arriba).
5. **Pega el resultado** en el campo `urlReserva` del frontmatter.

### 2.3 Por qué esto importa

El código (`lib/afiliados.ts → construirUrlViator`) **no transforma el path**.
Lee el `urlReserva` del `.md` literal y solo normaliza los query params. Si
escribes la URL ES sin `/es-ES/`, el usuario aterriza en Viator en inglés.
**El sistema confía en ti**: la línea de defensa es esta plantilla.

### 2.4 Verificación pre-commit

Después de pegar la URL, ejecuta esta comprobación mental:

- [ ] Si la ficha está en `content/actividades/es/...`, la URL contiene `/es-ES/`.
- [ ] Si la ficha está en `content/actividades/en/...`, la URL **no** contiene
      `/es-ES/` y sí contiene `primaryLanguage=en`.
- [ ] Los tres parámetros básicos están presentes: `pid=P00298823`,
      `mcid=42383`, `medium=link`.

---

## 3. Datos comerciales · Sacar todo del PDF de Viator

**No inventar nada**. Si un dato no está en el PDF oficial de Viator, no se
publica. La transparencia es parte del producto.

| Campo del frontmatter | De dónde sale en Viator                              |
|-----------------------|------------------------------------------------------|
| `precioDesde`         | "From €X" en la cabecera del producto.              |
| `duracion` / `duracionMinutos` | Bloque "Duration".                          |
| `idiomas`             | "Live guides" o "Live tour guide". Solo los que estén literal. |
| `ratingProveedor`     | Estrella agregada (decimal con punto: `4.8`, no `4,8`). |
| `numeroOpiniones`     | Número entero de reseñas. Si <10, considerar no publicar todavía. |
| `cancelacionGratuita` | Bloque "Cancellation policy".                       |
| `incluye` / `noIncluye` | Bloque "What's included" (✓ y ✗ literal).        |

**Prohibido:**
- Copiar opiniones individuales (plagio + no somos el operador).
- Inventar tamaños de grupo, número de paradas, o cualquier dato no
  documentado.
- Usar imágenes de Viator (copyright). Solo Pexels / Unsplash / Pixabay /
  fotos propias.

---

## 4. Parejas ES ↔ EN

Si una actividad existe en los dos idiomas, **debe declararse como pareja**
en el bloque `slugs:` de ambos archivos.

**En la ficha ES** (`content/actividades/es/madrid/tour-prado.md`):
```yaml
slugs:
  es: "tour-prado"
  en: "prado-tour"
```

**En la ficha EN** (`content/actividades/en/madrid/prado-tour.md`):
```yaml
slugs:
  en: "prado-tour"
  es: "tour-prado"
```

El `audit-parejas` (prebuild) valida la consistencia. Si una ficha es
single-language intencional, **omitir la línea del idioma ausente** (no
poner `null`, no poner `""`).

---

## 5. Categorización

Una de las 6 categorías declaradas en `lib/actividades.ts`:

| Slug             | Para qué                                          |
|------------------|---------------------------------------------------|
| `cultural`       | Museos, tours guiados, monumentos.                |
| `gastronomico`   | Tapas, cata de vinos, comida regional.            |
| `aireLibre`      | Senderismo, parques naturales, kayak.             |
| `nocturno`       | Flamenco, conciertos, vida nocturna.              |
| `excursion`      | Escapadas de día desde la ciudad.                 |
| `familiar`       | Actividades pensadas explícitamente para niños.   |

Si dudas entre dos, gana la **intención del visitante** (¿qué va a buscar?),
no la naturaleza del producto.

---

## 6. Imágenes

- **Formato**: WebP, 1600×1200 px, calidad 80, ~150-250 KB.
- **Ubicación**: `/public/images/actividades/{ciudad}/{lugar}/`.
- **Naming**: `hero.webp`, `01.webp`, `02.webp`, `03.webp`.
- **Compartidas**: ES y EN de una pareja pueden compartir las mismas imágenes.
- **Alt text**: descriptivo y honesto, **nunca decorativo vacío**.
- **Pre-commit**: las imágenes deben existir en disco antes del commit, si
  no la galería se rompe en runtime.

---

## 7. Tono editorial

### Para fichas ES
- Hispanohablante adulto. Sin paternalismo.
- Comparativas con "ir por libre" cuando aporten criterio.
- Evitar frases tipo "descubre la auténtica cultura española".
- `opinionEditorial` debe decir **para quién sí y para quién no**. No marketing.

### Para fichas EN
- Tourist-facing English. Concise. Concrete.
- No "discover the authentic spirit of Spain". No "magical journey".
- Same "for whom yes / for whom no" structure.

---

## 8. Checklist pre-commit (obligatorio)

Antes de `git add` + `git commit` de cualquier ficha nueva o modificada:

- [ ] **Idioma del guía verificado** en Viator (sección 1).
- [ ] **URL de afiliado** correcta para el idioma de la ficha (sección 2.4).
- [ ] **Datos sacados del PDF** de Viator, no inventados (sección 3).
- [ ] **Pareja declarada** en `slugs:` si existe versión recíproca (sección 4).
- [ ] **Categoría válida** declarada en `lib/actividades.ts` (sección 5).
- [ ] **Imágenes existen** en disco con el naming correcto (sección 6).
- [ ] **`publicada: true`** solo si todo lo anterior está OK.
- [ ] **`npm run build` pasa local** sin errores (incluye audit de parejas).

---

## 9. Hueco para futuros proveedores

A día de hoy solo `proveedor: "viator"` está activo. Cuando se incorporen
Civitatis o GetYourGuide, este runbook se ampliará con su sección equivalente
a la 2 (formato exacto de URL + tracking). Hasta entonces:

- **Civitatis**: pendiente de aprobación afiliado. Ver pendiente nº23 en handoff.
- **GetYourGuide Partner Program**: pendiente solicitud. Ver pendiente nº24.
- **Tiqets vía Awin**: evaluar al llegar a Barcelona.

No publicar fichas con un `proveedor` distinto a `"viator"` hasta que el
código del proveedor correspondiente esté en `lib/afiliados.ts`.

---

## 10. Si algo de este runbook está obsoleto

Actualízalo en el mismo commit que cambie la realidad. El runbook **vale lo
que vale su frescura**. Si el contrato de URLs cambia mañana, este archivo
debe cambiar mañana, no el mes que viene.
