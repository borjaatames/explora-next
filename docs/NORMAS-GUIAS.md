# ExploraSpain · Normas de estructura de las guías

Obligatorio para TODAS las guías (`content/guias/<idioma>/<ciudad>/*.md`), en los 6 idiomas, nuevas y revisadas. Aprobado por Borja el 7 de noviembre de 2026 (piloto: `madrid/el-escorial-entradas-agotadas`).

## Principio

Una guía es información práctica e interesante para el viajero, no un medio para vender. Tiene que merecer la pena leerla aunque no se reserve nada. Lo importante va arriba (pirámide invertida): la mayoría de la gente escanea y la primera pantalla decide si sigue leyendo.

## Estructura (siempre en este orden)

1. **Título y foto** (hero). En PC, la foto no debe tapar la primera pantalla: el comienzo de la descripción tiene que verse sin bajar.
2. **Descripción** (campo `intro` del frontmatter, 50-75 palabras). Qué es y por qué merece la pena:
   - Guía de monumento: qué es, qué hay dentro, a qué distancia está y cuánto dura la visita.
   - Guía de ciudad o itinerario («Madrid en 3 días», «qué ver en…»): la ciudad y lo mucho que se puede ver en ella.
   - Guía de tema (flamenco, tapas, Navidad, con niños…): ese tema en esa ciudad.
   - Admite **negrita**. Sin precios (van en la respuesta corta) y sin lenguaje de venta.
3. **Respuesta corta** (campo `respuestaCorta`, máximo 60 palabras): los datos clave de la pregunta de la guía (precio, día de cierre, horario, qué hacer si está agotado). Sin comillas invertidas.
4. **La guía**: 4-6 apartados (H2) por orden de importancia para el viajero.
   - Monumento: Qué vas a ver · Precios y horarios · Entrada gratis (si existe) · Si está agotado · Cómo llegar · Consejos.
   - Ciudad/itinerario: Plan por días (o por zonas) · Cómo moverse · Dónde comer / dormir (si encaja) · Consejos.
   - Tema: los apartados que pida el tema, siempre con datos prácticos (dónde, cuándo, cuánto).
   - Párrafos cortos, listas y negritas en los datos clave. Nada de relleno.
5. **Preguntas frecuentes** (campo `faq`, 4-6 preguntas reales).
6. **Reservas al final**: las opciones («Nuestras 3 opciones», privados y carrusel) las pinta la página después de la guía. Dentro del texto, como mucho UNA actividad (`[actividad: slug]`) y solo donde resuelve algo concreto (p. ej. «excursión con la entrada incluida» en el apartado «Si está agotado»). Prohibido abrir el texto con tablas de botones de «Reservar».

## Tamaño

Google no tiene un número de palabras preferido: escribir para llegar a una cifra es una señal de alarma. Lo que cuenta es responder bien. Aun así, como guía:

| Tipo | Palabras (cuerpo) | Lectura |
|---|---|---|
| Monumento (entradas, cómo visitar) | 600-1.000 | 3-5 min |
| Ciudad o itinerario | 1.000-1.500 (nunca más de 1.800) | 5-7 min |
| Descripción (`intro`) | 50-75 | — |
| Respuesta corta | máx. 60 | — |

Por qué: el tiempo de lectura total sube hasta unos 7 minutos y luego baja (Medium); más de la mitad de las páginas que cita la IA de Google tienen menos de 1.000 palabras (Ahrefs, 174.000 páginas); en nuestros datos de GA4 (ago-nov 2026) guías de igual longitud iban de 1 s a 2 min 25 s según lo que había arriba, no según su extensión.

## Datos

- Solo datos comprobados en fuentes oficiales o en la propia guía/página de atracción. Nada inventado.
- `datosComprobados` con la fecha de la última comprobación.
- Las versiones en otros idiomas siguen exactamente la misma estructura (traducción natural, no literal).

## Técnico

- `intro`: lo lee `lib/guias.ts` y lo pinta `components/guia/IntroGuia.tsx`.
- Orden de la página: `app/(es-shell)/(es)/guias/[categoria]/[slug]/page.tsx` y `app/[lang]/(l)/guides/[categoria]/[slug]/page.tsx` (descripción, respuesta corta y enlace a la atracción dentro de la columna de lectura, con el índice al lado; reservas después del artículo).
