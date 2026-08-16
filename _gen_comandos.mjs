import fs from "fs";

const rows = JSON.parse(fs.readFileSync("/tmp/rows.json", "utf8"));

function batches(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function fmtRow(r) {
  const resStr = r.opiniones !== "" && r.opiniones != null ? `${r.opiniones}res` : "res";
  return `  - ${r.codigo} | ${r.ciudad} | precio ${r.precio_desde} ${r.moneda} | rating ${r.rating || ""}/${resStr} | cancelación: ${r.cancelacion} | ${r.url}`;
}

// ---------- VIATOR ----------
const viator = rows.filter(r => r.proveedor === "viator").sort((a,b)=> a.ciudad === b.ciudad ? a.codigo.localeCompare(b.codigo) : a.ciudad.localeCompare(b.ciudad));
const viatorPub = viator.filter(r => r.publicada === "si");

let out1 = `=== COMANDO — VIATOR (pégalo en la extensión Claude del navegador) ===\n\n`;
if (viatorPub.length === 0) {
  out1 += `NOTA: esta semana sigue sin haber productos Viator publicados en las landings (las ${viator.length} fichas Viator están como "publicada: false"). No hay nada vivo que verificar en Viator ahora mismo. Si republicas alguna, usa el patrón de abajo.\n\n`;
} else {
  out1 += `NOTA: hay ${viatorPub.length} productos Viator publicados esta semana (de ${viator.length} fichas totales). Verifica esos primero.\n\n`;
}
out1 += `Eres mi verificador de condiciones de producto en VIATOR. Vamos a comprobar, UNO POR UNO, si el precio, el rating, el nº de reseñas y la política de cancelación de cada producto siguen coincidiendo con lo guardado en mi web.\n\n`;
out1 += `REGLAS DE RITMO (CRÍTICAS — Viator banea a los bots que van rápido, ve MUY despacio):\n`;
out1 += `- Abre y verifica UN producto cada vez. Espera a que cargue del todo antes de leer.\n`;
out1 += `- Pausa de VARIOS segundos entre producto y producto. Nunca varios a la vez.\n`;
out1 += `- Si aparece captcha, "verifica que eres humano" o cualquier bloqueo: PARA INMEDIATAMENTE, no recargues, y dime en qué producto te quedaste.\n`;
out1 += `- Solo leer la ficha pública: ni reservar ni iniciar sesión.\n\n`;
out1 += `PARA CADA PRODUCTO devuélveme exactamente esta línea:\n`;
out1 += `  CÓDIGO | precio_actual | rating_actual | nº_reseñas_actual | cancelación_actual (gratis Xh / no reembolsable)\n`;
out1 += `Marca con ⚠️ lo que NO coincida con el valor "guardado".\n\n`;
out1 += `Hazlo por LOTES de máx. 15. Al terminar un lote dame la tabla y espera mi "sigue".\n\n`;
out1 += `PRODUCTOS (REFERENCIA — actualmente DESPUBLICADOS, ${viator.length}). Formato: CÓDIGO | ciudad | precio | rating/reseñas | cancelación | URL\n\n`;

batches(viator, 15).forEach((b, i) => {
  out1 += `--- LOTE V${i+1} ---\n`;
  b.forEach(r => out1 += fmtRow(r) + "\n");
  out1 += "\n";
});

// ---------- GETYOURGUIDE ----------
const gyg = rows.filter(r => r.proveedor === "getyourguide" && r.publicada === "si").sort((a,b)=> a.ciudad === b.ciudad ? a.codigo.localeCompare(b.codigo) : a.ciudad.localeCompare(b.ciudad));
const gygTotal = rows.filter(r => r.proveedor === "getyourguide").length;

let out2 = `=== COMANDO — GETYOURGUIDE (pégalo en la extensión Claude del navegador) ===\n\n`;
out2 += `Eres mi verificador de condiciones de producto en GetYourGuide. Vamos a comprobar, UNO POR UNO, si el precio "desde", el rating, el nº de reseñas y la política de cancelación de cada producto siguen coincidiendo con lo que tengo guardado en mi web.\n\n`;
out2 += `REGLAS DE RITMO (importantes):\n`;
out2 += `- Abre y verifica UN producto cada vez. Espera a que la página cargue del todo antes de leer.\n`;
out2 += `- Deja una pausa de unos segundos entre producto y producto. No abras varios a la vez.\n`;
out2 += `- Si aparece un captcha o cualquier bloqueo: PARA, no recargues, y dime en qué producto te quedaste.\n`;
out2 += `- No hace falta reservar ni iniciar sesión: solo leer la ficha pública.\n\n`;
out2 += `PARA CADA PRODUCTO devuélveme exactamente esta línea:\n`;
out2 += `  CÓDIGO | precio_actual | rating_actual | nº_reseñas_actual | cancelación_actual (gratis Xh / no reembolsable)\n`;
out2 += `Marca con ⚠️ cualquier dato que NO coincida con el valor "guardado" que te paso.\n\n`;
out2 += `Hazlo por LOTES. Al terminar un lote dame la tabla de ese lote y espera mi "sigue" antes del siguiente.\n\n`;
out2 += `PRODUCTOS A VERIFICAR (${gyg.length} en total, de ${gygTotal} fichas GetYourGuide en el repo — el resto está despublicado). Formato guardado: CÓDIGO | ciudad | precio | rating/reseñas | cancelación | URL\n\n`;

batches(gyg, 15).forEach((b, i) => {
  out2 += `--- LOTE G${i+1} ---\n`;
  b.forEach(r => out2 += fmtRow(r) + "\n");
  out2 += "\n";
});

fs.writeFileSync("/tmp/comandos-verificacion-sem-2026-07-28.txt", out1 + "\n" + out2, "utf8");
console.log("Viator:", viator.length, "publicados:", viatorPub.length);
console.log("GYG publicados:", gyg.length, "de", gygTotal);
console.log("bytes:", (out1+out2).length);
