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
      priv=bool(d.get('privada')),pg=bool(d.get('precioPorGrupo')),hl=d.get('highlights') or [],dur=d.get('duracion'),
      es=(d.get('slugs') or {}).get('es') or (slug if lang=='es' else None))
GUIDED={'visitasGuiadas','toursGastronomicos','excursionesDia','experienciasPrivadas','nocturno'}
def ok(v,L): return v['pub'] and (v['cat'] not in GUIDED or not v['id'] or L in v['id'])
def bad(v,L): return v['cat'] in GUIDED and v['id'] and L not in v['id']
POOL=collections.defaultdict(list)
for v in F.values(): POOL[(v['lang'],v['city'])].append(v)
TF=collections.Counter(); TN=collections.Counter()
for v in F.values():
    TN[v['city']]+=1
    for x in set(v['tags']): TF[(v['city'],x)]+=1
GEN={'excursiones','visitas-guiadas','tours','gastronomia','ocio','nocturno','experiencias'}
def spec(v): return [x for x in v['tags'] if x not in GEN and TF[(v['city'],x)]<=0.25*TN[v['city']]]
def NVHL(v): return v['hl']
def NVD(v): return v['dur']
def url(v): return (f"/ciudades/{v['city']}/actividades/{v['slug']}" if v['lang']=='es' else f"/{v['lang']}/cities/{v['city']}/activities/{v['slug']}")
def best(fo,L,used):
    sf=spec(fo)
    if not sf: return None
    main=sf[0]; b=None; bs=-1
    for v in POOL[(L,fo['city'])]:
        if v['slug'] in used or v['cat']!=fo['cat'] or not ok(v,L): continue
        sv=spec(v)
        if main not in sv: continue
        sc=len(set(sv)&set(sf))*10+(5 if v['priv']==fo['priv'] else 0)+(v['r'] or 0)
        if sc>bs: b,bs=v,sc
    return b
LINK=re.compile(r'\[([^\]]+)\]\((/(?:([a-z]{2})/)?(?:ciudades|cities)/([^/)]+)/(?:actividades|activities)/([^)#?\s/]+))\)')
RAT=re.compile(r'\d(?:[.,]\d)?\s?★(?:\s?\([\d.,   ]+\))?')
PR=re.compile(r'\d[\d.,]*(?=\s?€)')
SUF={'de':'pro Gruppe','fr':'par groupe','it':'per gruppo','pt':'por grupo','es':'por grupo','en':'per group'}
PRIVL={'de':'Privat','fr':'En privé','it':'Privato','pt':'Privado','es':'Privado','en':'Private'}
GRPL={'de':'In der Gruppe','fr':'En groupe','it':'In gruppo','pt':'Em grupo','es':'En grupo','en':'In a group'}
PRIVW=re.compile(r'priv|nur für euch|solo per voi|rien que pour|só para|solo para|just for you',re.I)
def num(x,L):
    s=f"{x:g}"; return s if L=='en' else s.replace('.',',')
def cnt(n,L):
    s=f"{int(n):,}"; return s.replace(',', {'en':',','fr':' '}.get(L,'.'))
def rat(v,L):
    return f"{num(v['r'],L)}★"+(f" ({cnt(v['n'],L)})" if v['n'] else '')
def price(c,v,L):
    if v['precio'] is None: return c
    c=PR.sub(num(v['precio'],L),c,count=1)
    s=SUF[L]
    PP={'de':'pro Person','fr':'par personne','it':'a persona','pt':'por pessoa','es':'por persona','en':'per person'}[L]
    if v['pg'] and PP in c: c=c.replace(PP,s)
    elif not v['pg'] and s in c and PP not in c: pass
    if v['pg'] and s not in c: c=re.sub(r'€',f'€ {s}',c,count=1)
    if not v['pg'] and s in c: c=c.replace(' '+s,'')
    return c
APPLY='--apply' in sys.argv
NIGHT=re.compile(r'night|evening|nocturn|nacht|notte|noite|soir|abend',re.I)
DURH=re.compile(r'^(dauer|duration|durée|durata|duração|duración|fahrzeit|durée totale|tempo|temps)',re.I)
KEEPH=re.compile(r'takt|fréquence|frequenza|frequência|frecuencia|frequency|privé|privat|private|privado|privato|groupe \(|gruppe \(|group \(|grupo \(|gruppo \(|^$|bewertung|note|rating|valutazione|avalia|valoración|preis|prix|prezzo|preço|precio|price|ab$|from|à partir|a partir|desde|da$',re.I)
CLAIM=re.compile(r'abend|soir|sera|noite|noche|evening|night|spanisch|espagnol|spagnolo|espanhol|spanish|español|cuarto real|günstig|moins ch|economic|barat|cheap|beliebt|plus choisi|più scelt|mais escolhid|most popular|más elegid|bewert|mieux not|meglio valut|bem avaliad|top rated|mejor valor|generalife|différent|anders|diverso|different',re.I)
GL={'de':'Mit Guide auf Deutsch','fr':'Avec guide en français','it':'Con guida in italiano','pt':'Com guia em português','es':'Con guía en español','en':'With an English-speaking guide'}
GLP={'de':'Privat, mit Guide auf Deutsch','fr':'En privé, avec guide en français','it':'Privato, con guida in italiano','pt':'Privado, com guia em português','es':'Privado, con guía en español','en':'Private, with an English-speaking guide'}
def shortdur(x,L):
    if not x: return None
    x=str(x)
    x=re.sub(r'\s*\b(Stunden|Stunde)\b',' Std.',x); x=re.sub(r'\s*\b(heures|heure|horas|hora|ore|ora)\b',' h',x); x=re.sub(r'\s*\b(hours|hour)\b',' hr',x)
    x=re.sub(r'\s*\b(Minuten|minutes|minuti|minutos|minuto|minute)\b',' min',x); x=re.sub(r' (und|et|e|y|and) ',' ',x)
    return x
def header(lines,i):
    j=i
    while j>0 and lines[j-1].startswith('|'): j-=1
    return [c.strip() for c in lines[j].split('|')]
st=collections.Counter(); out=[]; changed=[]
for g in sorted(glob.glob('content/guias/*/*/*.md')):
    L=g.split('/')[2]; d,t=load(g); orig=t
    used={m.group(5) for m in LINK.finditer(t)}
    lines=t.split('\n')
    for i,ln in enumerate(lines):
        if not ln.startswith('|') or '---' in ln[:6]: continue
        cells=ln.split('|')
        nlinks=sum(len(LINK.findall(c)) for c in cells)
        for ci in range(1,len(cells)-1):
            for m in list(LINK.finditer(cells[ci])):
                lang=m.group(3) or 'es'; fo=F.get((lang,m.group(4),m.group(5)))
                if not fo or not bad(fo,L): continue
                st['mis']+=1
                nv=best(fo,L,used)
                if not nv: st['none']+=1; continue
                if NIGHT.search(fo['slug']+' '+fo['titulo']) and not NIGHT.search(nv['slug']+' '+nv['titulo']): st['night']+=1; continue
                before=ln
                txt=m.group(1)
                if re.match(r'^\W*(ca\.|circa|env\.|cerca de|about|ab|desde|from|da|à partir de|a partir de)?\s*\d',txt,re.I) or '€' in txt:
                    ntxt=price(txt,nv,L)       # price-style link
                else:
                    ntxt=nv['titulo'].replace('|','-').replace('[','(').replace(']',')')
                c=cells[ci].replace(m.group(0),f"[{ntxt}]({url(nv)})")
                if RAT.search(c): c=RAT.sub(rat(nv,L),c,count=1) if nv['r'] else re.sub(r',?\s*'+RAT.pattern,'',c,count=1)
                cells[ci]=c
                if nlinks==1:
                    for j in range(1,len(cells)-1):
                        if j==ci or LINK.search(cells[j]): continue
                        if RAT.fullmatch(cells[j].strip()): cells[j]=' '+(rat(nv,L) if nv['r'] else '—')+' '
                        elif PR.search(cells[j]): cells[j]=price(cells[j],nv,L)
                    H=header(lines,i)
                    hl=[str(x) for x in (NVHL(nv) or [])]
                    k=0
                    for j in range(1,len(cells)-1):
                        if j==ci or LINK.search(cells[j]) or RAT.fullmatch(cells[j].strip()) or PR.search(cells[j]) or cells[j].strip() in ('—','-',''): continue
                        hn=H[j] if j<len(H) else ''
                        if j==1 and ci!=1:
                            if CLAIM.search(cells[1]) or (fo['priv']!=nv['priv'] and PRIVW.search(cells[1]+fo['titulo'])):
                                cells[1]=' '+(GLP if nv['priv'] else GL)[L]+' '
                            continue
                        if DURH.search(hn):
                            sd=shortdur(NVD(nv),L)
                            if sd: cells[j]=' '+sd+(', '+cells[j].split(',',1)[1].strip() if ',' in cells[j] and not re.search(r'\d',cells[j].split(',',1)[1]) else '')+' '
                            continue
                        if KEEPH.search(hn): continue
                        if k<len(hl): cells[j]=' '+hl[k].replace('|','-')+' '; k+=1
                ln='|'.join(cells); used.add(nv['slug']); st['ok']+=1
                out.append(dict(g=g,L=L,old=before.strip(),new=ln.strip(),de=fo['titulo'],a=nv['titulo'],key=[nv['lang'],nv['city'],nv['slug']]))
        lines[i]=ln
    t='\n'.join(lines)
    if t!=orig:
        changed.append(g)
        if APPLY: open(g,'w',encoding='utf-8').write(t)
print(st,len(changed),'guias')
json.dump(out,open('/tmp/sust.json','w'),ensure_ascii=False,indent=0)
json.dump(changed,open('/tmp/changed.json','w'))
