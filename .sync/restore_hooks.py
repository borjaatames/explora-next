import re, os, glob, sys, json
LINK = re.compile(r'\]\(/(?:[a-z]{2}/)?(?:ciudades|cities)/[^)]+/(?:actividades|activities)/')
SC = re.compile(r'^\[actividad:\s*([^\]]+?)\s*\]\s*$')
STOP = set('de la el en y a con los las del para por que un una o al lo the and of in to with for on de des du le les et à pour avec die der das und mit für im il e per con do da em com no na'.split())
def split(t):
    m = re.match(r'^---\n.*?\n---\n', t, re.S)
    return (t[:m.end()], t[m.end():]) if m else ('', t)
def sections(body):
    lines = body.split('\n'); secs = []; cur = [None, []]
    for ln in lines:
        if ln.startswith('## '):
            secs.append(cur); cur = [ln, []]
        else: cur[1].append(ln)
    secs.append(cur); return secs
def words(h): return {w for w in re.findall(r'\w+', (h or '').lower()) if w not in STOP and len(w) > 2}
dry = '--dry' in sys.argv
stats = {'files': 0, 'tables': 0, 'sc': 0}
for old in glob.glob('/tmp/old/content/guias/*/*/*.md'):
    rel = old[len('/tmp/old/'):]
    if not os.path.exists(rel): continue
    ot = open(old, encoding='utf-8').read(); nt = open(rel, encoding='utf-8').read()
    _, ob = split(ot); fm, nb = split(nt)
    blocks = []; scs = []
    for h, ls in sections(ob):
        tbl = [l for l in ls if l.startswith('|')]
        if tbl and any(LINK.search(l) for l in tbl):
            # keep heading + contiguous table lines (first table with links)
            out = []; started = False
            for l in ls:
                if l.startswith('|'): out.append(l); started = True
                elif started: break
            if not any(LINK.search(l) for l in out):
                out = tbl
            if LINK.search('\n'.join(out)) and not all(l in nb for l in out if LINK.search(l)):
                blocks.append(((h + '\n\n') if h else '') + '\n'.join(out))
        for l in ls:
            m = SC.match(l.strip())
            if m: scs.append((h, m.group(1)))
    newsc = set(m.group(1) for m in (SC.match(l.strip()) for l in nb.split('\n')) if m)
    scs = [(h, s) for h, s in scs if s not in newsc]
    # dedupe
    seen = set(); scs = [x for x in scs if not (x[1] in seen or seen.add(x[1]))]
    if not blocks and not scs: continue
    secs = sections(nb)
    for h, s in scs:
        ow = words(h); best = None; score = 0
        for i, (nh, _) in enumerate(secs):
            if nh is None or re.search(r'preguntas|faq|questions|fragen|domande|perguntas', nh, re.I): continue
            sc = len(ow & words(nh))
            if (h and nh.strip() == h.strip()): sc = 99
            if sc > score: best, score = i, sc
        if best is None:
            # first real section
            best = next((i for i, (nh, _) in enumerate(secs) if nh), 0)
        ls = secs[best][1]
        while ls and ls[-1].strip() == '': ls.pop()
        ls += ['', f'[actividad: {s}]', '']
        stats['sc'] += 1
    nb2 = '\n'.join('\n'.join(([h] if h else []) + ls) for h, ls in secs)
    if blocks:
        i = nb2.find('\n## ')
        ins = '\n\n'.join(blocks) + '\n'
        nb2 = (nb2[:i+1] + ins + '\n' + nb2[i+1:]) if i >= 0 else (nb2 + '\n\n' + ins)
        stats['tables'] += len(blocks)
    nb2 = re.sub(r'\n{3,}', '\n\n', nb2)
    stats['files'] += 1
    if not dry: open(rel, 'w', encoding='utf-8').write(fm + nb2)
print(json.dumps(stats))
