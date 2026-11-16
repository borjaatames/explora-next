import re,glob,yaml
FM=re.compile(r'^---\n(.*?)\n---\n',re.S)
def load(f):
    t=open(f,encoding='utf-8').read();m=FM.match(t);return (yaml.safe_load(m.group(1)) if m else {}) or {},t
F={}
for f in glob.glob('content/actividades/en/*/*.md'):
    d,_=load(f);city=f.split('/')[3];F[(city,(d.get('slugs') or {}).get('es') or d.get('slug'))]=(f,d)
G={'christmas-in-malaga':'malaga','what-to-see-in-tenerife':'tenerife','roque-nublo-hike':'gran-canaria','segovia-day-trip-from-madrid':'madrid','maspalomas-dunes-guide':'gran-canaria'}
for s,c in G.items():
    d,t=load(f'content/guias/en/{c}/{s}.md')
    print('##',s,'reservasArriba',d.get('reservasArriba'),'opciones',bool(d.get('opciones')))
    for a in d.get('actividades') or []:
        x=F.get((c,a))
        if not x: print('  -',a,'SIN FICHA EN'); continue
        f,v=x;print('  -',a,'|',v.get('slug'),'|',v.get('idiomas'),'|',v.get('categoria'),'|',v.get('numeroOpiniones'),'|',v.get('ratingProveedor'),'|',v.get('precioDesde'),'|',v.get('publicada',True),'|',v.get('titulo')[:60])
    body=t.split('---',2)[2].strip().split('\n')[:3];print('  BODY:',body[0][:100])
