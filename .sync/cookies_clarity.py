import re
ROWS_TSX='''          <tr className="border-b border-piedra-100">
            <td className="p-3 font-mono text-xs">_ga, _ga_*</td>
            <td className="p-3">{t.tipoAnalitica}</td>
            <td className="p-3">{t.gaFinalidad}</td>
            <td className="p-3">{t.gaDuracion}</td>
          </tr>
          <tr className="border-b border-piedra-100">
            <td className="p-3 font-mono text-xs">_clck, _clsk, CLID, MUID</td>
            <td className="p-3">{t.tipoAnalitica}</td>
            <td className="p-3">{t.clarityFinalidad}</td>
            <td className="p-3">{t.clarityDuracion}</td>
          </tr>
'''
T={
'en':dict(dur="6 months",tipo="Analytics",ga="Google Analytics 4: counts visits and bookings clicks to understand how the site is used. Only with your consent.",gad="2 years",cl="Microsoft Clarity: heatmaps and anonymised recordings of how pages are used (clicks, scrolling). Only with your consent.",cld="1 year (_clsk: 1 day)",
 nota="Analytics cookies are only set if you accept them in the banner. If you reject them, Google Analytics works without cookies (Consent Mode v2) and Microsoft Clarity is not loaded. More information: ",old="This table will be updated",fecha=("April 24, 2026","November 11, 2026"),ms="Microsoft privacy statement"),
'de':dict(dur="6 Monate",tipo="Analyse",ga="Google Analytics 4: zählt Besuche und Klicks auf Buchungen, um zu verstehen, wie die Website genutzt wird. Nur mit deiner Einwilligung.",gad="2 Jahre",cl="Microsoft Clarity: Heatmaps und anonymisierte Aufzeichnungen der Seitennutzung (Klicks, Scrollen). Nur mit deiner Einwilligung.",cld="1 Jahr (_clsk: 1 Tag)",
 nota="Analyse-Cookies werden nur gesetzt, wenn du sie im Banner akzeptierst. Lehnst du sie ab, arbeitet Google Analytics ohne Cookies (Consent Mode v2) und Microsoft Clarity wird nicht geladen. Mehr Informationen: ",old="Diese Tabelle wird aktualisiert",fecha=("24. April 2026","11. November 2026"),ms="Datenschutzerklärung von Microsoft"),
'fr':dict(dur="6 mois",tipo="Analyse",ga="Google Analytics 4 : compte les visites et les clics sur les réservations pour comprendre l’utilisation du site. Uniquement avec votre consentement.",gad="2 ans",cl="Microsoft Clarity : cartes de chaleur et enregistrements anonymisés de l’utilisation des pages (clics, défilement). Uniquement avec votre consentement.",cld="1 an (_clsk : 1 jour)",
 nota="Les cookies d’analyse ne sont déposés que si vous les acceptez dans le bandeau. Si vous les refusez, Google Analytics fonctionne sans cookies (Consent Mode v2) et Microsoft Clarity n’est pas chargé. Plus d’informations : ",old="Ce tableau sera mis à jour",fecha=("24 avril 2026","11 novembre 2026"),ms="déclaration de confidentialité de Microsoft"),
'it':dict(dur="6 mesi",tipo="Analisi",ga="Google Analytics 4: conta le visite e i clic sulle prenotazioni per capire come si usa il sito. Solo con il tuo consenso.",gad="2 anni",cl="Microsoft Clarity: mappe di calore e registrazioni anonimizzate dell’uso delle pagine (clic, scorrimento). Solo con il tuo consenso.",cld="1 anno (_clsk: 1 giorno)",
 nota="I cookie di analisi vengono installati solo se li accetti nel banner. Se li rifiuti, Google Analytics funziona senza cookie (Consent Mode v2) e Microsoft Clarity non viene caricato. Maggiori informazioni: ",old="Questa tabella verrà aggiornata",fecha=("24 aprile 2026","11 novembre 2026"),ms="informativa sulla privacy di Microsoft"),
'pt':dict(dur="6 meses",tipo="Análise",ga="Google Analytics 4: conta as visitas e os cliques nas reservas para perceber como o site é usado. Só com o teu consentimento.",gad="2 anos",cl="Microsoft Clarity: mapas de calor e gravações anonimizadas do uso das páginas (cliques, scroll). Só com o teu consentimento.",cld="1 ano (_clsk: 1 dia)",
 nota="Os cookies de análise só são instalados se os aceitares no banner. Se os recusares, o Google Analytics funciona sem cookies (Consent Mode v2) e o Microsoft Clarity não é carregado. Mais informações: ",old="Esta tabela será atualizada",fecha=("24 de abril de 2026","11 de novembro de 2026"),ms="declaração de privacidade da Microsoft"),
}
OLD12={'en':"12 months",'de':"12 Monate",'fr':"12 mois",'it':"12 mesi",'pt':"12 meses"}
MSURL="https://privacy.microsoft.com/privacystatement"
p='app/[lang]/(l)/cookies/page.tsx'; s=open(p,encoding='utf-8').read()
s=s.replace('  consentimientoDuracion: string;\n}','  consentimientoDuracion: string;\n  tipoAnalitica: string;\n  gaFinalidad: string;\n  gaDuracion: string;\n  clarityFinalidad: string;\n  clarityDuracion: string;\n}',1)
s=s.replace('          <tr>\n            <td className="p-3 font-mono text-xs">\n              exploraspain_cookie_consent','          <tr className="border-b border-piedra-100">\n            <td className="p-3 font-mono text-xs">\n              exploraspain_cookie_consent',1)
s=s.replace('            <td className="p-3">{t.consentimientoDuracion}</td>\n          </tr>\n','            <td className="p-3">{t.consentimientoDuracion}</td>\n          </tr>\n'+ROWS_TSX,1)
for L,d in T.items():
    a=f'consentimientoDuracion: "{OLD12[L]}",'
    assert s.count(a)==1,(L,a)
    s=s.replace(a,f'consentimientoDuracion: "{d["dur"]}",\n          tipoAnalitica: "{d["tipo"]}",\n          gaFinalidad:\n            "{d["ga"]}",\n          gaDuracion: "{d["gad"]}",\n          clarityFinalidad:\n            "{d["cl"]}",\n          clarityDuracion: "{d["cld"]}",')
    m=re.search(r'(      <p className="text-sm text-piedra-600 italic">\n)\s*'+re.escape(d['old'])+r'.*?(\n      </p>)',s,re.S)
    assert m,L
    new=m.group(1)+'        '+d['nota']+'\n        <a href="'+MSURL+'" target="_blank" rel="noopener noreferrer">\n          '+d['ms']+'\n        </a>\n        .'+m.group(2)
    s=s[:m.start()]+new+s[m.end():]
    f0,f1=d['fecha']; assert s.count(f'fecha: "{f0}"')==1; s=s.replace(f'fecha: "{f0}"',f'fecha: "{f1}"')
open(p,'w',encoding='utf-8').write(s)
# ES
p='app/(es-shell)/(es)/cookies/page.tsx'; s=open(p,encoding='utf-8').read()
s=s.replace('Última actualización: 24 de abril de 2026','Última actualización: 11 de noviembre de 2026',1)
old='''                <tr>
                  <td className="p-3 font-mono text-xs">
                    exploraspain_cookie_consent'''
assert s.count(old)==1
s=s.replace(old,old.replace('<tr>','<tr className="border-b border-piedra-100">',1),1)
old2='''                  <td className="p-3">12 meses</td>
                </tr>
'''
assert s.count(old2)==1
s=s.replace(old2,'''                  <td className="p-3">6 meses</td>
                </tr>
                <tr className="border-b border-piedra-100">
                  <td className="p-3 font-mono text-xs">_ga, _ga_*</td>
                  <td className="p-3">Analítica</td>
                  <td className="p-3">
                    Google Analytics 4: cuenta las visitas y los clics en las
                    reservas para saber cómo se usa el sitio. Solo con tu
                    consentimiento.
                  </td>
                  <td className="p-3">2 años</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">_clck, _clsk, CLID, MUID</td>
                  <td className="p-3">Analítica</td>
                  <td className="p-3">
                    Microsoft Clarity: mapas de calor y grabaciones anónimas de
                    cómo se usan las páginas (clics, desplazamiento). Solo con
                    tu consentimiento.
                  </td>
                  <td className="p-3">1 año (_clsk: 1 día)</td>
                </tr>
''',1)
m=re.search(r'(          <p className="text-sm text-piedra-600 italic">\n)\s*Esta tabla se actualizará.*?(\n          </p>)',s,re.S); assert m
s=s[:m.start()]+m.group(1)+'''            Las cookies de analítica solo se instalan si las aceptas en el
            banner. Si las rechazas, Google Analytics funciona sin cookies
            (Consent Mode v2) y Microsoft Clarity no se carga. Más
            información:{" "}
            <a href="'''+MSURL+'''" target="_blank" rel="noopener noreferrer">
              declaración de privacidad de Microsoft
            </a>
            .'''+m.group(2)+s[m.end():]
open(p,'w',encoding='utf-8').write(s)
print('ok')
