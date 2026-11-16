import os, glob, re, sys, yaml
ROOT="."
LANGS=["es","en","de","fr","it","pt"]
PUB=os.path.join(ROOT,"public")
NEIGH={"cadiz":["jerez-de-la-frontera"],"jerez-de-la-frontera":["cadiz"]}
def ifichas(l): return l if l in ("es","en") else "en"

def load_md(path):
    with open(path,encoding="utf-8") as fh: raw=fh.read()
    if not raw.startswith("---"): return None,None,"no frontmatter"
    parts=raw.split("---",2)
    if len(parts)<3: return None,None,"frontmatter mal cerrado"
    try: fm=yaml.safe_load(parts[1])
    except Exception as e: return None,parts[2],"YAML error: "+str(e).splitlines()[0]
    if not isinstance(fm,dict): return None,parts[2],"frontmatter no es dict"
    return fm,parts[2],None

# ---- index fichas: (lang,city) -> {slug: fm}, plus slug/slugs index ----
fichas={}  # (lang,city)->list of (slug,fm,file)
for l in LANGS:
    for d in glob.glob(f"content/actividades/{l}/*"):
        city=os.path.basename(d)
        for f in glob.glob(d+"/*.md"):
            fm,body,err=load_md(f)
            fichas.setdefault((l,city),[]).append((os.path.splitext(os.path.basename(f))[0],fm,f,err))

def idx_for(lang,city,extra):
    cities=[]
    for c in list(dict.fromkeys(list(extra)+NEIGH.get(city,[])+[city])): cities.append(c)
    idx={}
    langs=[ifichas(lang)] + ([lang] if lang!=ifichas(lang) else [])
    for lg in langs:
        for c in cities:
            for slug,fm,f,err in fichas.get((lg,c),[]):
                if fm is None: continue
                idx.setdefault(slug,fm)
                sl=fm.get("slugs") or {}
                if sl.get("es"): idx.setdefault(sl["es"],fm)
                if sl.get("en"): idx.setdefault(sl["en"],fm)
    return idx

REMOTE=0
def exists_img(p):
    global REMOTE
    if not p or not isinstance(p,str): return True
    if p.startswith("http://") or p.startswith("https://"):
        REMOTE+=1; return True  # CDN remoto valido (bokun/gyg)
    return os.path.isfile(os.path.join(PUB,p.lstrip("/")))

FICHA_ERR=[]; FICHA_WARN=[]
pub_count=0
for (l,city),items in fichas.items():
    for slug,fm,f,err in items:
        rel=f
        if err: FICHA_ERR.append((rel,err)); continue
        publ=fm.get("publicada",True)
        if publ: pub_count+=1
        # slug == filename
        if fm.get("slug")!=slug: FICHA_ERR.append((rel,f"slug '{fm.get('slug')}' != fichero '{slug}'"))
        sl=fm.get("slugs") or {}
        if not sl.get("es"): FICHA_WARN.append((rel,"falta slugs.es (hreflang)"))
        if sl.get(l) and sl.get(l)!=slug: FICHA_WARN.append((rel,f"slugs.{l} '{sl.get(l)}' != fichero"))
        # precio / moneda / proveedor solo en publicadas
        if publ:
            pd=fm.get("precioDesde")
            if pd is None or not isinstance(pd,(int,float)) or pd<=0:
                FICHA_ERR.append((rel,f"precioDesde invalido: {pd!r} (LIVE)"))
            if not fm.get("moneda"): FICHA_WARN.append((rel,"falta moneda"))
            prov=(fm.get("proveedor") or "").lower()
            if not prov: FICHA_WARN.append((rel,"falta proveedor"))
            # reserva
            if prov in ("getyourguide","gyg","viator"):
                u=fm.get("urlReserva") or ""
                if not u: FICHA_ERR.append((rel,"falta urlReserva (LIVE)"))
                elif "partner_id" not in u and "pid=" not in u and "mcid" not in u:
                    FICHA_WARN.append((rel,"urlReserva sin partner/afiliado"))
            elif prov=="bokun" or fm.get("bokunProductId"):
                if not fm.get("bokunProductId"): FICHA_ERR.append((rel,"Bokun sin bokunProductId (LIVE)"))
        # imagen
        img=fm.get("imagen")
        if not img: FICHA_WARN.append((rel,"sin imagen principal"))
        elif not exists_img(img): FICHA_ERR.append((rel,f"imagen principal NO existe: {img}"))
        if img and not fm.get("imagenAlt"): FICHA_WARN.append((rel,"imagen sin imagenAlt (alt/SEO)"))
        gal=fm.get("galeria") or []
        if isinstance(gal,list):
            for g in gal:
                gp=g.get("src") if isinstance(g,dict) else g
                if gp and not exists_img(gp): FICHA_ERR.append((rel,f"galeria NO existe: {gp}"))

# ---- guias ----
GUIA_ERR=[]; GUIA_WARN=[]
RE_SC=re.compile(r"\[actividad:\s*([a-z0-9-]+)\s*\]")
gcount=0; gpub=0
for l in LANGS:
    for d in glob.glob(f"content/guias/{l}/*"):
        city=os.path.basename(d)
        for f in glob.glob(d+"/*.md"):
            gcount+=1
            slug=os.path.splitext(os.path.basename(f))[0]
            fm,body,err=load_md(f)
            if err: GUIA_ERR.append((f,err)); continue
            publ=fm.get("publicada",True)
            if publ: gpub+=1
            if fm.get("slug")!=slug: GUIA_ERR.append((f,f"slug '{fm.get('slug')}' != fichero '{slug}'"))
            ip=fm.get("imagen_portada")
            if not ip: GUIA_WARN.append((f,"sin imagen_portada"))
            elif not exists_img(ip): GUIA_ERR.append((f,f"imagen_portada NO existe: {ip}"))
            if ip and not fm.get("imagen_alt"): GUIA_WARN.append((f,"imagen_portada sin imagen_alt"))
            if not publ: continue
            extra=fm.get("ciudadesFichas") or []
            idx=idx_for(l,city,extra)
            def chk(ref,origen):
                if ref not in idx:
                    GUIA_ERR.append((f,f"{origen}: '{ref}' NO resuelve a ninguna ficha"))
                else:
                    if idx[ref].get("publicada",True)==False:
                        GUIA_WARN.append((f,f"{origen}: '{ref}' solo resuelve a ficha DESPUBLICADA (no se renderiza)"))
            for a in (fm.get("actividades") or []):
                if isinstance(a,str): chk(a,"actividades")
            for o in (fm.get("opciones") or []):
                if isinstance(o,dict) and o.get("ficha"): chk(o["ficha"],"opciones")
            for m in RE_SC.findall(body or ""):
                chk(m,"[actividad:] inline")

def dump(title,lst,lim=60):
    print(f"\n### {title}: {len(lst)}")
    for x in lst[:lim]: print(" -",x[0].replace('content/',''),"->",x[1])
    if len(lst)>lim: print(f"   ...y {len(lst)-lim} mas")

print("==== RESUMEN ====")
print("fichas totales:",sum(len(v) for v in fichas.values()),"| publicadas:",pub_count)
print("guias totales:",gcount,"| publicadas:",gpub)
print("FICHA_ERR:",len(FICHA_ERR),"FICHA_WARN:",len(FICHA_WARN),"GUIA_ERR:",len(GUIA_ERR),"GUIA_WARN:",len(GUIA_WARN))
dump("FICHAS · ERRORES (LIVE)",FICHA_ERR,80)
dump("GUIAS · ERRORES (LIVE)",GUIA_ERR,80)
