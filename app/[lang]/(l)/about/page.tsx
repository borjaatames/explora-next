import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IDIOMAS_ACTIVOS,
  IDIOMA_LOCALE,
  esIdiomaActivo,
} from "@/lib/i18n/config";
import { hreflangAlternates, urlContacto, urlIndiceCiudades } from "@/lib/i18n/utils";
import type { Idioma } from "@/lib/i18n/types";

type AboutCopy = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: React.ReactNode;
  whatWeDo: { heading: string; lead: string; items: React.ReactNode[] };
  whyWeBuilt: { heading: string; body: React.ReactNode };
  editorial: { heading: string; body: React.ReactNode };
  author: { heading: string; body: string };
  funding: {
    heading: string;
    lead: string;
    items: React.ReactNode[];
    body: React.ReactNode;
  };
  company: { heading: string; body: React.ReactNode };
  contact: { heading: string; body: React.ReactNode };
  cta: { heading: string; body: string; button: string; href: string };
  breadcrumbHome: string;
  breadcrumbSelf: string;
};

function getCopy(lang: Idioma): AboutCopy {
  if (lang === "en") {
    return {
      metaTitle: "About ExploraSpain | Who we are",
      metaDescription:
        "ExploraSpain is a SKYWARD PARTNERS, S.L. project: curated tours and activities across Spain plus honest editorial travel guides — no fluff, real opinions.",
      ogTitle: "About ExploraSpain",
      ogDescription:
        "A SKYWARD PARTNERS, S.L. project. Tours, activities and honest editorial guides for traveling Spain.",
      heroTitle: "About ExploraSpain",
      heroSubtitle:
        "Tours, activities and honest travel guides for visiting Spain.",
      intro: (
        <>
          ExploraSpain is a project by{" "}
          <strong>SKYWARD PARTNERS, S.L.</strong> offering tours and
          activities in Spain&rsquo;s main cities, alongside independent
          editorial content about traveling the country.
        </>
      ),
      whatWeDo: {
        heading: "What we do",
        lead: "Two things, both with the same standard:",
        items: [
          <>
            <strong>Tours and experiences</strong>: we curate activities in
            Spain&rsquo;s main cities and make them available to travelers.
            We prioritize experiences with real value rather than listing
            anything that&rsquo;s out there.
          </>,
          <>
            <strong>Editorial guides</strong>: opinionated routes, honest editorial picks and practical advice so you can decide what&rsquo;s
            worth your time, your days and your budget &mdash; without
            endless lists or postcard-tourism filler.
          </>,
        ],
      },
      whyWeBuilt: {
        heading: "Why we built this",
        body: (
          <>
            There&rsquo;s no shortage of information about what to see in
            Spain. There&rsquo;s very little about{" "}
            <strong>what&rsquo;s actually worth your time</strong>, depending
            on how many days you have, what you genuinely care about and
            what you want to spend. ExploraSpain fills that gap with
            specific content and a carefully chosen activity catalog.
          </>
        ),
      },
      author: {
        heading: "Who writes the guides",
        body: "The guides are written and reviewed by Borja, who runs ExploraSpain.",
      },
      editorial: {
        heading: "Our editorial standards",
        body: (
          <>
            <p>
              We&rsquo;re specific and we say things plainly. If something
              isn&rsquo;t worth it, we say so. If two options are roughly
              equivalent, we say that too. A grounded recommendation beats
              a list where everything looks equally important.
            </p>
            <p>
              Practical details (prices, opening hours, durations) are
              checked against official sources before we publish. If
              something changes and we catch it, we update. If a reader
              spots an error, they can flag it and we fix it.
            </p>
          </>
        ),
      },
      funding: {
        heading: "How we make money",
        lead: "ExploraSpain earns revenue in two ways:",
        items: [
          <>
            <strong>Selling tours and activities</strong> in the cities
            where we operate, either directly or through trusted travel
            partners.
          </>,
          <>
            <strong>Affiliate links</strong> to platforms like GetYourGuide for experiences we don&rsquo;t offer directly. If
            you book through one of these links, we earn a small commission
            at no extra cost to you.
          </>,
        ],
        body: (
          <>
            How we make money doesn&rsquo;t shape our editorial picks. An
            activity gets recommended because it makes sense for the
            reader&rsquo;s trip, not because it pays a higher commission.
            If something isn&rsquo;t worth it, we say so &mdash; even if
            it&rsquo;s sitting in our affiliate feed or our own catalog.
          </>
        ),
      },
      company: {
        heading: "Company information",
        body: (
          <>
            ExploraSpain is operated by SKYWARD PARTNERS, S.L., tax ID
            B26629576, registered office at Calle Castelló 117, 28006
            Madrid, Spain. For full legal details, see the{" "}
            <Link href={`/${lang}/legal-notice`}>legal notice</Link>.
          </>
        ),
      },
      contact: {
        heading: "Contact",
        body: (
          <>
            For suggestions, corrections, partnerships or pitches, email us
            at{" "}
            <a
              href="mailto:contacto@exploraspain.com"
              className="font-semibold"
              aria-label="Email us at contacto@exploraspain.com"
            >
              contacto@exploraspain.com
            </a>{" "}
            or visit{" "}
            <Link href={urlContacto(lang)} className="font-semibold">
              the contact page
            </Link>
            .
          </>
        ),
      },
      cta: {
        heading: "Start here",
        body: "Take a look at the published guides to see the kind of content we make.",
        button: "Browse all guides →",
        href: "/en/guides",
      },
      breadcrumbHome: "Home",
      breadcrumbSelf: "About",
    };
  }

  if (lang === "de") {
    return {
      metaTitle: "Über ExploraSpain | Wer wir sind",
      metaDescription:
        "ExploraSpain ist ein Projekt von SKYWARD PARTNERS, S.L.: kuratierte Touren und Aktivitäten in ganz Spanien sowie ehrliche redaktionelle Reiseführer – ohne Floskeln, mit echter Meinung.",
      ogTitle: "Über ExploraSpain",
      ogDescription:
        "Ein Projekt von SKYWARD PARTNERS, S.L. Touren, Aktivitäten und ehrliche redaktionelle Reiseführer für Spanien.",
      heroTitle: "Über ExploraSpain",
      heroSubtitle:
        "Touren, Aktivitäten und ehrliche Reiseführer für deinen Spanien-Besuch.",
      intro: (
        <>
          ExploraSpain ist ein Projekt von{" "}
          <strong>SKYWARD PARTNERS, S.L.</strong>, das Touren und Aktivitäten
          in den wichtigsten Städten Spaniens anbietet, zusammen mit
          unabhängigen redaktionellen Inhalten über das Reisen im Land.
        </>
      ),
      whatWeDo: {
        heading: "Was wir tun",
        lead: "Zwei Dinge, beide mit demselben Anspruch:",
        items: [
          <>
            <strong>Touren und Erlebnisse</strong>: Wir kuratieren
            Aktivitäten in den wichtigsten Städten Spaniens und stellen sie
            Reisenden zur Verfügung. Wir setzen auf Erlebnisse mit echtem
            Mehrwert statt auf endlose Listen.
          </>,
          <>
            <strong>Redaktionelle Reiseführer</strong>: fundierte Routen,
            ehrliche redaktionelle Empfehlungen und praktische Tipps, damit
            du entscheiden kannst, was deine Zeit, deine Tage und dein
            Budget wert ist – ohne endlose Listen oder Postkarten-Touristik.
          </>,
        ],
      },
      whyWeBuilt: {
        heading: "Warum wir das gebaut haben",
        body: (
          <>
            An Informationen darüber, was man in Spanien sehen kann, mangelt
            es nicht. Sehr wenig gibt es hingegen darüber,{" "}
            <strong>was sich wirklich lohnt</strong>, je nachdem, wie viele
            Tage man hat, was einen wirklich interessiert und was man
            ausgeben möchte. ExploraSpain schließt diese Lücke mit konkreten
            Inhalten und einem sorgfältig ausgewählten Aktivitätenkatalog.
          </>
        ),
      },
      author: {
        heading: "Wer die Reiseführer schreibt",
        body: "Die Reiseführer schreibt und prüft Borja, der ExploraSpain betreibt.",
      },
      editorial: {
        heading: "Unser redaktioneller Anspruch",
        body: (
          <>
            <p>
              Wir sind konkret und sagen die Dinge klar. Wenn sich etwas
              nicht lohnt, sagen wir das. Wenn zwei Optionen ungefähr
              gleichwertig sind, sagen wir auch das. Eine fundierte
              Empfehlung ist mehr wert als eine Liste, in der alles gleich
              wichtig erscheint.
            </p>
            <p>
              Praktische Angaben (Preise, Öffnungszeiten, Dauer) werden vor
              der Veröffentlichung anhand offizieller Quellen geprüft. Wenn
              sich etwas ändert und wir es bemerken, aktualisieren wir es.
              Wenn ein Leser einen Fehler entdeckt, kann er ihn melden und
              wir korrigieren ihn.
            </p>
          </>
        ),
      },
      funding: {
        heading: "Wie wir Geld verdienen",
        lead: "ExploraSpain erzielt Einnahmen auf zwei Wegen:",
        items: [
          <>
            <strong>Verkauf von Touren und Aktivitäten</strong> in den
            Städten, in denen wir tätig sind, entweder direkt oder über
            vertrauenswürdige Reisepartner.
          </>,
          <>
            <strong>Affiliate-Links</strong> zu Plattformen wie GetYourGuide für Erlebnisse, die wir nicht direkt anbieten. Wenn
            du über einen dieser Links buchst, erhalten wir eine kleine
            Provision, ohne Mehrkosten für dich.
          </>,
        ],
        body: (
          <>
            Wie wir Geld verdienen, beeinflusst nicht unsere redaktionellen
            Empfehlungen. Eine Aktivität wird empfohlen, weil sie für die
            Reise des Lesers sinnvoll ist, nicht weil sie eine höhere
            Provision zahlt. Wenn sich etwas nicht lohnt, sagen wir das –
            auch wenn es in unserem Affiliate-Feed oder unserem eigenen
            Katalog steht.
          </>
        ),
      },
      company: {
        heading: "Unternehmensangaben",
        body: (
          <>
            ExploraSpain wird betrieben von SKYWARD PARTNERS, S.L.,
            Steuernummer B26629576, mit Sitz in Calle Castelló 117, 28006
            Madrid, Spanien. Vollständige rechtliche Angaben findest du im{" "}
            <Link href={`/${lang}/legal-notice`}>Impressum</Link>.
          </>
        ),
      },
      contact: {
        heading: "Kontakt",
        body: (
          <>
            Für Vorschläge, Korrekturen, Kooperationen oder Anfragen schreib
            uns an{" "}
            <a
              href="mailto:contacto@exploraspain.com"
              className="font-semibold"
              aria-label="Schreib uns an contacto@exploraspain.com"
            >
              contacto@exploraspain.com
            </a>{" "}
            oder besuche{" "}
            <Link href={urlContacto(lang)} className="font-semibold">
              die Kontaktseite
            </Link>
            .
          </>
        ),
      },
      cta: {
        heading: "Hier geht's los",
        body: "Wirf einen Blick auf die veröffentlichten Reiseführer, um die Art von Inhalten zu sehen, die wir erstellen.",
        button: "Alle Reiseführer ansehen →",
        href: "/de/guides",
      },
      breadcrumbHome: "Startseite",
      breadcrumbSelf: "Über uns",
    };
  }

  if (lang === "fr") {
    return {
      metaTitle: "À propos d’ExploraSpain | Qui sommes-nous",
      metaDescription:
        "ExploraSpain est un projet de SKYWARD PARTNERS, S.L. : des visites et activités sélectionnées dans toute l’Espagne et des guides éditoriaux honnêtes, sans blabla, avec de vrais avis.",
      ogTitle: "À propos d’ExploraSpain",
      ogDescription:
        "Un projet de SKYWARD PARTNERS, S.L. Visites, activités et guides éditoriaux honnêtes pour voyager en Espagne.",
      heroTitle: "À propos d’ExploraSpain",
      heroSubtitle:
        "Des visites, des activités et des conseils honnêtes pour découvrir l’Espagne.",
      intro: (
        <>
          ExploraSpain est un projet de{" "}
          <strong>SKYWARD PARTNERS, S.L.</strong> qui propose des visites et
          des activités dans les principales villes d’Espagne, ainsi que des
          contenus éditoriaux indépendants sur les voyages dans le pays.
        </>
      ),
      whatWeDo: {
        heading: "Ce que nous faisons",
        lead: "Deux choses, avec la même exigence :",
        items: [
          <>
            <strong>Visites et expériences</strong> : nous sélectionnons des
            activités dans les principales villes d’Espagne et les mettons à
            la disposition des voyageurs. Nous privilégions les expériences
            qui ont une vraie valeur plutôt que de tout lister.
          </>,
          <>
            <strong>Guides éditoriaux</strong> : des itinéraires réfléchis,
            des recommandations honnêtes et des conseils pratiques pour vous
            aider à décider ce qui mérite votre temps, vos jours et votre
            budget &mdash; sans listes interminables ni tourisme de carte
            postale.
          </>,
        ],
      },
      whyWeBuilt: {
        heading: "Pourquoi ce projet",
        body: (
          <>
            Les informations sur ce qu’il faut voir en Espagne ne manquent
            pas. Il y en a très peu sur{" "}
            <strong>ce qui en vaut vraiment la peine</strong>, selon le
            nombre de jours dont vous disposez, ce qui vous intéresse
            réellement et ce que vous souhaitez dépenser. ExploraSpain comble
            ce manque avec des contenus concrets et un catalogue d’activités
            choisi avec soin.
          </>
        ),
      },
      author: {
        heading: "Qui rédige les guides",
        body: "Les guides sont rédigés et relus par Borja, responsable d’ExploraSpain.",
      },
      editorial: {
        heading: "Notre ligne éditoriale",
        body: (
          <>
            <p>
              Nous sommes concrets et nous disons les choses clairement. Si
              quelque chose n’en vaut pas la peine, nous le disons. Si deux
              options se valent, nous le disons aussi. Une recommandation
              argumentée est plus utile qu’une liste où tout semble aussi
              important.
            </p>
            <p>
              Les informations pratiques (prix, horaires, durées) sont
              vérifiées auprès de sources officielles avant publication. Si
              quelque chose change et que nous le remarquons, nous mettons à
              jour. Si un lecteur repère une erreur, il peut nous la signaler
              et nous la corrigeons.
            </p>
          </>
        ),
      },
      funding: {
        heading: "Comment nous gagnons de l’argent",
        lead: "ExploraSpain génère des revenus de deux façons :",
        items: [
          <>
            <strong>La vente de visites et d’activités</strong> dans les
            villes où nous opérons, directement ou via des partenaires de
            voyage de confiance.
          </>,
          <>
            <strong>Des liens d’affiliation</strong> vers des plateformes
            comme GetYourGuide pour les expériences que nous ne proposons pas
            directement. Si vous réservez via l’un de ces liens, nous
            touchons une petite commission sans aucun surcoût pour vous.
          </>,
        ],
        body: (
          <>
            Notre modèle de revenus n’influence pas nos recommandations. Une
            activité est recommandée parce qu’elle a du sens pour votre
            voyage, pas parce qu’elle rapporte une commission plus élevée. Si
            quelque chose n’en vaut pas la peine, nous le disons &mdash; même
            si cela figure dans notre flux d’affiliation ou dans notre propre
            catalogue.
          </>
        ),
      },
      company: {
        heading: "Informations sur l’entreprise",
        body: (
          <>
            ExploraSpain est exploité par SKYWARD PARTNERS, S.L., NIF
            B26629576, dont le siège social est situé Calle Castelló 117,
            28006 Madrid, Espagne. Pour toutes les informations légales,
            consultez les{" "}
            <Link href={`/${lang}/legal-notice`}>mentions légales</Link>.
          </>
        ),
      },
      contact: {
        heading: "Contact",
        body: (
          <>
            Pour toute suggestion, correction, collaboration ou proposition,
            écrivez-nous à{" "}
            <a
              href="mailto:contacto@exploraspain.com"
              className="font-semibold"
              aria-label="Écrivez-nous à contacto@exploraspain.com"
            >
              contacto@exploraspain.com
            </a>{" "}
            ou rendez-vous sur{" "}
            <Link href={urlContacto(lang)} className="font-semibold">
              la page de contact
            </Link>
            .
          </>
        ),
      },
      cta: {
        heading: "Commencez ici",
        body: "Parcourez les villes pour découvrir les activités que nous avons sélectionnées.",
        button: "Voir toutes les villes →",
        href: urlIndiceCiudades(lang),
      },
      breadcrumbHome: "Accueil",
      breadcrumbSelf: "À propos",
    };
  }

  if (lang === "it") {
    return {
      metaTitle: "Chi siamo | ExploraSpain",
      metaDescription:
        "ExploraSpain è un progetto di SKYWARD PARTNERS, S.L.: tour e attività selezionati in tutta la Spagna e guide editoriali oneste, senza fronzoli e con opinioni sincere.",
      ogTitle: "Chi è ExploraSpain",
      ogDescription:
        "Un progetto di SKYWARD PARTNERS, S.L. Tour, attività e guide editoriali oneste per viaggiare in Spagna.",
      heroTitle: "Chi è ExploraSpain",
      heroSubtitle:
        "Tour, attività e consigli onesti per scoprire la Spagna.",
      intro: (
        <>
          ExploraSpain è un progetto di{" "}
          <strong>SKYWARD PARTNERS, S.L.</strong> che offre tour e attività
          nelle principali città della Spagna, insieme a contenuti editoriali
          indipendenti su come viaggiare nel Paese.
        </>
      ),
      whatWeDo: {
        heading: "Cosa facciamo",
        lead: "Due cose, entrambe con lo stesso criterio:",
        items: [
          <>
            <strong>Tour ed esperienze</strong>: selezioniamo attività nelle
            principali città spagnole e le mettiamo a disposizione dei
            viaggiatori. Diamo priorità alle esperienze con un valore reale,
            invece di elencare tutto ciò che esiste.
          </>,
          <>
            <strong>Guide editoriali</strong>: itinerari ragionati,
            consigli onesti e informazioni pratiche per aiutarti a decidere
            cosa vale il tuo tempo, i tuoi giorni e il tuo budget &mdash;
            senza liste infinite né turismo da cartolina.
          </>,
        ],
      },
      whyWeBuilt: {
        heading: "Perché esiste",
        body: (
          <>
            Le informazioni su cosa vedere in Spagna non mancano. Ce ne sono
            pochissime su{" "}
            <strong>cosa vale davvero la pena</strong>, in base a quanti
            giorni hai, a cosa ti interessa davvero e a quanto vuoi spendere.
            ExploraSpain colma questa lacuna con contenuti concreti e un
            catalogo di attività scelto con cura.
          </>
        ),
      },
      author: {
        heading: "Chi scrive le guide",
        body: "Le guide sono scritte e revisionate da Borja, responsabile di ExploraSpain.",
      },
      editorial: {
        heading: "Il nostro criterio editoriale",
        body: (
          <>
            <p>
              Siamo concreti e diciamo le cose chiaramente. Se qualcosa non
              vale la pena, lo diciamo. Se due opzioni si equivalgono, lo
              diciamo lo stesso. Un consiglio motivato è più utile di una
              lista in cui tutto sembra ugualmente importante.
            </p>
            <p>
              Le informazioni pratiche (prezzi, orari, durate) vengono
              verificate su fonti ufficiali prima della pubblicazione. Se
              qualcosa cambia e ce ne accorgiamo, aggiorniamo. Se un lettore
              trova un errore, può segnalarcelo e lo correggiamo.
            </p>
          </>
        ),
      },
      funding: {
        heading: "Come ci finanziamo",
        lead: "ExploraSpain genera entrate in due modi:",
        items: [
          <>
            <strong>Vendita di tour e attività</strong> nelle città in cui
            operiamo, direttamente o tramite partner turistici affidabili.
          </>,
          <>
            <strong>Link di affiliazione</strong> a piattaforme come
            GetYourGuide per le esperienze che non offriamo direttamente. Se
            prenoti tramite uno di questi link, riceviamo una piccola
            commissione senza alcun costo aggiuntivo per te.
          </>,
        ],
        body: (
          <>
            Il nostro modello di guadagno non condiziona i consigli
            editoriali. Un’attività viene consigliata perché ha senso per il
            tuo viaggio, non perché paga una commissione più alta. Se
            qualcosa non vale la pena, lo diciamo &mdash; anche se è nel
            nostro feed di affiliazione o nel nostro catalogo.
          </>
        ),
      },
      company: {
        heading: "Informazioni sull’azienda",
        body: (
          <>
            ExploraSpain è gestito da SKYWARD PARTNERS, S.L., codice fiscale
            B26629576, con sede legale in Calle Castelló 117, 28006 Madrid,
            Spagna. Per tutti i dettagli legali, consulta le{" "}
            <Link href={`/${lang}/legal-notice`}>note legali</Link>.
          </>
        ),
      },
      contact: {
        heading: "Contatti",
        body: (
          <>
            Per suggerimenti, correzioni, collaborazioni o proposte,
            scrivici a{" "}
            <a
              href="mailto:contacto@exploraspain.com"
              className="font-semibold"
              aria-label="Scrivici a contacto@exploraspain.com"
            >
              contacto@exploraspain.com
            </a>{" "}
            oppure visita{" "}
            <Link href={urlContacto(lang)} className="font-semibold">
              la pagina dei contatti
            </Link>
            .
          </>
        ),
      },
      cta: {
        heading: "Inizia da qui",
        body: "Esplora le città per scoprire le attività che abbiamo selezionato.",
        button: "Vedi tutte le città →",
        href: urlIndiceCiudades(lang),
      },
      breadcrumbHome: "Home",
      breadcrumbSelf: "Chi siamo",
    };
  }

  if (lang === "pt") {
    return {
      metaTitle: "Sobre a ExploraSpain | Quem somos",
      metaDescription:
        "A ExploraSpain é um projeto da SKYWARD PARTNERS, S.L.: tours e atividades selecionados em toda a Espanha e guias editoriais honestos, sem rodeios e com opiniões sinceras.",
      ogTitle: "Sobre a ExploraSpain",
      ogDescription:
        "Um projeto da SKYWARD PARTNERS, S.L. Tours, atividades e guias editoriais honestos para viajar por Espanha.",
      heroTitle: "Sobre a ExploraSpain",
      heroSubtitle:
        "Tours, atividades e conselhos honestos para conhecer Espanha.",
      intro: (
        <>
          A ExploraSpain é um projeto da{" "}
          <strong>SKYWARD PARTNERS, S.L.</strong> que oferece tours e
          atividades nas principais cidades de Espanha, a par de conteúdo
          editorial independente sobre viagens pelo país.
        </>
      ),
      whatWeDo: {
        heading: "O que fazemos",
        lead: "Duas coisas, ambas com o mesmo critério:",
        items: [
          <>
            <strong>Tours e experiências</strong>: selecionamos atividades
            nas principais cidades espanholas e colocamo-las à disposição dos
            viajantes. Damos prioridade a experiências com valor real, em vez
            de listar tudo o que existe.
          </>,
          <>
            <strong>Guias editoriais</strong>: roteiros pensados,
            recomendações honestas e conselhos práticos para que cada
            viajante possa decidir o que merece o seu tempo, os seus dias e o
            seu orçamento &mdash; sem listas intermináveis nem turismo de
            postal.
          </>,
        ],
      },
      whyWeBuilt: {
        heading: "Porque existimos",
        body: (
          <>
            Não falta informação sobre o que visitar em Espanha. Há muito
            pouca sobre{" "}
            <strong>o que realmente vale a pena</strong>, consoante os dias
            disponíveis, o que interessa de verdade e o orçamento de cada
            um. A ExploraSpain preenche essa lacuna com conteúdo concreto e
            uma oferta de atividades cuidada.
          </>
        ),
      },
      author: {
        heading: "Quem escreve os guias",
        body: "Os guias são escritos e revistos por Borja, responsável pela ExploraSpain.",
      },
      editorial: {
        heading: "O nosso critério editorial",
        body: (
          <>
            <p>
              Somos concretos e dizemos as coisas com clareza. Se algo não
              vale a pena, dizemo-lo. Se duas opções são equivalentes,
              também. Uma recomendação fundamentada é mais útil do que uma
              lista em que tudo parece igualmente importante.
            </p>
            <p>
              Os dados práticos (preços, horários, durações) são verificados
              em fontes oficiais antes de publicar. Se algo muda e damos por
              isso, atualizamos. Se um leitor detetar um erro, pode
              avisar-nos e corrigimo-lo.
            </p>
          </>
        ),
      },
      funding: {
        heading: "Como nos financiamos",
        lead: "A ExploraSpain gera receitas de duas formas:",
        items: [
          <>
            <strong>Venda de tours e atividades</strong> nas cidades onde
            operamos, diretamente ou através de parceiros turísticos de
            confiança.
          </>,
          <>
            <strong>Ligações de afiliação</strong> a plataformas como a
            GetYourGuide nas experiências que não oferecemos diretamente. Se
            reservar através destas ligações, recebemos uma pequena comissão
            sem qualquer custo adicional para si.
          </>,
        ],
        body: (
          <>
            O modelo de receitas não condiciona as recomendações editoriais.
            Uma atividade é recomendada porque faz sentido para a viagem do
            leitor, não por pagar mais comissão. Se algo não vale a pena,
            dizemo-lo &mdash; mesmo que esteja disponível para afiliação ou
            no nosso catálogo.
          </>
        ),
      },
      company: {
        heading: "Informação da empresa",
        body: (
          <>
            A ExploraSpain é operada pela SKYWARD PARTNERS, S.L., NIF
            B26629576, com sede social na Calle Castelló 117, 28006 Madrid,
            Espanha. Para os dados legais completos, consulte o{" "}
            <Link href={`/${lang}/legal-notice`}>aviso legal</Link>.
          </>
        ),
      },
      contact: {
        heading: "Contacto",
        body: (
          <>
            Para sugestões, correções, colaborações ou propostas, escreva-nos
            para{" "}
            <a
              href="mailto:contacto@exploraspain.com"
              className="font-semibold"
              aria-label="Escreva-nos para contacto@exploraspain.com"
            >
              contacto@exploraspain.com
            </a>{" "}
            ou visite{" "}
            <Link href={urlContacto(lang)} className="font-semibold">
              a página de contacto
            </Link>
            .
          </>
        ),
      },
      cta: {
        heading: "Comece por aqui",
        body: "Percorra as cidades para descobrir as atividades que selecionámos.",
        button: "Ver todas as cidades →",
        href: urlIndiceCiudades(lang),
      },
      breadcrumbHome: "Início",
      breadcrumbSelf: "Sobre nós",
    };
  }

  // ES (default — defensa en profundidad; la ruta ES real es /sobre-nosotros)
  return {
    metaTitle: "Sobre ExploraSpain | Quiénes somos",
    metaDescription:
      "ExploraSpain es un proyecto de SKYWARD PARTNERS, S.L. dedicado a la comercialización de tours y actividades turísticas en España y a la publicación de contenido editorial honesto sobre viajes.",
    ogTitle: "Sobre ExploraSpain",
    ogDescription:
      "Proyecto de SKYWARD PARTNERS, S.L. Tours, actividades y guías editoriales sobre viajes por España.",
    heroTitle: "Sobre ExploraSpain",
    heroSubtitle:
      "Tours, actividades y guías con criterio para viajar por España.",
    intro: (
      <>
        ExploraSpain es un proyecto de{" "}
        <strong>SKYWARD PARTNERS, S.L.</strong> que ofrece tours y
        actividades en distintas ciudades de España, junto con contenido
        editorial independiente sobre viajes por el país.
      </>
    ),
    whatWeDo: {
      heading: "Qué hacemos",
      lead: "Dos cosas, y las dos con el mismo criterio:",
      items: [
        <>
          <strong>Tours y experiencias</strong>: seleccionamos actividades
          turísticas en las principales ciudades españolas y las ponemos a
          disposición del viajero. Priorizamos experiencias con valor real,
          no cualquier actividad disponible.
        </>,
        <>
          <strong>Guías editoriales</strong>: publicamos rutas con criterio,
          selección honesta y consejos prácticos para que cada viajero
          pueda decidir qué merece la pena en su caso, sin listados
          interminables ni el tono hinchado del turismo de postal.
        </>,
      ],
    },
    whyWeBuilt: {
      heading: "Por qué existe",
      body: (
        <>
          Hay mucha información disponible sobre qué visitar en España. Poca
          sobre <strong>qué merece la pena en cada caso</strong>, según
          cuántos días se tengan, qué interese de verdad y qué presupuesto
          se maneje. ExploraSpain cubre ese hueco con contenido concreto y
          una oferta de actividades cuidada.
        </>
      ),
    },
    author: {
      heading: "Quién escribe las guías",
      body: "Las guías las escribe y revisa Borja, responsable de ExploraSpain.",
    },
    editorial: {
      heading: "Nuestro criterio editorial",
      body: (
        <>
          <p>
            Somos concretos y decimos las cosas claras. Si algo no merece la
            pena, lo decimos. Si dos opciones son equivalentes, también. Una
            recomendación con fundamento es más útil que un listado donde
            todo parece igual de importante.
          </p>
          <p>
            Los datos prácticos (precios, horarios, duraciones) se verifican
            en fuentes oficiales antes de publicar. Si algo cambia y lo
            detectamos, se actualiza. Si un lector detecta un error, puede
            avisarnos y lo corregimos.
          </p>
        </>
      ),
    },
    funding: {
      heading: "Cómo nos financiamos",
      lead: "ExploraSpain genera ingresos a través de dos vías:",
      items: [
        <>
          <strong>Venta de tours y actividades</strong> en las ciudades
          donde operamos, directamente o a través de partners turísticos de
          confianza.
        </>,
        <>
          <strong>Enlaces de afiliación</strong> a plataformas como GetYourGuide en aquellas experiencias que no ofrecemos
          directamente. Si se reserva a través de estos enlaces, recibimos
          una pequeña comisión sin coste adicional para el usuario.
        </>,
      ],
      body: (
        <>
          El modelo de ingresos no condiciona las recomendaciones
          editoriales. Una actividad se menciona porque tiene sentido para
          el viaje del lector, no por pagar más comisión. Si algo no merece
          la pena, se dice aunque esté disponible para afiliación o en
          nuestro catálogo.
        </>
      ),
    },
    company: {
      heading: "Información de la empresa",
      body: (
        <>
          ExploraSpain es operado por SKYWARD PARTNERS, S.L., con NIF
          B26629576 y domicilio social en Calle Castelló 117, 28006 Madrid.
          Para detalles legales completos, consulta el{" "}
          <Link href="/aviso-legal">aviso legal</Link>.
        </>
      ),
    },
    contact: {
      heading: "Contacto",
      body: (
        <>
          Para sugerencias, correcciones, colaboraciones o propuestas,
          escríbenos a{" "}
          <a
            href="mailto:contacto@exploraspain.com"
            className="font-semibold"
            aria-label="Escríbenos a contacto@exploraspain.com"
          >
            contacto@exploraspain.com
          </a>{" "}
          o visita{" "}
          <Link href="/contacto" className="font-semibold">
            la página de contacto
          </Link>
          .
        </>
      ),
    },
    cta: {
      heading: "Empieza por aquí",
      body: "Echa un vistazo a las guías publicadas y verás el tipo de contenido que hacemos.",
      button: "Ver todas las guías →",
      href: "/guias",
    },
    breadcrumbHome: "Inicio",
    breadcrumbSelf: "Sobre nosotros",
  };
}

export function generateStaticParams(): Array<{ lang: Idioma }> {
  return IDIOMAS_ACTIVOS.filter((l) => l !== "es").map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    return {};
  }

  const copy = getCopy(lang);
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";

  // /about en EN, /sobre-nosotros en ES (legacy). Si en el futuro
  // creamos /de/about, /fr/about, etc., la convención EN se mantiene.
  const rutaPorIdioma = (l: Idioma): string =>
    l === "es" ? "/sobre-nosotros" : `/${l}/about`;

  const canonicalUrl = `${siteUrl}${rutaPorIdioma(lang)}`;
  const languages = hreflangAlternates(rutaPorIdioma);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: { index: allowIndexing, follow: allowIndexing },
    },
    openGraph: {
      type: "website",
      locale: IDIOMA_LOCALE[lang],
      url: canonicalUrl,
      siteName: "ExploraSpain",
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.ogTitle,
      description: copy.ogDescription,
    },
  };
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!esIdiomaActivo(lang) || lang === "es") {
    notFound();
  }

  const copy = getCopy(lang);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.exploraspain.com";
  const pageUrl = `${siteUrl}/${lang}/about`;
  const homeUrl = `${siteUrl}/${lang}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: copy.breadcrumbHome,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.breadcrumbSelf,
        item: pageUrl,
      },
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ExploraSpain",
    legalName: "SKYWARD PARTNERS, S.L.",
    url: siteUrl,
    email: "contacto@exploraspain.com",
    taxID: "B26629576",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Castelló 117",
      postalCode: "28006",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />

      {/* Hero */}
      <section className="bg-anil-500 text-white py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-4">
            {copy.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-anil-50">{copy.heroSubtitle}</p>
        </div>
      </section>

      {/* Contenido principal */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-fraunces prose-headings:text-piedra-900 prose-a:text-anil-600 prose-a:no-underline hover:prose-a:underline">
          <p className="text-xl leading-relaxed text-piedra-700">{copy.intro}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.whatWeDo.heading}
          </h2>
          <p>{copy.whatWeDo.lead}</p>
          <ul className="space-y-2">
            {copy.whatWeDo.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.whyWeBuilt.heading}
          </h2>
          <p>{copy.whyWeBuilt.body}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.editorial.heading}
          </h2>
          {copy.editorial.body}

          <h2 id="autor" className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.author.heading}
          </h2>
          <p>{copy.author.body}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.funding.heading}
          </h2>
          <p>{copy.funding.lead}</p>
          <ul className="space-y-2">
            {copy.funding.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{copy.funding.body}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.company.heading}
          </h2>
          <p>{copy.company.body}</p>

          <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
            {copy.contact.heading}
          </h2>
          <p>{copy.contact.body}</p>
        </div>

        {/* CTA final */}
        <div className="mt-16 p-8 bg-azafran-50 border-l-4 border-azafran-500 rounded-r-lg">
          <h3 className="font-fraunces text-2xl font-bold text-piedra-900 mb-2">
            {copy.cta.heading}
          </h3>
          <p className="text-piedra-700 mb-4">{copy.cta.body}</p>
          <Link
            href={copy.cta.href}
            className="inline-block bg-azafran-500 hover:bg-azafran-600 text-piedra-900 font-semibold px-6 py-3 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-azafran-600 focus-visible:ring-offset-2"
          >
            {copy.cta.button}
          </Link>
        </div>
      </article>
    </main>
  );
}
