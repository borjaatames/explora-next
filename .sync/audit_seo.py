import glob, yaml, os
LANGS=["es","en","de","fr","it","pt"]
def load(p):
    with open(p,encoding="utf-8") as fh: raw=fh.read()
    if not raw.startswith("---"): return {}
    s=raw.split("---",2)
    try: fm=yaml.safe_load(s[1]) or {}
    except: return {"_yamlerr":True}
    return fm if isinstance(fm,dict) else {}
no_titulo=[]; no_desc=[]; desc_larga=[]; desc_corta=[]; titulo_largo=[]
nf=ng=0
for kind,glb in (("ficha","content/actividades/{l}/*/*.md"),("guia","content/guias/{l}/*/*.md")):
    for l in LANGS:
        for f in glob.glob(glb.format(l=l)):
            if f.endswith(".backup"): continue
            fm=load(f)
            if fm.get("publicada",True)==False: continue
            if kind=="ficha": nf+=1
            else: ng+=1
            t=fm.get("titulo") or fm.get("metaTitle") or ""
            d=fm.get("descripcion") or ""
            if not t: no_titulo.append(f)
            if not d: no_desc.append(f)
            else:
                if len(d)>170: desc_larga.append((f,len(d)))
                if len(d)<70: desc_corta.append((f,len(d)))
            # metaTitle/title length for SERP (~60)
            mt=fm.get("metaTitle") or t
            if mt and len(mt)>65: titulo_largo.append((f,len(mt)))
print(f"publicadas: fichas={nf} guias={ng}")
print("\nSIN titulo:",len(no_titulo)); [print("  -",x.replace('content/','')) for x in no_titulo[:20]]
print("\nSIN descripcion:",len(no_desc)); [print("  -",x.replace('content/','')) for x in no_desc[:20]]
print("\ndescripcion >170 (puede truncarse en SERP):",len(desc_larga))
for x in sorted(desc_larga,key=lambda t:-t[1])[:15]: print("  -",x[1],x[0].replace('content/',''))
print("\ndescripcion <70 (corta):",len(desc_corta))
for x in desc_corta[:15]: print("  -",x[1],x[0].replace('content/',''))
print("\ntitulo/metaTitle >65 (puede truncarse):",len(titulo_largo))
for x in sorted(titulo_largo,key=lambda t:-t[1])[:15]: print("  -",x[1],x[0].replace('content/',''))
