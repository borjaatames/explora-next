import json,sys,re,yaml,os
from PIL import Image
E=os.path.expanduser('~/mnt/imagenes-master')
dec=json.load(open('.sync/dec3.json')); aud=json.load(open('.sync/audit_fotos.json')); ecred=json.load(open('.sync/e_creditos.json'))
def key(f):
    s=f['slugs'].get('es') if f['slugs'] else None
    return s or (f['lang']+':'+f['slug'])
porK={}
for f in aud['fichas']: porK.setdefault(key(f),[]).append(f['p'])
porSlug={}
for f in aud['fichas']: porSlug[f['slug']]=key(f)
def q(s): return "'"+str(s).replace("'","''")+"'"
def slugify(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')[:70]
conv={}
for d in dec:
    if d['src']=='E':
        if d['path'] not in conv:
            parts=d['path'].split('/'); base=slugify((parts[-2] if len(parts)>1 else '')+'-'+os.path.splitext(parts[-1])[0])
            folder=f"public/images/actividades/{d['c']}/fotos-biblioteca"; os.makedirs(folder,exist_ok=True)
            dest=f"{folder}/{base}.webp"
            if not os.path.exists(dest):
                im=Image.open(os.path.join(E,d['path'])).convert('RGB'); w,h=im.size
                tw,th=(w,int(w*3/4)) if w*3/4<=h else (int(h*4/3),h); l=(w-tw)//2; t=(h-th)//2
                im.crop((l,t,l+tw,t+th)).resize((1600,1200),Image.LANCZOS).save(dest,'WEBP',quality=80)
                cr=os.path.join(folder,'CREDITOS.md')
                if not os.path.exists(cr): open(cr,'w',encoding='utf-8').write(f"# Créditos · {d['c']}/fotos-biblioteca\n\nFotos de la biblioteca E:\\imagenes-master, recortadas a 1600×1200 y convertidas a WebP.\n\n")
                winp='E:\\imagenes-master\\'+d['path'].replace('/','\\')
                open(cr,'a',encoding='utf-8').write('- `'+base+'.webp` — '+ecred.get(d['path'],'origen por confirmar')+' ('+winp+')\n')
            conv[d['path']]='/'+dest[len('public/'):]
        d['final']=conv[d['path']]
    else: d['final']=d['path']
def rewrite(p,fn):
    s=open(p,encoding='utf-8').read(); end=s.index('\n---',3); fm=yaml.safe_load(s[3:end])
    gal=[g for g in (fm.get('galeria') or []) if isinstance(g,dict)]
    main,alt,gal=fn(fm.get('imagen'),fm.get('imagenAlt') or '',gal,p.split('/')[2])
    out=[];skip=False;had=False
    for ln in s[:end].split('\n'):
        if skip:
            if ln.startswith('- ') or ln.startswith('  '): continue
            skip=False
        if re.match(r'^imagen:',ln): out.append('imagen: '+main); continue
        if re.match(r'^imagenAlt:',ln): out.append('imagenAlt: '+q(alt)); had=True; continue
        if re.match(r'^galeria:',ln):
            out.append('galeria:')
            for g in gal: out.append('- src: '+g['src']); out.append('  alt: '+q(g.get('alt') or ''))
            skip=True; continue
        out.append(ln)
    t='\n'.join(out)
    if not had: t=t.replace('imagen: '+main,'imagen: '+main+'\nimagenAlt: '+q(alt),1)
    t+=s[end:]; yaml.safe_load(t[3:t.index('\n---',3)]); open(p,'w',encoding='utf-8').write(t)
n=0
for d in dec:
    k=d['k'] if d['k'] in porK else porSlug.get(d['k'],d['k'])
    for p in porK.get(k,[]):
        lang=p.split('/')[2]; alt=d['alts'].get(lang) or d['alts']['en']
        if d['tipo']=='main':
            def fn(old,oldalt,gal,lang,d=d,alt=alt):
                gal=[g for g in gal if g.get('src')!=d['final']]
                if old and not d['quitar_antigua'] and old!=d['final']: gal.insert(0,{'src':old,'alt':oldalt})
                return d['final'],alt,gal
        else:
            def fn(old,oldalt,gal,lang,d=d,alt=alt):
                if d['final']!=old and all(g.get('src')!=d['final'] for g in gal): gal=gal+[{'src':d['final'],'alt':alt}]
                return old,oldalt,gal
        rewrite(p,fn); n+=1
print(n,'escrituras;',len(conv),'fotos nuevas de E')
