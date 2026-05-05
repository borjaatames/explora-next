# ExploraSpain — Web

Proyecto Next.js 14 (App Router + TypeScript + Tailwind) para
**ExploraSpain**, operado por SKYWARD PARTNERS, S.L.

---

## Arrancar en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Y ajusta los valores. La importante:

- `NEXT_PUBLIC_ALLOW_INDEXING=false` → mantén en `false` hasta tener
  varias guías publicadas. Cuando esté en `true`, robots.txt y
  metadatos permiten que Google indexe.

## Estructura del proyecto

```
app/
  layout.tsx              # Layout raíz (Navbar + Footer)
  page.tsx                # Home
  globals.css             # Estilos globales (incluye .prose-guia)
  sitemap.ts              # Sitemap dinámico
  robots.ts               # Robots dinámico (respeta ALLOW_INDEXING)
  guias/
    page.tsx              # Listado /guias
    [categoria]/[slug]/
      page.tsx            # Página de guía individual
  sobre-nosotros/page.tsx
  contacto/page.tsx
  aviso-legal/page.tsx
  privacidad/page.tsx
  cookies/page.tsx
components/
  layout/
    Navbar.tsx
    Footer.tsx
content/
  guias/
    madrid/
      madrid-en-3-dias.md   # Guías editoriales en Markdown
  actividades/
    _TEMPLATE.md            # Plantilla ficha ES
    _TEMPLATE.en.md         # Plantilla ficha EN
    es/                     # Fichas en español
    en/                     # Fichas en inglés
docs/
  RUNBOOK-FICHAS.md         # Fuente de verdad para crear fichas
lib/
  guias.ts                # Lectura y procesado de Markdown
  actividades.ts          # Lectura de fichas de actividades
  afiliados.ts            # Construcción de URLs de afiliado
```

## Cómo crear una nueva guía

1. Crea un archivo `.md` dentro de `content/guias/{categoria}/{slug}.md`.
   Por ejemplo: `content/guias/madrid/madrid-gratis.md`.
2. Empieza con frontmatter YAML:

```yaml
---
titulo: "Madrid gratis: 12 planes sin gastar un euro"
descripcion: "Lo mejor que se puede hacer en Madrid sin pagar entrada."
categoria: "madrid"
slug: "madrid-gratis"
fecha: "2026-05-10"
autor: "Equipo ExploraSpain"
publicada: true
destacada: false
keywords:
  - "madrid gratis"
  - "que hacer en madrid sin gastar"
---
```

3. Después del frontmatter, escribe el contenido en Markdown.
4. Reinicia `npm run dev` y la guía aparecerá automáticamente en
   `/guias` y en `/guias/madrid/madrid-gratis`.

**`publicada: false`** oculta la guía aunque exista el fichero.

## Cómo crear una nueva ficha de actividad

**Antes de empezar**, lee el runbook editorial:

📘 **[docs/RUNBOOK-FICHAS.md](./docs/RUNBOOK-FICHAS.md)** — fuente de verdad
para crear, editar y publicar fichas. Incluye el contrato de URLs de afiliado
(crítico: ES lleva `/es-ES/`, EN lleva `primaryLanguage=en`), el gate de
verificación de idioma del guía, y el checklist pre-commit.

Después, copia la plantilla:

- ES: `content/actividades/_TEMPLATE.md` → `content/actividades/es/{ciudad}/{slug}.md`
- EN: `content/actividades/_TEMPLATE.en.md` → `content/actividades/en/{city}/{slug}.md`

## Despliegue

Conectado a Vercel. Cada `git push` a `main` despliega
automáticamente.

## Datos de la empresa

Operado por **SKYWARD PARTNERS, S.L.** (NIF B26629576), Calle
Castelló 117, 28006 Madrid. Email: contacto@exploraspain.com.
