import json,os,glob
from PIL import Image
E=os.path.expanduser('~/mnt/imagenes-master')
rows=json.load(open('.sync/pendientes.json')); aud=json.load(open('.sync/audit_fotos.json'))
ecred=json.load(open('.sync/e_creditos.json'))
mains=set(f['imgs'][0][1] for f in aud['fichas'] if f['imgs'] and f['imgs'][0][1])
pub=[p[6:] for p in glob.glob('public/images/actividades/**/*.webp',recursive=True) if not any(x in p for x in ('-card.','-thumb.','-og.','-hero-hero'))]
epaths=list(ecred.keys())
usados=set(); sizes={}
def ok(path):
    if path in sizes: return sizes[path]
    try: w,h=Image.open(path).size; r=(w>=1600 and h>=1000)
    except Exception: r=False
    sizes[path]=r; return r
for r in rows:
    kws=[k.lower() for k in r['kw']]; city=r['c']; cs=[]
    def match(s): return any(k in s.lower() for k in kws)
    for u in pub:
        if len(cs)>=4: break
        if u in mains or u in usados or not match(u): continue
        if ok('public'+u): cs.append(['W',u]); usados.add(u)
    for e in epaths:
        if len(cs)>=8: break
        if e in usados or not match(e): continue
        if ok(os.path.join(E,e)): cs.append(['E',e]); usados.add(e)
    r['cand']=cs
json.dump(rows,open('.sync/pendientes_cand.json','w'),ensure_ascii=False)
print(sum(1 for r in rows if r['cand']),'de',len(rows),'con candidatas')
