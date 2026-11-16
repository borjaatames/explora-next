import sys,re,os
root=sys.argv[1]
files={'es':'es/gran-canaria/aqualand-maspalomas-entrada.md','en':'en/gran-canaria/aqualand-maspalomas-ticket.md','de':'de/gran-canaria/aqualand-maspalomas-tickets.md','fr':'fr/gran-canaria/aqualand-maspalomas-billet.md','it':'it/gran-canaria/aqualand-maspalomas-biglietto.md','pt':'pt/gran-canaria/maspalomas-aqualand-bilhete.md'}
fotos=['piscina-olas','mamut-toboganes','polynesia-infantil','tornado','discovery-beach','skull-bay']
alts={
'es':['Vista aérea de la gran piscina de olas de Aqualand Maspalomas','Toboganes Mamut de Aqualand Maspalomas entre ruinas de inspiración maya','Zona infantil Polynesia con toboganes y cubo de agua','Bañistas en el embudo verde del tobogán Tornado','Bañistas en la piscina de olas Discovery Beach','Niños corriendo por el agua en la zona infantil Skull Bay'],
'en':['Aerial view of the big wave pool at Aqualand Maspalomas','Mamut slides at Aqualand Maspalomas among Mayan-style ruins','Polynesia kids area with slides and a tipping water bucket','Riders in the green funnel of the Tornado slide','Swimmers in the Discovery Beach wave pool','Children running through the water in the Skull Bay kids area'],
'de':['Luftaufnahme des großen Wellenbeckens im Aqualand Maspalomas','Mamut-Rutschen im Aqualand Maspalomas zwischen Ruinen im Maya-Stil','Kinderbereich Polynesia mit Rutschen und Wasserkübel','Badegäste im grünen Trichter der Rutsche Tornado','Badegäste im Wellenbecken Discovery Beach','Kinder laufen im Kinderbereich Skull Bay durchs Wasser'],
'fr':['Vue aérienne de la grande piscine à vagues d’Aqualand Maspalomas','Toboggans Mamut d’Aqualand Maspalomas parmi des ruines d’inspiration maya','Espace enfants Polynesia avec toboggans et seau d’eau géant','Baigneurs dans l’entonnoir vert du toboggan Tornado','Baigneurs dans la piscine à vagues Discovery Beach','Enfants courant dans l’eau dans l’espace Skull Bay'],
'it':['Vista aerea della grande piscina a onde di Aqualand Maspalomas','Scivoli Mamut di Aqualand Maspalomas tra rovine in stile maya','Area bambini Polynesia con scivoli e secchio d’acqua','Bagnanti nell’imbuto verde dello scivolo Tornado','Bagnanti nella piscina a onde Discovery Beach','Bambini che corrono nell’acqua nell’area Skull Bay'],
'pt':['Vista aérea da grande piscina de ondas do Aqualand Maspalomas','Escorregas Mamut do Aqualand Maspalomas entre ruínas de inspiração maia','Zona infantil Polynesia com escorregas e balde de água','Banhistas no funil verde do escorrega Tornado','Banhistas na piscina de ondas Discovery Beach','Crianças a correr na água na zona infantil Skull Bay']}
for l,f in files.items():
    p=os.path.join(root,'content/actividades',f); t=open(p,encoding='utf-8').read()
    g='galeria:\n'+''.join(f'- src: /images/actividades/gran-canaria/aqualand/aqualand-{n}.webp\n  alt: "{a}"\n' for n,a in zip(fotos,alts[l]))
    assert t.count('galeria: null\n')==1,p
    open(p,'w',encoding='utf-8').write(t.replace('galeria: null\n',g)); print('ok',l)
c=os.path.join(root,'public/images/actividades/gran-canaria/aqualand/CREDITOS.md')
if os.path.exists(c) and 'piscina-olas' not in open(c,encoding='utf-8').read():
    open(c,'a',encoding='utf-8').write('\n## Fotos oficiales de Aqualand Maspalomas\n\nCortesía de Aqualand Maspalomas (Aspro Parks), tomadas de aqualand.es/maspalomas con permiso por escrito del parque (4-11-2026) para promocionar la venta de sus entradas. Solo pueden usarse para vender sus servicios.\n\n'+''.join(f'- `aqualand-{n}.webp` — Aqualand Maspalomas, original `{o}`\n' for n,o in zip(fotos,['MAS.olas_.2025.jpg','JA2_2610-MAS-1-scaled.jpg','MAS_Polynesia_24.1.1-scaled.webp','tornado-w.webp','MAS_attrac_DiscoveryBeach-scaled.webp','MAS_AT.SkullBay.jpg'])))
    print('creditos ok')
