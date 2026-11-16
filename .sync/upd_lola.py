import re, glob, os, json
os.chdir(os.path.expanduser('~/mnt/explora-next'))
P = '/images/actividades/madrid/cueva-de-lola/'
ALT = {
 'es': ['Bailaora en el escenario de La Cueva de Lola con guitarrista y cantaor', 'Bailaor en la cueva del siglo XVII con guitarrista', 'La sala de La Cueva de Lola, una cueva del siglo XVII', 'Artistas haciendo palmas en el tablao', 'Bailaora con mantón de flores'],
 'en': ['Flamenco dancer on stage at La Cueva de Lola with guitarist and singer', 'Male dancer in the 17th-century cave with a guitarist', 'The room at La Cueva de Lola, a 17th-century cave', 'Artists clapping palmas at the tablao', 'Dancer with a floral shawl'],
 'de': ['Flamencotänzerin auf der Bühne der Cueva de Lola mit Gitarrist und Sänger', 'Tänzer in der Höhle aus dem 17. Jahrhundert mit Gitarrist', 'Der Saal der Cueva de Lola, eine Höhle aus dem 17. Jahrhundert', 'Künstler beim Klatschen (Palmas) im Tablao', 'Tänzerin mit geblümtem Schultertuch'],
 'fr': ['Danseuse sur la scène de La Cueva de Lola avec guitariste et chanteur', 'Danseur dans la grotte du XVIIe siècle avec un guitariste', 'La salle de La Cueva de Lola, une grotte du XVIIe siècle', 'Artistes faisant les palmas au tablao', 'Danseuse au châle fleuri'],
 'it': ['Ballerina sul palco della Cueva de Lola con chitarrista e cantante', 'Ballerino nella grotta del XVII secolo con un chitarrista', 'La sala della Cueva de Lola, una grotta del XVII secolo', 'Artisti che battono le palmas nel tablao', 'Ballerina con scialle a fiori'],
 'pt': ['Bailarina no palco da Cueva de Lola com guitarrista e cantor', 'Bailarino na gruta do século XVII com guitarrista', 'A sala da Cueva de Lola, uma gruta do século XVII', 'Artistas a bater palmas no tablao', 'Bailarina com xaile de flores'],
}
FILES = ['bailaora-guitarra-cante-escenario.webp', 'bailaor-cueva-guitarrista.webp', 'sala-cueva-siglo-xvii.webp', 'artistas-palmas-tablao.webp', 'bailaora-manton-flores.webp']
q = lambda s: json.dumps(s, ensure_ascii=False)
for f in glob.glob('content/actividades/*/madrid/flamenco-cueva-de-lola-madrid-*.md'):
    lang = f.split('/')[2]; a = ALT[lang]
    t = open(f, encoding='utf-8').read()
    t = re.sub(r'^imagen: .*$', f'imagen: {q(P + FILES[0])}', t, count=1, flags=re.M)
    t = re.sub(r'^imagenAlt: .*$', f'imagenAlt: {q(a[0])}', t, count=1, flags=re.M)
    gal = 'galeria:\n' + ''.join(f'- src: {q(P + FILES[i])}\n  alt: {q(a[i])}\n' for i in range(1, 5))
    t = re.sub(r'^galeria:\n(?:[- ] .*\n)+', gal, t, count=1, flags=re.M)
    t = t.replace('publicada: false', 'publicada: true')
    open(f, 'w', encoding='utf-8').write(t); print(f)
