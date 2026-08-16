import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT = path.join(process.cwd(), "content");
const gygCode = (u:string)=>{const m=(u||"").match(/-t(\d+)/);return m?m[1]:null;};
const viaCode = (u:string)=>{const m=(u||"").match(/\/d\d+-([A-Za-z0-9]+)/);return m?m[1]:null;};
function walk(dir:string, fn:(f:string)=>void){ if(!fs.existsSync(dir))return;
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);
  if(e.isDirectory())walk(p,fn); else if(e.name.endsWith(".md")&&!e.name.startsWith("_"))fn(p);}}
type Rec={prov:string;code:string;lang:string;precio:number|null;url:string;ref:string};
const out:Rec[]=[];
for(const idi of ["es","en"]){
 walk(path.join(ROOT,"actividades",idi),(f)=>{
  const {data}=matter(fs.readFileSync(f,"utf8")) as any;
  const u=data.urlReserva as string; if(!u)return;
  const prov=u.includes("viator")?"viator":u.includes("getyourguide")?"gyg":null; if(!prov)return;
  const code=prov==="viator"?viaCode(u):gygCode(u); if(!code)return;
  out.push({prov,code,lang:idi,precio:data.precioDesde??null,url:u,ref:`ficha/${idi}/${path.basename(f)}`});
 });
}
walk(path.join(ROOT,"sem"),(f)=>{
 const lang=f.includes(`${path.sep}en${path.sep}`)?"en":"es";
 const {data}=matter(fs.readFileSync(f,"utf8")) as any;
 for(const t of (data.tours as any[])||[]){
  const u=(t.viator_url as string)||(t.url_reserva as string)||""; if(!u)continue;
  const prov=u.includes("viator")?"viator":u.includes("getyourguide")?"gyg":null; if(!prov)continue;
  const code=prov==="viator"?(viaCode(u)||t.viator_product_id):gygCode(u); if(!code)continue;
  out.push({prov,code,lang,precio:t.precio_desde??null,url:u,ref:`sem/${lang}/${path.basename(f)}`});
 }
});
fs.writeFileSync("/tmp/productos.json",JSON.stringify(out,null,1));
const uniq=(p:string)=>new Set(out.filter(r=>r.prov===p).map(r=>r.code)).size;
console.log(`refs:${out.length} viator:${uniq("viator")} gyg:${uniq("gyg")}`);
