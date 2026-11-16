import re
L={
'malaga/christmas-in-malaga':[('Sunset catamaran cruise','malaga','malaga-catamaran-sunset-cruise',13),('Nerja Caves and Frigiliana day trip','malaga','nerja-caves-frigiliana-from-malaga',69),('Hammam Al Ándalus Arab baths','malaga','hammam-al-andalus-malaga-ticket',60)],
'tenerife/what-to-see-in-tenerife':[('Eco-yacht whale and dolphin watching','tenerife','eco-yacht-whale-dolphin-watching-tenerife',30),('Siam Park ticket','tenerife','siam-park-tickets',44),('Loro Parque ticket','tenerife','loro-parque-tickets',44)],
'gran-canaria/roque-nublo-hike':[('Off-road buggy tour','gran-canaria','gran-canaria-off-road-buggy-tour',65),('Southern jeep safari','gran-canaria','southern-gran-canaria-jeep-safari',69),('Roque Nublo and Pico de las Nieves from Las Palmas','gran-canaria','roque-nublo-pico-de-las-nieves-tour-from-las-palmas',48)],
'madrid/segovia-day-trip-from-madrid':[('Segovia and Toledo with the Alcázar','madrid','toledo-and-segovia-with-alcazar-from-madrid',41),('Ávila and Segovia with tickets','madrid','avila-segovia-day-trip-with-tickets',79),('Segovia, Ávila and Toledo with lunch','madrid','toledo-segovia-avila-from-madrid',78)],
'gran-canaria/maspalomas-dunes-guide':[('Camel ride through the dunes','gran-canaria','maspalomas-dunes-camel-ride',18),('Off-road buggy tour','gran-canaria','gran-canaria-off-road-buggy-tour',65),('Palmitos Park ticket','gran-canaria','palmitos-park-gran-canaria-ticket',39)],
}
for k,items in L.items():
    p=f'content/guias/en/{k}.md'; t=open(p,encoding='utf-8').read()
    assert 'Short on time? The 3 most-booked' not in t
    m=re.match(r'^(---\n.*?\n---\n)\n*',t,re.S)
    line='**Short on time? The 3 most-booked options:** '+' · '.join(f'[{n}](/en/cities/{c}/activities/{s}) (from €{p})' for n,c,s,p in items)
    t=m.group(1)+'\n'+line+'\n\n'+t[m.end():]
    open(p,'w',encoding='utf-8').write(t); print(p)
