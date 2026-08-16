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
  const u=String(d.urlReserva||""); if(!u)return;
  const code = prov==="viator"? viaCode(u) : gygCode(u); if(!code)return;
  const canc = d.cancelacionGratuita ? `gratis ${d.horasCancelacion||24}h` : "no reembolsable";
  const pub = d.publicada===false ? "no" : "si";
  const rec = { prov, ciudad:d.ciudad||"", code, precio:d.precioDesde??"", moneda:d.moneda||"EUR",
    rating:d.ratingProveedor??"", op:d.numeroOpiniones??"", canc, pub, url:u.split("?")[0] };
  const k=prov+"|"+code;
  const prev=map.get(k);
  if(!prev || (prev.pub==="no" && pub==="si")) map.set(k,rec);
});
const rows=[...map.values()].sort((a,b)=> a.prov.localeCompare(b.prov)||a.ciudad.localeCompare(b.ciudad)||a.code.localeCompare(b.code));
const esc=s=>`"${String(s).replace(/"/g,'""')}"`;
const csv=["proveedor,ciudad,codigo,precio_desde,moneda,rating,opiniones,cancelacion,publicada,url",
  ...rows.map(r=>[r.prov,r.ciudad,r.code,r.precio,r.moneda,r.rating,r.op,r.canc,r.pub,r.url].map(esc).join(","))].join("\n");
fs.writeFileSync("/tmp/inventario-2026-07-13.csv",csv);
const via=rows.filter(r=>r.prov==="viator"), gyg=rows.filter(r=>r.prov==="getyourguide");
console.log("TOTAL:",rows.length,"| viator:",via.length,"(pub:",via.filter(r=>r.pub==="si").length,") | gyg:",gyg.length,"(pub:",gyg.filter(r=>r.pub==="si").length,")");
