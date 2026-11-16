import re,glob,yaml,sys
FM=re.compile(r'^---\n(.*?)\n---\n',re.S)
DRY=len(sys.argv)>1 and sys.argv[1]=='dry'
def load(f):
    t=open(f,encoding='utf-8').read();m=FM.match(t);return (yaml.safe_load(m.group(1)) or {}),t,m.end()
IDX={}
for f in glob.glob('content/guias/*/*/*.md'):
    L,c=f.split('/')[2:4]; d,_,_=load(f); es=(d.get('slugs') or {}).get('es') or d.get('slug')
    IDX[(L,es)]=(f,c,d.get('slug'))
# (guia ES, agotada ES, nombre EN, nombre ES, palabras clave)
T=[('madrid-en-1-dia','museo-del-prado-entradas-agotadas','Prado','del Prado',['Prado']),
('cordoba-en-un-dia','mezquita-cordoba-entradas-agotadas','Mosque-Cathedral','de la Mezquita',['Mezquita','Mosque']),
('granada-en-1-dia','alhambra-nocturna-entradas-agotadas','Alhambra night visit','de la Alhambra nocturna',['Alhambra']),
('granada-en-2-dias','alhambra-entradas-agotadas','Alhambra','de la Alhambra',['Alhambra']),
('ciudad-artes-ciencias-como-visitar','oceanografic-valencia-entradas-agotadas','Oceanogràfic','del Oceanogràfic',['Oceanogr']),
('barcelona-en-1-dia','sagrada-familia-entradas-agotadas','Sagrada Família','de la Sagrada Família',['Sagrada Famil']),
('barcelona-en-2-dias','park-guell-entradas-agotadas','Park Güell','del Park Güell',['Park Güell']),
('bilbao-en-un-dia','guggenheim-bilbao-entradas-agotadas','Guggenheim','del Guggenheim',['Guggenheim']),
('madrid-en-2-dias','museo-del-prado-entradas-agotadas','Prado','del Prado',['Prado']),
('escapadas-costa-brava-desde-girona','museo-dali-figueres-entradas-agotadas','Dalí Theatre-Museum','del Teatro-Museo Dalí',['Dalí','Figueres'])]
def plain(l): return l.strip() and not re.match(r'\s*([|#>\-*]|\d+\.|\[actividad|<)',l)
for g,a,nen,nes,kw in T:
  for L in ('en','es'):
    if (L,g) not in IDX: print('NO GUIA',L,g); continue
    if (L,a) not in IDX: print('NO AGOTADA',L,a); continue
    f,c,s=IDX[(L,g)]; _,ca,sa=IDX[(L,a)]
    url=(f'/guias/{ca}/{sa}' if L=='es' else f'/en/guides/{ca}/{sa}')
    d,t,e=load(f); body=t[e:]
    if url in body: print('YA',f); continue
    lines=body.split('\n'); pos=None
    HR=[r'^#{2,3} .*('+'|'.join(map(re.escape,kw))+')', r'^## (Book|Reserva|What to book|Qué reservar|Tickets|Entradas|Los imprescindibles)']
    for hr in HR:
        for i,l in enumerate(lines):
            if re.match(hr,l):
                j=i+1
                while j<len(lines) and not lines[j].strip(): j+=1
                if j>=len(lines) or lines[j].startswith('#'): continue
                while j+1<len(lines) and lines[j+1].strip() and not lines[j+1].startswith('#'): j+=1
                pos=j; break
        if pos is not None: break
    if pos is None: print('SIN PARRAFO',f); continue
    txt=(f'**{nen} tickets sold out?** Here are [the alternatives that still work]({url}).' if L=='en' else f'**¿No quedan entradas {nes}?** Aquí tienes [las alternativas que siguen funcionando]({url}).')
    lines[pos+1:pos+1]=['',txt]
    print('OK',L,f.split('/')[-1],'| tras:',lines[pos][:70])
    if not DRY: open(f,'w',encoding='utf-8').write(t[:e]+'\n'.join(lines))
