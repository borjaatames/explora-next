import os, glob, yaml
from PIL import Image
LANGS=["es","en","de","fr","it","pt"]
PUB="public"
def load(path):
    with open(path,encoding="utf-8") as fh: raw=fh.read()
    if not raw.startswith("---"): return {}
    p=raw.split("---",2)
    try: fm=yaml.safe_load(p[1]) or {}
    except: return {}
    return fm if isinstance(fm,dict) else {}

# collect local main images from PUBLISHED fichas + guides (dedup)
paths={}  # relpath -> example source
def add(img,src):
    if not img or not isinstance(img,str): return
    if img.startswith("http"): return
    paths.setdefault(img.lstrip("/"), src)
for l in LANGS:
    for f in glob.glob(f"content/actividades/{l}/*/*.md"):
        if f.endswith(".backup"): continue
        fm=load(f)
        if fm.get("publicada",True)==False: continue
        add(fm.get("imagen"), f)
    for f in glob.glob(f"content/guias/{l}/*/*.md"):
        if f.endswith(".backup"): continue
        fm=load(f)
        if fm.get("publicada",True)==False: continue
        add(fm.get("imagen_portada"), f)

small=[]; nonwebp=[]; missing=[]; errors=[]; ok=0
for rel,src in paths.items():
    fp=os.path.join(PUB,rel)
    if not os.path.isfile(fp): missing.append((rel,src)); continue
    ext=os.path.splitext(rel)[1].lower()
    if ext not in (".webp",".avif"): nonwebp.append((rel,ext,src))
    try:
        with Image.open(fp) as im: w,h=im.size
        if w<1000: small.append((rel,f"{w}x{h}",src))
        else: ok+=1
    except Exception as e:
        errors.append((rel,str(e)[:60]))

print("imagenes principales unicas (publicadas):",len(paths),"| OK(>=1000px):",ok)
print("\n== FALTAN (local, publicada) ==",len(missing))
for x in missing[:30]: print("  -",x[0])
print("\n== HERO PEQUENO <1000px ==",len(small))
for x in sorted(small,key=lambda t:int(t[1].split('x')[0]))[:50]: print("  -",x[1],x[0])
print("\n== NO webp/avif ==",len(nonwebp))
for x in nonwebp[:40]: print("  -",x[1],x[0])
print("\n== errores PIL ==",len(errors))
for x in errors[:20]: print("  -",x[0],x[1])
