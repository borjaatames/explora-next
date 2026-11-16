import re, glob, os, json
os.chdir(os.path.expanduser('~/mnt/explora-next'))
P = '/images/actividades/sevilla/tablao-las-setas/'
FILES = ['bailaora-bata-de-cola-escenario.webp', 'cuadro-flamenco-bailaora-mantoncillo.webp', 'sala-publico-escenario-iluminado.webp', 'guitarristas-cantaores-escenario.webp', 'escenario-sillas-luces-rojas.webp']
ALT = {
 'es': ['Bailaora con bata de cola en el escenario del Tablao Las Setas', 'Cuadro flamenco con bailaora y cantaoras', 'La sala del tablao vista desde el público', 'Guitarristas y cantaores en el escenario', 'El escenario del Tablao Las Setas iluminado en rojo'],
 'en': ['Dancer in a bata de cola on stage at Tablao Las Setas', 'Flamenco ensemble with dancer and singers', 'The tablao seen from the audience', 'Guitarists and singers on stage', 'The Tablao Las Setas stage lit in red'],
 'de': ['Tänzerin mit Schleppenkleid auf der Bühne des Tablao Las Setas', 'Flamenco-Ensemble mit Tänzerin und Sängerinnen', 'Der Tablao aus Sicht des Publikums', 'Gitarristen und Sänger auf der Bühne', 'Die Bühne des Tablao Las Setas in rotem Licht'],
 'fr': ['Danseuse en bata de cola sur la scène du Tablao Las Setas', 'Troupe de flamenco avec danseuse et chanteuses', 'Le tablao vu depuis le public', 'Guitaristes et chanteurs sur scène', 'La scène du Tablao Las Setas éclairée en rouge'],
 'it': ['Ballerina con bata de cola sul palco del Tablao Las Setas', 'Gruppo di flamenco con ballerina e cantanti', 'Il tablao visto dal pubblico', 'Chitarristi e cantanti sul palco', 'Il palco del Tablao Las Setas illuminato di rosso'],
 'pt': ['Bailarina com bata de cola no palco do Tablao Las Setas', 'Grupo de flamenco com bailarina e cantoras', 'O tablao visto do público', 'Guitarristas e cantores no palco', 'O palco do Tablao Las Setas iluminado de vermelho'],
}
q = lambda s: json.dumps(s, ensure_ascii=False)
for f in glob.glob('content/actividades/*/sevilla/flamenco-tablao-las-setas-*.md'):
    lang = f.split('/')[2]; a = ALT[lang]
    t = open(f, encoding='utf-8').read()
    t = re.sub(r'^imagen: .*$', f'imagen: {q(P + FILES[0])}', t, count=1, flags=re.M)
    t = re.sub(r'^imagenAlt: .*$', f'imagenAlt: {q(a[0])}', t, count=1, flags=re.M)
    gal = 'galeria:\n' + ''.join(f'- src: {q(P + FILES[i])}\n  alt: {q(a[i])}\n' for i in range(1, 5))
    t = re.sub(r'^galeria:\n(?:[- ] .*\n)+', gal, t, count=1, flags=re.M)
    t = t.replace('publicada: false', 'publicada: true')
    open(f, 'w', encoding='utf-8').write(t); print(f)
