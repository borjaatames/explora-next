import fs from "fs"; import path from "path"; import matter from "gray-matter";
const ROOT=path.join(process.cwd(),"content");
const viaCode=u=>{const m=(u||"").match(/\/d\d+-([A-Za-z0-9]+)/);return m?m[1]:null;};
const gygCode=u=>{const m=(u||"").match(/-t(\d+)/);return m?m[1]:null;};
function walk(dir,fn){if(!fs.existsSync(dir))return;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p,fn);else if(e.name.endsWith(".md")&&!e.name.startsWith("_"))fn(p);}}
const via=new Map(), gyg=new Map();
function add(map,code,precio,moneda,ref){if(!code)return;const e=map.get(code)||{precios:{},refs:[]};if(precio!=null&&isFinite(Number(precio)))e.precios[ref.split("/")[1]]=Number(precio);e.refs.push(ref);map.set(code,e);}
for(const idi of ["es","en"]){
  walk(path.join(ROOT,"actividades",idi),f=>{
    const {data}=matter(fs.readFileSync(f,"utf8"));
    const u=data.urlReserva; if(!u)return;
    if(String(u).includes("viator")) add(via,viaCode(u),data.precioDesde,data.moneda,`ficha/${idi}/${path.basename(f)}`);
    else if(String(u).includes("getyourguide")) add(gyg,gygCode(u),data.precioDesde,data.moneda,`ficha/${idi}/${path.basename(f)}`);
  });
}
walk(path.join(ROOT,"sem"),f=>{
  const {data}=matter(fs.readFileSync(f,"utf8"));
  const idi=f.includes("/sem/en/")?"en":"es";
  for(const t of (data.tours||[])){
    const u=t.viator_url||t.url_reserva||"";
    if(String(u).includes("viator")) add(via,viaCode(u)||t.viator_product_id,t.precio_desde,t.moneda,`sem/${idi}/${path.basename(f)}`);
    else if(String(u).includes("getyourguide")) add(gyg,gygCode(u),t.precio_desde,t.moneda,`sem/${idi}/${path.basename(f)}`);
  }
});
const dump=m=>[...m.entries()].map(([code,v])=>({code,precios:v.precios,n:v.refs.length})).sort((a,b)=>a.code.localeCompare(b.code));
const out={viator:dump(via),gyg:dump(gyg)};
fs.writeFileSync("/tmp/inventario.json",JSON.stringify(out,null,2));
console.log("Viator unicos:",out.viator.length,"| GYG unicos:",out.gyg.length);
console.log("\n-- Primeros 5 Viator --"); for(const r of out.viator.slice(0,5)) console.log(r.code,JSON.stringify(r.precios),"refs:"+r.n);
console.log("\n-- Primeros 5 GYG --"); for(const r of out.gyg.slice(0,5)) console.log(r.code,JSON.stringify(r.precios),"refs:"+r.n);
