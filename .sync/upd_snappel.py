import re, json
q=lambda s: json.dumps(s, ensure_ascii=False)
P='/images/actividades/tenerife/snappel/'
items=[('snappel-tenerife-pareja-costa-acantilados','Pareja durante una sesión de fotos en la costa de Tenerife, con los acantilados al fondo','Couple during a photo shoot on the Tenerife coast, with cliffs behind'),
('snappel-tenerife-pareja-rocas-volcanicas','Pareja sentada en las rocas volcánicas junto al mar','Couple sitting on volcanic rocks by the sea'),
('snappel-tenerife-familia-playa','Familia paseando por la orilla de una playa de Tenerife','Family walking along a beach in Tenerife'),
('snappel-tenerife-pareja-orilla','Pareja abrazada en la orilla del mar','Couple embracing by the sea'),
('snappel-tenerife-pareja-palmeras','Pareja besándose entre palmeras','Couple kissing among palm trees'),
('snappel-tenerife-pareja-playa-arena-negra','Pareja paseando por una playa de arena negra','Couple walking on a black sand beach'),
('snappel-tenerife-madre-hija-mirador','Madre e hija en un mirador frente al océano','Mother and daughter at a viewpoint over the ocean'),
('snappel-tenerife-pareja-atardecer','Pareja besándose en la orilla al atardecer','Couple kissing at the water’s edge at sunset'),
('snappel-tenerife-pareja-jardin','Pareja en un jardín con palmeras junto al paseo','Couple in a palm garden by the promenade')]
for lang,f,i in [('es','content/actividades/es/tenerife/sesion-fotos-playa-atardecer-costa-adeje.md',1),('en','content/actividades/en/tenerife/tenerife-beach-sunset-photo-shoot-costa-adeje.md',2)]:
    t=open(f,encoding='utf-8').read()
    t=re.sub(r'^imagen: .*$','imagen: '+q(P+items[0][0]+'.webp'),t,count=1,flags=re.M)
    t=re.sub(r'^imagenAlt: .*$','imagenAlt: '+q(items[0][i]),t,count=1,flags=re.M)
    m=re.search(r'^galeria:\n((?:[- ] .*\n)*)',t,re.M)
    old=re.findall(r'- src: (.*)\n  alt: (.*)\n',m.group(1))
    gal='galeria:\n'+''.join(f'- src: {q(P+x[0]+".webp")}\n  alt: {q(x[i])}\n' for x in items[1:])+''.join(f'- src: {s}\n  alt: {a}\n' for s,a in old[:3])
    t=t[:m.start()]+gal+t[m.end():]
    open(f,'w',encoding='utf-8').write(t); print('OK',f,len(old))
