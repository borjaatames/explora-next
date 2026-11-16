import json,sys,re,yaml,os
dec=json.load(open(sys.argv[1]))   # [{"k":slug_es_or_lang:slug,"nuevo":path,"quitar_antigua":bool}]
aud=json.load(open('.sync/audit_fotos.json'))
APPLY='--apply' in sys.argv
def key(f):
    s=f['slugs'].get('es') if f['slugs'] else None
    return s or (f['lang']+':'+f['slug'])
porK={}
for f in aud['fichas']: porK.setdefault(key(f),[]).append(f['p'])
def q(s): return "'"+s.replace("'","''")+"'"
log=[]
for d in dec:
    for p in porK.get(d['k'],[]):
        s=open(p,encoding='utf-8').read()
        end=s.index('\n---',3); fm_txt=s[:end]; body=s[end:]
        fm=yaml.safe_load(fm_txt[3:])
        gal=fm.get('galeria') or []; old=fm.get('imagen'); oldalt=fm.get('imagenAlt') or ''
        idx=[i for i,g in enumerate(gal) if isinstance(g,dict) and g.get('src')==d['nuevo']]
        if not idx: log.append(('SIN-CANDIDATA',p)); continue
        i=idx[0]; newalt=gal[i].get('alt') or oldalt
        if d.get('quitar_antigua') or not old or str(old).startswith('http') and False:
            gal.pop(i)
        else:
            gal[i]={'src':old,'alt':oldalt}
        # rebuild galeria block textually
        lines=fm_txt.split('\n')
        out=[];skip=False
        for ln in lines:
            if skip:
                if ln.startswith('- ') or ln.startswith('  '): continue
                skip=False
            if re.match(r'^imagen:',ln): out.append('imagen: '+d['nuevo']); continue
            if re.match(r'^imagenAlt:',ln): out.append('imagenAlt: '+q(newalt)); continue
            if re.match(r'^galeria:',ln):
                out.append('galeria:')
                for g in gal: out.append('- src: '+g['src']); out.append('  alt: '+q(g.get('alt') or ''))
                skip=True; continue
            out.append(ln)
        new='\n'.join(out)+body
        yaml.safe_load(new[3:new.index('\n---',3)])
        if not re.search(r'^imagenAlt:',new,re.M):
            new=new.replace('imagen: '+d['nuevo'],'imagen: '+d['nuevo']+'\nimagenAlt: '+q(newalt),1)
        if APPLY: open(p,'w',encoding='utf-8').write(new)
        log.append(('OK',p))
import collections
print(collections.Counter(a for a,b in log)); [print(a,b) for a,b in log if a!='OK']
