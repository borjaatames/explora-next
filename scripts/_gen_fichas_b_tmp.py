# -*- coding: utf-8 -*-
"""Genera fichas GYG Prioridad B (ES+EN) con YAML seguro (yaml.safe_dump)."""
import os, sys, yaml

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
P = "?partner_id=C71NOAW"
HOY = "2026-10-17"

def url(tid, lang):
    return f"https://www.getyourguide.com/{'es-es' if lang=='es' else 'en-us'}/activity-t{tid}/{P}"

A = []  # cada entrada: dict con campos comunes + es + en

A.append(dict(
 ciudad="granada", tid=75398, precio=28, rating=4.6, op=18167, dur=("3 horas","3 hours"), min=180, cat="entradas",
 cancel=False, horas=None, tags=["alhambra"], destacada=True,
 img="/images/actividades/granada/alhambra/alhambra-granada-aerial-photography-brown-castle-hero.webp",
 gal=[("/images/actividades/granada/palacios-nazaries/pexels-11829108-hero.webp","Patio de los Leones en los Palacios Nazaríes","Court of the Lions in the Nasrid Palaces"),
      ("/images/actividades/granada/generalife/generalife-granada-toit-salle-abencerrages-espagne-hero.webp","Bóveda de mocárabes de la Sala de los Abencerrajes","Muqarnas vault of the Hall of the Abencerrajes"),
      ("/images/actividades/granada/alhambra/alhambra-granada-evening-hero.webp","La Alhambra al atardecer desde el Albaicín","The Alhambra at dusk from the Albaicín")],
 lat=37.1761, lng=-3.5881,
 es=dict(slug="alhambra-entrada-general", titulo="Granada: entrada general a la Alhambra con Palacios Nazaríes",
  desc="Entrada general a la Alhambra con acceso a los Palacios Nazaríes, Alcazaba, Generalife y Palacio de Carlos V, sin guía. 4,6/5 con 18.167 opiniones.",
  alt="Vista aérea de la Alhambra de Granada con Sierra Nevada al fondo",
  high=["Acceso completo: Palacios Nazaríes, Alcazaba, Generalife y Palacio de Carlos V","Entrada con hora fija para los Nazaríes (la que más se agota)","Vas por libre, a tu ritmo, sin grupo","Disponible cuando la web oficial ya está agotada"],
  inc=["Entrada general a la Alhambra","Acceso a los Palacios Nazaríes en la franja reservada"],
  noinc=["Guía","Audioguía (se alquila en taquilla)","Transporte"],
  punto=("Alhambra, Pabellón de acceso, Granada","El pabellón de acceso está junto al aparcamiento de la Alhambra, en el extremo este del recinto. Microbús C30/C32 desde Plaza Isabel la Católica, o 20-25 minutos a pie subiendo por la Cuesta de Gomérez. Lleva el DNI o pasaporte: la entrada es nominativa."),
  traer=["DNI o pasaporte de cada visitante (entrada nominativa)","Calzado cómodo: son 3-4 km de recorrido","Agua en verano"],
  noapto=[],
  tener=["La hora de los Palacios Nazaríes es inamovible: si la pierdes, no entras a los palacios","Los menores de 12 años entran gratis pero necesitan su propio ticket nominativo","En Semana Santa, puentes y verano se agota con semanas de antelación"],
  acces="El recorrido tiene cuestas, escaleras y suelos irregulares. Hay un itinerario adaptado parcial; consúltalo antes de reservar.",
  politica="No reembolsable. Las entradas de la Alhambra son nominativas y no admiten cambios.",
  faq=[("¿Incluye los Palacios Nazaríes?","Sí. Es la entrada general completa: Palacios Nazaríes con hora asignada, Alcazaba, Generalife y Palacio de Carlos V. Es la que necesita la inmensa mayoría de visitantes."),
       ("¿Qué pasa si llego tarde a la hora de los Nazaríes?","No entras a los palacios y no hay devolución. Llega al recinto al menos 30 minutos antes de tu franja: desde la entrada principal hasta los Palacios hay 10-15 minutos andando."),
       ("¿Por qué cuesta más que en la web oficial?","La entrada oficial cuesta unos 22 €. Esta opción incluye la gestión y, sobre todo, disponibilidad cuando la web del Patronato ya está agotada, que en temporada es lo habitual.")],
  opinion="Si vas por libre y quieres la Alhambra entera, esta es la entrada. Reserva en cuanto tengas fechas: es el monumento más visitado de España y las franjas de mañana vuelan.",
  guias=["alhambra-como-visitar","granada-en-2-dias","alhambra-que-tour-elegir"],
  kw=["entrada alhambra","alhambra entrada general","palacios nazaries entrada","alhambra sin guia"],
  cuerpo="""## Qué incluye la entrada general

La **entrada general** es la que da acceso a todo el conjunto monumental: los **Palacios Nazaríes** (con hora asignada), la **Alcazaba**, el **Generalife** con sus jardines y el **Palacio de Carlos V**. Es la entrada que necesita casi todo el mundo; las otras modalidades (Jardines, Nocturna) dejan fuera lo esencial.

## Cómo organizar las 3 horas

- **Llega 30 minutos antes** de tu franja de los Nazaríes. El pabellón de acceso está en el extremo opuesto a los palacios.
- Si tu franja es temprano, haz **Nazaríes → Alcazaba → Carlos V → Generalife**. Si es tarde, invierte el orden y deja los palacios para el final.
- Los Palacios Nazaríes son 45-60 minutos de recorrido en un solo sentido. No se puede volver atrás.

## Para quién es

- Quien quiere ir por libre, sin horarios de grupo.
- Quien ya tiene fechas cerradas y no encuentra entradas en la web oficial.

## Para quién no es

- Quien quiere entender lo que ve: con guía se aprovecha mucho más. Mira el comparador de visitas guiadas en nuestra guía de la Alhambra."""),
 en=dict(slug="alhambra-general-admission-ticket", titulo="Granada: Alhambra general admission with Nasrid Palaces",
  desc="General admission ticket to the Alhambra with access to the Nasrid Palaces, Alcazaba, Generalife and Palace of Charles V, self-guided. 4.6/5 with 18,167 reviews.",
  alt="Aerial view of the Alhambra in Granada with the Sierra Nevada behind",
  high=["Full access: Nasrid Palaces, Alcazaba, Generalife and Palace of Charles V","Timed entry to the Nasrid Palaces (the slot that sells out first)","Self-guided, at your own pace, no group","Available when the official website is already sold out"],
  inc=["Alhambra general admission ticket","Access to the Nasrid Palaces in your reserved time slot"],
  noinc=["Guide","Audio guide (available for hire at the entrance)","Transport"],
  punto=("Alhambra, Access Pavilion, Granada","The access pavilion is next to the Alhambra car park, at the eastern end of the complex. Take minibus C30/C32 from Plaza Isabel la Católica, or walk 20-25 minutes up the Cuesta de Gomérez. Bring your passport or ID: tickets are named."),
  traer=["Passport or ID for every visitor (named tickets)","Comfortable shoes: the route is 3-4 km","Water in summer"],
  noapto=[],
  tener=["The Nasrid Palaces time slot is fixed: miss it and you will not get into the palaces","Children under 12 enter free but need their own named ticket","Sells out weeks ahead at Easter, on long weekends and in summer"],
  acces="The route has slopes, stairs and uneven ground. A partial accessible itinerary exists; check before booking.",
  politica="Non-refundable. Alhambra tickets are named and cannot be changed.",
  faq=[("Does it include the Nasrid Palaces?","Yes. This is the complete general admission: Nasrid Palaces with a timed slot, Alcazaba, Generalife and Palace of Charles V. It is the ticket the vast majority of visitors need."),
       ("What if I am late for my Nasrid Palaces slot?","You will not be admitted to the palaces and there is no refund. Arrive at the site at least 30 minutes before your slot: it is a 10-15 minute walk from the main entrance to the palaces."),
       ("Why is it more expensive than the official website?","The official ticket costs about €22. This option includes the booking service and, above all, availability when the official website is sold out, which is the norm in high season.")],
  opinion="If you are visiting independently and want the whole Alhambra, this is the ticket. Book as soon as you have dates: it is Spain's most visited monument and morning slots go fast.",
  guias=["alhambra-how-to-visit","granada-in-2-days","alhambra-which-tour-to-choose"],
  kw=["alhambra ticket","alhambra general admission","nasrid palaces ticket","alhambra without guide"],
  cuerpo="""## What the general admission includes

The **general admission** ticket gives access to the whole monument: the **Nasrid Palaces** (timed entry), the **Alcazaba**, the **Generalife** with its gardens and the **Palace of Charles V**. It is the ticket almost everyone needs; the other options (Gardens only, Night visit) leave out the essentials.

## How to plan your 3 hours

- **Arrive 30 minutes before** your Nasrid Palaces slot. The access pavilion is at the opposite end from the palaces.
- If your slot is early, go **Nasrid Palaces → Alcazaba → Charles V → Generalife**. If it is late, reverse the order and leave the palaces for last.
- The Nasrid Palaces take 45-60 minutes on a one-way route. You cannot go back.

## Who it's for

- Independent visitors who do not want a group schedule.
- Anyone with fixed dates who cannot find tickets on the official website.

## Who it's not for

- Those who want to understand what they are seeing: a guide adds a lot here. See the guided tour comparison in our Alhambra guide."""),
))

A.append(dict(
 ciudad="sevilla", tid=131232, precio=20, rating=4.6, op=36909, dur=("1,5-2 horas","1.5-2 hours"), min=105, cat="entradas",
 cancel=True, horas=24, tags=["alcazar"], destacada=True,
 img="/images/actividades/sevilla/real-alcazar/real-alcazar-pexels-16627228.webp",
 gal=[("/images/actividades/sevilla/real-alcazar/real-alcazar-pexels-31538422.webp","Arcos mudéjares del Palacio de Pedro I","Mudéjar arches of the Palace of Pedro I"),
      ("/images/actividades/sevilla/real-alcazar/real-alcazar-pexels-36481634.webp","Jardines del Real Alcázar de Sevilla","Gardens of the Royal Alcázar of Seville"),
      ("/images/actividades/sevilla/real-alcazar/real-alcazar-pixabay-3573907.webp","Patio de las Doncellas","Courtyard of the Maidens")],
 lat=37.3831, lng=-5.9903,
 es=dict(slug="real-alcazar-sevilla-entrada", titulo="Sevilla: entrada al Real Alcázar con acceso prioritario",
  desc="Entrada con hora al Real Alcázar de Sevilla, el palacio en uso más antiguo de Europa, sin hacer la cola de taquilla. 4,6/5 con 36.909 opiniones.",
  alt="Fachada del Palacio de Pedro I en el Real Alcázar de Sevilla",
  high=["Acceso con hora al monumento más visitado de Sevilla","Palacio de Pedro I, Patio de las Doncellas, Salón de Embajadores","Jardines con pavos reales y el Estanque de Mercurio","Escenario de Juego de Tronos (Jardines del Agua de Dorne)"],
  inc=["Entrada al Real Alcázar con franja horaria"],
  noinc=["Cuarto Real Alto (entrada aparte, aforo muy limitado)","Guía o audioguía"],
  punto=("Real Alcázar, Puerta del León, Patio de Banderas, Sevilla","La entrada es por la Puerta del León, en la plaza del Triunfo, junto a la Catedral. Presenta el ticket del móvil en la franja reservada; fuera de ella no se garantiza el acceso."),
  traer=["Ticket en el móvil","Sombrero y agua en verano: los jardines no tienen sombra"],
  noapto=[],
  tener=["La franja horaria es estricta: llega 10-15 minutos antes","Los lunes de abril a septiembre hay entrada gratuita de 18:00 a 19:00, pero las plazas se agotan al instante","El Cuarto Real Alto no está incluido y se vende aparte en la web oficial"],
  acces="La planta baja y los jardines principales son accesibles. Algunas zonas tienen escalones.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Es mejor con guía o por libre?","Por libre funciona bien si llevas leído qué ver: el palacio se entiende por sí solo y los jardines son un paseo. Con guía ganas el contexto de la mezcla mudéjar-cristiana. Nuestra guía del Alcázar compara las opciones."),
       ("¿Cuánto tiempo necesito?","Entre hora y media y dos horas: 45-60 minutos para los palacios y el resto para los jardines. En primavera, cuando los jardines están en flor, merece la pena alargar."),
       ("¿Se puede combinar con la Catedral el mismo día?","Sí, están a 100 metros. Lo cómodo es Alcázar a primera hora y Catedral después de comer, o reservar el pack de 3 monumentos con acceso prioritario.")],
  opinion="El Alcázar es la visita número uno de Sevilla y la cola de taquilla en temporada pasa de la hora. Con entrada por franja entras a tu hora y te ahorras el sol. Reserva con días de antelación en primavera y Semana Santa.",
  guias=["alcazar-de-sevilla-como-visitar","sevilla-en-1-dia","sevilla-en-3-dias"],
  kw=["entrada real alcazar sevilla","alcazar sevilla entradas","alcazar sevilla sin colas","real alcazar tickets"],
  cuerpo="""## Qué verás

El **Real Alcázar** es un palacio que lleva mil años en uso: fortaleza omeya, palacio almohade, residencia de Pedro I y, hoy, residencia oficial de la familia real en Sevilla.

### El Palacio de Pedro I
La joya mudéjar del recinto. **Patio de las Doncellas**, **Salón de Embajadores** con su cúpula de madera dorada y yeserías hechas por artesanos granadinos de la Alhambra.

### El Palacio Gótico y los Baños de María de Padilla
La parte cristiana del conjunto, con tapices del siglo XVI y los baños abovedados bajo el Patio del Crucero, uno de los rincones más fotografiados.

### Los jardines
Más de 7 hectáreas: el Jardín del Estanque, la Galería del Grutesco, el laberinto y los pavos reales sueltos. Aquí se rodaron los Jardines del Agua de Dorne en *Juego de Tronos*.

## Cómo aprovechar la visita

- Reserva la **primera franja de la mañana** (9:30): el palacio se llena de grupos a partir de las 11:00.
- Haz primero los palacios y deja los jardines para el final.
- El **Cuarto Real Alto** (las estancias privadas de la familia real) no está incluido: se visita con guía en grupos de 15 y hay que reservarlo aparte."""),
 en=dict(slug="real-alcazar-seville-entry-ticket", titulo="Seville: Royal Alcázar entry ticket with priority access",
  desc="Timed entry ticket to the Royal Alcázar of Seville, Europe's oldest palace still in use, skipping the box-office queue. 4.6/5 with 36,909 reviews.",
  alt="Facade of the Palace of Pedro I in the Royal Alcázar of Seville",
  high=["Timed entry to Seville's most visited monument","Palace of Pedro I, Courtyard of the Maidens, Hall of Ambassadors","Gardens with peacocks and the Mercury Pond","Game of Thrones filming location (Water Gardens of Dorne)"],
  inc=["Royal Alcázar entry ticket with time slot"],
  noinc=["Cuarto Real Alto / Upper Royal Rooms (separate ticket, very limited capacity)","Guide or audio guide"],
  punto=("Royal Alcázar, Lion Gate, Patio de Banderas, Seville","Entry is through the Lion Gate on Plaza del Triunfo, next to the Cathedral. Show your mobile ticket within your reserved slot; access outside it is not guaranteed."),
  traer=["Ticket on your phone","Hat and water in summer: the gardens have little shade"],
  noapto=[],
  tener=["The time slot is strict: arrive 10-15 minutes early","On Mondays from April to September there is free entry from 6 to 7 pm, but places vanish instantly","The Upper Royal Rooms are not included and are sold separately on the official website"],
  acces="The ground floor and main gardens are accessible. Some areas have steps.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Guide or self-guided?","Self-guided works well if you have read up on what to see: the palace speaks for itself and the gardens are a stroll. A guide adds the context of the Mudéjar-Christian mix. Our Alcázar guide compares the options."),
       ("How long do I need?","Between 1.5 and 2 hours: 45-60 minutes for the palaces and the rest for the gardens. In spring, when the gardens are in bloom, it is worth lingering."),
       ("Can I combine it with the Cathedral on the same day?","Yes, they are 100 metres apart. The easy plan is the Alcázar first thing and the Cathedral after lunch, or book the 3-monument priority pass.")],
  opinion="The Alcázar is Seville's number one visit and the box-office queue in season exceeds an hour. With a timed ticket you walk in at your time and skip the sun. Book days ahead in spring and at Easter.",
  guias=["alcazar-of-seville-how-to-visit","seville-in-1-day","seville-in-3-days"],
  kw=["royal alcazar seville ticket","alcazar seville tickets","alcazar seville skip the line","real alcazar entry"],
  cuerpo="""## What you'll see

The **Royal Alcázar** is a palace that has been in use for a thousand years: Umayyad fortress, Almohad palace, residence of Pedro I and, today, the royal family's official residence in Seville.

### The Palace of Pedro I
The Mudéjar jewel of the complex. The **Courtyard of the Maidens**, the **Hall of Ambassadors** with its gilded wooden dome, and plasterwork made by Granada craftsmen from the Alhambra.

### The Gothic Palace and the Baths of María de Padilla
The Christian part of the site, with 16th-century tapestries and the vaulted baths beneath the Patio del Crucero, one of the most photographed corners.

### The gardens
Over 7 hectares: the Pond Garden, the Grutesco Gallery, the maze and free-roaming peacocks. The Water Gardens of Dorne in *Game of Thrones* were filmed here.

## Making the most of it

- Book the **first morning slot** (9:30): the palace fills with groups from 11 am.
- Do the palaces first and leave the gardens for the end.
- The **Upper Royal Rooms** (the royal family's private quarters) are not included: they are visited with a guide in groups of 15 and must be booked separately."""),
))

A.append(dict(
 ciudad="malaga", tid=569659, precio=30, rating=4.6, op=16892, dur=("3-4 horas","3-4 hours"), min=210, cat="entradas",
 cancel=True, horas=24, tags=["caminito"], destacada=True,
 img="/images/actividades/malaga/caminito-del-rey/caminito-del-rey-malaga-hero.webp",
 gal=[("/images/actividades/malaga/caminito-del-rey/desfiladero-rio.webp","Desfiladero de los Gaitanes desde las pasarelas","Gaitanes Gorge seen from the walkways"),
      ("/images/actividades/malaga/caminito-del-rey/garganta.webp","La garganta del río Guadalhorce","The Guadalhorce river gorge"),
      ("/images/actividades/malaga/caminito-del-rey/pasarelas-roca.webp","Pasarelas ancladas a la roca","Walkways anchored to the rock face")],
 lat=36.9263, lng=-4.7899,
 es=dict(slug="caminito-del-rey-entrada-guia-oficial", titulo="Caminito del Rey: entrada con guía oficial (sin transporte)",
  desc="Entrada al Caminito del Rey con guía oficial y casco incluido, sin transporte: la opción para quien llega en coche o tren a El Chorro. 4,6/5 con 16.892 opiniones.",
  alt="Pasarelas del Caminito del Rey sobre el desfiladero de los Gaitanes",
  high=["Entrada garantizada cuando la web oficial está agotada","Guía oficial del Caminito durante todo el recorrido","7,7 km de pasarelas y senderos por el desfiladero de los Gaitanes","Mucho más barato que el tour con transporte si ya tienes coche"],
  inc=["Entrada al Caminito del Rey","Guía oficial","Casco obligatorio"],
  noinc=["Transporte hasta el Caminito","Bus lanzadera entre las dos entradas (1,55 € en el sitio)","Comida y bebida"],
  punto=("Caminito del Rey, acceso norte (Ardales), Málaga","El recorrido es lineal y empieza por el acceso norte, en Ardales. En coche, aparca en el norte (El Kiosko) o en el sur (El Chorro) y usa el bus lanzadera. En tren, Cercanías C-2 hasta El Chorro-Caminito del Rey (40 min desde Málaga). Punto exacto en el voucher."),
  traer=["Calzado deportivo cerrado (obligatorio)","Agua y algo de comer: no hay nada en el recorrido","Protección solar; en invierno, cortavientos"],
  noapto=["Menores de 8 años (no pueden entrar)","Personas con vértigo severo","Movilidad reducida: hay tramos con escaleras y suelo irregular"],
  tener=["El recorrido es solo de ida (norte a sur): calcula 3-4 horas con el bus lanzadera","Cierra con viento fuerte o lluvia intensa; en ese caso se devuelve el importe","Las entradas oficiales salen a la venta con meses de antelación y se agotan"],
  acces="No accesible para sillas de ruedas ni carritos.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Cuál es la diferencia con el tour desde Málaga?","El tour con transporte (72 €) te recoge en Málaga y te lleva en autobús. Esta opción (30 €) incluye solo entrada, guía y casco: la eliges si vas en coche o en el Cercanías hasta El Chorro."),
       ("¿Puedo ir sin guía?","La entrada oficial sin guía existe, pero se agota con meses de antelación. Esta opción con guía oficial tiene cupo propio y, además, el guía explica la historia de la central hidroeléctrica y la geología del desfiladero."),
       ("¿Da miedo?","Las pasarelas son anchas, con barandilla y a 100 metros sobre el río. Es seguro y apto para familias con niños desde 8 años, pero el puente colgante final impresiona a quien tiene vértigo.")],
  opinion="La forma más barata de hacer el Caminito con entrada asegurada. Si ya tienes coche o vas a usar el tren, no pagues el tour con transporte. Reserva el día que te cuadre y organiza el viaje a Málaga alrededor de esa fecha.",
  guias=["caminito-del-rey-como-visitar","malaga-en-dos-dias","escapadas-desde-malaga"],
  kw=["caminito del rey entradas","caminito del rey entrada guia","caminito del rey sin transporte","caminito del rey tickets"],
  cuerpo="""## Qué incluye exactamente

- **Entrada al Caminito del Rey** para la franja reservada.
- **Guía oficial** durante todo el recorrido (unas 3 horas de pasarelas y senderos).
- **Casco** obligatorio.

No incluye el transporte: tú llegas al acceso norte (Ardales) por tu cuenta.

## Cómo llegar sin tour

**En coche**: 1 hora desde Málaga. Aparca en El Kiosko (acceso norte) y, al terminar, vuelve con el bus lanzadera desde El Chorro (1,55 €, cada 30 minutos). O al revés: aparca en El Chorro, sube en lanzadera al norte y termina junto a tu coche.

**En tren**: Cercanías C-2 Málaga → El Chorro-Caminito del Rey (40 minutos, unos 5 €). Desde la estación, lanzadera hasta el acceso norte.

## El recorrido

7,7 km lineales de norte a sur: 1,5 km de senderos de acceso, **3 km de pasarelas ancladas a la roca** sobre el desfiladero de los Gaitanes a 100 metros de altura, el **puente colgante** sobre la garganta y 2 km de bajada hasta El Chorro. Unas 3 horas sin contar el bus."""),
 en=dict(slug="caminito-del-rey-ticket-official-guide", titulo="Caminito del Rey: entry ticket with official guide (no transport)",
  desc="Caminito del Rey entry ticket with official guide and helmet included, without transport: the option for those arriving by car or train to El Chorro. 4.6/5 with 16,892 reviews.",
  alt="Caminito del Rey walkways above the Gaitanes Gorge",
  high=["Guaranteed entry when the official website is sold out","Official Caminito guide for the whole route","7.7 km of walkways and trails through the Gaitanes Gorge","Much cheaper than the tour with transport if you already have a car"],
  inc=["Caminito del Rey entry ticket","Official guide","Mandatory helmet"],
  noinc=["Transport to the Caminito","Shuttle bus between the two entrances (€1.55 on site)","Food and drink"],
  punto=("Caminito del Rey, north access (Ardales), Málaga","The route is one-way and starts at the north access in Ardales. By car, park at the north (El Kiosko) or south (El Chorro) and use the shuttle bus. By train, Cercanías C-2 to El Chorro-Caminito del Rey (40 min from Málaga). Exact point on your voucher."),
  traer=["Closed sports shoes (mandatory)","Water and a snack: there is nothing along the route","Sun protection; in winter, a windbreaker"],
  noapto=["Children under 8 (not admitted)","People with severe vertigo","Reduced mobility: there are stairs and uneven ground"],
  tener=["The route is one-way (north to south): allow 3-4 hours including the shuttle bus","Closes in strong wind or heavy rain, in which case you are refunded","Official tickets go on sale months ahead and sell out"],
  acces="Not accessible for wheelchairs or pushchairs.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("How is this different from the tour from Málaga?","The tour with transport (€72) picks you up in Málaga and takes you by coach. This option (€30) includes only entry, guide and helmet: choose it if you drive or take the Cercanías train to El Chorro."),
       ("Can I go without a guide?","The official unguided ticket exists but sells out months in advance. This option with an official guide has its own allocation and, on top of that, the guide explains the history of the hydroelectric plant and the geology of the gorge."),
       ("Is it scary?","The walkways are wide, with railings, 100 metres above the river. It is safe and suitable for families with children from 8, but the final suspension bridge is impressive for anyone with vertigo.")],
  opinion="The cheapest way to do the Caminito with guaranteed entry. If you already have a car or plan to take the train, do not pay for the tour with transport. Book the day that suits you and plan your Málaga trip around that date.",
  guias=["caminito-del-rey-how-to-visit","malaga-in-two-days","day-trips-from-malaga"],
  kw=["caminito del rey tickets","caminito del rey entry guide","caminito del rey without transport","caminito del rey booking"],
  cuerpo="""## What exactly is included

- **Caminito del Rey entry** for your reserved slot.
- **Official guide** for the whole route (about 3 hours of walkways and trails).
- **Mandatory helmet**.

Transport is not included: you get to the north access (Ardales) on your own.

## Getting there without a tour

**By car**: 1 hour from Málaga. Park at El Kiosko (north access) and, when you finish, return on the shuttle bus from El Chorro (€1.55, every 30 minutes). Or the reverse: park at El Chorro, take the shuttle north and finish next to your car.

**By train**: Cercanías C-2 Málaga → El Chorro-Caminito del Rey (40 minutes, about €5). From the station, shuttle to the north access.

## The route

7.7 km one-way from north to south: 1.5 km of access trails, **3 km of walkways anchored to the rock** above the Gaitanes Gorge at 100 metres, the **suspension bridge** over the gorge and 2 km down to El Chorro. About 3 hours not counting the bus."""),
))

A.append(dict(
 ciudad="madrid", tid=415581, precio=14, rating=4.4, op=728, dur=("1-2 días","1-2 days"), min=480, cat="entradas",
 cancel=True, horas=24, tags=["toledo"], destacada=False,
 img="/images/actividades/madrid/monasterio-san-juan-reyes-toledo/monasterio-san-juan-reyes-toledo-cloister-02-hero.webp",
 gal=[("/images/actividades/madrid/iglesia-santo-tome-toledo/iglesia-santo-tome-toledo-espana-hero.webp","Iglesia de Santo Tomé, donde está El entierro del conde de Orgaz","Church of Santo Tomé, home of The Burial of the Count of Orgaz"),
      ("/images/actividades/madrid/mezquita-cristo-luz-toledo/mezquita-cristo-luz-toledo-2025-facade-hero.webp","Mezquita del Cristo de la Luz","Mosque of Cristo de la Luz"),
      ("/images/actividades/madrid/toledo/callejon-vista-alcazar.webp","Callejón de Toledo con el Alcázar al fondo","Toledo alley with the Alcázar behind")],
 lat=39.8581, lng=-4.0273,
 es=dict(slug="toledo-pulsera-turistica-7-monumentos", titulo="Toledo: pulsera turística para 7 monumentos",
  desc="Pulsera turística de Toledo con entrada a 7 monumentos (Santo Tomé, San Juan de los Reyes, Cristo de la Luz, Santa María la Blanca…) sin caducidad. 4,4/5 con 728 opiniones.",
  alt="Claustro del Monasterio de San Juan de los Reyes, Toledo",
  high=["7 monumentos por el precio de 3 entradas sueltas","Santo Tomé con El entierro del conde de Orgaz de El Greco","Monasterio de San Juan de los Reyes y su claustro","Sin fecha de caducidad: puedes repartirlo en dos días"],
  inc=["Pulsera con entrada a 7 monumentos: Santo Tomé, San Juan de los Reyes, Cristo de la Luz, Santa María la Blanca, El Salvador, San Ildefonso (Jesuitas) y Colegio de Doncellas"],
  noinc=["Catedral de Toledo (entrada aparte)","Sinagoga del Tránsito y Museo del Greco (gratis o entrada aparte)","Transporte desde Madrid"],
  punto=("Canje de la pulsera en cualquiera de los 7 monumentos, Toledo","Presenta el voucher del móvil en la taquilla de cualquiera de los 7 monumentos y te dan la pulsera. Lo cómodo es empezar por San Ildefonso (Jesuitas), subir a su torre y seguir hacia Santo Tomé y San Juan de los Reyes."),
  traer=["Calzado cómodo: Toledo es cuesta arriba y empedrado","Mapa o móvil con los 7 puntos marcados"],
  noapto=[],
  tener=["La Catedral no está incluida: es la visita más cara (12 €) y va aparte","Las torres de San Ildefonso tienen la mejor vista de la ciudad","Santo Tomé es pequeño y se llena con grupos: ve a primera hora o a última"],
  acces="Varía por monumento; los claustros y las iglesias tienen escalones. Las torres de San Ildefonso no son accesibles.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Merece la pena frente a pagar entradas sueltas?","Cada monumento cuesta 3-4 € por separado. Con que visites tres ya has amortizado la pulsera, y lo normal es ver cinco o seis en un día."),
       ("¿Caduca?","No. La pulsera no tiene fecha de caducidad una vez canjeada, así que puedes repartir los monumentos en dos días si duermes en Toledo."),
       ("¿Incluye la Catedral?","No. La Catedral tiene su propia entrada (unos 12 €) y merece la pena por separado. El plan razonable en un día: Catedral por la mañana y la pulsera por la tarde.")],
  opinion="Es el truco de Toledo que casi nadie conoce. Siete monumentos, entre ellos la obra maestra de El Greco y el claustro más bonito de la ciudad, por el precio de un menú del día. Si vas por libre desde Madrid, cómprala antes de salir.",
  guias=["escapadas-desde-madrid-toledo","madrid-en-3-dias"],
  kw=["pulsera turistica toledo","toledo 7 monumentos","entradas toledo","que ver en toledo entradas"],
  cuerpo="""## Los 7 monumentos

1. **Iglesia de Santo Tomé**: *El entierro del conde de Orgaz*, la obra maestra de El Greco, en el lugar para el que se pintó.
2. **Monasterio de San Juan de los Reyes**: gótico isabelino, el claustro más bonito de Toledo y las cadenas de los cautivos cristianos en la fachada.
3. **Mezquita del Cristo de la Luz**: del año 999, la mezquita mejor conservada de España.
4. **Sinagoga de Santa María la Blanca**: cinco naves de arcos de herradura blancos; sinagoga, iglesia y hoy museo.
5. **Iglesia de El Salvador**: con restos visigodos y de mezquita.
6. **Iglesia de San Ildefonso (Jesuitas)**: sube a las torres, la mejor panorámica de la ciudad.
7. **Colegio de Doncellas Nobles**: el menos conocido y el más tranquilo.

## Cómo organizar el día

Empieza por **San Ildefonso** para orientarte desde las torres, baja por la judería hacia **Santo Tomé** (llega antes de las 11:00 para evitar los grupos), sigue a **Santa María la Blanca** y **San Juan de los Reyes**, y cierra con el **Cristo de la Luz** camino de la Puerta de Bisagra. La Catedral, si la haces, mejor por la mañana con entrada aparte."""),
 en=dict(slug="toledo-tourist-bracelet-7-monuments", titulo="Toledo: tourist bracelet for 7 monuments",
  desc="Toledo tourist bracelet with entry to 7 monuments (Santo Tomé, San Juan de los Reyes, Cristo de la Luz, Santa María la Blanca and more), no expiry date. 4.4/5 with 728 reviews.",
  alt="Cloister of the Monastery of San Juan de los Reyes, Toledo",
  high=["7 monuments for the price of 3 single tickets","Santo Tomé with El Greco's The Burial of the Count of Orgaz","Monastery of San Juan de los Reyes and its cloister","No expiry date: spread it over two days"],
  inc=["Bracelet with entry to 7 monuments: Santo Tomé, San Juan de los Reyes, Cristo de la Luz, Santa María la Blanca, El Salvador, San Ildefonso (Jesuits) and Colegio de Doncellas"],
  noinc=["Toledo Cathedral (separate ticket)","Sinagoga del Tránsito and El Greco Museum (free or separate ticket)","Transport from Madrid"],
  punto=("Bracelet exchange at any of the 7 monuments, Toledo","Show your mobile voucher at the ticket desk of any of the 7 monuments and you will receive the bracelet. The easy start is San Ildefonso (Jesuits): climb its tower, then continue to Santo Tomé and San Juan de los Reyes."),
  traer=["Comfortable shoes: Toledo is uphill and cobbled","A map or phone with the 7 sites marked"],
  noapto=[],
  tener=["The Cathedral is not included: it is the most expensive visit (€12) and sold separately","The San Ildefonso towers have the best view of the city","Santo Tomé is small and fills with groups: go first thing or late in the day"],
  acces="Varies by monument; cloisters and churches have steps. The San Ildefonso towers are not accessible.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Is it worth it versus single tickets?","Each monument costs €3-4 on its own. Visit three and the bracelet has paid for itself; most people see five or six in a day."),
       ("Does it expire?","No. Once exchanged, the bracelet has no expiry date, so you can spread the monuments over two days if you stay overnight in Toledo."),
       ("Does it include the Cathedral?","No. The Cathedral has its own ticket (about €12) and is worth it on its own. A sensible one-day plan: Cathedral in the morning, bracelet in the afternoon.")],
  opinion="Toledo's best-kept trick. Seven monuments, including El Greco's masterpiece and the city's most beautiful cloister, for the price of a set lunch. If you are visiting independently from Madrid, buy it before you leave.",
  guias=["day-trips-from-madrid-toledo","madrid-in-3-days"],
  kw=["toledo tourist bracelet","toledo 7 monuments","toledo tickets","what to see in toledo tickets"],
  cuerpo="""## The 7 monuments

1. **Church of Santo Tomé**: *The Burial of the Count of Orgaz*, El Greco's masterpiece, in the place it was painted for.
2. **Monastery of San Juan de los Reyes**: Isabelline Gothic, Toledo's most beautiful cloister and the chains of Christian captives on the facade.
3. **Mosque of Cristo de la Luz**: from the year 999, the best-preserved mosque in Spain.
4. **Synagogue of Santa María la Blanca**: five naves of white horseshoe arches; synagogue, church and now museum.
5. **Church of El Salvador**: with Visigothic and mosque remains.
6. **Church of San Ildefonso (Jesuits)**: climb the towers for the best panorama of the city.
7. **Colegio de Doncellas Nobles**: the least known and the quietest.

## Planning the day

Start at **San Ildefonso** to get your bearings from the towers, walk down through the Jewish quarter to **Santo Tomé** (arrive before 11 am to avoid the groups), continue to **Santa María la Blanca** and **San Juan de los Reyes**, and finish at **Cristo de la Luz** on the way to the Bisagra Gate. If you do the Cathedral, do it in the morning with a separate ticket."""),
))

A.append(dict(
 ciudad="madrid", tid=413124, precio=18, rating=4.5, op=312, dur=("2-3 horas","2-3 hours"), min=150, cat="entradas",
 cancel=True, horas=24, tags=["excursiones-desde-madrid"], destacada=False,
 img="/images/actividades/madrid/escorial/monasterio-del-escorial-facade-monastery-san-lorenzo-spain-hero.webp",
 gal=[("/images/actividades/madrid/escorial/monasterio-del-escorial-escorialbiblioteca-hero.webp","Biblioteca del Monasterio de El Escorial","Library of the Monastery of El Escorial"),
      ("/images/actividades/madrid/escorial/monasterio-del-escorial-dramatic-view-monastery-gardens-hero.webp","Jardines de los Frailes y fachada sur","Friars' Gardens and south facade"),
      ("/images/actividades/madrid/escorial/monasterio-del-escorial-detail-facade-basilica-monastery-hero.webp","Fachada de la basílica en el Patio de los Reyes","Basilica facade in the Courtyard of the Kings")],
 lat=40.5890, lng=-4.1477,
 es=dict(slug="el-escorial-monasterio-entrada", titulo="El Escorial: entrada al Real Monasterio",
  desc="Entrada al Real Monasterio de San Lorenzo de El Escorial: basílica, panteón de los reyes, biblioteca y palacio de los Austrias, sin guía. 4,5/5 con 312 opiniones.",
  alt="Fachada principal del Monasterio de El Escorial",
  high=["Patrimonio de la Humanidad y el gran edificio de Felipe II","Panteón de Reyes: 26 monarcas españoles en una cripta de mármol","Biblioteca renacentista con 40.000 volúmenes","A 50 minutos de Madrid en Cercanías"],
  inc=["Entrada al Real Monasterio de San Lorenzo de El Escorial"],
  noinc=["Transporte desde Madrid","Guía o audioguía","Casita del Príncipe y Casita del Infante"],
  punto=("Real Monasterio de San Lorenzo de El Escorial, Av. Juan de Borbón y Battemberg, s/n","En Cercanías C-3 o C-8 desde Atocha, Sol o Chamartín hasta El Escorial (50-60 min) y 15 minutos a pie cuesta arriba, o autobús 661/664 desde Moncloa (50 min) que te deja junto al monasterio."),
  traer=["Ropa de abrigo: dentro hace frío incluso en verano","Calzado cómodo"],
  noapto=[],
  tener=["Cierra los lunes","Los miércoles y jueves por la tarde (últimas 3 horas) la entrada es gratuita para ciudadanos de la UE, con cola","El recorrido oficial es de un solo sentido y dura unas 2 horas"],
  acces="Accesible en su mayor parte; el Panteón de Reyes tiene escaleras.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Cómo llego desde Madrid?","En Cercanías (líneas C-3 y C-8) desde Atocha o Chamartín, unos 55 minutos, y 15 minutos andando cuesta arriba. O en autobús 661/664 desde el intercambiador de Moncloa, que para a 200 metros del monasterio."),
       ("¿Se puede combinar con el Valle de Cuelgamuros?","Sí, están a 15 minutos en coche, pero sin coche es complicado (el autobús 660 tiene pocas frecuencias). Si quieres los dos en un día sin conducir, mira la excursión organizada."),
       ("¿Cuánto tiempo necesito?","Dos horas para el recorrido oficial (palacio, panteones, salas capitulares, biblioteca y basílica). Añade una hora si quieres pasear por los jardines y el pueblo.")],
  opinion="El Escorial es la excursión de medio día más seria desde Madrid: menos pintoresca que Toledo o Segovia, pero el edificio impone y el Panteón de Reyes no se olvida. Entrada barata, fácil de llegar en tren. Reserva y evita la taquilla los fines de semana.",
  guias=["madrid-en-3-dias","madrid-gratis"],
  kw=["entrada el escorial","monasterio escorial entradas","el escorial desde madrid","escorial tickets"],
  cuerpo="""## Qué verás

El **Real Monasterio de San Lorenzo de El Escorial** es el edificio con el que Felipe II quiso resumir su reinado: monasterio, palacio, basílica, biblioteca y panteón en 33.000 m² de granito gris. Patrimonio de la Humanidad desde 1984.

### El recorrido oficial
- **Palacio de los Austrias**: las estancias austeras de Felipe II, con la cama desde la que oía misa a través de una ventana.
- **Panteón de Reyes**: cripta circular de mármol y bronce donde descansan 26 reyes y reinas de España, de Carlos I a Alfonso XIII.
- **Panteón de Infantes** y **Salas Capitulares**, con cuadros de El Bosco, Tiziano y Velázquez.
- **Biblioteca**: una de las más bellas del Renacimiento, con bóveda pintada y 40.000 volúmenes.
- **Basílica**: cúpula de 92 metros y el retablo de jaspe y bronce.

## Cómo organizar la excursión

Sal de Madrid a las 9:00, llega a las 10:00 cuando abre, haz el recorrido en dos horas y come en el pueblo. Por la tarde, el **Jardín de los Frailes** y, si hay tiempo, la **Silla de Felipe II** a 3 km, desde donde el rey vigilaba las obras."""),
 en=dict(slug="el-escorial-monastery-entry-ticket", titulo="El Escorial: Royal Monastery entry ticket",
  desc="Entry ticket to the Royal Monastery of San Lorenzo de El Escorial: basilica, royal pantheon, library and Habsburg palace, self-guided. 4.5/5 with 312 reviews.",
  alt="Main facade of the Monastery of El Escorial",
  high=["World Heritage Site and Philip II's great building","Pantheon of Kings: 26 Spanish monarchs in a marble crypt","Renaissance library with 40,000 volumes","50 minutes from Madrid by commuter train"],
  inc=["Entry ticket to the Royal Monastery of San Lorenzo de El Escorial"],
  noinc=["Transport from Madrid","Guide or audio guide","Casita del Príncipe and Casita del Infante"],
  punto=("Royal Monastery of San Lorenzo de El Escorial, Av. Juan de Borbón y Battemberg","Cercanías C-3 or C-8 from Atocha, Sol or Chamartín to El Escorial (50-60 min) then a 15-minute uphill walk, or bus 661/664 from Moncloa (50 min), which stops next to the monastery."),
  traer=["Warm layer: it is cold inside even in summer","Comfortable shoes"],
  noapto=[],
  tener=["Closed on Mondays","Wednesday and Thursday afternoons (last 3 hours) are free for EU citizens, with queues","The official route is one-way and takes about 2 hours"],
  acces="Mostly accessible; the Pantheon of Kings has stairs.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("How do I get there from Madrid?","By Cercanías commuter train (lines C-3 and C-8) from Atocha or Chamartín, about 55 minutes, then a 15-minute uphill walk. Or bus 661/664 from the Moncloa interchange, which stops 200 metres from the monastery."),
       ("Can I combine it with the Valley of Cuelgamuros?","Yes, they are 15 minutes apart by car, but without a car it is awkward (bus 660 runs rarely). If you want both in one day without driving, look at the organised excursion."),
       ("How long do I need?","Two hours for the official route (palace, pantheons, chapter rooms, library and basilica). Add an hour for the gardens and the town.")],
  opinion="El Escorial is the most serious half-day trip from Madrid: less picturesque than Toledo or Segovia, but the building is overwhelming and the Pantheon of Kings stays with you. Cheap ticket, easy by train. Book ahead to skip the weekend box office.",
  guias=["madrid-in-3-days","madrid-on-a-budget"],
  kw=["el escorial ticket","escorial monastery tickets","el escorial from madrid","escorial entry"],
  cuerpo="""## What you'll see

The **Royal Monastery of San Lorenzo de El Escorial** is the building in which Philip II summed up his reign: monastery, palace, basilica, library and pantheon in 33,000 m² of grey granite. A World Heritage Site since 1984.

### The official route
- **Habsburg Palace**: Philip II's austere rooms, with the bed from which he heard Mass through a window.
- **Pantheon of Kings**: a circular crypt of marble and bronze where 26 kings and queens of Spain rest, from Charles I to Alfonso XIII.
- **Pantheon of the Infantes** and **Chapter Rooms**, with paintings by Bosch, Titian and Velázquez.
- **Library**: one of the most beautiful of the Renaissance, with a painted vault and 40,000 volumes.
- **Basilica**: a 92-metre dome and the jasper and bronze altarpiece.

## Planning the trip

Leave Madrid at 9 am, arrive at 10 when it opens, do the route in two hours and have lunch in town. In the afternoon, the **Friars' Garden** and, time permitting, **Philip II's Seat** 3 km away, from where the king watched the construction."""),
))

A.append(dict(
 ciudad="madrid", tid=409590, precio=62, rating=4.7, op=1769, dur=("5 horas","5 hours"), min=300, cat="excursionesDia",
 cancel=True, horas=24, tags=["excursiones-desde-madrid"], destacada=True,
 img="/images/actividades/madrid/escorial/monasterio-del-escorial-dramatic-view-monastery-gardens-hero.webp",
 gal=[("/images/actividades/madrid/valle-caidos/valle-caidos-by-forcy-cruz-piedad-hero.webp","La cruz del Valle de Cuelgamuros, de 150 metros","The 150-metre cross of the Valley of Cuelgamuros"),
      ("/images/actividades/madrid/valle-caidos/valle-caidos-capilla-mayor-basilica-santa-cruz-hero.webp","Capilla mayor de la basílica excavada en la roca","High chapel of the basilica carved into the rock"),
      ("/images/actividades/madrid/escorial/monasterio-del-escorial-escorialbiblioteca-hero.webp","Biblioteca de El Escorial","El Escorial library")],
 lat=40.4236, lng=-3.7118,
 es=dict(slug="escorial-valle-cuelgamuros-excursion-grupo", titulo="Desde Madrid: El Escorial y Valle de Cuelgamuros con guía",
  desc="Excursión de medio día desde Madrid en grupo con guía: Monasterio de El Escorial y Valle de Cuelgamuros (antiguo Valle de los Caídos), con entradas y transporte. 4,7/5 con 1.769 opiniones.",
  alt="Monasterio de El Escorial y sus jardines",
  high=["Los dos monumentos en una mañana, con transporte y entradas","Guía oficial que explica Felipe II y la historia reciente del Valle","Panteón de Reyes, biblioteca y basílica de El Escorial","Basílica excavada en la roca y cruz de 150 metros en Cuelgamuros"],
  inc=["Transporte en autocar desde el centro de Madrid","Guía oficial","Entradas al Monasterio de El Escorial y al Valle de Cuelgamuros"],
  noinc=["Comida","Recogida en hotel"],
  punto=("Centro de Madrid (punto exacto en el voucher)","La salida es desde el centro de Madrid a primera hora de la mañana; el punto exacto y la hora se indican en el voucher. Llega 15 minutos antes."),
  traer=["Ropa de abrigo: en la sierra hace fresco y dentro del monasterio también","Calzado cómodo"],
  noapto=[],
  tener=["Es una excursión de medio día: estás de vuelta en Madrid para comer","El Valle de Cuelgamuros puede cerrar por obras o actos; en ese caso el operador lo sustituye o reembolsa parte","El guía explica con neutralidad la historia del Valle; es parte del interés de la visita"],
  acces="El Escorial es mayormente accesible; el Valle tiene rampas y escalones. Consulta con el operador.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Por qué no ir por mi cuenta?","El Escorial sí se hace en tren, pero el Valle de Cuelgamuros está a 15 minutos en coche y casi sin transporte público. Esta excursión resuelve los dos en una mañana, con entradas y guía, por poco más de lo que cuesta ir por libre."),
       ("¿Qué se ve en el Valle de Cuelgamuros?","La basílica excavada en la montaña (262 metros de nave), la cruz de 150 metros, la mayor del mundo, y el paisaje de pinares de la sierra de Guadarrama. El guía explica su historia como monumento de la posguerra y su resignificación actual."),
       ("¿Hay versión en español?","Sí, hay salidas con guía en español y en inglés. Elige el idioma al reservar.")],
  opinion="Es la forma eficiente de ver los dos monumentos sin coche: cinco horas, una mañana, y vuelves a Madrid para comer. El Escorial impresiona por el edificio y el Valle por el lugar y la historia. Muy bien valorada por los guías.",
  guias=["madrid-en-3-dias","madrid-gratis","escapadas-desde-madrid-toledo"],
  kw=["excursion escorial valle de los caidos","escorial y cuelgamuros desde madrid","tour escorial madrid","valle de cuelgamuros visita"],
  cuerpo="""## La excursión

Cinco horas, dos monumentos y un guía. Sales del centro de Madrid a primera hora en autocar y recorres la sierra de Guadarrama hasta los dos lugares más cargados de historia de la Comunidad.

### El Escorial (2 horas)
El **monasterio de Felipe II**: palacio de los Austrias, **Panteón de Reyes** con 26 monarcas, salas capitulares con El Bosco y Tiziano, la **biblioteca** renacentista y la basílica. El guía ordena un edificio que por libre resulta inabarcable.

### Valle de Cuelgamuros (1 hora)
A 15 minutos: la **basílica excavada en la roca**, más larga que San Pedro del Vaticano, y la **cruz de 150 metros**, la más alta del mundo. El guía explica su construcción en la posguerra, la exhumación de 2019 y el proceso de resignificación en curso, con el equilibrio que exige el lugar.

## Para quién es

- Quien quiere ver los dos sitios sin coche: el Valle casi no tiene transporte público.
- Quien prefiere contexto: la historia de ambos lugares es lo que les da sentido.

## Para quién no es

- Quien quiere pasar el día entero en El Escorial y pasear por el pueblo: entonces compra solo la entrada y ve en tren."""),
 en=dict(slug="el-escorial-valley-of-cuelgamuros-group-tour", titulo="From Madrid: El Escorial and Valley of Cuelgamuros guided tour",
  desc="Half-day group excursion from Madrid with a guide: Monastery of El Escorial and Valley of Cuelgamuros (formerly Valley of the Fallen), tickets and transport included. 4.7/5 with 1,769 reviews.",
  alt="Monastery of El Escorial and its gardens",
  high=["Both monuments in one morning, with transport and tickets","Official guide explaining Philip II and the Valley's recent history","Pantheon of Kings, library and basilica at El Escorial","Rock-carved basilica and 150-metre cross at Cuelgamuros"],
  inc=["Coach transport from central Madrid","Official guide","Tickets to the Monastery of El Escorial and the Valley of Cuelgamuros"],
  noinc=["Lunch","Hotel pickup"],
  punto=("Central Madrid (exact point on your voucher)","Departure is from central Madrid first thing in the morning; the exact point and time are on your voucher. Arrive 15 minutes early."),
  traer=["Warm layer: it is cool in the mountains and inside the monastery","Comfortable shoes"],
  noapto=[],
  tener=["It is a half-day trip: you are back in Madrid for lunch","The Valley of Cuelgamuros may close for works or events; the operator then substitutes or partially refunds","The guide covers the Valley's history even-handedly; it is part of what makes the visit interesting"],
  acces="El Escorial is mostly accessible; the Valley has ramps and steps. Check with the operator.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Why not go on my own?","El Escorial is doable by train, but the Valley of Cuelgamuros is 15 minutes away by car with almost no public transport. This trip covers both in a morning, with tickets and a guide, for little more than going independently."),
       ("What is there to see at the Valley of Cuelgamuros?","The basilica carved into the mountain (a 262-metre nave), the 150-metre cross, the tallest in the world, and the pine forests of the Guadarrama range. The guide explains its history as a post-war monument and its current reinterpretation."),
       ("Is there an English-speaking guide?","Yes, there are departures with English-speaking and Spanish-speaking guides. Choose the language when booking.")],
  opinion="The efficient way to see both monuments without a car: five hours, one morning, and back in Madrid for lunch. El Escorial impresses with the building, the Valley with the setting and the history. Consistently praised for its guides.",
  guias=["madrid-in-3-days","madrid-on-a-budget","day-trips-from-madrid-toledo"],
  kw=["el escorial valley of the fallen tour","escorial and cuelgamuros from madrid","escorial tour madrid","valley of cuelgamuros visit"],
  cuerpo="""## The trip

Five hours, two monuments and a guide. You leave central Madrid early by coach and cross the Guadarrama mountains to the two most history-laden places in the region.

### El Escorial (2 hours)
**Philip II's monastery**: the Habsburg palace, the **Pantheon of Kings** with 26 monarchs, chapter rooms with Bosch and Titian, the Renaissance **library** and the basilica. The guide brings order to a building that is overwhelming on your own.

### Valley of Cuelgamuros (1 hour)
Fifteen minutes away: the **basilica carved into the rock**, longer than St Peter's in Rome, and the **150-metre cross**, the tallest in the world. The guide explains its post-war construction, the 2019 exhumation and the ongoing reinterpretation, with the balance the place demands.

## Who it's for

- Anyone who wants both sites without a car: the Valley has almost no public transport.
- Those who want context: the history of both places is what gives them meaning.

## Who it's not for

- Anyone who wants a full day at El Escorial and a stroll through the town: in that case buy the ticket alone and take the train."""),
))

A.append(dict(
 ciudad="madrid", tid=1314627, precio=38, rating=4.4, op=489, dur=("Validez 1 año","Valid 1 year"), min=480, cat="entradas",
 cancel=True, horas=24, tags=["museo-prado","reina-sofia"], destacada=False,
 img="/images/actividades/madrid/prado-edificio/museo-prado-edificio-2016-25185969599-hero.webp",
 gal=[("/images/actividades/madrid/thyssen/thyssen-fachada-paseo-prado-hero.webp","Museo Thyssen-Bornemisza en el Paseo del Prado","Thyssen-Bornemisza Museum on Paseo del Prado"),
      ("/images/actividades/madrid/reina-sofia/museo-reina-sofia-large-white-building-clock-tower-hero.webp","Edificio Sabatini del Museo Reina Sofía","Sabatini building of the Reina Sofía Museum"),
      ("/images/actividades/madrid/prado-edificio/museo-prado-edificio-madrid-02-hero.webp","Puerta de Velázquez del Museo del Prado","Velázquez entrance of the Prado Museum")],
 lat=40.4138, lng=-3.6921,
 es=dict(slug="art-walk-pass-prado-reina-sofia-thyssen", titulo="Madrid: Art Walk Pass (Prado, Reina Sofía y Thyssen)",
  desc="Abono para los tres grandes museos del Paseo del Arte: Prado, Reina Sofía y Thyssen-Bornemisza, una visita a cada uno, válido un año. 4,4/5 con 489 opiniones.",
  alt="Fachada del Museo del Prado en el Paseo del Arte, Madrid",
  high=["Los tres museos imprescindibles de Madrid en un solo abono","Ahorro frente a las tres entradas sueltas","Válido un año: sin fecha fija","Acceso sin pasar por taquilla en los tres"],
  inc=["Una entrada al Museo del Prado","Una entrada al Museo Reina Sofía","Una entrada al Museo Thyssen-Bornemisza (colección permanente)"],
  noinc=["Exposiciones temporales con entrada aparte","Guía o audioguía"],
  punto=("Museo del Prado, Puerta de Goya (Calle Felipe IV), Madrid","Canjea el voucher en cualquiera de los tres museos. Los tres están a 10 minutos a pie unos de otros en el Paseo del Prado. Metro: Banco de España (L2), Atocha (L1) o Estación del Arte (L1)."),
  traer=["Documento de identidad","Mochila pequeña: las grandes van a consigna"],
  noapto=[],
  tener=["Una sola entrada por museo: no se puede repetir","El Prado y el Thyssen cierran algunas tardes; comprueba horarios antes de planificar","Las horas gratuitas del Prado (18:00-20:00) están saturadas; con el abono entras a cualquier hora"],
  acces="Los tres museos son plenamente accesibles.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Cuánto ahorro?","Las entradas sueltas suman unos 41 € (Prado 15, Thyssen 14, Reina Sofía 12). El abono cuesta 38 € y te evita tres colas de taquilla. El ahorro real es tiempo más que dinero."),
       ("¿Tengo que hacer los tres el mismo día?","No. Es válido un año y cada museo pide medio día. Lo razonable: Prado un día, Thyssen y Reina Sofía otro."),
       ("¿Cuál hago si solo tengo tiempo para uno?","El Prado. Nuestra comparativa de los tres museos explica cuál elegir según lo que te interese.")],
  opinion="Si vas a entrar en los tres (y en una primera visita a Madrid deberías), el abono es la opción cómoda: un solo pago, tres museos, sin colas. Si solo vas a hacer uno o dos, compra las entradas sueltas.",
  guias=["prado-reina-sofia-thyssen-comparativa","madrid-en-3-dias"],
  kw=["abono paseo del arte","art walk pass madrid","prado thyssen reina sofia entrada","tres museos madrid"],
  cuerpo="""## Los tres museos

**Museo del Prado**: Velázquez, Goya, El Greco, Tiziano, Rubens y El Bosco. *Las Meninas*, *El jardín de las delicias*, las Pinturas Negras. Uno de los cinco grandes museos del mundo; mínimo 3 horas.

**Museo Thyssen-Bornemisza**: la colección privada que recorre el arte occidental del siglo XIII al XX: primitivos flamencos, impresionistas, expresionismo alemán, pop americano. El más variado de los tres; 2 horas.

**Museo Reina Sofía**: arte del siglo XX y el *Guernica* de Picasso, con Dalí, Miró y las vanguardias españolas. 2 horas si vas a lo esencial.

## Cómo repartirlos

Los tres están en el **Paseo del Prado**, a 10 minutos a pie unos de otros. Dos días es lo cómodo: el Prado una mañana entera; el Thyssen y el Reina Sofía otro día, uno por la mañana y otro por la tarde. El abono vale un año, así que no hay prisa.

## Para quién es

- Primera visita a Madrid con interés por el arte.
- Quien quiere evitar tres taquillas y tres reservas."""),
 en=dict(slug="art-walk-pass-prado-reina-sofia-thyssen", titulo="Madrid: Art Walk Pass (Prado, Reina Sofía and Thyssen)",
  desc="Pass for the three great museums of the Paseo del Arte: Prado, Reina Sofía and Thyssen-Bornemisza, one visit each, valid for a year. 4.4/5 with 489 reviews.",
  alt="Facade of the Prado Museum on the Paseo del Arte, Madrid",
  high=["Madrid's three essential museums on one pass","Saving versus three single tickets","Valid for a year: no fixed date","Skip the box office at all three"],
  inc=["One entry to the Prado Museum","One entry to the Reina Sofía Museum","One entry to the Thyssen-Bornemisza Museum (permanent collection)"],
  noinc=["Temporary exhibitions with separate tickets","Guide or audio guide"],
  punto=("Prado Museum, Goya Gate (Calle Felipe IV), Madrid","Exchange your voucher at any of the three museums. All three are within a 10-minute walk of each other on the Paseo del Prado. Metro: Banco de España (L2), Atocha (L1) or Estación del Arte (L1)."),
  traer=["ID document","A small bag: large ones go to the cloakroom"],
  noapto=[],
  tener=["One entry per museum: no repeat visits","The Prado and the Thyssen close some afternoons; check opening hours before planning","The Prado's free hours (6-8 pm) are packed; with the pass you enter at any time"],
  acces="All three museums are fully accessible.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("How much do I save?","Single tickets add up to about €41 (Prado 15, Thyssen 14, Reina Sofía 12). The pass costs €38 and saves you three box-office queues. The real saving is time more than money."),
       ("Do I have to do all three on the same day?","No. It is valid for a year and each museum takes half a day. The sensible plan: the Prado one day, the Thyssen and the Reina Sofía another."),
       ("Which one if I only have time for one?","The Prado. Our comparison of the three museums explains which to choose depending on your interests.")],
  opinion="If you are going to all three (and on a first visit to Madrid you should), the pass is the easy option: one payment, three museums, no queues. If you will only do one or two, buy single tickets.",
  guias=["prado-vs-reina-sofia-vs-thyssen","madrid-in-3-days"],
  kw=["paseo del arte pass","art walk pass madrid","prado thyssen reina sofia ticket","three museums madrid"],
  cuerpo="""## The three museums

**Prado Museum**: Velázquez, Goya, El Greco, Titian, Rubens and Bosch. *Las Meninas*, *The Garden of Earthly Delights*, the Black Paintings. One of the world's five great museums; 3 hours minimum.

**Thyssen-Bornemisza Museum**: the private collection that spans Western art from the 13th to the 20th century: Flemish primitives, Impressionists, German Expressionism, American Pop. The most varied of the three; 2 hours.

**Reina Sofía Museum**: 20th-century art and Picasso's *Guernica*, with Dalí, Miró and the Spanish avant-garde. 2 hours for the essentials.

## How to split them

All three are on the **Paseo del Prado**, a 10-minute walk from each other. Two days is comfortable: a full morning at the Prado; the Thyssen and the Reina Sofía another day, one in the morning and one in the afternoon. The pass is valid for a year, so there is no rush.

## Who it's for

- A first visit to Madrid with an interest in art.
- Anyone who wants to avoid three box offices and three bookings."""),
))

A.append(dict(
 ciudad="valencia", tid=1026111, precio=14, rating=4.4, op=130, dur=("3-4 horas","3-4 hours"), min=210, cat="entradas",
 cancel=True, horas=24, tags=["ciudad-artes-ciencias"], destacada=False,
 img="/images/actividades/valencia/museo-ciencias/hemisferic.webp",
 gal=[("/images/actividades/valencia/museo-ciencias/museo-ciencias-fachada.webp","Fachada del Museu de les Ciències","Facade of the Museu de les Ciències"),
      ("/images/actividades/valencia/museo-ciencias/museo-ciencias-noche.webp","Museu de les Ciències de noche","Museu de les Ciències at night"),
      ("/images/actividades/valencia/museo-ciencias/hemisferic-dia.webp","El Hemisfèric, el ojo de Calatrava","The Hemisfèric, Calatrava's eye")],
 lat=39.4549, lng=-0.3516,
 es=dict(slug="hemisferic-museu-ciencies-entrada", titulo="Valencia: entrada combinada Hemisfèric + Museu de les Ciències",
  desc="Entrada combinada al Hemisfèric (cine IMAX y planetario) y al Museu de les Ciències de la Ciudad de las Artes, sin el Oceanogràfic. 4,4/5 con 130 opiniones.",
  alt="El Hemisfèric de la Ciudad de las Artes y las Ciencias de Valencia",
  high=["Dos de los tres edificios de Calatrava por menos de 15 €","Película en pantalla cóncava de 900 m² en el Hemisfèric","Museo de ciencias interactivo: tocar está permitido","La alternativa barata si el Oceanogràfic no te interesa"],
  inc=["Entrada al Museu de les Ciències","Una sesión en el Hemisfèric (elige película y hora al canjear)"],
  noinc=["Oceanogràfic","Exposiciones temporales con entrada aparte"],
  punto=("Taquillas del Museu de les Ciències, Av. del Professor López Piñero 7, Valencia","Canjea el voucher en las taquillas del Museu de les Ciències y elige allí la sesión del Hemisfèric. Metro: Alameda (L3/L5) y 15 minutos a pie por el jardín del Turia, o autobuses 35 y 95."),
  traer=["Reserva de la sesión del Hemisfèric al llegar: las de la tarde se llenan"],
  noapto=[],
  tener=["La sesión del Hemisfèric dura 45 minutos: planifica el museo alrededor de esa hora","El Museu de les Ciències es muy bueno con niños de 6 a 14 años","Si vas a entrar en el Oceanogràfic, la entrada combinada de los tres sale más a cuenta"],
  acces="Totalmente accesible.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Cuál es la diferencia con la entrada 3 en 1?","Esta incluye Hemisfèric y Museu de les Ciències (14 €); la 3 en 1 añade el Oceanogràfic (46 €). El Oceanogràfic es el gran reclamo, pero si no te interesan los acuarios, esta es la entrada correcta."),
       ("¿Qué película ponen en el Hemisfèric?","Documentales IMAX de naturaleza, espacio y ciencia, de 45 minutos, en pantalla cóncava de 900 m². La cartelera cambia cada temporada; eliges la sesión al canjear."),
       ("¿Es para niños?","El Museu de les Ciències es uno de los mejores museos interactivos de España para niños. El Hemisfèric gusta a todas las edades.")],
  opinion="La entrada para quien quiere ver la Ciudad de las Artes por dentro sin pagar el Oceanogràfic. Por 14 € tienes una tarde completa: el museo interactivo y una película en la pantalla más espectacular de Valencia.",
  guias=["ciudad-artes-ciencias-como-visitar","valencia-en-2-dias","valencia-con-ninos"],
  kw=["hemisferic entrada","museu de les ciencies entrada","ciudad de las artes entrada sin oceanografic","hemisferic museo ciencias combinada"],
  cuerpo="""## Qué incluye

**Museu de les Ciències Príncipe Felipe**: 26.000 m² de ciencia interactiva en el edificio con forma de esqueleto de ballena. Péndulo de Foucault de 34 metros, exposiciones sobre el cuerpo humano, el espacio y el clima, y talleres en directo. Aquí el lema es *prohibido no tocar*.

**Hemisfèric**: el ojo de Calatrava. Dentro, una sala con **pantalla cóncava de 900 m²** donde se proyectan documentales IMAX y sesiones de planetario. Una sesión de 45 minutos incluida; eliges película y hora al canjear.

## Cómo organizar la visita

Llega, canjea y reserva la sesión del Hemisfèric para dentro de dos horas. Recorre el museo (2 horas es lo razonable con niños) y entra a la película. Al salir, el paseo por los estanques entre los edificios es gratis y es la mejor foto de Valencia al atardecer.

## Para quién es

- Familias con niños de 6 a 14 años.
- Quien quiere la Ciudad de las Artes por dentro sin pagar los 46 € de la entrada con Oceanogràfic."""),
 en=dict(slug="hemisferic-science-museum-combo-ticket", titulo="Valencia: Hemisfèric + Science Museum combo ticket",
  desc="Combined ticket for the Hemisfèric (IMAX cinema and planetarium) and the Science Museum at the City of Arts and Sciences, without the Oceanogràfic. 4.4/5 with 130 reviews.",
  alt="The Hemisfèric at the City of Arts and Sciences in Valencia",
  high=["Two of Calatrava's three buildings for under €15","Film on a 900 m² concave screen at the Hemisfèric","Interactive science museum: touching is allowed","The budget option if the Oceanogràfic is not for you"],
  inc=["Entry to the Museu de les Ciències","One session at the Hemisfèric (choose film and time when exchanging)"],
  noinc=["Oceanogràfic","Temporary exhibitions with separate tickets"],
  punto=("Museu de les Ciències ticket desks, Av. del Professor López Piñero 7, Valencia","Exchange your voucher at the Museu de les Ciències ticket desks and choose your Hemisfèric session there. Metro: Alameda (L3/L5) and a 15-minute walk through the Turia gardens, or buses 35 and 95."),
  traer=["Book your Hemisfèric session on arrival: afternoon ones fill up"],
  noapto=[],
  tener=["The Hemisfèric session lasts 45 minutes: plan the museum around that time","The Science Museum is excellent with children aged 6 to 14","If you plan to visit the Oceanogràfic, the 3-in-1 ticket is better value"],
  acces="Fully accessible.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("How does it differ from the 3-in-1 ticket?","This one includes the Hemisfèric and the Science Museum (€14); the 3-in-1 adds the Oceanogràfic (€46). The Oceanogràfic is the big draw, but if aquariums are not your thing, this is the right ticket."),
       ("What film is showing at the Hemisfèric?","45-minute IMAX documentaries on nature, space and science, on a 900 m² concave screen. The programme changes each season; you choose the session when you exchange your voucher."),
       ("Is it good for children?","The Science Museum is one of Spain's best interactive museums for children. The Hemisfèric works for all ages.")],
  opinion="The ticket for anyone who wants to see the City of Arts from the inside without paying for the Oceanogràfic. For €14 you get a full afternoon: the interactive museum and a film on Valencia's most spectacular screen.",
  guias=["city-of-arts-sciences-how-to-visit","valencia-in-2-days","valencia-with-kids"],
  kw=["hemisferic ticket","science museum valencia ticket","city of arts ticket without oceanografic","hemisferic science museum combo"],
  cuerpo="""## What's included

**Museu de les Ciències Príncipe Felipe**: 26,000 m² of hands-on science in the building shaped like a whale skeleton. A 34-metre Foucault pendulum, exhibitions on the human body, space and climate, and live workshops. The motto here is *forbidden not to touch*.

**Hemisfèric**: Calatrava's eye. Inside, a hall with a **900 m² concave screen** showing IMAX documentaries and planetarium sessions. One 45-minute session included; you choose the film and time when you exchange your voucher.

## Planning the visit

Arrive, exchange your voucher and book the Hemisfèric session for two hours later. Explore the museum (2 hours is about right with children) and go in for the film. On the way out, the walk around the pools between the buildings is free and gives the best photo of Valencia at sunset.

## Who it's for

- Families with children aged 6 to 14.
- Anyone who wants the City of Arts from the inside without paying €46 for the ticket with the Oceanogràfic."""),
))

A.append(dict(
 ciudad="granada", tid=961733, precio=10, rating=4.5, op=612, dur=("1 hora","1 hour"), min=60, cat="entradas",
 cancel=True, horas=24, tags=["catedral"], destacada=False,
 img="/images/actividades/granada/catedral/granada-catedral-04.webp",
 gal=[("/images/actividades/granada/catedral/granada-catedral-01.webp","Capilla de Nuestra Señora de las Angustias, Catedral de Granada","Chapel of Our Lady of Sorrows, Granada Cathedral"),
      ("/images/actividades/granada/catedral/granada-catedral-02.webp","Interior de la Catedral de Granada","Interior of Granada Cathedral"),
      ("/images/actividades/granada/catedral/granada-catedral-06.webp","Puerta del Perdón","Gate of Forgiveness")],
 lat=37.1764, lng=-3.5990,
 es=dict(slug="catedral-granada-entrada", titulo="Granada: entrada a la Catedral con audioguía",
  desc="Entrada a la Catedral de Granada, la gran catedral renacentista de España, con audioguía incluida. 4,5/5 con 612 opiniones.",
  alt="Fachada de la Catedral de Granada",
  high=["La primera catedral renacentista de España, obra de Diego de Siloé","Capilla Mayor de 45 metros con vidrieras y los retratos de los Reyes Católicos","Audioguía incluida en varios idiomas","A 5 minutos de Plaza Nueva y junto a la Capilla Real"],
  inc=["Entrada a la Catedral de Granada","Audioguía"],
  noinc=["Capilla Real (entrada aparte, acceso independiente)","Guía en persona"],
  punto=("Catedral de Granada, Calle Gran Vía de Colón 5 (entrada por Plaza de las Pasiegas)","La entrada de visitantes está en la Plaza de las Pasiegas, en el lateral de la catedral que da a la Gran Vía. Presenta el voucher en taquilla y recoge la audioguía."),
  traer=["Hombros y rodillas cubiertos (es un templo en uso)"],
  noapto=[],
  tener=["Los domingos por la mañana no hay visita turística por el culto","La Capilla Real está pegada pero tiene entrada propia y horarios distintos","Una hora es suficiente; con la Capilla Real, dos"],
  acces="Accesible en planta baja.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Incluye la Capilla Real?","No. Son dos monumentos con entradas y accesos distintos aunque estén pegados. La Capilla Real, donde están enterrados los Reyes Católicos, se reserva aparte."),
       ("¿Merece la pena después de la Alhambra?","Es otro mundo: la Alhambra es nazarí y la Catedral es la respuesta cristiana, empezada 30 años después de la conquista. Juntas cuentan la historia de la ciudad. Una hora bien invertida."),
       ("¿Por qué está la catedral tan encajonada?","Se construyó sobre la mezquita mayor, en el centro de la medina, y nunca se despejó el entorno. Por eso no hay una gran plaza delante y la fachada se ve mejor desde la Plaza de las Pasiegas.")],
  opinion="La Catedral de Granada vive a la sombra de la Alhambra y no lo merece: es la obra maestra del Renacimiento andaluz y la Capilla Mayor es de las más luminosas de España. Diez euros con audioguía; combínala con la Capilla Real.",
  guias=["granada-en-2-dias","alhambra-como-visitar"],
  kw=["catedral de granada entrada","catedral granada entradas","catedral granada audioguia","que ver en granada catedral"],
  cuerpo="""## Qué verás

La **Catedral de Granada** se empezó en 1523 sobre la mezquita mayor de la ciudad y es la primera gran catedral renacentista de España. Diego de Siloé la concibió como un templo luminoso y blanco, lo contrario de las catedrales góticas que la precedieron.

### La Capilla Mayor
Una rotonda de **45 metros de altura** con dos pisos de vidrieras, cinco grandes lienzos de Alonso Cano y, en las pechinas, los retratos orantes de los Reyes Católicos. Es lo que recordarás.

### Las naves y las capillas
Cinco naves de pilares blancos y bóvedas pintadas. Entre las capillas, la de **Nuestra Señora de las Angustias** (patrona de Granada) y la de la Trinidad, con la Inmaculada de Alonso Cano.

### La fachada
Obra de Alonso Cano (1667), un arco de triunfo de tres cuerpos que se ve mejor desde la **Plaza de las Pasiegas**, donde está la entrada de visitantes.

## Cómo combinarla

Está pegada a la **Capilla Real** (entrada aparte) y a 5 minutos de la Alcaicería y Plaza Bib-Rambla. Una mañana: Catedral, Capilla Real y un paseo por la Alcaicería antes de comer."""),
 en=dict(slug="granada-cathedral-entry-ticket", titulo="Granada: Cathedral entry ticket with audio guide",
  desc="Entry ticket to Granada Cathedral, Spain's great Renaissance cathedral, with audio guide included. 4.5/5 with 612 reviews.",
  alt="Facade of Granada Cathedral",
  high=["Spain's first Renaissance cathedral, by Diego de Siloé","45-metre High Chapel with stained glass and portraits of the Catholic Monarchs","Audio guide included in several languages","5 minutes from Plaza Nueva, next to the Royal Chapel"],
  inc=["Entry ticket to Granada Cathedral","Audio guide"],
  noinc=["Royal Chapel (separate ticket and entrance)","Live guide"],
  punto=("Granada Cathedral, Calle Gran Vía de Colón 5 (entrance via Plaza de las Pasiegas)","The visitor entrance is on Plaza de las Pasiegas, on the side of the cathedral facing Gran Vía. Show your voucher at the desk and collect the audio guide."),
  traer=["Covered shoulders and knees (it is a working church)"],
  noapto=[],
  tener=["No tourist visits on Sunday mornings because of services","The Royal Chapel is next door but has its own entrance and hours","One hour is enough; two with the Royal Chapel"],
  acces="Accessible on the ground floor.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Does it include the Royal Chapel?","No. They are two monuments with separate tickets and entrances, even though they adjoin. The Royal Chapel, where the Catholic Monarchs are buried, is booked separately."),
       ("Is it worth it after the Alhambra?","It is another world: the Alhambra is Nasrid and the Cathedral is the Christian response, begun 30 years after the conquest. Together they tell the city's story. An hour well spent."),
       ("Why is the cathedral so hemmed in?","It was built on the site of the main mosque, in the heart of the medina, and the surroundings were never cleared. That is why there is no grand square in front and the facade is best seen from Plaza de las Pasiegas.")],
  opinion="Granada Cathedral lives in the Alhambra's shadow and does not deserve to: it is the masterpiece of the Andalusian Renaissance and its High Chapel is among the brightest in Spain. Ten euros with audio guide; combine it with the Royal Chapel.",
  guias=["granada-in-2-days","alhambra-how-to-visit"],
  kw=["granada cathedral ticket","granada cathedral tickets","granada cathedral audio guide","what to see in granada cathedral"],
  cuerpo="""## What you'll see

**Granada Cathedral** was begun in 1523 on the site of the city's main mosque and is Spain's first great Renaissance cathedral. Diego de Siloé conceived it as a bright, white temple, the opposite of the Gothic cathedrals that came before.

### The High Chapel
A rotunda **45 metres high** with two tiers of stained glass, five large canvases by Alonso Cano and, in the pendentives, the praying portraits of the Catholic Monarchs. This is what you will remember.

### The naves and chapels
Five naves of white pillars and painted vaults. Among the chapels, **Our Lady of Sorrows** (Granada's patron) and the Trinity chapel with Alonso Cano's Immaculate Conception.

### The facade
By Alonso Cano (1667), a three-tier triumphal arch best seen from **Plaza de las Pasiegas**, where the visitor entrance is.

## How to combine it

It adjoins the **Royal Chapel** (separate ticket) and is 5 minutes from the Alcaicería and Plaza Bib-Rambla. One morning: Cathedral, Royal Chapel and a stroll through the Alcaicería before lunch."""),
))

A.append(dict(
 ciudad="granada", tid=962086, precio=10, rating=4.4, op=141, dur=("45 minutos","45 minutes"), min=45, cat="entradas",
 cancel=True, horas=24, tags=["catedral"], destacada=False,
 img="/images/actividades/granada/capilla-real/capilla-real-granada-granada-capilla-real-6-vista-hero.webp",
 gal=[("/images/actividades/granada/catedral/granada-catedral-04.webp","La Catedral, pegada a la Capilla Real","The Cathedral, adjoining the Royal Chapel"),
      ("/images/actividades/granada/catedral/granada-catedral-06.webp","Puerta del Perdón de la Catedral","Gate of Forgiveness of the Cathedral")],
 lat=37.1759, lng=-3.5984,
 es=dict(slug="capilla-real-granada-entrada", titulo="Granada: entrada a la Capilla Real con audioguía",
  desc="Entrada a la Capilla Real de Granada, mausoleo de los Reyes Católicos, con audioguía. Sepulcros de mármol, cripta y museo con la colección de Isabel la Católica. 4,4/5 con 141 opiniones.",
  alt="Exterior de la Capilla Real de Granada",
  high=["Tumbas de Isabel y Fernando, Juana la Loca y Felipe el Hermoso","Sepulcros de mármol de Carrara y la reja de Bartolomé de Jaén","Museo con la colección flamenca de Isabel la Católica: Memling, Van der Weyden, Botticelli","Audioguía incluida"],
  inc=["Entrada a la Capilla Real","Audioguía"],
  noinc=["Catedral (entrada aparte)","Guía en persona"],
  punto=("Capilla Real, Calle Oficios s/n, Granada","La entrada está en la calle Oficios, entre la Catedral y la Alcaicería, por la Lonja. Presenta el voucher en taquilla."),
  traer=["Hombros y rodillas cubiertos"],
  noapto=[],
  tener=["No se pueden hacer fotos en el interior","Los domingos por la mañana cierra por el culto","Es pequeña: 45 minutos bastan; combínala con la Catedral"],
  acces="Accesible salvo la cripta, que tiene escaleras.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Quién está enterrado aquí?","Los Reyes Católicos, Isabel y Fernando; su hija Juana la Loca y su marido Felipe el Hermoso; y el infante Miguel, nieto de los reyes. Los sepulcros de mármol están en la capilla y los ataúdes de plomo, en la cripta."),
       ("¿Por qué quisieron enterrarse en Granada?","Porque la conquista de Granada en 1492 fue el gran logro de su reinado. Isabel lo dejó escrito en su testamento y la capilla se construyó entre 1505 y 1517."),
       ("¿Qué hay en el museo?","La colección personal de Isabel: tablas flamencas de Memling, Van der Weyden y Bouts, un Botticelli, su corona y cetro, la espada de Fernando y los estandartes de la conquista.")],
  opinion="Es el lugar donde la historia de España se vuelve concreta: dos reyes en mármol y, debajo, sus ataúdes de plomo. Pequeña, intensa y con un museo que sorprende. Diez euros bien gastados; hazla junto con la Catedral.",
  guias=["granada-en-2-dias","alhambra-como-visitar"],
  kw=["capilla real granada entrada","capilla real granada","tumba reyes catolicos","capilla real entradas"],
  cuerpo="""## Qué verás

La **Capilla Real** es el mausoleo que Isabel y Fernando mandaron construir en la ciudad que conquistaron. Gótico isabelino, levantado entre 1505 y 1517, con una reja de hierro dorado de Bartolomé de Jaén que es una obra maestra por sí sola.

### Los sepulcros
Dos monumentos funerarios de **mármol de Carrara**: el de los Reyes Católicos (Domenico Fancelli, 1517) y el de Juana la Loca y Felipe el Hermoso (Bartolomé Ordóñez). Bajo ellos, por una escalera, la **cripta** con los cinco ataúdes de plomo.

### El retablo
Obra de Felipe Bigarny, con relieves de la rendición de Boabdil y el bautismo de los moriscos: la conquista contada por los vencedores.

### El museo
En la sacristía, la **colección flamenca de Isabel la Católica**: Memling, Van der Weyden, Dirk Bouts y Botticelli. Además, su corona, su cetro y el cofre, y la espada de Fernando.

## Cómo combinarla

Está pegada a la **Catedral** (entrada aparte). Las dos en una mañana, con la Alcaicería y Bib-Rambla al lado para comer."""),
 en=dict(slug="royal-chapel-granada-entry-ticket", titulo="Granada: Royal Chapel entry ticket with audio guide",
  desc="Entry ticket to the Royal Chapel of Granada, mausoleum of the Catholic Monarchs, with audio guide. Marble tombs, crypt and museum with Isabella's art collection. 4.4/5 with 141 reviews.",
  alt="Exterior of the Royal Chapel of Granada",
  high=["Tombs of Isabella and Ferdinand, Joanna the Mad and Philip the Handsome","Carrara marble sepulchres and Bartolomé de Jaén's grille","Museum with Isabella's Flemish collection: Memling, Van der Weyden, Botticelli","Audio guide included"],
  inc=["Entry ticket to the Royal Chapel","Audio guide"],
  noinc=["Cathedral (separate ticket)","Live guide"],
  punto=("Royal Chapel, Calle Oficios, Granada","The entrance is on Calle Oficios, between the Cathedral and the Alcaicería, through the Lonja. Show your voucher at the desk."),
  traer=["Covered shoulders and knees"],
  noapto=[],
  tener=["No photography inside","Closed on Sunday mornings for services","It is small: 45 minutes is enough; combine it with the Cathedral"],
  acces="Accessible except the crypt, which has stairs.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Who is buried here?","The Catholic Monarchs, Isabella and Ferdinand; their daughter Joanna the Mad and her husband Philip the Handsome; and Prince Miguel, the monarchs' grandson. The marble sepulchres are in the chapel and the lead coffins in the crypt."),
       ("Why did they want to be buried in Granada?","Because the conquest of Granada in 1492 was the great achievement of their reign. Isabella set it down in her will and the chapel was built between 1505 and 1517."),
       ("What is in the museum?","Isabella's personal collection: Flemish panels by Memling, Van der Weyden and Bouts, a Botticelli, her crown and sceptre, Ferdinand's sword and the banners of the conquest.")],
  opinion="This is where Spanish history becomes concrete: two monarchs in marble and, below, their lead coffins. Small, intense, with a museum that surprises. Ten euros well spent; do it together with the Cathedral.",
  guias=["granada-in-2-days","alhambra-how-to-visit"],
  kw=["royal chapel granada ticket","royal chapel granada","catholic monarchs tomb","capilla real tickets"],
  cuerpo="""## What you'll see

The **Royal Chapel** is the mausoleum Isabella and Ferdinand had built in the city they conquered. Isabelline Gothic, raised between 1505 and 1517, with a gilded iron grille by Bartolomé de Jaén that is a masterpiece in itself.

### The tombs
Two funerary monuments in **Carrara marble**: that of the Catholic Monarchs (Domenico Fancelli, 1517) and that of Joanna the Mad and Philip the Handsome (Bartolomé Ordóñez). Beneath them, down a staircase, the **crypt** with the five lead coffins.

### The altarpiece
By Felipe Bigarny, with reliefs of Boabdil's surrender and the baptism of the Moriscos: the conquest as told by the victors.

### The museum
In the sacristy, **Isabella's Flemish collection**: Memling, Van der Weyden, Dirk Bouts and Botticelli. Plus her crown, sceptre and casket, and Ferdinand's sword.

## How to combine it

It adjoins the **Cathedral** (separate ticket). Both in one morning, with the Alcaicería and Bib-Rambla next door for lunch."""),
))

A.append(dict(
 ciudad="malaga", tid=446333, precio=16, rating=4.6, op=2107, dur=("45 minutos","45 minutes"), min=45, cat="entradas",
 cancel=True, horas=24, tags=["excursiones"], destacada=False,
 img="/images/actividades/granada/nerja-frigiliana-sin-colas/nerja-frigiliana-sin-colas-cuevas-nerja-interior-01-hero.webp",
 gal=[("/images/actividades/granada/nerja-costa-tropical-desde-granada/nerja-costa-tropical-desde-granada-cuevas-nerja-interior-cue-hero.webp","Estalactitas en la Sala del Cataclismo","Stalactites in the Cataclysm Hall"),
      ("/images/actividades/granada/nerja-costa-tropical-desde-granada/nerja-costa-tropical-desde-granada-cuevas-entrada-exterior-0-hero.webp","Entrada a la Cueva de Nerja","Entrance to the Nerja Caves"),
      ("/images/actividades/granada/nerja-frigiliana-sin-colas/nerja-frigiliana-sin-colas-balcon-europa-vista-panoramica-02-hero.webp","Balcón de Europa, en Nerja","Balcón de Europa in Nerja")],
 lat=36.7619, lng=-3.8456,
 es=dict(slug="cuevas-nerja-entrada", titulo="Cueva de Nerja: entrada con audioguía",
  desc="Entrada a la Cueva de Nerja con audioguía: la columna de estalactitas más grande del mundo, salas de 60 metros de altura y pinturas rupestres de 40.000 años. 4,6/5 con 2.107 opiniones.",
  alt="Interior de la Cueva de Nerja con sus formaciones",
  high=["La columna natural más grande del mundo (32 m de altura, Guinness)","Salas de hasta 60 metros de altura iluminadas","Recorrido de 45 minutos con audioguía","A 5 km de Nerja y el Balcón de Europa"],
  inc=["Entrada a la Cueva de Nerja","Audioguía"],
  noinc=["Transporte","Museo de Nerja (entrada conjunta disponible en taquilla)"],
  punto=("Cueva de Nerja, Carretera de Maro s/n, Nerja (Málaga)","La cueva está en Maro, a 5 km de Nerja por la N-340. En coche, aparcamiento gratuito. En autobús, línea Málaga-Nerja de ALSA (1 h 15) y luego el bus urbano o taxi hasta la cueva. Presenta el voucher en taquilla a la hora reservada."),
  traer=["Calzado con suela de goma: el suelo está húmedo y hay escaleras","Una chaqueta ligera: dentro hay 19-20 °C todo el año"],
  noapto=["Personas con movilidad reducida: 400 escalones en el recorrido"],
  tener=["La entrada tiene hora asignada; en verano se agotan las franjas de mañana","Solo se visita un tercio de la cueva (las Galerías Turísticas); el resto está reservado a investigación","Las pinturas rupestres no están en el recorrido abierto al público"],
  acces="No accesible: el recorrido tiene unos 400 escalones.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Cuánto dura la visita?","Unos 45 minutos siguiendo la audioguía por las Galerías Turísticas: Sala del Belén, Sala de la Cascada, Sala de los Fantasmas y Sala del Cataclismo, donde está la gran columna."),
       ("¿Se pueden ver las pinturas rupestres?","No. Las pinturas (algunas de las más antiguas del mundo, de hace unos 40.000 años) están en las galerías altas, cerradas al público para conservarlas. En el museo de Nerja hay reproducciones."),
       ("¿Es buena idea combinarla con Frigiliana?","Sí: Frigiliana está a 10 minutos en coche y es uno de los pueblos blancos más bonitos de Andalucía. Cueva por la mañana, Frigiliana para comer y el Balcón de Europa en Nerja al atardecer.")],
  opinion="La Cueva de Nerja es la excursión natural más espectacular de la Costa del Sol: la Sala del Cataclismo, con su columna de 32 metros, deja sin palabras. Entrada barata y con hora; en verano reserva con días de antelación.",
  guias=["escapadas-desde-malaga","malaga-en-dos-dias"],
  kw=["cueva de nerja entradas","cuevas de nerja entrada","cueva nerja precio","cueva de nerja visita"],
  cuerpo="""## Qué verás

La **Cueva de Nerja** se descubrió en 1959 por cinco chicos de Maro que entraron persiguiendo murciélagos. Hoy es uno de los monumentos naturales más visitados de España: 4 km de galerías de los que se visita un tercio.

### El recorrido (45 minutos)
- **Sala del Belén**: la entrada, donde se encontraron restos humanos y herramientas del Paleolítico.
- **Sala de la Cascada**: formaciones que parecen una cortina de agua congelada. Aquí se celebra el Festival de Música y Danza cada verano.
- **Sala de los Fantasmas**: nombre por las siluetas que forman las estalagmitas.
- **Sala del Cataclismo**: la gran cúpula de 60 metros de altura con la **columna de 32 metros**, la más grande del mundo según el Guinness. Las formaciones caídas del suelo las derribó un terremoto hace 800.000 años.

## Cómo organizar el día

Desde Málaga son 55 minutos en coche por la A-7. Reserva la cueva a primera hora (10:00), come en **Frigiliana** (10 minutos) y termina en el **Balcón de Europa** de Nerja. Si no tienes coche, mira la excursión organizada Nerja y Frigiliana desde Málaga."""),
 en=dict(slug="nerja-caves-entry-ticket", titulo="Nerja Caves: entry ticket with audio guide",
  desc="Entry ticket to the Nerja Caves with audio guide: the world's largest stalactite column, chambers 60 metres high and 40,000-year-old cave paintings. 4.6/5 with 2,107 reviews.",
  alt="Interior of the Nerja Caves with their formations",
  high=["The world's largest natural column (32 m high, Guinness record)","Illuminated chambers up to 60 metres high","45-minute route with audio guide","5 km from Nerja and the Balcón de Europa"],
  inc=["Entry ticket to the Nerja Caves","Audio guide"],
  noinc=["Transport","Nerja Museum (combined ticket available at the desk)"],
  punto=("Nerja Caves, Carretera de Maro, Nerja (Málaga)","The caves are in Maro, 5 km from Nerja on the N-340. By car, free parking. By bus, the ALSA Málaga-Nerja line (1 h 15) then the local bus or a taxi to the caves. Show your voucher at the desk at your reserved time."),
  traer=["Rubber-soled shoes: the floor is damp and there are stairs","A light jacket: it is 19-20 °C inside all year"],
  noapto=["People with reduced mobility: about 400 steps on the route"],
  tener=["Entry is timed; morning slots sell out in summer","Only a third of the cave is visited (the Tourist Galleries); the rest is reserved for research","The cave paintings are not on the public route"],
  acces="Not accessible: the route has about 400 steps.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("How long is the visit?","About 45 minutes following the audio guide through the Tourist Galleries: Nativity Hall, Cascade Hall, Hall of the Ghosts and the Cataclysm Hall, home of the great column."),
       ("Can I see the cave paintings?","No. The paintings (some of the oldest in the world, around 40,000 years old) are in the upper galleries, closed to the public for conservation. The Nerja Museum has reproductions."),
       ("Is it a good idea to combine it with Frigiliana?","Yes: Frigiliana is 10 minutes away by car and one of the prettiest white villages in Andalusia. Caves in the morning, Frigiliana for lunch and the Balcón de Europa in Nerja at sunset.")],
  opinion="The Nerja Caves are the most spectacular natural excursion on the Costa del Sol: the Cataclysm Hall, with its 32-metre column, leaves you speechless. Cheap, timed ticket; in summer book days ahead.",
  guias=["day-trips-from-malaga","malaga-in-two-days"],
  kw=["nerja caves tickets","nerja caves entry","nerja cave price","nerja caves visit"],
  cuerpo="""## What you'll see

The **Nerja Caves** were discovered in 1959 by five boys from Maro who went in chasing bats. Today they are one of Spain's most visited natural monuments: 4 km of galleries, of which a third is open.

### The route (45 minutes)
- **Nativity Hall**: the entrance, where Palaeolithic human remains and tools were found.
- **Cascade Hall**: formations that look like a frozen curtain of water. The Music and Dance Festival is held here every summer.
- **Hall of the Ghosts**: named after the silhouettes formed by the stalagmites.
- **Cataclysm Hall**: the great 60-metre dome with the **32-metre column**, the largest in the world according to Guinness. The fallen formations on the floor were toppled by an earthquake 800,000 years ago.

## Planning the day

From Málaga it is 55 minutes by car on the A-7. Book the caves first thing (10 am), have lunch in **Frigiliana** (10 minutes away) and finish at Nerja's **Balcón de Europa**. Without a car, look at the organised Nerja and Frigiliana trip from Málaga."""),
))

A.append(dict(
 ciudad="alicante", tid=719748, precio=9, rating=4.6, op=1822, dur=("30 min por trayecto","30 min each way"), min=60, cat="transporte",
 cancel=True, horas=24, tags=["mar"], destacada=False,
 img="/images/actividades/alicante/tabarca/tabarca-pueblo.webp",
 gal=[("/images/actividades/alicante/tabarca/tabarca-playa.webp","Playa de Tabarca","Tabarca beach"),
      ("/images/actividades/alicante/tabarca/faro-tabarca.webp","Faro de Tabarca","Tabarca lighthouse"),
      ("/images/actividades/alicante/tabarca/porta-de-terra.webp","Porta de Terra, entrada al pueblo amurallado","Porta de Terra, gateway to the walled village")],
 lat=38.1913, lng=-0.5582,
 es=dict(slug="ferry-santa-pola-tabarca", titulo="Santa Pola: ferry de ida y vuelta a la isla de Tabarca",
  desc="Ferry de ida y vuelta entre Santa Pola y la isla de Tabarca: 30 minutos de travesía, la forma más rápida y barata de llegar a la única isla habitada de la Comunidad Valenciana. 4,6/5 con 1.822 opiniones.",
  alt="Pueblo amurallado de la isla de Tabarca visto desde el mar",
  high=["El trayecto más corto a Tabarca: 30 minutos frente a 1 hora desde Alicante","Salidas cada hora en temporada","Reserva marina con aguas transparentes para hacer snorkel","Pueblo amurallado del siglo XVIII y caldero de pescado"],
  inc=["Billete de ferry ida y vuelta Santa Pola–Tabarca"],
  noinc=["Transporte hasta Santa Pola","Comida","Equipo de snorkel"],
  punto=("Puerto de Santa Pola, embarcadero de los ferris a Tabarca","Santa Pola está a 20 km de Alicante (25 min en coche, autobús desde la estación). Los ferris salen del puerto pesquero; presenta el voucher en la taquilla de la naviera 20 minutos antes. Elige la hora de ida y vuelta al reservar."),
  traer=["Bañador, toalla y gafas de snorkel","Protección solar: en la isla hay poca sombra","Efectivo para el caldero: algunos restaurantes no aceptan tarjeta"],
  noapto=[],
  tener=["Elige bien la vuelta: la última suele ser a media tarde","Con mar gruesa la naviera puede cancelar y te reembolsa","Tabarca se llena en agosto a mediodía; ve en la primera salida"],
  acces="El embarque tiene escalones. Consulta a la naviera.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Mejor desde Santa Pola o desde Alicante?","Desde Santa Pola el trayecto es de 30 minutos y cuesta la mitad; desde Alicante es 1 hora y sale del centro. Si tienes coche o te alojas en el sur, Santa Pola; si estás en Alicante sin coche, el barco desde el puerto de Alicante."),
       ("¿Cuánto tiempo necesito en Tabarca?","Entre 4 y 6 horas: paseo por el pueblo amurallado (30 min), baño y snorkel en la playa o las calas del este, y el caldero. En un día sobra."),
       ("¿Qué es el caldero?","El plato de la isla: un guiso de pescado de roca con arroz, al estilo de los pescadores genoveses que la poblaron en el siglo XVIII. Reserva mesa en temporada.")],
  opinion="Tabarca es la excursión marítima de Alicante y el ferry desde Santa Pola es la forma inteligente de ir: más barato, más corto y con más salidas. Lleva las gafas de snorkel: es reserva marina desde 1986 y se nota.",
  guias=["isla-de-tabarca-como-visitar","escapadas-costa-blanca-desde-alicante"],
  kw=["ferry santa pola tabarca","barco a tabarca","tabarca desde santa pola","isla de tabarca ferry"],
  cuerpo="""## La travesía

Media hora de ferry desde el puerto pesquero de **Santa Pola** hasta la **isla de Tabarca**, la única habitada de la Comunidad Valenciana y la primera reserva marina de España (1986). En temporada hay salidas cada hora desde las 10:00; la vuelta, hasta media tarde.

## Qué hacer en Tabarca

- **El pueblo amurallado**: Carlos III lo fortificó en el siglo XVIII para asentar a pescadores genoveses rescatados de Túnez. Tres puertas, iglesia de San Pedro y casas bajas de colores.
- **La playa y las calas**: la playa principal es pequeña y de cantos; las calas del este, hacia el faro, son más tranquilas. El agua es de las más transparentes del Mediterráneo español.
- **Snorkel**: posidonia, sargos, doradas y, con suerte, pulpos. Las gafas, llévalas de casa.
- **El caldero**: el guiso de pescado de la isla. Los restaurantes del puerto lo sirven de 13:30 a 16:00; en verano, reserva.

## Cómo llegar a Santa Pola

Desde Alicante, 25 minutos en coche por la N-332 (aparcamiento junto al puerto) o autobús interurbano desde la estación de autobuses. Desde Elche, 20 minutos."""),
 en=dict(slug="santa-pola-tabarca-ferry", titulo="Santa Pola: return ferry to Tabarca Island",
  desc="Return ferry between Santa Pola and Tabarca Island: a 30-minute crossing, the fastest and cheapest way to reach the only inhabited island in the Valencia region. 4.6/5 with 1,822 reviews.",
  alt="Walled village of Tabarca Island seen from the sea",
  high=["The shortest crossing to Tabarca: 30 minutes versus 1 hour from Alicante","Hourly departures in season","Marine reserve with crystal-clear water for snorkelling","18th-century walled village and the island's fish stew"],
  inc=["Return ferry ticket Santa Pola–Tabarca"],
  noinc=["Transport to Santa Pola","Food","Snorkelling gear"],
  punto=("Port of Santa Pola, Tabarca ferry pier","Santa Pola is 20 km from Alicante (25 min by car, bus from the bus station). Ferries leave from the fishing port; show your voucher at the operator's desk 20 minutes before. Choose your outbound and return times when booking."),
  traer=["Swimsuit, towel and snorkel mask","Sun protection: there is little shade on the island","Cash for the caldero: some restaurants do not take cards"],
  noapto=[],
  tener=["Choose your return carefully: the last one is usually mid-afternoon","In rough seas the operator may cancel and refund you","Tabarca gets crowded at midday in August; take the first departure"],
  acces="Boarding involves steps. Check with the operator.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Better from Santa Pola or from Alicante?","From Santa Pola the crossing takes 30 minutes and costs half as much; from Alicante it is 1 hour and leaves from the city centre. With a car or staying in the south, Santa Pola; in Alicante without a car, the boat from Alicante's port."),
       ("How long do I need on Tabarca?","Between 4 and 6 hours: a walk around the walled village (30 min), a swim and snorkel at the beach or the eastern coves, and the caldero. A day is plenty."),
       ("What is the caldero?","The island's dish: a rockfish stew with rice, in the style of the Genoese fishermen who settled here in the 18th century. Book a table in season.")],
  opinion="Tabarca is Alicante's sea excursion and the Santa Pola ferry is the smart way to go: cheaper, shorter and with more departures. Bring a snorkel mask: it has been a marine reserve since 1986 and it shows.",
  guias=["tabarca-island-how-to-visit","costa-blanca-day-trips-from-alicante"],
  kw=["santa pola tabarca ferry","boat to tabarca","tabarca from santa pola","tabarca island ferry"],
  cuerpo="""## The crossing

Half an hour by ferry from the fishing port of **Santa Pola** to **Tabarca Island**, the only inhabited island in the Valencia region and Spain's first marine reserve (1986). In season there are hourly departures from 10 am; returns run until mid-afternoon.

## What to do on Tabarca

- **The walled village**: Charles III fortified it in the 18th century to settle Genoese fishermen rescued from Tunis. Three gates, the church of San Pedro and low, colourful houses.
- **The beach and the coves**: the main beach is small and pebbly; the eastern coves towards the lighthouse are quieter. The water is among the clearest in the Spanish Mediterranean.
- **Snorkelling**: seagrass meadows, bream, gilthead and, with luck, octopus. Bring your own mask.
- **The caldero**: the island's fish stew. The harbour restaurants serve it from 1:30 to 4 pm; book in summer.

## Getting to Santa Pola

From Alicante, 25 minutes by car on the N-332 (parking next to the port) or an intercity bus from the bus station. From Elche, 20 minutes."""),
))

A.append(dict(
 ciudad="alicante", tid=398727, precio=50, rating=4.6, op=97, dur=("3 horas","3 hours"), min=180, cat="excursionesDia",
 cancel=True, horas=24, tags=["mar"], destacada=False,
 img="/images/actividades/alicante/tabarca/tabarca-islote.webp",
 gal=[("/images/actividades/alicante/tabarca/tabarca-playa.webp","Aguas transparentes de la reserva marina de Tabarca","Clear waters of the Tabarca marine reserve"),
      ("/images/actividades/alicante/tabarca/puerta-trancada.webp","Puerta de la Trancada, Tabarca","Trancada Gate, Tabarca"),
      ("/images/actividades/alicante/tabarca/faro-tabarca.webp","Faro de Tabarca","Tabarca lighthouse")],
 lat=38.1664, lng=-0.4790,
 es=dict(slug="snorkel-tabarca-reserva-marina", titulo="Tabarca: excursión de snorkel guiado en la reserva marina",
  desc="Excursión de snorkel con guía en la reserva marina de Tabarca: equipo incluido, dos puntos de inmersión y explicación del ecosistema de posidonia. 4,6/5 con 97 opiniones.",
  alt="Islote y aguas transparentes de la isla de Tabarca",
  high=["La primera reserva marina de España, con 15 metros de visibilidad","Equipo completo incluido: neopreno, gafas, tubo y aletas","Guía que conoce los mejores puntos y explica la posidonia","Grupos pequeños"],
  inc=["Guía de snorkel","Neopreno, gafas, tubo y aletas","Dos puntos de inmersión en la reserva","Seguro"],
  noinc=["Ferry o barco hasta Tabarca (según opción; consulta al reservar)","Comida"],
  punto=("Isla de Tabarca (punto exacto en el voucher)","Según la opción elegida, el encuentro es en el puerto de Tabarca o incluye la travesía desde Santa Pola. Comprueba el voucher: indica si debes llegar a la isla por tu cuenta."),
  traer=["Bañador puesto y toalla","Protección solar resistente al agua","Agua"],
  noapto=["Menores de 8 años","Personas que no sepan nadar"],
  tener=["La visibilidad es mejor por la mañana y con mar en calma","En la reserva está prohibido pescar y tocar el fondo: el guía lo explica","Combina bien con el ferry desde Santa Pola si reservas la opción sin travesía"],
  acces="No accesible.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Qué se ve?","Praderas de posidonia (la planta que hace el agua tan transparente), sargos, doradas, salpas, morenas en las grietas y, con suerte, pulpos y sepias. La reserva lleva casi 40 años sin pesca y la diferencia con el resto de la costa es evidente."),
       ("¿Hace falta experiencia?","No. Basta con saber nadar; el guía explica el uso del equipo y acompaña al grupo. El neopreno da flotabilidad."),
       ("¿Incluye el barco a la isla?","Depende de la opción que elijas al reservar: hay versión con travesía desde Santa Pola y versión solo snorkel para quien ya está en Tabarca. Léelo en la descripción de GetYourGuide antes de confirmar.")],
  opinion="Si vas a Tabarca, el snorkel es el motivo. Con guía y equipo ves lo que por tu cuenta te pierdes (los puntos buenos no están en la playa principal) y entiendes por qué la posidonia importa. La mejor forma de aprovechar la reserva marina.",
  guias=["isla-de-tabarca-como-visitar","que-ver-en-alicante"],
  kw=["snorkel tabarca","tabarca snorkel excursion","reserva marina tabarca","snorkel alicante"],
  cuerpo="""## La excursión

Tres horas de snorkel guiado en la **reserva marina de Tabarca**, protegida desde 1986. Un guía, equipo completo y dos puntos de inmersión elegidos según el estado del mar: normalmente las calas del este, hacia el faro, y los bajos del islote de la Cantera.

## Qué verás bajo el agua

- **Praderas de posidonia**: la planta marina responsable de la transparencia del agua y del oxígeno del Mediterráneo. El guía explica por qué está protegida.
- **Peces**: sargos, doradas, salpas en bancos, serranos, castañuelas y, en las grietas, morenas. En la reserva no se pesca y los peces no huyen.
- **Fondo rocoso**: cuevas y pasos entre rocas a 3-8 metros de profundidad, perfectos para snorkel sin bajar.

## Para quién es

- Quien sabe nadar y quiere ver la reserva de verdad, no solo la playa principal.
- Familias con niños desde 8 años.

## Cómo encajarlo en el día

Reserva la salida de la mañana (mejor visibilidad), come el caldero en el puerto y pasea por el pueblo amurallado antes de la vuelta en ferry."""),
 en=dict(slug="tabarca-snorkeling-tour", titulo="Tabarca: guided snorkelling tour in the marine reserve",
  desc="Guided snorkelling tour in the Tabarca marine reserve: gear included, two snorkelling spots and an explanation of the seagrass ecosystem. 4.6/5 with 97 reviews.",
  alt="Islet and clear waters of Tabarca Island",
  high=["Spain's first marine reserve, with 15 metres of visibility","Full gear included: wetsuit, mask, snorkel and fins","Guide who knows the best spots and explains the seagrass","Small groups"],
  inc=["Snorkelling guide","Wetsuit, mask, snorkel and fins","Two snorkelling spots in the reserve","Insurance"],
  noinc=["Ferry or boat to Tabarca (depending on the option; check when booking)","Food"],
  punto=("Tabarca Island (exact point on your voucher)","Depending on the option chosen, the meeting point is Tabarca harbour or the tour includes the crossing from Santa Pola. Check your voucher: it says whether you need to reach the island on your own."),
  traer=["Swimsuit on and a towel","Water-resistant sun protection","Water"],
  noapto=["Children under 8","Non-swimmers"],
  tener=["Visibility is best in the morning and in calm seas","Fishing and touching the seabed are banned in the reserve: the guide explains","Pairs well with the Santa Pola ferry if you book the option without the crossing"],
  acces="Not accessible.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("What will I see?","Seagrass meadows (the plant that makes the water so clear), bream, gilthead, salema, moray eels in the crevices and, with luck, octopus and cuttlefish. The reserve has been fishing-free for almost 40 years and the difference from the rest of the coast is obvious."),
       ("Do I need experience?","No. You just need to be able to swim; the guide explains the gear and accompanies the group. The wetsuit gives buoyancy."),
       ("Does it include the boat to the island?","It depends on the option you choose when booking: there is a version with the crossing from Santa Pola and a snorkel-only version for those already on Tabarca. Read the GetYourGuide description before confirming.")],
  opinion="If you go to Tabarca, snorkelling is the reason. With a guide and gear you see what you would miss on your own (the good spots are not at the main beach) and understand why seagrass matters. The best way to make the most of the marine reserve.",
  guias=["tabarca-island-how-to-visit","what-to-see-in-alicante"],
  kw=["tabarca snorkelling","tabarca snorkel tour","tabarca marine reserve","snorkelling alicante"],
  cuerpo="""## The tour

Three hours of guided snorkelling in the **Tabarca marine reserve**, protected since 1986. One guide, full gear and two snorkelling spots chosen according to sea conditions: usually the eastern coves towards the lighthouse and the shallows off La Cantera islet.

## What you'll see underwater

- **Seagrass meadows**: the marine plant responsible for the water's clarity and the Mediterranean's oxygen. The guide explains why it is protected.
- **Fish**: bream, gilthead, schools of salema, comber, damselfish and, in the crevices, moray eels. There is no fishing in the reserve and the fish do not flee.
- **Rocky seabed**: caves and passages between rocks at 3-8 metres, perfect for snorkelling without diving.

## Who it's for

- Swimmers who want to see the reserve properly, not just the main beach.
- Families with children from 8.

## Fitting it into the day

Book the morning departure (best visibility), have the caldero at the harbour and walk the walled village before the ferry back."""),
))

A.append(dict(
 ciudad="gran-canaria", tid=149066, precio=48, rating=4.7, op=1283, dur=("8 horas","8 hours"), min=480, cat="excursionesDia",
 cancel=True, horas=24, tags=["interior"], destacada=True,
 img="/images/actividades/gran-canaria/roque-nublo/roque-nublo-monolito.webp",
 gal=[("/images/actividades/gran-canaria/roque-nublo/pico-nieves.webp","Pico de las Nieves, el techo de Gran Canaria","Pico de las Nieves, the roof of Gran Canaria"),
      ("/images/actividades/gran-canaria/roque-nublo/roque-nublo-tejeda.webp","Tejeda y la caldera desde el Roque Nublo","Tejeda and the caldera from Roque Nublo"),
      ("/images/actividades/gran-canaria/roque-nublo/roque-nublo-mar-nubes.webp","Mar de nubes sobre las cumbres","Sea of clouds over the peaks")],
 lat=28.1235, lng=-15.4363,
 es=dict(slug="roque-nublo-pico-nieves-desde-las-palmas", titulo="Desde Las Palmas: Roque Nublo, Pico de las Nieves y Tejeda",
  desc="Excursión de día completo por las cumbres de Gran Canaria: subida al Roque Nublo, Pico de las Nieves (1.949 m), Tejeda y pueblos del interior, con guía y transporte desde Las Palmas. 4,7/5 con 1.283 opiniones.",
  alt="El Roque Nublo, monolito de 80 metros en las cumbres de Gran Canaria",
  high=["Caminata de 1,5 km hasta la base del Roque Nublo","Pico de las Nieves, el punto más alto de la isla, con el Teide al fondo","Tejeda, uno de los pueblos más bonitos de España, y su almendro","Guía que explica geología, cultura aborigen y productos locales"],
  inc=["Transporte en minibús desde Las Palmas","Guía oficial","Paradas en Roque Nublo, Pico de las Nieves y Tejeda"],
  noinc=["Comida (parada para comer en Tejeda)","Recogida en el sur (hay versión con recogida en Maspalomas)"],
  punto=("Las Palmas de Gran Canaria (punto exacto en el voucher)","Recogida en puntos del centro de Las Palmas a primera hora. El punto y la hora exactos se indican en el voucher; confírmalos el día anterior."),
  traer=["Calzado de senderismo o deportivo","Ropa de abrigo: en las cumbres hace 10 °C menos que en la costa","Agua, protección solar y algo de picar"],
  noapto=["Personas con movilidad reducida: la subida al Roque Nublo es un sendero de piedra con desnivel"],
  tener=["Las cumbres pueden estar en niebla; el mar de nubes es parte del espectáculo","Tejeda tiene las mejores vistas al almendro en flor en febrero","Lleva efectivo para el bienmesabe y los dulces de almendra de Tejeda"],
  acces="No accesible por el sendero del Roque Nublo. Consulta al operador por alternativas.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Es dura la subida al Roque Nublo?","No. Es un sendero de 1,5 km (unos 30-40 minutos) con 200 metros de desnivel, por piedra, hasta la meseta donde está el monolito. Lo hacen familias con niños; solo necesitas calzado cerrado."),
       ("¿Se ve el Teide?","Con el día despejado, sí: desde el Pico de las Nieves y desde el Roque Nublo el Teide aparece sobre el mar de nubes a 100 km. Es más frecuente por la mañana."),
       ("¿Hay versión desde el sur?","Sí, hay salidas con recogida en Maspalomas y Playa del Inglés. Esta es la que sale de Las Palmas; elige según dónde te alojes.")],
  opinion="La excursión al interior que hay que hacer en Gran Canaria: el Roque Nublo es el símbolo de la isla y las cumbres no tienen nada que ver con la costa. Sin coche, esta es la forma de verlo en un día con alguien que explica lo que ves.",
  guias=["roque-nublo-como-subir","que-ver-en-gran-canaria"],
  kw=["excursion roque nublo desde las palmas","roque nublo tour","pico de las nieves excursion","tejeda gran canaria tour"],
  cuerpo="""## El recorrido

Un día entero por el **interior de Gran Canaria**, la parte de la isla que la mayoría de visitantes no ve. Salida de Las Palmas a primera hora en minibús, subida por la carretera del centro y regreso por la tarde.

### Roque Nublo
Un monolito volcánico de **80 metros**, a 1.813 m de altitud, que los aborígenes canarios consideraban sagrado. Se sube por un sendero de 1,5 km hasta la meseta de la base: 30-40 minutos, con vistas a la caldera de Tejeda y, si está despejado, al Teide.

### Pico de las Nieves
El **techo de la isla (1.949 m)**. Desde el mirador se ve media Gran Canaria, el mar de nubes del norte y, en días claros, Tenerife entera con el Teide.

### Tejeda
Uno de **los pueblos más bonitos de España**: casas blancas colgadas sobre la caldera, almendros y dulces de almendra (bienmesabe, mazapán). Parada para comer.

### Pueblos del interior
Según la ruta, paradas en Santa Brígida, San Mateo o la Cruz de Tejeda, con el guía explicando el origen volcánico de la isla y la cultura aborigen.

## Para quién es

- Quien no tiene coche o no quiere conducir por carreteras de montaña con curvas.
- Quien quiere entender la isla más allá de la playa."""),
 en=dict(slug="roque-nublo-pico-de-las-nieves-tour-from-las-palmas", titulo="From Las Palmas: Roque Nublo, Pico de las Nieves and Tejeda",
  desc="Full-day tour of Gran Canaria's peaks: hike to Roque Nublo, Pico de las Nieves (1,949 m), Tejeda and inland villages, with guide and transport from Las Palmas. 4.7/5 with 1,283 reviews.",
  alt="Roque Nublo, an 80-metre monolith on Gran Canaria's peaks",
  high=["1.5 km hike to the base of Roque Nublo","Pico de las Nieves, the island's highest point, with Mount Teide in the distance","Tejeda, one of Spain's prettiest villages, and its almond trees","Guide covering geology, aboriginal culture and local produce"],
  inc=["Minibus transport from Las Palmas","Official guide","Stops at Roque Nublo, Pico de las Nieves and Tejeda"],
  noinc=["Lunch (lunch stop in Tejeda)","Pickup in the south (a version with Maspalomas pickup exists)"],
  punto=("Las Palmas de Gran Canaria (exact point on your voucher)","Pickup at points in central Las Palmas first thing in the morning. The exact point and time are on your voucher; confirm them the day before."),
  traer=["Hiking or sports shoes","Warm layers: the peaks are 10 °C cooler than the coast","Water, sun protection and a snack"],
  noapto=["People with reduced mobility: the Roque Nublo climb is a stone path with elevation gain"],
  tener=["The peaks can be in fog; the sea of clouds is part of the show","Tejeda has the best views of almond blossom in February","Bring cash for the bienmesabe and almond sweets in Tejeda"],
  acces="Not accessible on the Roque Nublo path. Ask the operator about alternatives.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Is the Roque Nublo climb hard?","No. It is a 1.5 km stone path (30-40 minutes) with 200 metres of elevation gain up to the plateau where the monolith stands. Families with children do it; you just need closed shoes."),
       ("Can you see Mount Teide?","On a clear day, yes: from Pico de las Nieves and from Roque Nublo, Teide rises above the sea of clouds 100 km away. It is more common in the morning."),
       ("Is there a version from the south?","Yes, there are departures with pickup in Maspalomas and Playa del Inglés. This is the one from Las Palmas; choose according to where you are staying.")],
  opinion="The inland trip you have to do on Gran Canaria: Roque Nublo is the island's symbol and the peaks have nothing to do with the coast. Without a car, this is the way to see it in a day with someone who explains what you are looking at.",
  guias=["roque-nublo-how-to-climb","what-to-see-in-gran-canaria"],
  kw=["roque nublo tour from las palmas","roque nublo excursion","pico de las nieves tour","tejeda gran canaria tour"],
  cuerpo="""## The route

A full day in **inland Gran Canaria**, the part of the island most visitors never see. Departure from Las Palmas first thing by minibus, up the central road and back in the afternoon.

### Roque Nublo
An **80-metre** volcanic monolith at 1,813 m that the aboriginal Canarians held sacred. A 1.5 km path leads to the plateau at its base: 30-40 minutes, with views over the Tejeda caldera and, on a clear day, Mount Teide.

### Pico de las Nieves
The **roof of the island (1,949 m)**. From the viewpoint you see half of Gran Canaria, the sea of clouds to the north and, on clear days, all of Tenerife with Teide.

### Tejeda
One of **Spain's prettiest villages**: white houses perched over the caldera, almond trees and almond sweets (bienmesabe, marzipan). Lunch stop.

### Inland villages
Depending on the route, stops in Santa Brígida, San Mateo or the Cruz de Tejeda, with the guide explaining the island's volcanic origin and aboriginal culture.

## Who it's for

- Anyone without a car, or who does not want to drive winding mountain roads.
- Anyone who wants to understand the island beyond the beach."""),
))

A.append(dict(
 ciudad="santiago-de-compostela", tid=460483, precio=40, rating=4.8, op=206, dur=("2,5 horas","2.5 hours"), min=150, cat="visitasGuiadas",
 cancel=True, horas=24, tags=["catedral"], destacada=True,
 img="/images/actividades/santiago-de-compostela/catedral/portico-gloria.webp",
 gal=[("/images/actividades/santiago-de-compostela/catedral/obradoiro.webp","Fachada del Obradoiro","Obradoiro facade"),
      ("/images/actividades/santiago-de-compostela/catedral/nave-interior.webp","Nave de la catedral","Cathedral nave"),
      ("/images/actividades/santiago-de-compostela/catedral/botafumeiro.webp","El Botafumeiro","The Botafumeiro")],
 lat=42.8806, lng=-8.5446,
 es=dict(slug="santiago-portico-gloria-catedral-tour", titulo="Santiago: Pórtico de la Gloria, catedral y casco histórico con guía",
  desc="Visita guiada al Pórtico de la Gloria (acceso con entrada incluida), la catedral de Santiago y el casco histórico, en grupo reducido. 4,8/5 con 206 opiniones.",
  alt="Pórtico de la Gloria del Maestro Mateo en la catedral de Santiago",
  high=["Entrada al Pórtico de la Gloria, que solo se visita con cupo","La obra maestra del románico, restaurada con su color original","Catedral, tumba del Apóstol y plazas del casco histórico","Grupo reducido con guía oficial"],
  inc=["Entrada al Pórtico de la Gloria","Guía oficial","Visita de la catedral y del casco histórico"],
  noinc=["Subida a las cubiertas","Museo de la catedral"],
  punto=("Plaza del Obradoiro, Santiago de Compostela (punto exacto en el voucher)","Encuentro en la Plaza del Obradoiro, frente a la fachada de la catedral. El guía lleva identificación. Llega 10 minutos antes: el acceso al Pórtico tiene hora fija."),
  traer=["Ropa cómoda y paraguas: es Santiago"],
  noapto=[],
  tener=["Dentro del Pórtico no se pueden hacer fotos","El Botafumeiro no vuela todos los días; el guía te dice cuándo","La visita incluye la tumba del Apóstol y el abrazo a la imagen si no hay cola excesiva"],
  acces="La catedral es accesible; el acceso al Pórtico tiene escalones.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Por qué el Pórtico de la Gloria necesita entrada?","Desde su restauración (2018) se visita con cupo limitado, en grupos pequeños y sin fotos, para conservar la policromía recuperada. Las entradas sueltas se agotan; con esta visita la tienes incluida."),
       ("¿Qué tiene de especial?","Es la obra cumbre del románico europeo: 200 figuras talladas por el Maestro Mateo en 1188, con los 24 ancianos del Apocalipsis tocando instrumentos. La restauración devolvió el color original que estuvo oculto siglos."),
       ("¿Cuánto dura y qué más se ve?","Dos horas y media: Pórtico (30 min), interior de la catedral con la tumba del Apóstol, y las plazas del casco histórico (Obradoiro, Platerías, Quintana) con la historia del Camino.")],
  opinion="La mejor forma de entrar al Pórtico de la Gloria, que por libre es difícil de conseguir. El guía convierte una fachada de piedra en una historia que se sigue, y el resto de la visita ordena el casco histórico. Valoración de 4,8 por algo.",
  guias=["catedral-de-santiago-como-visitar","santiago-en-un-dia","camino-de-santiago-ultimos-100-km"],
  kw=["portico de la gloria entrada","visita guiada catedral santiago","portico de la gloria visita","catedral de santiago tour"],
  cuerpo="""## La visita

Dos horas y media con guía oficial en grupo reducido por lo esencial de Santiago: el **Pórtico de la Gloria** (con entrada incluida), el interior de la **catedral** y las plazas del **casco histórico**.

### El Pórtico de la Gloria (30 minutos)
La obra maestra del **Maestro Mateo** (1188): tres arcos y más de 200 figuras que representan el Apocalipsis, con los 24 ancianos afinando sus instrumentos. Desde la restauración de 2018 luce el color original, oculto durante siglos. Se visita con cupo, sin fotos y con guía que explica cada figura.

### La catedral
Nave románica, el altar mayor barroco con la imagen del Apóstol (se puede subir a abrazarla), la **cripta con la tumba de Santiago** y, si coincide, el **Botafumeiro** en vuelo.

### El casco histórico
Plaza del Obradoiro con el Hostal de los Reyes Católicos, Platerías, la Quintana con la Puerta Santa y las rúas de piedra con soportales. El guía cuenta el Camino desde el siglo IX hasta hoy.

## Para quién es

- Quien llega a Santiago (a pie o no) y quiere entender lo que ve.
- Quien no ha conseguido entrada suelta al Pórtico."""),
 en=dict(slug="santiago-portico-of-glory-cathedral-city-tour", titulo="Santiago: Portico of Glory, cathedral and old town guided tour",
  desc="Guided visit to the Portico of Glory (entry included), Santiago Cathedral and the old town, in a small group. 4.8/5 with 206 reviews.",
  alt="Portico of Glory by Master Mateo in Santiago Cathedral",
  high=["Entry to the Portico of Glory, which can only be visited with limited allocation","The masterpiece of Romanesque art, restored to its original colours","Cathedral, tomb of the Apostle and the old town squares","Small group with official guide"],
  inc=["Entry to the Portico of Glory","Official guide","Visit of the cathedral and old town"],
  noinc=["Rooftop climb","Cathedral museum"],
  punto=("Plaza del Obradoiro, Santiago de Compostela (exact point on your voucher)","Meet in Plaza del Obradoiro, in front of the cathedral facade. The guide carries ID. Arrive 10 minutes early: the Portico has a fixed entry time."),
  traer=["Comfortable clothes and an umbrella: this is Santiago"],
  noapto=[],
  tener=["No photography inside the Portico","The Botafumeiro does not swing every day; the guide will tell you when","The visit includes the Apostle's tomb and the embrace of the statue if the queue is not excessive"],
  acces="The cathedral is accessible; the Portico access has steps.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Why does the Portico of Glory need a ticket?","Since its restoration (2018) it is visited with a limited allocation, in small groups and without photos, to preserve the recovered polychromy. Single tickets sell out; with this tour it is included."),
       ("What makes it special?","It is the summit of European Romanesque: 200 figures carved by Master Mateo in 1188, with the 24 elders of the Apocalypse playing instruments. The restoration brought back the original colour hidden for centuries."),
       ("How long is it and what else do you see?","Two and a half hours: the Portico (30 min), the cathedral interior with the Apostle's tomb, and the old town squares (Obradoiro, Platerías, Quintana) with the history of the Camino.")],
  opinion="The best way into the Portico of Glory, which is hard to get on your own. The guide turns a stone facade into a story you can follow, and the rest of the visit makes sense of the old town. Rated 4.8 for a reason.",
  guias=["santiago-cathedral-how-to-visit","santiago-in-one-day","camino-de-santiago-last-100-km"],
  kw=["portico of glory ticket","santiago cathedral guided tour","portico de la gloria visit","santiago de compostela cathedral tour"],
  cuerpo="""## The tour

Two and a half hours with an official guide in a small group through the essentials of Santiago: the **Portico of Glory** (entry included), the interior of the **cathedral** and the squares of the **old town**.

### The Portico of Glory (30 minutes)
**Master Mateo's** masterpiece (1188): three arches and over 200 figures depicting the Apocalypse, with the 24 elders tuning their instruments. Since the 2018 restoration it shows its original colour, hidden for centuries. Visited with a limited allocation, no photos, and a guide explaining each figure.

### The cathedral
Romanesque nave, the Baroque high altar with the statue of the Apostle (you can climb up to embrace it), the **crypt with St James's tomb** and, if it coincides, the **Botafumeiro** in flight.

### The old town
Plaza del Obradoiro with the Hostal de los Reyes Católicos, Platerías, the Quintana with the Holy Door and the arcaded stone streets. The guide tells the story of the Camino from the 9th century to today.

## Who it's for

- Anyone arriving in Santiago (on foot or otherwise) who wants to understand what they see.
- Anyone who could not get a single ticket to the Portico."""),
))

A.append(dict(
 ciudad="tenerife", tid=51524, precio=21, rating=4.6, op=918, dur=("1,5 horas","1.5 hours"), min=90, cat="visitasGuiadas",
 cancel=True, horas=24, tags=["teide"], destacada=False,
 img="/images/actividades/tenerife/teide/teide-canadas.webp",
 gal=[("/images/actividades/tenerife/teide/canadas-panoramica.webp","Las Cañadas del Teide","Las Cañadas del Teide"),
      ("/images/actividades/tenerife/estrellas/atardecer-teide-nubes.webp","Atardecer sobre el mar de nubes","Sunset over the sea of clouds"),
      ("/images/actividades/tenerife/teide/teide-mar-nubes.webp","El Teide sobre el mar de nubes","Teide above the sea of clouds")],
 lat=28.3005, lng=-16.5119,
 es=dict(slug="observatorio-teide-visita-guiada", titulo="Tenerife: visita guiada al Observatorio del Teide",
  desc="Visita guiada diurna al Observatorio del Teide, a 2.390 metros: telescopios solares, observación del Sol con filtros y explicación de por qué Tenerife es uno de los mejores cielos del mundo. 4,6/5 con 918 opiniones.",
  alt="Paisaje volcánico de Las Cañadas del Teide, donde está el Observatorio",
  high=["Uno de los mayores observatorios solares del mundo","Observación del Sol en directo con telescopio y filtros","Entrada a una cúpula y visita a los telescopios nocturnos por fuera","Guía astrónomo del Instituto de Astrofísica de Canarias"],
  inc=["Visita guiada de 90 minutos al Observatorio del Teide","Observación solar con telescopio","Entrada a una de las cúpulas"],
  noinc=["Transporte (hay versión con traslado desde el sur y el norte)","Observación nocturna (el observatorio no abre de noche al público)"],
  punto=("Observatorio del Teide, Izaña (carretera TF-24), Tenerife","El observatorio está en Izaña, a 2.390 m, por la TF-24 desde La Laguna o la TF-21 desde el Portillo. Aparcamiento en la entrada; presenta el voucher al guía a la hora reservada. Si reservas la opción con traslado, el punto de recogida va en el voucher."),
  traer=["Ropa de abrigo: a 2.400 m hace 15 °C menos que en la costa, incluso en verano","Protección solar: la radiación es muy alta","Agua"],
  noapto=["Menores de 7 años","Personas con problemas cardiacos o respiratorios graves (altitud)"],
  tener=["Es una visita DIURNA: se observa el Sol, no las estrellas","El observatorio está a 40 km del teleférico del Teide; combínalos el mismo día","Con viento fuerte o nieve la visita se cancela y se reembolsa"],
  acces="Parcialmente accesible; consulta al operador.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Se ven estrellas?","No. El Observatorio del Teide abre al público solo de día; la visita se centra en los telescopios solares y en observar el Sol con filtros (manchas y protuberancias). Para estrellas, mira la excursión de atardecer y estrellas con telescopio."),
       ("¿Qué telescopios hay?","Telescopios solares como GREGOR (el mayor de Europa) y THEMIS, y telescopios nocturnos y de microondas. Se entra en una cúpula y el resto se ve desde fuera con la explicación del guía."),
       ("¿Cómo llego?","En coche propio por la TF-24 (la carretera de la cumbre desde La Laguna, muy bonita) o reservando la opción con traslado desde el sur o el norte de la isla.")],
  opinion="Una visita distinta en el Teide: ciencia de primera línea explicada por quien trabaja allí, y el Sol visto como no lo has visto nunca. Barata y de hora y media; encaja con el teleférico o con el atardecer en Las Cañadas.",
  guias=["subir-al-teide","que-ver-en-tenerife"],
  kw=["observatorio del teide visita","observatorio teide entradas","visita observatorio izaña","telescopios teide"],
  cuerpo="""## La visita

Hora y media en el **Observatorio del Teide**, en Izaña, a 2.390 metros de altitud, con un guía del Instituto de Astrofísica de Canarias. Es uno de los mayores observatorios solares del mundo y el cielo de Tenerife está protegido por ley desde 1988.

### Qué se hace
- **Observación del Sol** con telescopio y filtros: manchas solares y, si hay actividad, protuberancias en el limbo.
- **Entrada a una cúpula** y explicación de cómo funciona un telescopio profesional.
- **Recorrido exterior** por los telescopios solares GREGOR y THEMIS, los nocturnos y las antenas de microondas que estudian el fondo cósmico.
- **Por qué aquí**: el guía explica la inversión térmica, el mar de nubes y la estabilidad atmosférica que convierten a Canarias en uno de los tres mejores lugares del mundo para observar.

## Cómo encajarlo en el día

El observatorio está en la **carretera de la cumbre (TF-24)** entre La Laguna y Las Cañadas. Lo cómodo: visita por la mañana, bajar a Las Cañadas, teleférico del Teide a mediodía y atardecer en los Roques de García.

## Para quién es

- Curiosos de la ciencia y familias con niños desde 7 años.
- Quien ya ha subido al Teide y quiere otra cara del parque."""),
 en=dict(slug="teide-observatory-guided-visit", titulo="Tenerife: Teide Observatory guided visit",
  desc="Daytime guided visit to the Teide Observatory at 2,390 metres: solar telescopes, Sun observation through filters and why Tenerife has one of the world's best skies. 4.6/5 with 918 reviews.",
  alt="Volcanic landscape of Las Cañadas del Teide, home of the Observatory",
  high=["One of the world's largest solar observatories","Live Sun observation through a telescope with filters","Entry to a dome and outside view of the night telescopes","Astronomer guide from the Canary Islands Institute of Astrophysics"],
  inc=["90-minute guided visit to the Teide Observatory","Solar observation through a telescope","Entry to one of the domes"],
  noinc=["Transport (a version with transfer from the south and north exists)","Night observation (the observatory is not open to the public at night)"],
  punto=("Teide Observatory, Izaña (TF-24 road), Tenerife","The observatory is at Izaña, 2,390 m, on the TF-24 from La Laguna or the TF-21 from El Portillo. Parking at the entrance; show your voucher to the guide at the reserved time. If you book the transfer option, the pickup point is on your voucher."),
  traer=["Warm clothes: at 2,400 m it is 15 °C colder than the coast, even in summer","Sun protection: radiation is very high","Water"],
  noapto=["Children under 7","People with serious heart or respiratory conditions (altitude)"],
  tener=["This is a DAYTIME visit: you observe the Sun, not the stars","The observatory is 40 km from the Teide cable car; combine them on the same day","In strong wind or snow the visit is cancelled and refunded"],
  acces="Partially accessible; check with the operator.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("Will I see stars?","No. The Teide Observatory opens to the public only by day; the visit focuses on the solar telescopes and observing the Sun through filters (sunspots and prominences). For stars, see the sunset and stargazing tour with telescope."),
       ("Which telescopes are there?","Solar telescopes such as GREGOR (the largest in Europe) and THEMIS, plus night and microwave telescopes. You enter one dome and see the rest from outside with the guide's explanation."),
       ("How do I get there?","By your own car on the TF-24 (the beautiful ridge road from La Laguna) or by booking the option with transfer from the south or north of the island.")],
  opinion="A different kind of visit on Teide: frontline science explained by people who work there, and the Sun as you have never seen it. Cheap and an hour and a half; fits with the cable car or sunset at Las Cañadas.",
  guias=["climbing-mount-teide","what-to-see-in-tenerife"],
  kw=["teide observatory visit","teide observatory tickets","izana observatory tour","teide telescopes"],
  cuerpo="""## The visit

An hour and a half at the **Teide Observatory** in Izaña, at 2,390 metres, with a guide from the Canary Islands Institute of Astrophysics. It is one of the world's largest solar observatories, and Tenerife's sky has been protected by law since 1988.

### What you do
- **Observe the Sun** through a telescope with filters: sunspots and, if there is activity, prominences on the limb.
- **Enter a dome** and learn how a professional telescope works.
- **Outdoor walk** past the GREGOR and THEMIS solar telescopes, the night telescopes and the microwave antennas studying the cosmic background.
- **Why here**: the guide explains the thermal inversion, the sea of clouds and the atmospheric stability that make the Canaries one of the three best observing sites in the world.

## Fitting it into the day

The observatory is on the **ridge road (TF-24)** between La Laguna and Las Cañadas. The easy plan: visit in the morning, drive down to Las Cañadas, Teide cable car at midday and sunset at the Roques de García.

## Who it's for

- Science enthusiasts and families with children from 7.
- Anyone who has already been up Teide and wants another side of the park."""),
))

A.append(dict(
 ciudad="barcelona", tid=83292, precio=12, rating=4.5, op=2161, dur=("2-3 horas","2-3 hours"), min=150, cat="entradas",
 cancel=True, horas=24, tags=["otros-barcelona"], destacada=False,
 img="/images/actividades/barcelona/montjuic/descarga-11-hero.webp",
 gal=[("/images/actividades/barcelona/montjuic/pexels-7796698-hero.webp","Vistas de Barcelona desde la terraza del MNAC","Views of Barcelona from the MNAC terrace"),
      ("/images/actividades/barcelona/montjuic/pexels-16841065-hero.webp","Plaza de España y las torres venecianas desde Montjuïc","Plaça d'Espanya and the Venetian towers from Montjuïc")],
 lat=41.3684, lng=2.1534,
 es=dict(slug="mnac-museu-nacional-art-catalunya-entrada", titulo="Barcelona: entrada al MNAC (Museu Nacional d'Art de Catalunya)",
  desc="Entrada al MNAC en el Palau Nacional de Montjuïc: la mejor colección de pintura mural románica del mundo, gótico, modernismo y la terraza con las mejores vistas de Barcelona. 4,5/5 con 2.161 opiniones.",
  alt="Palau Nacional de Montjuïc, sede del MNAC",
  high=["Los frescos románicos del Pirineo, únicos en el mundo","Modernismo: Gaudí, Casas, Rusiñol y los muebles de la Casa Batlló","La terraza del Palau Nacional, el mejor mirador gratuito de la ciudad","Mucho menos masificado que los museos del centro"],
  inc=["Entrada a la colección permanente del MNAC","Acceso a la terraza-mirador"],
  noinc=["Exposiciones temporales","Audioguía"],
  punto=("MNAC, Palau Nacional, Parc de Montjuïc, Barcelona","Metro Espanya (L1/L3) y 10 minutos subiendo por las escaleras mecánicas de la avenida de la Reina Maria Cristina. Presenta el voucher en taquilla."),
  traer=["Nada especial; hay consigna gratuita"],
  noapto=[],
  tener=["Cierra los lunes","Los sábados por la tarde (a partir de las 15:00) y el primer domingo de mes es gratis, con mucha más gente","Combínalo con la Fuente Mágica (espectáculo nocturno, gratis) y el teleférico de Montjuïc"],
  acces="Totalmente accesible.",
  politica="Cancelación gratuita hasta 24 horas antes con reembolso completo.",
  faq=[("¿Qué tiene de especial el MNAC?","El románico. En los años 20 se arrancaron los frescos de las iglesias del Pirineo para salvarlos del expolio y se montaron aquí en ábsides reconstruidos. El Pantocrátor de Sant Climent de Taüll es la imagen más famosa del arte medieval español."),
       ("¿Merece la pena frente a los museos de Gaudí?","Es otra cosa: aquí está el contexto. El modernismo del MNAC (muebles de Gaudí, Casas, Rusiñol) explica de dónde salen la Pedrera y la Batlló, y por 12 € ves mil años de arte catalán sin colas."),
       ("¿Cuánto tiempo?","Dos horas para románico, gótico y modernismo. Media hora más en la terraza: la vista desde la Plaza de España hasta el Tibidabo es la mejor panorámica gratuita de Barcelona.")],
  opinion="El museo más infravalorado de Barcelona. Los frescos románicos no existen en ningún otro sitio del mundo y la terraza del Palau Nacional vale la entrada por sí sola. Doce euros, sin colas y a diez minutos del metro.",
  guias=["barcelona-en-3-dias"],
  kw=["mnac entrada","museu nacional art catalunya entradas","mnac barcelona","museo nacional arte cataluña"],
  cuerpo="""## Qué verás

El **MNAC** ocupa el Palau Nacional, construido para la Exposición de 1929 en la ladera de Montjuïc. Dentro, mil años de arte catalán en cuatro grandes bloques.

### Románico
La colección que lo hace único: **frescos del siglo XII** arrancados de las iglesias del Pirineo en los años 20 y montados en ábsides reconstruidos. El **Pantocrátor de Sant Climent de Taüll** es la imagen más reproducida del arte medieval español.

### Gótico
Retablos de Bernat Martorell y Jaume Huguet, y la pintura catalana del siglo XV.

### Modernismo y Noucentisme
Muebles de **Gaudí** para la Casa Batlló y la Pedrera, pintura de Ramon Casas y Santiago Rusiñol, el famoso *Ramon Casas y Pere Romeu en un tándem*. Aquí se entiende el Eixample.

### Siglo XX y fotografía
Picasso, Dalí, Miró y la colección de fotografía catalana.

## La terraza

Sube a la **terraza del Palau Nacional** (incluida): Plaza de España, las torres venecianas, el Tibidabo y la Sagrada Família de un vistazo. A la hora de cerrar, baja a la **Fuente Mágica** si hay espectáculo."""),
 en=dict(slug="mnac-national-art-museum-catalonia-ticket", titulo="Barcelona: MNAC (National Art Museum of Catalonia) entry ticket",
  desc="Entry ticket to the MNAC in the Palau Nacional on Montjuïc: the world's finest collection of Romanesque mural painting, Gothic, Modernisme and the terrace with Barcelona's best views. 4.5/5 with 2,161 reviews.",
  alt="Palau Nacional on Montjuïc, home of the MNAC",
  high=["Romanesque frescoes from the Pyrenees, unique in the world","Modernisme: Gaudí, Casas, Rusiñol and the Casa Batlló furniture","The Palau Nacional terrace, the city's best free viewpoint","Far less crowded than the city-centre museums"],
  inc=["Entry to the MNAC permanent collection","Access to the terrace viewpoint"],
  noinc=["Temporary exhibitions","Audio guide"],
  punto=("MNAC, Palau Nacional, Parc de Montjuïc, Barcelona","Metro Espanya (L1/L3) then 10 minutes up the escalators on Avinguda de la Reina Maria Cristina. Show your voucher at the desk."),
  traer=["Nothing special; there is a free cloakroom"],
  noapto=[],
  tener=["Closed on Mondays","Saturday afternoons (from 3 pm) and the first Sunday of the month are free, with far more people","Combine it with the Magic Fountain (free night show) and the Montjuïc cable car"],
  acces="Fully accessible.",
  politica="Free cancellation up to 24 hours before with full refund.",
  faq=[("What is special about the MNAC?","The Romanesque. In the 1920s the frescoes were removed from Pyrenean churches to save them from looters and mounted here in reconstructed apses. The Pantocrator of Sant Climent de Taüll is the most famous image in Spanish medieval art."),
       ("Is it worth it compared with the Gaudí museums?","It is something else: this is the context. The MNAC's Modernisme section (Gaudí furniture, Casas, Rusiñol) explains where La Pedrera and Casa Batlló come from, and for €12 you see a thousand years of Catalan art without queues."),
       ("How long?","Two hours for Romanesque, Gothic and Modernisme. Half an hour more on the terrace: the view from Plaça d'Espanya to Tibidabo is the best free panorama in Barcelona.")],
  opinion="Barcelona's most underrated museum. The Romanesque frescoes exist nowhere else in the world and the Palau Nacional terrace is worth the ticket on its own. Twelve euros, no queues, ten minutes from the metro.",
  guias=["barcelona-in-3-days"],
  kw=["mnac ticket","national art museum catalonia tickets","mnac barcelona","museu nacional d'art de catalunya"],
  cuerpo="""## What you'll see

The **MNAC** occupies the Palau Nacional, built for the 1929 Exhibition on the slopes of Montjuïc. Inside, a thousand years of Catalan art in four main sections.

### Romanesque
The collection that makes it unique: **12th-century frescoes** removed from Pyrenean churches in the 1920s and mounted in reconstructed apses. The **Pantocrator of Sant Climent de Taüll** is the most reproduced image in Spanish medieval art.

### Gothic
Altarpieces by Bernat Martorell and Jaume Huguet, and 15th-century Catalan painting.

### Modernisme and Noucentisme
**Gaudí** furniture for Casa Batlló and La Pedrera, painting by Ramon Casas and Santiago Rusiñol, the famous *Ramon Casas and Pere Romeu on a Tandem*. This is where the Eixample makes sense.

### 20th century and photography
Picasso, Dalí, Miró and the Catalan photography collection.

## The terrace

Go up to the **Palau Nacional terrace** (included): Plaça d'Espanya, the Venetian towers, Tibidabo and the Sagrada Família at a glance. At closing time, walk down to the **Magic Fountain** if there is a show."""),
))

# ----------------------------------------------------------------------------

def ficha(a, lang):
    L = a[lang]; other = a["en" if lang == "es" else "es"]
    fm = {
        "titulo": L["titulo"], "slug": L["slug"], "ciudad": a["ciudad"], "descripcion": L["desc"],
        "slugs": {"es": a["es"]["slug"], "en": a["en"]["slug"]},
        "duracion": a["dur"][0 if lang == "es" else 1], "duracionMinutos": a["min"],
        "precioDesde": a["precio"], "moneda": "EUR", "idiomas": ["es", "en"],
        "proveedor": "getyourguide", "urlReserva": url(a["tid"], lang),
        "cancelacionGratuita": a["cancel"],
    }
    if a["horas"]: fm["horasCancelacion"] = a["horas"]
    fm.update({
        "highlights": L["high"], "incluye": L["inc"], "noIncluye": L["noinc"],
        "puntoEncuentro": {"texto": L["punto"][0], "descripcionGuia": L["punto"][1], "latitud": a["lat"], "longitud": a["lng"], "zoom": 15},
        "detallesPracticos": {"ticketMovil": True, "confirmacionInmediata": True, "accesibleSilla": False, "edadMinima": 0, "mascotasPermitidas": False},
        "informacionImportante": {"queTraer": L["traer"], "noAptoPara": L["noapto"], "aTenerEnCuenta": L["tener"]},
        "accesibilidad": L["acces"], "politicaCancelacion": L["politica"],
        "preguntasFrecuentes": [{"pregunta": p, "respuesta": r} for p, r in L["faq"]],
        "opinionEditorial": L["opinion"], "guiasRelacionadas": L["guias"], "categoria": a["cat"], "keywords": L["kw"],
        "imagen": a["img"], "imagenAlt": L["alt"],
        "galeria": [{"src": s, "alt": (aes if lang == "es" else aen)} for s, aes, aen in a["gal"]],
        "ratingProveedor": a["rating"], "numeroOpiniones": a["op"], "atraccionesRelacionadas": a["tags"],
        "publicada": True, "destacada": a["destacada"], "fecha": HOY, "fecha_actualizacion": HOY,
    })
    y = yaml.safe_dump(fm, allow_unicode=True, sort_keys=False, width=10000, default_flow_style=False)
    return "---\n" + y + "---\n\n" + L["cuerpo"].strip() + "\n"

n = 0
for a in A:
    for lang in ("es", "en"):
        d = os.path.join(ROOT, "content", "actividades", lang, a["ciudad"]); os.makedirs(d, exist_ok=True)
        p = os.path.join(d, a[lang]["slug"] + ".md")
        with open(p, "w", encoding="utf-8") as f: f.write(ficha(a, lang)); n += 1
        print("ok", p)
print("fichas:", n)
