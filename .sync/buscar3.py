import json,os,glob,re,yaml
from PIL import Image,ImageDraw,ImageFont
E=os.path.expanduser('~/mnt/imagenes-master')
aud=json.load(open('.sync/audit_fotos.json')); ecred=json.load(open('.sync/e_creditos.json'))
def key(f):
    s=f['slugs'].get('es') if f['slugs'] else None
    return s or (f['lang']+':'+f['slug'])
mains=set(f['imgs'][0][1] for f in aud['fichas'] if f['imgs'] and f['imgs'][0][1])
B=json.load(open('.sync/pend_B.json'))
STOP=set('desde tour privado privada grupo reducido visita guiada entrada excursion con para dia completo medio recogida hotel ticket tickets guia oficial sin colas incluida incluido entradas espectaculo cena bebida horas audioguia'.split())
A=[]
for p,n in json.load(open('.sync/faltan8.json')):
    if '/es/' not in p: continue
    s=open(p,encoding='utf-8').read(); fm=yaml.safe_load(s[3:s.index('\n---',3)])
    tit=str(fm.get('titulo','')).lower().translate(str.maketrans('áéíóúñüàèòç','aeiounuaeoc'))
    toks=[t for t in re.sub(r'[^a-z0-9 ]',' ',tit).split() if len(t)>=4 and t not in STOP]
    have=[fm.get('imagen')]+[g['src'] for g in fm.get('galeria') or []]
    A.append({'n':'A'+str(len(A)),'k':fm.get('slug'),'c':p.split('/')[3],'t':fm.get('titulo'),'main':fm.get('imagen'),'why':f'faltan {n}','kw':toks,'tipo':'gal','need':n,'have':have})
rows=B+A
pub=[p[6:] for p in glob.glob('public/images/actividades/**/*.webp',recursive=True) if not re.search(r'-(card|thumb|og)\.webp$',p) and '-hero-hero' not in p]
epaths=list(ecred.keys()); sizes={}
def ok(path):
    if path not in sizes:
        try: w,h=Image.open(path).size; sizes[path]=(w>=1600 and h>=1000)
        except Exception: sizes[path]=False
    return sizes[path]
for r in rows:
    kws=[k.lower() for k in r['kw']]; have=set(r.get('have',[]))
    def m(s): s=s.lower(); return any(k in s for k in kws) and (r['c'] in s or r['tipo']=='main' or True)
    cs=[]; lim=10
    for u in pub:
        if len(cs)>=5: break
        if u in have or (r['tipo']=='main' and u in mains) or not m(u): continue
        if f"/{r['c']}/" not in u and r['tipo']=='gal': continue
        if ok('public'+u): cs.append(['W',u])
    for e in epaths:
        if len(cs)>=lim: break
        if not m(e): continue
        if ok(os.path.join(E,e)): cs.append(['E',e])
    r['cand']=cs
json.dump(rows,open('.sync/pend3.json','w'),ensure_ascii=False)
print(len(rows),'filas;',sum(1 for r in rows if r['cand']),'con candidatas')
# sheets
font=ImageFont.truetype('/usr/share/fonts/truetype/lato/Lato-Medium.ttf',13)
TW,TH=170,128; COLS=11; RPS=10; rr=[r for r in rows if r['cand']]
os.makedirs('.sync/hojas-3',exist_ok=True)
for s in range(0,len(rr),RPS):
    ch=rr[s:s+RPS]; sh=Image.new('RGB',(COLS*TW,len(ch)*(TH+38)),'white'); d=ImageDraw.Draw(sh)
    for ri,r in enumerate(ch):
        y=ri*(TH+38); d.text((3,y),f"#{r['n']} [{'PRINCIPAL' if r['tipo']=='main' else 'GALERÍA: faltan '+str(r['need'])}] {r['c']} · {str(r['t'])[:80]}",fill='black',font=font)
        cells=[('ACTUAL','W',r['main'] or '')]+[(str(i+1),a,b) for i,(a,b) in enumerate(r['cand'])]
        for ci,(lab,src,u) in enumerate(cells):
            x=ci*TW
            if not u or str(u).startswith('http'): d.text((x+10,y+70),'Bókun' if u else '—',fill='red',font=font)
            else:
                try: im=Image.open(('public'+u) if src=='W' else os.path.join(E,u)).convert('RGB'); im.thumbnail((TW-4,TH-4)); sh.paste(im,(x+2,y+18))
                except Exception: d.text((x+10,y+70),'ERR',fill='red',font=font)
            d.text((x+3,y+16+TH),lab,fill='red' if lab=='ACTUAL' else 'blue',font=font)
    sh.save(f'.sync/hojas-3/q-{s//RPS:02d}.jpg',quality=72)
print('hojas',(len(rr)+RPS-1)//RPS)
