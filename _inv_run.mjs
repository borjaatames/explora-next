import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT = path.join(process.cwd(), "content", "actividades");
const viaCode = u => (u.match(/\/d\d+-([A-Za-z0-9]+)/)||[])[1] || null;
const gygCode = u => (u.match(/-t(\d+)/)||[])[1] ? "t"+(u.match(/-t(\d+)/)[1]) : null;
function walk(d, fn){ if(!fs.existsSync(d))return; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory())walk(p,fn); else if(e.name.endsWith(".md")&&!e.name.startsWith("_"))fn(p);} }
const map = new Map();
for(const idi of ["es","en"]) walk(path.join(ROOT,idi),f=>{
  let d; try{ d=matter(fs.readFileSync(f,"utf8")).data; }catch{ return; }
  const prov=String(d.proveedor||"").toLowerCase();
  if(prov!=="viator"&&prov!=="getyourguide")return;
  if(d.publicada===false)return;
  const u=String(d.urlReserva||"");
  if(!u)return;
  const code = prov==="viator"? viaCode(u) : gygCode(u);
  if(!code)return;
  const canc = d.cancelacionGratuita ? `gratis ${d.horasCancelacion||24}h` : "no reembolsable";
  const rec = { prov, ciudad:d.ciudad||"", code, slug:d.slug||path.basename(f,".md"),
    precio:d.precioDesde??"", moneda:d.moneda||"EUR", rating:d.ratingProveedor??"",
    op:d.numeroOpiniones??"", canc, url:u.split("?")[0] };
  const k=prov+"|"+code;
  if(!map.has(k)) map.set(k,rec);
});
const rows=[...map.values()].sort((a,b)=> a.prov.localeCompare(b.prov)||a.ciudad.localeCompare(b.ciudad)||a.code.localeCompare(b.code));
const via=rows.filter(r=>r.prov==="viator"), gyg=rows.filter(r=>r.prov==="getyourguide");
console.log("TOTAL:",rows.length,"| viator:",via.length,"| gyg:",gyg.length);
// write CSV
const esc=s=>`"${String(s).replace(/"/g,'""')}"`;
const csv=["proveedor,ciudad,codigo,slug,precio_desde,moneda,rating,opiniones,cancelacion,url",
  ...rows.map(r=>[r.prov,r.ciudad,r.code,r.slug,r.precio,r.moneda,r.rating,r.op,r.canc,r.url].map(esc).join(","))].join("\n");
fs.writeFileSync("/tmp/inventario.csv",csv);
fs.writeFileSync("/tmp/rows.json",JSON.stringify({via,gyg},null,0));
console.log("--- viator by city ---");
const byc=x=>{const m={};x.forEach(r=>m[r.ciudad]=(m[r.ciudad]||0)+1);return m;};
console.log(JSON.stringify(byc(via))); console.log("--- gyg by city ---"); console.log(JSON.stringify(byc(gyg)));
