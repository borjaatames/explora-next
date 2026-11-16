import re,glob,yaml,sys
FM=re.compile(r'^---\n(.*?)\n---\n',re.S)
L=sys.argv[1]
pre='/guias' if L=='es' else f'/{L}/guides'
# monumento -> palabras clave (en el texto)
KW={'alhambra-entradas-agotadas':['Alhambra'],'alhambra-nocturna-entradas-agotadas':['Alhambra'],'alcazar-de-sevilla-entradas-agotadas':['Alcázar de Sevilla','Real Alcázar','Alcazar of Seville','Royal Alcázar'],
'catedral-sevilla-giralda-entradas-agotadas':['Giralda'],'sagrada-familia-entradas-agotadas':['Sagrada Famil'],'park-guell-entradas-agotadas':['Park Güell'],'casa-batllo-entradas-agotadas':['Casa Batll'],
'la-pedrera-entradas-agotadas':['Pedrera'],'museo-picasso-barcelona-entradas-agotadas':['Museo Picasso','Picasso Museum'],'palau-musica-catalana-entradas-agotadas':['Palau de la Música','Palau de la Musica'],
'camp-nou-tour-entradas-agotadas':['Camp Nou','Spotify'],'museo-del-prado-entradas-agotadas':['Prado'],'museo-reina-sofia-entradas-agotadas':['Reina Sof'],'palacio-real-madrid-entradas-agotadas':['Palacio Real','Royal Palace'],
'bernabeu-tour-entradas-agotadas':['Bernabéu','Bernabeu'],'el-escorial-entradas-agotadas':['Escorial'],'alcazar-segovia-entradas-agotadas':['Alcázar de Segovia','Alcázar of Segovia','Alcazar of Segovia'],
'mezquita-cordoba-entradas-agotadas':['Mezquita','Mosque'],'museo-dali-figueres-entradas-agotadas':['Dalí','Dali Theatre'],'guggenheim-bilbao-entradas-agotadas':['Guggenheim'],
'caminito-del-rey-entradas-agotadas':['Caminito'],'museo-picasso-malaga-entradas-agotadas':['Picasso'],'teide-entradas-agotadas':['Teide'],'oceanografic-valencia-entradas-agotadas':['Oceanogr']}
def load(f):
    t=open(f,encoding='utf-8').read();m=FM.match(t);return (yaml.safe_load(m.group(1)) or {}),t[m.end():]
agot={}
for f in glob.glob(f'content/guias/{L}/*/*.md'):
    d,b=load(f);es=(d.get('slugs') or {}).get('es') or d.get('slug')
    if es in KW: agot[es]=(f.split('/')[3],d.get('slug'),d.get('titulo'))
out=[]
for f in sorted(glob.glob(f'content/guias/{L}/*/*.md')):
    d,b=load(f);es=(d.get('slugs') or {}).get('es') or d.get('slug')
    if es in KW or d.get('publicada') is False: continue
    city=f.split('/')[3]
    for k,(c,s,tit) in agot.items():
        if c!=city: continue
        url=f'{pre}/{c}/{s}'
        if url in b: continue
        n=sum(b.count(w) for w in KW[k])
        if n>=3: out.append((n,f,url))
for n,f,u in sorted(out,reverse=True): print(n,f.replace(f'content/guias/{L}/',''),'->',u.split('/')[-1])
