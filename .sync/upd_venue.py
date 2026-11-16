"""Uso: python3 upd_venue.py <es/ciudad/slug.md> <carpeta images (ciudad/carpeta)> "<Nombre local>" tipo1:archivo1 tipo2:archivo2 ...
El primero es la principal; el resto, galería. Actualiza todas las versiones de idioma (slugs del frontmatter ES)."""
import re, glob, os, sys, json
os.chdir(os.path.expanduser('~/mnt/explora-next'))
es_rel, folder, venue = sys.argv[1], sys.argv[2], sys.argv[3]
items = [a.split(':', 1) for a in sys.argv[4:]]
T = {
 'bailaora': {'es': 'Bailaora en el escenario de {v}', 'en': 'Flamenco dancer on stage at {v}', 'de': 'Flamencotänzerin auf der Bühne von {v}', 'fr': 'Danseuse de flamenco sur la scène de {v}', 'it': 'Ballerina di flamenco sul palco di {v}', 'pt': 'Bailarina de flamenco no palco de {v}'},
 'bailaor': {'es': 'Bailaor en el escenario de {v}', 'en': 'Male flamenco dancer on stage at {v}', 'de': 'Flamencotänzer auf der Bühne von {v}', 'fr': 'Danseur de flamenco sur la scène de {v}', 'it': 'Ballerino di flamenco sul palco di {v}', 'pt': 'Bailarino de flamenco no palco de {v}'},
 'cuadro': {'es': 'Cuadro flamenco al completo en {v}', 'en': 'The full flamenco ensemble at {v}', 'de': 'Das komplette Flamenco-Ensemble in {v}', 'fr': 'La troupe de flamenco au complet à {v}', 'it': 'Il gruppo di flamenco al completo a {v}', 'pt': 'O grupo de flamenco completo em {v}'},
 'guitarra': {'es': 'Guitarra y cante en directo en {v}', 'en': 'Live guitar and singing at {v}', 'de': 'Live-Gitarre und Gesang in {v}', 'fr': 'Guitare et chant en direct à {v}', 'it': 'Chitarra e canto dal vivo a {v}', 'pt': 'Guitarra e canto ao vivo em {v}'},
 'sala': {'es': 'La sala de {v}', 'en': 'The venue at {v}', 'de': 'Der Saal von {v}', 'fr': 'La salle de {v}', 'it': 'La sala di {v}', 'pt': 'A sala de {v}'},
 'pareja': {'es': 'Pareja de baile flamenco en {v}', 'en': 'Flamenco dance couple at {v}', 'de': 'Flamenco-Tanzpaar in {v}', 'fr': 'Couple de danseurs de flamenco à {v}', 'it': 'Coppia di ballerini di flamenco a {v}', 'pt': 'Par de bailarinos de flamenco em {v}'},
 'fachada': {'es': 'Entrada de {v}', 'en': 'Entrance to {v}', 'de': 'Eingang von {v}', 'fr': 'Entrée de {v}', 'it': 'Ingresso di {v}', 'pt': 'Entrada de {v}'},
 'cena': {'es': 'Cena y espectáculo en {v}', 'en': 'Dinner and show at {v}', 'de': 'Abendessen und Show in {v}', 'fr': 'Dîner-spectacle à {v}', 'it': 'Cena e spettacolo a {v}', 'pt': 'Jantar e espetáculo em {v}'},
}
q = lambda s: json.dumps(s, ensure_ascii=False)
es_path = f'content/actividades/{es_rel}'
es = open(es_path, encoding='utf-8').read()
city = es_rel.split('/')[1]
m = re.search(r'^slugs:\n((?:  \w\w: .*\n)+)', es, re.M)
slugs = dict(re.findall(r'  (\w\w): (\S+)', m.group(1))) if m else {'es': es_rel.split('/')[-1][:-3]}
P = f'/images/actividades/{folder}/'
for lang, slug in slugs.items():
    f = f'content/actividades/{lang}/{city}/{slug}.md'
    if not os.path.exists(f): print('NO', f); continue
    t = open(f, encoding='utf-8').read()
    alt = lambda i: T[items[i][0]][lang].format(v=venue)
    t = re.sub(r'^imagen: .*$', f'imagen: {q(P + items[0][1])}', t, count=1, flags=re.M)
    t = re.sub(r'^imagenAlt: .*$', f'imagenAlt: {q(alt(0))}', t, count=1, flags=re.M)
    gal = 'galeria:\n' + ''.join(f'- src: {q(P + items[i][1])}\n  alt: {q(alt(i))}\n' for i in range(1, len(items)))
    if re.search(r'^galeria:\n', t, re.M):
        t = re.sub(r'^galeria:\n(?:[- ] .*\n)*', gal, t, count=1, flags=re.M)
    else:
        t = t.replace('\npublicada:', '\n' + gal.rstrip('\n') + '\npublicada:', 1)
    open(f, 'w', encoding='utf-8').write(t); print('OK', f)
