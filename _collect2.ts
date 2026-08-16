import fs from "fs"; import path from "path"; import matter from "gray-matter";
const OUT="/sessions/relaxed-zealous-sagan/mnt/outputs";
const ROOT = path.join(process.cwd(), "content");
function walk(dir:string, fn:(f:string)=>void){ if(!fs.existsSync(dir))return; for(const e of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,e.name); if(e.isDirectory())walk(p,fn); else if(e.name.endsWith(".md")&&!e.name.startsWith("_"))fn(p);}}
type Rec={prov:string;code:string;idi:string;precio:any;url:string;ref:string};
const rows:Rec[]=[];
const gygCode=(u:string)=>{const m=(u||"").match(/-t(\d+)/);return m?m[1]:null;};
const viaCode=(u:string)=>{const m=(u||"").match(/\/d\d+-([A-Za-z0-9]+)/);return m?m[1]:null;};
for(const idi of ["es","en"]){
  walk(path.join(ROOT,"actividades",idi),(f)=>{
    const {data}=matter(fs.readFileSync(f,"utf8")) as {data:any};
    const u=data.urlReserva as string; if(!u)return;
    const ref=`ficha/${idi}/${path.basename(f)}`;
    if(u.includes("getyourguide")){const c=gygCode(u); if(c)rows.push({prov:"GYG",code:c,idi,precio:data.precioDesde,url:u,ref});}
    else if(u.includes("viator")){const c=viaCode(u); if(c)rows.push({prov:"VIA",code:c,idi,precio:data.precioDesde,url:u,ref});}
  });
}
walk(path.join(ROOT,"sem"),(f)=>{
  const {data}=matter(fs.readFileSync(f,"utf8")) as {data:any};
  const idi=f.includes(path.sep+"en"+path.sep)?"en":"es";
  for(const t of (data.tours as any[])||[]){
    const u=(t.viator_url as string)||(t.url_reserva as string)||(t.gyg_url as string)||"";
    const ref=`sem/${idi}/${path.basename(f)}`;
    if(u.includes("getyourguide")){const c=gygCode(u); if(c)rows.push({prov:"GYG",code:c,idi,precio:t.precio_desde,url:u,ref});}
    else if(u.includes("viator")){const c=viaCode(u); if(c)rows.push({prov:"VIA",code:c,idi,precio:t.precio_desde,url:u,ref});}
  }
});
fs.writeFileSync(path.join(OUT,"rows.json"),JSON.stringify(rows));
// dedupe por prov+code, guardando una url por idioma
type Agg={prov:string;code:string;es?:Rec;en?:Rec;precios:Set<number>};
const m=new Map<string,Agg>();
for(const r of rows){const k=r.prov+":"+r.code;const a=m.get(k)||{prov:r.prov,code:r.code,precios:new Set<number>()};if(r.idi==="es"&&!a.es)a.es=r;if(r.idi==="en"&&!a.en)a.en=r;if(r.precio!=null&&Number.isFinite(Number(r.precio)))a.precios.add(Number(r.precio));m.set(k,a);}
const dedup=[...m.values()].map(a=>({prov:a.prov,code:a.code,precios:[...a.precios].sort((x,y)=>x-y),urlEs:a.es?.url||null,urlEn:a.en?.url||null}));
fs.writeFileSync(path.join(OUT,"dedup.json"),JSON.stringify(dedup));
console.log("dedup total:",dedup.length,"GYG:",dedup.filter(d=>d.prov==="GYG").length,"VIA:",dedup.filter(d=>d.prov==="VIA").length);
