import json,sys,re,yaml,os,collections
APPLY='--apply' in sys.argv
aud=json.load(open('.sync/audit_fotos.json'))
def key(f):
    s=f['slugs'].get('es') if f['slugs'] else None
    return s or (f['lang']+':'+f['slug'])
fm_cache={}
def load(p):
    if p not in fm_cache:
        s=open(p,encoding='utf-8').read(); end=s.index('\n---',3)
        fm_cache[p]=(s,end,yaml.safe_load(s[3:end]))
    return fm_cache[p]
ALT=collections.defaultdict(dict); FOLDER=collections.defaultdict(collections.Counter)
for f in aud['fichas']:
    s,end,fm=load(f['p']); lang=f['lang']
    items=[(fm.get('imagen'),fm.get('imagenAlt'))]+[(g.get('src'),g.get('alt')) for g in (fm.get('galeria') or []) if isinstance(g,dict)]
    for u,a in items:
        if u and a and not str(u).startswith('http') and os.path.exists('public'+u):
            ALT[lang].setdefault(u,a); FOLDER[os.path.dirname(u)][u]+=1
G=collections.defaultdict(list)
for f in aud['fichas']: G[key(f)].append(f)
def q(s): return "'"+str(s).replace("'","''")+"'"
stats=collections.Counter(); faltan=[]
for k,fs in G.items():
    ref=sorted(fs,key=lambda f:(f['lang']!='es',f['lang']!='en'))[0]
    s,end,fm=load(ref['p'])
    have=[fm.get('imagen')]+[g.get('src') for g in (fm.get('galeria') or []) if isinstance(g,dict)]
    have=[h for h in have if h]
    if len(have)>=8: continue
    folders=collections.Counter(os.path.dirname(h) for h in have if not str(h).startswith('http'))
    pool=[]
    for fo,_ in folders.most_common():
        for u,_c in FOLDER[fo].most_common():
            if u not in have and u not in pool: pool.append(u)
    for f in fs:
        s,end,fm=load(f['p']); lang=f['lang']
        gal=[g for g in (fm.get('galeria') or []) if isinstance(g,dict)]
        cur=set([fm.get('imagen')]+[g.get('src') for g in gal])
        need=8-len([x for x in cur if x])
        add=[]
        for u in pool:
            if need<=0: break
            if u in cur: continue
            a=ALT[lang].get(u)
            if not a: continue
            add.append({'src':u,'alt':a}); need-=1
        if need>0: faltan.append((f['p'],need))
        if not add: continue
        gal=gal+add; stats['fichas']+=1; stats['fotos']+=len(add)
        fm_txt=s[:end]; body=s[end:]
        lines=fm_txt.split('\n'); out=[]; skip=False; done=False
        for ln in lines:
            if skip:
                if ln.startswith('- ') or ln.startswith('  '): continue
                skip=False
            if re.match(r'^galeria:',ln):
                out.append('galeria:')
                for g in gal: out.append('- src: '+g['src']); out.append('  alt: '+q(g.get('alt') or ''))
                skip=True; done=True; continue
            out.append(ln)
        if not done:
            out.append('galeria:')
            for g in gal: out.append('- src: '+g['src']); out.append('  alt: '+q(g.get('alt') or ''))
        new='\n'.join(out)+body
        yaml.safe_load(new[3:new.index('\n---',3)])
        if APPLY: open(f['p'],'w',encoding='utf-8').write(new)
print(dict(stats)); print('fichas que siguen por debajo de 8:',len(faltan))
json.dump(faltan,open('.sync/faltan8.json','w'))
