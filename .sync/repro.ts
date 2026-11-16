import { obtenerActividad } from "@/lib/actividades";
import { obtenerGuiasParaFicha, obtenerGuiaAgotadaParaFicha, obtenerComparativaPrivadaParaFicha } from "@/lib/guias";
const casos: [string,string][] = [
  ["las-palmas-tour-privado-ciudad-pueblos-del-norte","city-highlights ES"],
  ["gran-canaria-cruceristas-tour-privado-isla-dia","cruceros ES"],
];
for (const [slug,nombre] of casos){
  try{
    const act:any = obtenerActividad("es","gran-canaria",slug);
    if(!act){ console.log("NULL actividad:",nombre); continue; }
    obtenerGuiasParaFicha("es","gran-canaria",act);
    obtenerGuiaAgotadaParaFicha("es","gran-canaria",slug);
    obtenerComparativaPrivadaParaFicha("es","gran-canaria",act);
    console.log("OK",nombre);
  }catch(e:any){ console.log("CRASH",nombre,"->",e.message); }
}
