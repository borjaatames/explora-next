import re, glob, json, yaml, collections, sys
FM=re.compile(r'^---\n(.*?)\n---\n',re.S)
def load(f):
    t=open(f,encoding='utf-8').read(); m=FM.match(t)
    try: d=yaml.safe_load(m.group(1)) if m else {}
    except Exception: d={}
    return d or {}, t
F={}
for f in glob.glob('content/actividades/*/*/*.md'):
    lang,city,name=f.split('/')[2:5]; d,_=load(f)
    slug=d.get('slug') or name[:-3]
    F[(lang,city,slug)]=dict(lang=lang,city=city,slug=slug,id=[str(x) for x in (d.get('idiomas') or [])],cat=d.get('categoria'),pub=d.get('publicada',True) is not False,
      titulo=str(d.get('titulo','')),tags=d.get('atraccionesRelacionadas') or [],precio=d.get('precioDesde'),r=d.get('ratingProveedor'),n=d.get('numeroOpiniones'),
      es=(d.get('slugs') or {}).get('es') or (slug if lang=='es' else None),url=d.get('urlReserva'))
GUIDED={'visitasGuiadas','toursGastronomicos','excursionesDia','experienciasPrivadas','nocturno'}
def ok(v,L): return v['pub'] and (v['cat'] not in GUIDED or not v['id'] or L in v['id'])
BYES=collections.defaultdict(dict)
for k,v in F.items():
    if v['es']: BYES[v['es']][v['lang']]=v
POOL=collections.defaultdict(list)
for v in F.values(): POOL[(v['lang'],v['city'])].append(v)
TF=collections.Counter(); TN=collections.Counter()
for v in F.values():
    TN[v['city']]+=1
    for x in set(v['tags']): TF[(v['city'],x)]+=1
GEN={'excursiones','visitas-guiadas','tours','gastronomia','ocio','nocturno','experiencias'}
def spec(v): return {x for x in v['tags'] if x not in GEN and TF[(v['city'],x)]<=0.25*TN[v['city']]}
LINKP={'es':'/ciudades/{c}/actividades/{s}'}
def url(v): return (f"/ciudades/{v['city']}/actividades/{v['slug']}" if v['lang']=='es' else f"/{v['lang']}/cities/{v['city']}/activities/{v['slug']}")
def best(fo,L,used):
    tw=BYES.get(fo['es'],{}).get(L) if fo['es'] else None
    if tw and ok(tw,L) and tw['slug'] not in used: return tw,'twin'
    bs=0;b=None
    for v in POOL[(L,fo['city'])]:
        if v['slug'] in used or v['cat']!=fo['cat'] or not ok(v,L): continue
        ov=len(spec(v)&spec(fo))
        if ov<1: continue
        sc=ov*10+(v['r'] or 0)
        if sc>bs: b,bs=v,sc
    return (b,'sim') if b else (None,None)
LINK=re.compile(r'\[([^\]]+)\]\((/(?:([a-z]{2})/)?(?:ciudades|cities)/([^/)]+)/(?:actividades|activities)/([^)#?\s/]+))\)')
def fmt_eur(p,L):
    if p is None: return None
    s=f"{p:g}"; 
    if L!='en': s=s.replace('.',',')
    return s
APPLY='--apply' in sys.argv
SK=[];st=collections.Counter(); samples=[]; changed=[]
for g in sorted(glob.glob('content/guias/*/*/*.md')):
    L=g.split('/')[2]; d,t=load(g); orig=t
    used={m.group(5) for m in LINK.finditer(t)}
    lines=t.split('\n'); 
    for i,ln in enumerate(lines):
        if not ln.startswith('|'): continue
        cells=ln.split('|')
        for m in list(LINK.finditer(ln)):
            lang=m.group(3) or 'es'; fo=F.get((lang,m.group(4),m.group(5)))
            if not fo or fo['cat'] not in GUIDED or not fo['id'] or L in fo['id']: continue
            st['mis']+=1
            nv,how=best(fo,L,used)
            if not nv: st['none']+=1; continue
            first = cells[1].strip().startswith('['+m.group(1)+']')
            if how=='twin':
                ln=ln.replace(m.group(2),url(nv)); st['twin']+=1; used.add(nv['slug']); continue
            if not first:
                st['skip_shape']+=1; SK.append((g.split('/',2)[2],ln.strip()[:200],nv['titulo'][:60])); continue
            # row A: rewrite title/url, rating cell, price cell
            new=[c for c in cells]
            title=nv['titulo'].replace('|','-')
            new[1]=f" [{title}]({url(nv)}) "
            for j in range(2,len(new)-1):
                c=new[j]
                if re.search(r'★',c) and nv['r']:
                    rr=fmt_eur(nv['r'],L); nn=f"{nv['n']:,}".replace(',','.' if L!='en' else ',') if nv['n'] else ''
                    new[j]=f" {rr}★"+(f" ({nn})" if nn else '')+" "
                elif re.search(r'\d\s*€|€\s*\d',c) and nv['precio'] is not None:
                    new[j]=re.sub(r'\d[\d.,]*',fmt_eur(nv['precio'],L),c,count=1)
            ln2='|'.join(new)
            samples.append((g.split('/',2)[2],ln.strip()[:110],ln2.strip()[:110]))
            ln=ln2; cells=new; used.add(nv['slug']); st['rowA']+=1
        lines[i]=ln
    t='\n'.join(lines)
    if t!=orig:
        changed.append(g)
        if APPLY: open(g,'w',encoding='utf-8').write(t)
print(st, len(changed),'guias')
import random; random.seed(3)
for s in random.sample(samples,min(12,len(samples))): print(s[0]); print('  -',s[1]); print('  +',s[2])
json.dump(changed,open('/tmp/changed.json','w'))

json.dump(SK,open('/tmp/skip.json','w'),ensure_ascii=False)
