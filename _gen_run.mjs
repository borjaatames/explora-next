import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT=path.join(process.cwd(),"content","actividades");
const viaCode=u=>(u.match(/\/d\d+-([A-Za-z0-9]+)/)||[])[1]||null;
const gygCode=u=>{const m=u.match(/-t(\d+)/);return m?"t"+m[1]:null;};
function walk(d,fn){if(!fs.existsSync(d))return;for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p,fn);else if(e.name.endsWith(".md")&&!e.name.startsWith("_"))fn(p);}}
const map=new Map();
for(const idi of ["es","en"])walk(path.join(ROOT,idi),f=>{let d;try{d=matter(fs.readFileSync(f,"utf8")).data;}catch{return;}
 const prov=String(d.proveedor||"").toLowerCase();if(prov!=="viator"&&prov!=="getyourguide")return;
 const u=String(d.urlReserva||"");if(!u)return;const code=prov==="viator"?viaCode(u):gygCode(u);if(!code)return;
 const canc=d.cancelacionGratuita?`gratis ${d.horasCancelacion||24}h`:"no reembolsable";
 const k=prov+"|"+code;if(map.has(k)){if(d.publicada===true)map.get(k).pub=true;return;}
 map.set(k,{prov,ciudad:d.ciudad||"",code,precio:d.precioDesde??"",moneda:d.moneda||"EUR",rating:d.ratingProveedor??"",op:d.numeroOpiniones??"",canc,url:u.split("?")[0],pub:d.publicada===true});});
const rows=[...map.values()].sort((a,b)=>a.ciudad.localeCompare(b.ciudad)||a.code.localeCompare(b.code));
const via=rows.filter(r=>r.prov==="viator"), gyg=rows.filter(r=>r.prov==="getyourguide");
const viaPub=via.filter(r=>r.pub), gygPub=gyg.filter(r=>r.pub);
// CSV (solo publicados = lo que está vivo)
const esc=s=>`"${String(s).replace(/"/g,'""')}"`;
const live=[...gygPub,...viaPub].sort((a,b)=>a.prov.localeCompare(b.prov)||a.ciudad.localeCompare(b.ciudad)||a.code.localeCompare(b.code));
fs.writeFileSync("/tmp/inventario.csv",["proveedor,ciudad,codigo,precio_desde,moneda,rating,opiniones,cancelacion,publicada,url",
 ...rows.map(r=>[r.prov,r.ciudad,r.code,r.precio,r.moneda,r.rating,r.op,r.canc,r.pub?"si":"no",r.url].map(esc).join(","))].join("\n"));
// batches de 15
function batches(arr,n=15){const o=[];for(let i=0;i<arr.length;i+=n)o.push(arr.slice(i,i+n));return o;}
function line(r){return `  - ${r.code} | ${r.ciudad} | precio ${r.precio} ${r.moneda} | rating ${r.rating}/${r.op}res | cancelación: ${r.canc} | ${r.url}`;}
const FECHA="2026-06-29";
// ---- COMANDO GYG ----
let g=`=== COMANDO — GETYOURGUIDE (pégalo en la extensión Claude del navegador) ===\n\n`;
g+=`Eres mi verificador de condiciones de producto en GetYourGuide. Vamos a comprobar, UNO POR UNO, si el precio "desde", el rating, el nº de reseñas y la política de cancelación de cada producto siguen coincidiendo con lo que tengo guardado en mi web.\n\n`;
g+=`REGLAS DE RITMO (importantes):\n- Abre y verifica UN producto cada vez. Espera a que la página cargue del todo antes de leer.\n- Deja una pausa de unos segundos entre producto y producto. No abras varios a la vez.\n- Si aparece un captcha o cualquier bloqueo: PARA, no recargues, y dime en qué producto te quedaste.\n- No hace falta reservar ni iniciar sesión: solo leer la ficha pública.\n\n`;
g+=`PARA CADA PRODUCTO devuélveme exactamente esta línea:\n  CÓDIGO | precio_actual | rating_actual | nº_reseñas_actual | cancelación_actual (gratis Xh / no reembolsable)\nMarca con ⚠️ cualquier dato que NO coincida con el valor "guardado" que te paso.\n\n`;
g+=`Hazlo por LOTES. Al terminar un lote dame la tabla de ese lote y espera mi "sigue" antes del siguiente.\n\n`;
g+=`PRODUCTOS A VERIFICAR (${gygPub.length} en total). Formato guardado: CÓDIGO | ciudad | precio | rating/reseñas | cancelación | URL\n`;
batches(gygPub).forEach((b,i)=>{g+=`\n--- LOTE G${i+1} ---\n`+b.map(line).join("\n")+"\n";});
fs.writeFileSync("/tmp/cmd_gyg.txt",g);
// ---- COMANDO VIATOR ----
let v=`=== COMANDO — VIATOR (pégalo en la extensión Claude del navegador) ===\n\n`;
if(viaPub.length===0){
 v+=`NOTA: esta semana NO hay productos Viator publicados en las landings (todas las fichas Viator están como "publicada: false"). No hay nada vivo que verificar en Viator ahora mismo. Si republicas alguna, usa el patrón de abajo.\n\n`;
}
v+=`Eres mi verificador de condiciones de producto en VIATOR. Vamos a comprobar, UNO POR UNO, si el precio, el rating, el nº de reseñas y la política de cancelación de cada producto siguen coincidiendo con lo guardado en mi web.\n\n`;
v+=`REGLAS DE RITMO (CRÍTICAS — Viator banea a los bots que van rápido, ve MUY despacio):\n- Abre y verifica UN producto cada vez. Espera a que cargue del todo antes de leer.\n- Pausa de VARIOS segundos entre producto y producto. Nunca varios a la vez.\n- Si aparece captcha, "verifica que eres humano" o cualquier bloqueo: PARA INMEDIATAMENTE, no recargues, y dime en qué producto te quedaste.\n- Solo leer la ficha pública: ni reservar ni iniciar sesión.\n\n`;
v+=`PARA CADA PRODUCTO devuélveme exactamente esta línea:\n  CÓDIGO | precio_actual | rating_actual | nº_reseñas_actual | cancelación_actual (gratis Xh / no reembolsable)\nMarca con ⚠️ lo que NO coincida con el valor "guardado".\n\n`;
v+=`Hazlo por LOTES de máx. 15. Al terminar un lote dame la tabla y espera mi "sigue".\n\n`;
const viaList = viaPub.length? viaPub : via; // si no hay publicados, lista de referencia (despublicados)
v+=`PRODUCTOS ${viaPub.length?`A VERIFICAR (${viaPub.length})`:`(REFERENCIA — actualmente DESPUBLICADOS, ${via.length})`}. Formato: CÓDIGO | ciudad | precio | rating/reseñas | cancelación | URL\n`;
batches(viaList).forEach((b,i)=>{v+=`\n--- LOTE V${i+1} ---\n`+b.map(line).join("\n")+"\n";});
fs.writeFileSync("/tmp/cmd_viator.txt",v);
console.log("GYG publicados:",gygPub.length,"| Viator publicados:",viaPub.length,"| Viator despublicados:",via.length-viaPub.length);
console.log("GYG por ciudad:",JSON.stringify(gygPub.reduce((m,r)=>(m[r.ciudad]=(m[r.ciudad]||0)+1,m),{})));
console.log("lotes GYG:",Math.ceil(gygPub.length/15),"| lotes Viator ref:",Math.ceil(viaList.length/15));
