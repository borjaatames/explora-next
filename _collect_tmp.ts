import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT = path.join(process.cwd(), "content");
function walk(dir:string, fn:(f:string)=>void){ if(!fs.existsSync(dir))return; for(const e of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,e.name); if(e.isDirectory())walk(p,fn); else if(e.name.endsWith(".md")&&!e.name.startsWith("_"))fn(p);}}
type Rec={prov:string;code:string;idi:string;precio:any;url:string};
const rows:Rec[]=[];
const gygCode=(u:string)=>{const m=(u||"").match(/-t(\d+)/);return m?m[1]:null;};
const viaCode=(u:string)=>{const m=(u||"").match(/\/d\d+-([A-Za-z0-9]+)/);return m?m[1]:null;};
for(const idi of ["es","en"]){
  walk(path.join(ROOT,"actividades",idi),(f)=>{
    const {data}=matter(fs.readFileSync(f,"utf8")) as {data:any};
    const u=data.urlReserva as string; if(!u)return;
    if(u.includes("getyourguide")){const c=gygCode(u); if(c)rows.push({prov:"GYG",code:c,idi,precio:data.precioDesde,url:u});}
    else if(u.includes("viator")){const c=viaCode(u); if(c)rows.push({prov:"VIA",code:c,idi,precio:data.precioDesde,url:u});}
  });
}
walk(path.join(ROOT,"sem"),(f)=>{
  const {data}=matter(fs.readFileSync(f,"utf8")) as {data:any};
  const idi=f.includes(path.sep+"en"+path.sep)?"en":"es";
  for(const t of (data.tours as any[])||[]){
    const u=(t.viator_url as string)||(t.url_reserva as string)||(t.gyg_url as string)||"";
    if(u.includes("getyourguide")){const c=gygCode(u); if(c)rows.push({prov:"GYG",code:c,idi,precio:t.precio_desde,url:u});}
    else if(u.includes("viator")){const c=viaCode(u); if(c)rows.push({prov:"VIA",code:c,idi,precio:t.precio_desde,url:u});}
  }
});
const gyg=new Set(rows.filter(r=>r.prov==="GYG").map(r=>r.code));
const via=new Set(rows.filter(r=>r.prov==="VIA").map(r=>r.code));
console.log(`Total refs: ${rows.length}`);
console.log(`GYG productos únicos: ${gyg.size}`);
console.log(`VIA productos únicos: ${via.size}`);
fs.writeFileSync("/tmp/rows.json",JSON.stringify(rows,null,0));
console.log("escrito /tmp/rows.json");
