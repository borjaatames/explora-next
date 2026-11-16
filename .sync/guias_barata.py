import json,re,yaml,glob,collections
FM=re.compile(r'^---\n(.*?)\n---\n',re.S)
IDX={}
def fic(lang,city,slug):
    if (lang,city) not in IDX:
        IDX[(lang,city)]={}
        for f in glob.glob(f'content/actividades/{lang}/{city}/*.md'):
            try: y=yaml.safe_load(FM.match(open(f,encoding='utf-8').read()).group(1))
            except Exception: continue
            IDX[(lang,city)][y.get('slug') or f.split('/')[-1][:-3]]=y
    return IDX[(lang,city)].get(slug) or {}
LINK=re.compile(r'\[([^\]]+)\]\((/(?:([a-z]{2})/)?(?:ciudades|cities)/([^/)]+)/(?:actividades|activities)/([^)#?\s/]+))\)')
N={'de':{'es':'Spanisch','en':'Englisch','fr':'Französisch','it':'Italienisch','pt':'Portugiesisch','de':'Deutsch','ca':'Katalanisch'},
   'fr':{'es':'espagnol','en':'anglais','fr':'français','it':'italien','pt':'portugais','de':'allemand','ca':'catalan'},
   'it':{'es':'spagnolo','en':'inglese','fr':'francese','it':'italiano','pt':'portoghese','de':'tedesco','ca':'catalano'},
   'pt':{'es':'espanhol','en':'inglês','fr':'francês','it':'italiano','pt':'português','de':'alemão','ca':'catalão'},
   'es':{'es':'español','en':'inglés','fr':'francés','it':'italiano','pt':'portugués','de':'alemán','ca':'catalán'},
   'en':{'es':'Spanish','en':'English','fr':'French','it':'Italian','pt':'Portuguese','de':'German','ca':'Catalan'}}
J={'de':'und','fr':'et','it':'e','pt':'e','es':'y','en':'and'}
P={'de':'nur auf {}','fr':'uniquement en {}','it':'solo in {}','pt':'só em {}','es':'solo en {}','en':'{} only'}
def note(L,ids):
    ns=[N[L].get(i,i) for i in ids if i in N[L] and i!='ca'] or [N[L].get(i,i) for i in ids]
    ns=list(dict.fromkeys(ns))
    s=ns[0] if len(ns)==1 else ', '.join(ns[:-1])+f' {J[L]} '+ns[-1]
    t=P[L].format(s)
    return t[0].upper()+t[1:] if L=='en' else t
d=json.load(open('/tmp/sust.json'))
by=collections.defaultdict(list); st=collections.Counter()
for x in d:
    L=x['L']; mo=[m for m in LINK.finditer(x['old']) if (m.group(3) or 'es')!=L or True]
    # old link that was replaced = in old, not in new
    newurls={m.group(2) for m in LINK.finditer(x['new'])}
    olds=[m for m in LINK.finditer(x['old']) if m.group(2) not in newurls]
    if len(olds)!=1: st['skipmulti']+=1; continue
    m=olds[0]; fo=fic(m.group(3) or 'es',m.group(4),m.group(5)); l,c,s=x['key']; nv=fic(l,c,s)
    po,pn=fo.get('precioDesde'),nv.get('precioDesde')
    if po is None or pn is None: st['noprice']+=1; continue
    if not (pn>po*1.3 and pn-po>=15): st['similar']+=1; continue
    cells=x['old'].split('|')
    nt=note(L,[str(i) for i in fo.get('idiomas') or []])
    for ci in range(1,len(cells)-1):
        if m.group(0) in cells[ci]:
            if re.match(r'^\W*\d|^[^\d]*€',m.group(1)) and ci!=1: cells[1]=cells[1].rstrip()+f' ({nt}) '
            else: cells[ci]=cells[ci].replace(m.group(0),m.group(0)+f' ({nt})')
            break
    by[x['g']].append((x['new'],'|'.join(cells))); st['add']+=1
print(st)
ch=[]
for g,items in by.items():
    t=open(g,encoding='utf-8').read().split('\n')
    for new,oldn in items:
        if new in t and oldn not in t:
            k=t.index(new); t.insert(k+1,oldn)
    open(g,'w',encoding='utf-8').write('\n'.join(t)); ch.append(g)
json.dump(ch,open('/tmp/ch2.json','w'))
import random;random.seed(2)
for g in random.sample(list(by),5): print(g[13:]);[print('  ',a[:150],'\n  +',b[:170]) for a,b in by[g][:1]]
