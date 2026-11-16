import glob,re,yaml,sys
APPLY='--apply' in sys.argv; n=0; quit=0
def q(s): return "'"+str(s).replace("'","''")+"'"
for p in glob.glob('content/actividades/*/*/*.md'):
    s=open(p,encoding='utf-8').read()
    try: end=s.index('\n---',3); fm=yaml.safe_load(s[3:end])
    except Exception: continue
    gal=[g for g in (fm.get('galeria') or []) if isinstance(g,dict)]
    seen={fm.get('imagen')}; new=[]
    for g in gal:
        if g.get('src') in seen: continue
        seen.add(g.get('src')); new.append(g)
    if len(new)==len(gal): continue
    n+=1; quit+=len(gal)-len(new)
    lines=s[:end].split('\n'); out=[]; skip=False
    for ln in lines:
        if skip:
            if ln.startswith('- ') or ln.startswith('  '): continue
            skip=False
        if re.match(r'^galeria:',ln):
            out.append('galeria:')
            for g in new: out.append('- src: '+g['src']); out.append('  alt: '+q(g.get('alt') or ''))
            skip=True; continue
        out.append(ln)
    t='\n'.join(out)+s[end:]; yaml.safe_load(t[3:t.index('\n---',3)])
    if APPLY: open(p,'w',encoding='utf-8').write(t)
print(n,'fichas,',quit,'fotos repetidas quitadas')
