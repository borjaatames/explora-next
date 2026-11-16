import os, glob, re, yaml
LANGS=["es","en","de","fr","it","pt"]
def load(path):
    with open(path,encoding="utf-8") as fh: raw=fh.read()
    if not raw.startswith("---"): return {}, raw
    p=raw.split("---",2)
    try: fm=yaml.safe_load(p[1]) or {}
    except: fm={}
    return (fm if isinstance(fm,dict) else {}), (p[2] if len(p)>2 else "")

# build valid URL sets
ficha_url=set(); guia_url=set()
# identity map for hreflang: (slug_es) -> {lang: (file, slugsmap, publicada)}
ident={}
for l in LANGS:
    for f in glob.glob(f"content/actividades/{l}/*/*.md"):
        if f.endswith(".backup"): continue
        city=f.split("/")[3]; slug=os.path.basename(f)[:-3]
        fm,_=load(f)
        if l=="es": ficha_url.add(f"/ciudades/{city}/actividades/{slug}")
        else: ficha_url.add(f"/{l}/cities/{city}/activities/{slug}")
        sid=(fm.get("slugs") or {}).get("es") or slug
        ident.setdefault(("ficha",city,sid),{})[l]=(f,fm.get("slugs") or {},fm.get("publicada",True))
    for f in glob.glob(f"content/guias/{l}/*/*.md"):
        if f.endswith(".backup"): continue
        city=f.split("/")[3]; slug=os.path.basename(f)[:-3]
        fm,_=load(f)
        if l=="es": guia_url.add(f"/guias/{city}/{slug}")
        else: guia_url.add(f"/{l}/guides/{city}/{slug}")
        sid=(fm.get("slugs") or {}).get("es") or slug
        ident.setdefault(("guia",city,sid),{})[l]=(f,fm.get("slugs") or {},fm.get("publicada",True))

# A) broken internal links in guide bodies (only detail-page links)
LINK=re.compile(r"\]\((/[^)\s]+)\)")
RE_FICHA_ES=re.compile(r"^/ciudades/([^/]+)/actividades/([^/]+)$")
RE_FICHA_L=re.compile(r"^/([a-z]{2})/cities/([^/]+)/activities/([^/]+)$")
RE_GUIA_ES=re.compile(r"^/guias/([^/]+)/([^/]+)$")
RE_GUIA_L=re.compile(r"^/([a-z]{2})/guides/([^/]+)/([^/]+)$")
broken=[]
for l in LANGS:
    for f in glob.glob(f"content/guias/{l}/*/*.md"):
        if f.endswith(".backup"): continue
        fm,body=load(f)
        if fm.get("publicada",True)==False: continue
        for m in LINK.findall(body):
            path=m.split("#")[0].split("?")[0]
            if path.endswith("/c"): continue
            if "/c/" in path: continue
            if RE_FICHA_ES.match(path) or RE_FICHA_L.match(path):
                if path not in ficha_url: broken.append((f,path,"ficha inexistente"))
            elif RE_GUIA_ES.match(path) or RE_GUIA_L.match(path):
                if path not in guia_url: broken.append((f,path,"guia inexistente"))

# B) hreflang gaps: identity present (published) in >1 lang but a published ficha's slugs map misses a lang that exists
hreflang=[]
for key,langs in ident.items():
    present=[l for l,(f,sl,pub) in langs.items() if pub]  # published langs
    if len(present)<2: continue
    for l in present:
        f,sl,pub=langs[l]
        for other in present:
            if other==l: continue
            if not sl.get(other):
                hreflang.append((f,f"slugs.{other} ausente (existe {key[0]} publicada en {other})"))

print("==== ENLACES INTERNOS ROTOS en cuerpo de guias (publicadas) ====", len(broken))
for x in broken[:80]: print(" -",x[0].replace("content/",""),"->",x[1],"|",x[2])
print("\n==== HUECOS HREFLANG (ficha/guia publicada sin slug de un idioma donde SÍ existe publicada) ====", len(hreflang))
# dedupe by file+msg, show sample
seen=set(); uniq=[]
for x in hreflang:
    k=(x[0],x[1])
    if k in seen: continue
    seen.add(k); uniq.append(x)
for x in uniq[:60]: print(" -",x[0].replace("content/",""),"->",x[1])
print("   total huecos (unicos):",len(uniq))
