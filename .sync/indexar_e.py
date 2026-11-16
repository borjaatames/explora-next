import os,csv,json,re,io
E=os.path.expanduser('~/mnt/imagenes-master'); idx={}
for root,dirs,fs in os.walk(E):
    for f in fs:
        if f.lower().startswith(('creditos','_creditos')) and f.endswith('.csv'):
            raw=open(os.path.join(root,f),encoding='utf-8-sig').read()
            sep=';' if raw.count(';')>raw.count(',') else ','
            for row in csv.DictReader(io.StringIO(raw),delimiter=sep):
                tema=row.get('tema') or row.get('carpeta') or ''; arch=row.get('archivo') or ''
                p=os.path.join(root,tema,arch) if tema else os.path.join(root,arch)
                autor=row.get('autor',''); lic=row.get('licencia',''); fuente=row.get('fuente') or ('Wikimedia Commons' if row.get('titulo_commons') else '')
                url=row.get('url') or ('https://commons.wikimedia.org/wiki/'+row['titulo_commons'].replace(' ','_') if row.get('titulo_commons') else '')
                idx[os.path.relpath(p,E)]=f'{autor}, {lic}, vía {fuente} ({url})'
for root,dirs,fs in os.walk(E):
    for f in fs:
        m=re.match(r'(.+)-([A-Za-z0-9_-]{11})-unsplash\.(jpe?g|webp)$',f)
        if m:
            rel=os.path.relpath(os.path.join(root,f),E)
            idx.setdefault(rel,f"{m.group(1).replace('-',' ').title()}, licencia Unsplash, vía Unsplash (https://unsplash.com/photos/{m.group(2)})")
json.dump(idx,open(os.path.expanduser('~/mnt/explora-next/.sync/e_creditos.json'),'w'),ensure_ascii=False)
print(len(idx))
