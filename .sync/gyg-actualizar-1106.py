import os,re,json,sys
ROOT=sys.argv[1]; APPLY='--apply' in sys.argv
datos=json.load(open(sys.argv[2]))
def fmt_int(n,lang):
    s=f"{n:,}"
    if lang=='en': return s
    if lang=='fr': return s.replace(',', ' ') if False else s.replace(',', ' ')
    return s.replace(',', '.')
def variants(n):
    s=f"{n:,}"; return {s, s.replace(',','.'), s.replace(',',' '), s.replace(',',' '), s.replace(',',' '), str(n)}
def num(x): 
    x=round(float(x),2); return int(x) if x==int(x) else x
log=[]; slug2tid={}
A=os.path.join(ROOT,'content/actividades')
for root,_,fs in os.walk(A):
  for f in fs:
    if not f.endswith('.md'): continue
    p=os.path.join(root,f); s=open(p,encoding='utf-8').read()
    if 'proveedor: getyourguide' not in s.split('\n---',1)[0]: continue
    m=re.search(r'^urlReserva:.*?(?:-|activity-)t(\d+)[/?]',s,re.M)
    if not m or m.group(1) not in datos: continue
    tid=m.group(1); rv,rc,pr=datos[tid]; lang=p.split(os.sep)[-3]
    head,body=s.split('\n---',1) if s.startswith('---') else (s,'')
    # head includes leading '---'
    fm=s[:s.index('\n---',3)+4]; rest=s[len(fm):]
    g=lambda k:(re.search(r'^'+k+r':\s*(.+)$',fm,re.M) or [None,None])[1]
    old_rc=g('numeroOpiniones'); old_rv=g('ratingProveedor'); old_pr=g('precioDesde')
    slug=g('slug'); slug2tid[slug]=tid
    new=s; ch=[]
    new_rv=round(rv,1)
    if old_rc and old_rc.strip().isdigit() and int(old_rc)!=rc and rc>0:
        o=int(old_rc)
        new=re.sub(r'^numeroOpiniones:.*$',f'numeroOpiniones: {rc}',new,flags=re.M)
        if o>=100:
            for v in sorted(variants(o),key=len,reverse=True):
                new=re.sub(r'(?<![\d.,])'+re.escape(v)+r'(?![\d])', fmt_int(rc,lang), new)
        ch.append(f'opiniones {o}->{rc}')
    if old_rv:
        try: orv=float(old_rv)
        except: orv=None
        if orv is not None and abs(orv-new_rv)>=0.05:
            new=re.sub(r'^ratingProveedor:.*$',f'ratingProveedor: {new_rv}',new,flags=re.M)
            for a,b in [(f'{orv:.1f}/5',f'{new_rv:.1f}/5'),(f'{orv:.1f}/5'.replace('.',','),f'{new_rv:.1f}/5'.replace('.',','))]:
                new=new.replace(a,b)
            ch.append(f'nota {orv}->{new_rv}')
    if old_pr:
        try: opr=float(old_pr.strip().strip('"\''))
        except: opr=None
        npr=num(pr)
        if False and opr and abs(npr-opr)/opr>=0.05:
            new=re.sub(r'^precioDesde:.*$',f'precioDesde: {npr}',new,flags=re.M)
            ch.append(f'precio {opr}->{npr} (revisar texto)')
    if new!=s:
        log.append((p.replace(ROOT+'/',''),tid,', '.join(ch)))
        if APPLY: open(p,'w',encoding='utf-8').write(new)
# guias: lines linking fichas whose counts changed
G=os.path.join(ROOT,'content/guias')
cnt=0
for root,_,fs in os.walk(G):
  for f in fs:
    if not f.endswith('.md'): continue
    p=os.path.join(root,f); s=open(p,encoding='utf-8').read(); new=s
    lang=p.split(os.sep)[-3]
    for line in s.split('\n'):
        for m in re.finditer(r'/activit(?:ies|ades)/([a-z0-9-]+)\)',line.replace('actividades','activitades')):
            pass
    out=[]
    for line in new.split('\n'):
        ms=re.findall(r'/(?:actividades|activities)/([a-z0-9-]+)\)',line)
        for sl in ms:
            if sl in slug2tid:
                rv,rc,pr=datos[slug2tid[sl]]
                mm=re.search(r'★ \(([\d.,   ]+)\)',line)
                if mm:
                    o=int(re.sub(r'\D','',mm.group(1)))
                    if o!=rc: line=line.replace(mm.group(0),f'★ ({fmt_int(rc,lang)})')
                mr=re.search(r'(\d[.,]\d)★',line)
                if mr:
                    sep=',' if ',' in mr.group(1) else '.'
                    line=line.replace(mr.group(0),f'{round(rv,1):.1f}'.replace('.',sep)+'★',1)
        out.append(line)
    new='\n'.join(out)
    if new!=s:
        cnt+=1; log.append((p.replace(ROOT+'/',''),'guia','tabla'))
        if APPLY: open(p,'w',encoding='utf-8').write(new)
for l in log: print(' | '.join(l))
print(len(log),'archivos', 'APLICADO' if APPLY else 'DRY-RUN')
