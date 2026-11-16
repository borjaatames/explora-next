import sys
S = {
'de': ('## Was tun in Valencia an Weihnachten', """## Was hat in Valencia am 24., 25. und 31. Dezember und am 1. Januar geöffnet?

| Ort | 24. und 31. Dezember | 25. Dezember | 1. Januar |
| --- | --- | --- | --- |
| Oceanogràfic | 10:00–16:00 | 12:00–18:00 | Geöffnet |
| Museu de les Ciències | Geöffnet | Geschlossen | Geöffnet |
| Lonja de la Seda | Eventuell Sonderöffnungszeiten | Geschlossen | Geschlossen |
| Expojove | Nur am 31.: 10:00–14:00 | Noch nicht begonnen | 16:00–21:00 |

- **Das Oceanogràfic hat an allen Tagen des Jahres geöffnet**, auch am 25.: der sicherste Plan für einen Feiertag mit Kindern. Kaufen Sie das Ticket online, denn an diesen Tagen ist es voll.
- **Die Lonja de la Seda** schließt auch am 6. Januar; an den übrigen Feiertagen öffnet sie von 10:00 bis 14:00.
- **Geschäfte und Restaurants:** Am 24. und 31. schließen sie am Nachmittag, am 25. und am 1. haben nur wenige geöffnet. Reservieren Sie das Abendessen rechtzeitig.

*Öffnungszeiten am 10. November 2026 auf den offiziellen Websites geprüft. Die der Ciutat de les Arts i les Ciències können sich ändern: Bestätigen Sie sie vor dem Besuch auf cac.es.*

"""),
'fr': ('## Que faire à Valence à Noël', """## Ce qui ouvre et ce qui ferme à Valence les 24, 25 et 31 décembre et le 1er janvier

| Lieu | 24 et 31 décembre | 25 décembre | 1er janvier |
| --- | --- | --- | --- |
| Oceanogràfic | 10 h–16 h | 12 h–18 h | Ouvert |
| Museu de les Ciències | Ouvert | Fermé | Ouvert |
| Lonja de la Seda | Horaires spéciaux possibles | Fermée | Fermée |
| Expojove | Le 31 seulement : 10 h–14 h | Pas encore commencé | 16 h–21 h |

- **L'Oceanogràfic ouvre tous les jours de l'année**, y compris le 25 : c'est le plan le plus sûr pour un jour férié avec des enfants. Achetez le billet en ligne, car ces jours-là il y a foule.
- **La Lonja de la Seda** ferme aussi le 6 janvier ; les autres jours fériés, elle ouvre de 10 h à 14 h.
- **Commerces et restaurants :** les 24 et 31, ils ferment en milieu d'après-midi, et les 25 et 1er, peu sont ouverts. Réservez le dîner à l'avance.

*Horaires vérifiés sur les sites officiels le 10 novembre 2026. Ceux de la Ciutat de les Arts i les Ciències peuvent changer : confirmez-les sur cac.es avant d'y aller.*

"""),
'it': ('## Cosa fare a Valencia a Natale', """## Cosa apre e cosa chiude a Valencia il 24, 25 e 31 dicembre e il 1° gennaio

| Luogo | 24 e 31 dicembre | 25 dicembre | 1° gennaio |
| --- | --- | --- | --- |
| Oceanogràfic | 10:00–16:00 | 12:00–18:00 | Aperto |
| Museu de les Ciències | Aperto | Chiuso | Aperto |
| Lonja de la Seda | Possibili orari speciali | Chiusa | Chiusa |
| Expojove | Solo il 31: 10:00–14:00 | Non ancora iniziato | 16:00–21:00 |

- **L'Oceanogràfic è aperto tutti i giorni dell'anno**, anche il 25: è il piano più sicuro per un festivo con i bambini. Compra il biglietto online, perché in quei giorni si riempie.
- **La Lonja de la Seda** chiude anche il 6 gennaio; negli altri festivi apre dalle 10:00 alle 14:00.
- **Negozi e ristoranti:** il 24 e il 31 chiudono a metà pomeriggio, e il 25 e il 1° ne aprono pochi. Prenota la cena per tempo.

*Orari verificati sui siti ufficiali il 10 novembre 2026. Quelli della Ciutat de les Arts i les Ciències possono cambiare: confermali su cac.es prima di andare.*

"""),
'pt': ('## O que fazer em Valência no Natal', """## O que abre e o que fecha em Valência a 24, 25 e 31 de dezembro e a 1 de janeiro

| Local | 24 e 31 de dezembro | 25 de dezembro | 1 de janeiro |
| --- | --- | --- | --- |
| Oceanogràfic | 10:00–16:00 | 12:00–18:00 | Aberto |
| Museu de les Ciències | Aberto | Fechado | Aberto |
| Lonja de la Seda | Pode ter horário especial | Fechada | Fechada |
| Expojove | Só a 31: 10:00–14:00 | Ainda não começou | 16:00–21:00 |

- **O Oceanogràfic abre todos os dias do ano**, também a 25: é o plano mais seguro para um feriado com crianças. Compre o bilhete online, porque nesses dias enche.
- **A Lonja de la Seda** também fecha a 6 de janeiro; nos restantes feriados abre das 10:00 às 14:00.
- **Lojas e restaurantes:** a 24 e a 31 fecham a meio da tarde, e a 25 e a 1 abrem poucos. Reserve o jantar com tempo.

*Horários confirmados nos sites oficiais a 10 de novembro de 2026. Os da Ciutat de les Arts i les Ciències podem mudar: confirme-os em cac.es antes de ir.*

"""),
}
F = {'de': 'de/valencia/weihnachten-valencia.md', 'fr': 'fr/valencia/noel-a-valence.md',
     'it': 'it/valencia/natale-a-valencia.md', 'pt': 'pt/valencia/natal-em-valencia.md'}
for l, p in F.items():
    anchor, block = S[l]
    t = open(p, encoding='utf-8').read()
    i = t.find(anchor)
    if i < 0 or 'Oceanogràfic | 10' in t:
        print('SKIP', p); continue
    open(p, 'w', encoding='utf-8').write(t[:i] + block + t[i:])
    print('ok', p)
