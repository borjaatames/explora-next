import os,re,json
from PIL import Image, ImageOps
SRC=os.path.expanduser('~/mnt/e/Fotos proveedores/Vive Madriz Tours/03 Luces de Navidad/')
R=os.path.expanduser('~/mnt/explora-next/')
DST=R+'public/images/actividades/madrid/tuk-tuk-luces-navidad/'
os.makedirs(DST,exist_ok=True)
fs=[f for f in sorted(os.listdir(SRC)) if f.lower().endswith(('.jpg','.jpeg'))]
# idx, name, alts es,en,de,fr,it,pt
P=[
(1,'tuk-tuk-luces-navidad-arbol-sol',['El tuk tuk de noche junto a un gran árbol de Navidad iluminado en el centro de Madrid','The tuk tuk at night beside a big lit-up Christmas tree in central Madrid','Das Tuk-Tuk nachts neben einem großen beleuchteten Weihnachtsbaum im Zentrum von Madrid',"Le tuk-tuk de nuit à côté d'un grand sapin de Noël illuminé dans le centre de Madrid","Il tuk tuk di notte accanto a un grande albero di Natale illuminato nel centro di Madrid",'O tuk tuk à noite junto a uma grande árvore de Natal iluminada no centro de Madrid']),
(16,'tuk-tuk-luces-navidad-pasajeros-arbol',['Tuk tuk con pasajeros ante un árbol de Navidad de luces','Tuk tuk with passengers in front of a Christmas tree made of lights','Tuk-Tuk mit Fahrgästen vor einem Weihnachtsbaum aus Lichtern','Tuk-tuk avec des passagers devant un sapin de Noël lumineux','Tuk tuk con passeggeri davanti a un albero di Natale di luci','Tuk tuk com passageiros diante de uma árvore de Natal de luzes']),
(9,'tuk-tuk-luces-navidad-edificio-iluminado',['El tuk tuk ante un edificio iluminado por Navidad en el centro de Madrid','The tuk tuk in front of a building lit up for Christmas in central Madrid','Das Tuk-Tuk vor einem weihnachtlich beleuchteten Gebäude im Zentrum von Madrid','Le tuk-tuk devant un immeuble illuminé pour Noël dans le centre de Madrid','Il tuk tuk davanti a un palazzo illuminato per Natale nel centro di Madrid','O tuk tuk diante de um edifício iluminado para o Natal no centro de Madrid']),
(13,'tuk-tuk-luces-navidad-luces-azules',['El tuk tuk bajo las luces azules de Navidad','The tuk tuk under blue Christmas lights','Das Tuk-Tuk unter blauer Weihnachtsbeleuchtung','Le tuk-tuk sous les illuminations bleues de Noël','Il tuk tuk sotto le luci blu di Natale','O tuk tuk sob as luzes azuis de Natal']),
(2,'tuk-tuk-luces-navidad-congreso',['El tuk tuk de noche ante el Congreso de los Diputados','The tuk tuk at night in front of the Congress of Deputies','Das Tuk-Tuk nachts vor dem Abgeordnetenhaus','Le tuk-tuk de nuit devant le Congrès des députés','Il tuk tuk di notte davanti al Congresso dei Deputati','O tuk tuk à noite diante do Congresso dos Deputados']),
(10,'tuk-tuk-luces-navidad-clientes-belen',['Clientes junto al tuk tuk ante unas luces de belén','Customers next to the tuk tuk in front of nativity lights','Gäste neben dem Tuk-Tuk vor einer leuchtenden Krippe','Des clients à côté du tuk-tuk devant une crèche lumineuse','Clienti accanto al tuk tuk davanti a un presepe di luci','Clientes junto ao tuk tuk diante de um presépio de luzes']),
(18,'luces-navidad-madrid-arbol-gigante',['Árbol de Navidad gigante iluminado en Madrid','Giant lit-up Christmas tree in Madrid','Riesiger beleuchteter Weihnachtsbaum in Madrid','Sapin de Noël géant illuminé à Madrid','Albero di Natale gigante illuminato a Madrid','Árvore de Natal gigante iluminada em Madrid']),
(20,'luces-navidad-madrid-calle',['Luces de Navidad sobre una calle del centro de Madrid','Christmas lights over a street in central Madrid','Weihnachtsbeleuchtung über einer Straße im Zentrum von Madrid',"Illuminations de Noël au-dessus d'une rue du centre de Madrid",'Luci di Natale su una strada del centro di Madrid','Luzes de Natal sobre uma rua do centro de Madrid']),
(22,'luces-navidad-madrid-metropolis',['Árbol de Navidad junto al edificio Metrópolis','Christmas tree next to the Metrópolis building','Weihnachtsbaum neben dem Metrópolis-Gebäude',"Sapin de Noël à côté de l'immeuble Metrópolis",'Albero di Natale accanto al palazzo Metrópolis','Árvore de Natal junto ao edifício Metrópolis']),
(24,'luces-navidad-madrid-angel',['Ángel de luces navideño en una plaza de Madrid','Christmas angel made of lights on a Madrid square','Weihnachtsengel aus Lichtern auf einem Platz in Madrid',"Ange de Noël lumineux sur une place de Madrid",'Angelo di luci natalizio in una piazza di Madrid','Anjo de luzes de Natal numa praça de Madrid']),
(25,'luces-navidad-madrid-puerta-alcala',['La Puerta de Alcalá iluminada de noche','The Puerta de Alcalá lit up at night','Die Puerta de Alcalá nachts beleuchtet',"La Puerta de Alcalá illuminée de nuit",'La Puerta de Alcalá illuminata di notte','A Puerta de Alcalá iluminada à noite']),
(21,'luces-navidad-madrid-cibeles',['La fuente de Cibeles iluminada de noche','The Cibeles fountain lit up at night','Der Cibeles-Brunnen nachts beleuchtet','La fontaine de Cibeles illuminée de nuit','La fontana di Cibeles illuminata di notte','A fonte de Cibeles iluminada à noite']),
]
for idx,name,_ in P:
    im=ImageOps.exif_transpose(Image.open(SRC+fs[idx])).convert('RGB')
    w,h=im.size
    if w>=h: nw=min(1600,w); im=im.resize((nw,round(h*nw/w)),Image.LANCZOS)
    else: nh=min(1600,h); im=im.resize((round(w*nh/h),nh),Image.LANCZOS)
    im.save(DST+name+'.webp','WEBP',quality=80); print(name,im.size,fs[idx])
open(DST+'CREDITOS.md','w',encoding='utf-8').write('# Créditos de las fotos\n\nFotos del proveedor Vive Madriz Tours (MADRIZ TOURS en Bókun; tuk tuks de Tuk Tuk Zero), de su Google Drive compartido con ExploraSpain el 9 nov 2026 para usarlas en las fichas de sus productos en exploraspain.com. Originales en E:\\Fotos proveedores\\Vive Madriz Tours\\03 Luces de Navidad.\n\n'+''.join(f'- {n}.webp ({fs[i]})\n' for i,n,_ in P))
L=['es','en','de','fr','it','pt']
FILES={'es':'es/madrid/tuk-tuk-luces-navidad-madrid.md','en':'en/madrid/madrid-christmas-lights-tuk-tuk-tour.md','de':'de/madrid/madrid-weihnachtsbeleuchtung-private-tuk-tuk-tour.md','fr':'fr/madrid/madrid-illuminations-noel-tuk-tuk-prive.md','it':'it/madrid/madrid-luci-di-natale-tuk-tuk-privato.md','pt':'pt/madrid/madrid-luzes-natal-tuk-tuk-privado.md'}
for k,lang in enumerate(L):
    p=R+'content/actividades/'+FILES[lang]; s=open(p,encoding='utf-8').read()
    base='/images/actividades/madrid/tuk-tuk-luces-navidad/'
    main=P[0]
    s=re.sub(r'^imagen: .*$', 'imagen: '+base+main[1]+'.webp', s, count=1, flags=re.M)
    s=re.sub(r'^imagenAlt: .*$', 'imagenAlt: '+json.dumps(main[2][k],ensure_ascii=False), s, count=1, flags=re.M)
    new=''.join(f'- src: {base}{n}.webp\n  alt: {json.dumps(a[k],ensure_ascii=False)}\n' for _,n,a in P[1:])
    assert '\ngaleria:\n' in s,(p)
    s=s.replace('\ngaleria:\n','\ngaleria:\n'+new,1)
    open(p,'w',encoding='utf-8').write(s); print('ok',p)
