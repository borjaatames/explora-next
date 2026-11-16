import os,re,json,glob,yaml
from PIL import Image
from collections import defaultdict
fichas=[]; uso=defaultdict(list)
for p in glob.glob('content/actividades/*/*/*.md'):
    s=open(p,encoding='utf-8').read()
    try: fm=yaml.safe_load(s.split('---')[1])
    except Exception as e: continue
    if not fm or fm.get('publicada') is not True: continue
    lang=p.split('/')[2]
    imgs=[('main',fm.get('imagen'))]+[('gal',g.get('src')) for g in (fm.get('galeria') or []) if isinstance(g,dict)]
    fichas.append({'p':p,'lang':lang,'slug':fm.get('slug'),'slugs':fm.get('slugs') or {},'titulo':fm.get('titulo'),'prov':fm.get('proveedor'),'idx':fm.get('indexar',True),'imgs':imgs})
    for k,u in imgs:
        if u: uso[u].append(p)
info={}
for u in uso:
    if not isinstance(u,str): continue
    if u.startswith('http'): info[u]={'ext':True}; continue
    f='public'+u
    if not os.path.exists(f): info[u]={'missing':True}; continue
    try:
        im=Image.open(f); w,h=im.size; sz=os.path.getsize(f)
        info[u]={'w':w,'h':h,'kb':sz//1024,'bpp':round(sz*8/(w*h),3)}
    except Exception as e: info[u]={'err':str(e)}
json.dump({'fichas':fichas,'info':info,'uso':{k:len(v) for k,v in uso.items()}},open('.sync/audit_fotos.json','w'))
print(len(fichas),'fichas',len(info),'fotos')
