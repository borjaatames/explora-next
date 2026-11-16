import os, re, subprocess, glob
os.chdir(os.path.expanduser('~/mnt/explora-next'))
new = set(subprocess.check_output(['git', 'diff', '--name-only', '--diff-filter=A', '7a8a2bb4', 'HEAD', '--', 'content/actividades']).decode().split())
IMG = 'public'
FALLBACK = {'sevilla/flamenco': ['barcelona/flamenco', 'madrid/flamenco-espectaculo'],
            'madrid/flamenco-espectaculo': ['barcelona/flamenco'],
            'barcelona/flamenco': ['madrid/flamenco-espectaculo'],
            'granada/mirador-san-nicolas': ['granada/albaicin']}
def pool(folder):
    out = []
    for f in [folder] + FALLBACK.get(folder, []):
        d = f'{IMG}/images/actividades/{f}'
        if not os.path.exists(f'{d}/CREDITOS.md'): continue
        for n in sorted(os.listdir(d)):
            if n.endswith('.webp') and not re.search(r'-(card|og|thumb)\.webp$', n):
                out.append(f'/images/actividades/{f}/{n}')
    return out
def main_of(txt):
    m = re.search(r'^imagen: "?([^"\n]+)"?$', txt, re.M); return m.group(1) if m else None
changes = []
for lang in os.listdir('content/actividades'):
    files = sorted(glob.glob(f'content/actividades/{lang}/**/*.md', recursive=True))
    used = {}
    order = [f for f in files if f not in new] + [f for f in files if f in new]
    for f in order:
        t = open(f, encoding='utf-8').read()
        if not re.search(r'^publicada: true', t, re.M): continue
        im = main_of(t)
        if not im: continue
        if im not in used: used[im] = f; continue
        if f not in new: continue  # old vs old: not ours
        folder = '/'.join(im.split('/')[3:-1])
        cand = next((c for c in pool(folder) if c not in used), None)
        if not cand: print('SIN CANDIDATA', f, im); continue
        t2 = re.sub(r'^imagen: .*$', f'imagen: "{cand}"', t, count=1, flags=re.M)
        t2 = t2.replace(f'src: "{cand}"', f'src: "{im}"')  # swap if it was in gallery
        open(f, 'w', encoding='utf-8').write(t2)
        used[cand] = f; changes.append((f, im.split('/')[-1], cand.split('/')[-2] + '/' + cand.split('/')[-1]))
for c in changes: print(*c)
print(len(changes))
