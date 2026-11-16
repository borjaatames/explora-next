import re, glob, os, json, sys, yaml
FM=re.compile(r'^---\n(.*?)\n---\n',re.S)
def load(f):
    t=open(f,encoding='utf-8').read(); m=FM.match(t)
    try: d=yaml.safe_load(m.group(1)) if m else {}
    except Exception: d={}
    return d or {}, t
# index fichas
fichas={}   # (lang, city, slug) -> data
bysl={}     # es slug -> {lang: (city,slug)}
for f in glob.glob('content/actividades/*/*/*.md'):
    lang,city,name=f.split('/')[2:5]; d,_=load(f)
    slug=d.get('slug') or name[:-3]
    fichas[(lang,city,slug)]=dict(f=f,id=d.get('idiomas') or [],cat=d.get('categoria'),pub=d.get('publicada',True) is not False,titulo=d.get('titulo',''),tags=d.get('atraccionesRelacionadas') or [],precio=d.get('precioDesde'),es=(d.get('slugs') or {}).get('es') or (slug if lang=='es' else None))
GUIDED={'visitasGuiadas','toursGastronomicos','excursionesDia','experienciasPrivadas','nocturno'}
def needs(fi): return fi['cat'] in GUIDED
LINK=re.compile(r'\]\((/(?:([a-z]{2})/)?(?:ciudades|cities)/([^/)]+)/(?:actividades|activities)/([^)#?\s/]+))')
SC=re.compile(r'\[actividad:\s*([a-z0-9-]+)\s*\]')
out=[]
for g in glob.glob('content/guias/*/*/*.md'):
    L=g.split('/')[2]; d,t=load(g)
    refs=set()
    for m in LINK.finditer(t):
        lang=m.group(2) or 'es'; refs.add(('link',lang,m.group(3),m.group(4)))
    for s in SC.findall(t): refs.add(('sc','es',None,s))
    for k in ('actividades',):
        for s in d.get(k) or []: refs.add(('fm','es',None,s if isinstance(s,str) else s.get('ficha')))
    for o in d.get('opciones') or []: refs.add(('fm','es',None,o.get('ficha')))
    for kind,lang,city,slug in refs:
        if kind=='link':
            fi=fichas.get((lang,city,slug))
            if not fi: continue
        else:
            fi=next((v for (l,c,s2),v in fichas.items() if l==L and v['es']==slug and v['pub']),None)
            if not fi: continue
        if needs(fi) and fi['id'] and L not in fi['id']:
            out.append(dict(g=g,L=L,kind=kind,lang=lang,slug=slug,ids=fi['id'],cat=fi['cat'],t=fi['titulo'][:50]))
json.dump(out,open('/tmp/mismatch.json','w'),ensure_ascii=False)
from collections import Counter
print(len(out),'refs;',len({o['g'] for o in out}),'guias'); print(Counter(o['L'] for o in out)); print(Counter(o['kind'] for o in out))

# --- candidates
import collections
def city_of(o):
    return o.get('city')
res=collections.Counter(); ex=[]
cand={}
for (l,c,s),v in fichas.items():
    if v['pub']: cand.setdefault((l,c),[]).append((s,v))
for o in out:
    L=o['L']
    # find original ficha + city
    if o['kind']=='link':
        k=next(((l,c,s) for (l,c,s) in fichas if l==o['lang'] and s==o['slug']),None)
    else:
        k=next(((l,c,s) for (l,c,s),v in fichas.items() if l==L and v['es']==o['slug']),None)
    if not k: res['noorig']+=1; continue
    fo=fichas[k]; c=k[1]
    best=None;bs=0
    for s,v in cand.get((L,c),[]):
        if needs(v) and v['id'] and L not in v['id']: continue
        sc=len(set(v['tags'])&set(fo['tags']))*3+(2 if v['cat']==fo['cat'] else 0)
        if sc>bs: best,bs=(s,v),sc
    if best and bs>=3: res['ok']+=1; ex.append((L,fo['titulo'][:45],'->',best[1]['titulo'][:45],bs))
    else: res['none']+=1
print(res); import random; random.seed(1)
for e in random.sample(ex,min(15,len(ex))): print(e)
