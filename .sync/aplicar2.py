import json,sys,re,yaml,os
from PIL import Image
E=os.path.expanduser('~/mnt/imagenes-master')
dec=json.load(open(sys.argv[1])); aud=json.load(open('.sync/audit_fotos.json')); ecred=json.load(open('.sync/e_creditos.json'))
APPLY='--apply' in sys.argv
def key(f):
    s=f['slugs'].get('es') if f['slugs'] else None
    return s or (f['lang']+':'+f['slug'])
porK={}
for f in aud['fichas']: porK.setdefault(key(f),[]).append(f['p'])
def q(s): return "'"+s.replace("'","''")+"'"
def slugify(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')[:60]
log=[]
for d in dec:
    new=d['path']
    if d['src']=='E':
        base=slugify(os.path.splitext(os.path.basename(new))[0])
        folder=f"public/images/actividades/{d['c']}/fotos-biblioteca"
        dest=f"{folder}/{base}.webp"; webp='/'+dest[len('public/'):]
        if APPLY:
            os.makedirs(folder,exist_ok=True)
            im=Image.open(os.path.join(E,new)).convert('RGB'); w,h=im.size
            tw,th=(w,int(w*3/4)) if w*3/4<=h else (int(h*4/3),h)
            l=(w-tw)//2; t=(h-th)//2; im=im.crop((l,t,l+tw,t+th)).resize((1600,1200),Image.LANCZOS)
            im.save(dest,'WEBP',quality=80)
            cr=os.path.join(folder,'CREDITOS.md')
            if not os.path.exists(cr): open(cr,'w',encoding='utf-8').write(f"# Créditos · {d['c']}/fotos-biblioteca\n\nFotos de la biblioteca E:\\imagenes-master, recortadas a 1600×1200 y convertidas a WebP.\n\n")
            winp='E:\\imagenes-master\\'+new.replace('/','\\')
            open(cr,'a',encoding='utf-8').write('- `'+base+'.webp` — '+ecred.get(new,'origen por confirmar')+' ('+winp+')\n')
        new=webp
    for p in porK.get(d['k'],[]):
        lang=p.split('/')[2]
        s=open(p,encoding='utf-8').read(); end=s.index('\n---',3); fm_txt=s[:end]; body=s[end:]
        fm=yaml.safe_load(fm_txt[3:]); gal=[g for g in (fm.get('galeria') or []) if isinstance(g,dict)]
        old=fm.get('imagen'); oldalt=fm.get('imagenAlt') or ''
        gal=[g for g in gal if g.get('src')!=new]
        if old and not d['quitar_antigua']: gal.insert(0,{'src':old,'alt':oldalt})
        alt=d['alts'].get(lang) or d['alts']['en']
        lines=fm_txt.split('\n'); out=[]; skip=False; had_alt=False
        for ln in lines:
            if skip:
                if ln.startswith('- ') or ln.startswith('  '): continue
                skip=False
            if re.match(r'^imagen:',ln): out.append('imagen: '+new); continue
            if re.match(r'^imagenAlt:',ln): out.append('imagenAlt: '+q(alt)); had_alt=True; continue
            if re.match(r'^galeria:',ln):
                out.append('galeria:')
                for g in gal: out.append('- src: '+g['src']); out.append('  alt: '+q(g.get('alt') or ''))
                skip=True; continue
            out.append(ln)
        newtxt='\n'.join(out)
        if not had_alt: newtxt=newtxt.replace('imagen: '+new,'imagen: '+new+'\nimagenAlt: '+q(alt),1)
        newtxt+=body
        yaml.safe_load(newtxt[3:newtxt.index('\n---',3)])
        if APPLY: open(p,'w',encoding='utf-8').write(newtxt)
        log.append(p)
print(len(log),'archivos')
