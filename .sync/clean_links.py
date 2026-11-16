import re, glob, os
pub=set()
for f in glob.glob('content/actividades/*/*/*.md'):
    lang,city,name=f.split('/')[2:5]
    t=open(f,encoding='utf-8').read(4000)
    if re.search(r'^publicada:\s*false',t,re.M): continue
    m=re.search(r'^slug:\s*(\S+)',t,re.M); slug=m.group(1).strip('\'"') if m else name[:-3]
    pub.add(f'/ciudades/{city}/actividades/{slug}' if lang=='es' else f'/{lang}/cities/{city}/activities/{slug}')
RX=re.compile(r'\]\((/(?:[a-z]{2}/)?(?:ciudades|cities)/[^/)]+/(?:actividades|activities)/[^)#?\s]+)')
rm=0; files=0
for f in glob.glob('content/guias/*/*/*.md'):
    t=open(f,encoding='utf-8').read(); lines=t.split('\n'); out=[]; ch=False
    for l in lines:
        if l.startswith('|'):
            us=RX.findall(l)
            if us and any(u.rstrip('/') not in pub for u in us):
                rm+=1; ch=True; continue
        out.append(l)
    if ch:
        # drop tables that are left with only header+separator, and their orphan heading
        t2='\n'.join(out)
        t2=re.sub(r'(?m)^## [^\n]*\n\n(\|[^\n]*\|\n\|[ \-:|]+\|\n)(?!\|)','',t2)
        t2=re.sub(r'(?m)^(\|[^\n]*\|\n\|[ \-:|]+\|\n)(?!\|)','',t2)
        open(f,'w',encoding='utf-8').write(t2); files+=1
print('rows removed',rm,'files',files,'published',len(pub))
