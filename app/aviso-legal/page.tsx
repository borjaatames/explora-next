import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal | ExploraSpain",
  description:
    "Información legal del titular del sitio web ExploraSpain conforme a la LSSI-CE.",
  robots: {
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  alternates: {
    canonical: "https://exploraspain.com/aviso-legal",
  },
};

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
            Aviso Legal
          </h1>
          <p className="text-sky-50">
            Última actualización: 24 de abril de 2026
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
          <h2>1. Datos identificativos del titular</h2>
          <p>
            En cumplimiento de lo establecido en la Ley 34/2002, de 11 de
            julio, de Servicios de la Sociedad de la Información y de Comercio
            Electrónico (LSSI-CE), se informa de los siguientes datos del
            titular del sitio web:
          </p>
          <ul>
            <li>
              <strong>Titular</strong>: SKYWARD PARTNERS, S.L.
            </li>
            <li>
              <strong>NIF</strong>: B26629576
            </li>
            <li>
              <strong>Domicilio</strong>: Calle Castelló 117, 28006 Madrid,
              España
            </li>
            <li>
              <strong>Correo electrónico</strong>: contacto@exploraspain.com
            </li>
            <li>
              <strong>Sitio web</strong>: https://exploraspain.com
            </li>
            <li>
              <strong>Actividad</strong>: comercialización de tours y
              actividades turísticas en España y publicación de contenido
              editorial sobre viajes y turismo, incluyendo enlaces de
              afiliación a plataformas de terceros.
            </li>
          </ul>

          <h2>2. Objeto y ámbito de aplicación</h2>
          <p>
            El presente aviso legal regula el uso del sitio web{" "}
            <strong>exploraspain.com</strong> (en adelante, «el sitio web»), que
            el titular pone a disposición de los usuarios con el fin de ofrecer
            contenido informativo y editorial sobre viajes por España, así como
            la comercialización de tours y actividades turísticas, y enlaces a
            productos y servicios turísticos de terceros.
          </p>
          <p>
            El acceso y uso del sitio web atribuye la condición de usuario e
            implica la aceptación plena de las condiciones incluidas en este
            aviso legal, así como de la{" "}
            <Link href="/privacidad">Política de Privacidad</Link> y de la{" "}
            <Link href="/cookies">Política de Cookies</Link>.
          </p>

          <h2>3. Condiciones de uso</h2>
          <p>
            El usuario se compromete a hacer un uso adecuado y lícito del sitio
            web, de conformidad con la legislación aplicable, el presente aviso
            legal, la moral y el orden público.
          </p>
          <p>Queda prohibido:</p>
          <ul>
            <li>
              Utilizar el sitio web con fines ilícitos o que puedan dañar los
              intereses del titular o de terceros.
            </li>
            <li>
              Introducir virus informáticos, archivos defectuosos o cualquier
              otro programa que pueda causar daños al sitio web o a los
              sistemas del titular o de terceros.
            </li>
            <li>
              Realizar actividades que supongan un uso abusivo del sitio web,
              como el scraping masivo, la recopilación automatizada de datos o
              la reproducción no autorizada de contenidos.
            </li>
            <li>
              Suplantar la identidad del titular o de cualquier otro usuario.
            </li>
          </ul>

          <h2>4. Propiedad intelectual e industrial</h2>
          <p>
            Todos los contenidos del sitio web (textos, imágenes, gráficos,
            diseños, código fuente, logotipos, marcas y demás elementos) son
            titularidad de SKYWARD PARTNERS, S.L. o de terceros que han
            autorizado su uso, y están protegidos por la normativa española e
            internacional de propiedad intelectual e industrial.
          </p>
          <p>
            Queda expresamente prohibida la reproducción, distribución,
            comunicación pública, transformación o cualquier otra forma de
            explotación de los contenidos sin autorización previa y expresa del
            titular, salvo para uso personal y privado del usuario.
          </p>
          <p>
            Se permite citar breves fragmentos del contenido con fines
            informativos o educativos, siempre que se indique la fuente y se
            enlace al sitio web original.
          </p>

          <h2>5. Enlaces de afiliación y a terceros</h2>
          <p>
            El sitio web incluye enlaces a plataformas de terceros, entre ellas
            enlaces de afiliación (por ejemplo, a Viator, GetYourGuide o
            similares). Cuando un usuario realiza una compra o reserva a través
            de estos enlaces, el titular puede recibir una comisión, sin que
            ello suponga ningún coste adicional para el usuario.
          </p>
          <p>
            El titular no se hace responsable del contenido, las prácticas
            comerciales, la política de privacidad ni las condiciones de uso de
            los sitios web enlazados. El acceso a dichos sitios se realiza bajo
            la responsabilidad del usuario.
          </p>

          <h2>6. Exclusión de garantías y responsabilidad</h2>
          <p>
            El titular realiza los mayores esfuerzos para que la información
            publicada en el sitio web sea veraz, actualizada y de calidad. No
            obstante, no garantiza la exactitud, completitud o actualidad de
            toda la información, especialmente en lo referente a precios,
            horarios, disponibilidad o condiciones de productos y servicios de
            terceros.
          </p>
          <p>
            El usuario acepta que la información publicada tiene carácter
            orientativo y debe verificarse en las fuentes oficiales antes de
            tomar decisiones de viaje o reserva. El titular no se hace
            responsable de los daños o perjuicios derivados del uso de la
            información contenida en el sitio web.
          </p>
          <p>
            El titular no garantiza la disponibilidad continua del sitio web y
            se reserva el derecho de suspender, interrumpir o modificar el
            acceso al mismo por motivos técnicos, de mantenimiento o cualquier
            otra causa justificada.
          </p>

          <h2>7. Modificación del aviso legal</h2>
          <p>
            El titular se reserva el derecho de modificar el presente aviso
            legal en cualquier momento, con el fin de adaptarlo a cambios
            legislativos, operativos o de cualquier otra naturaleza. La versión
            vigente será siempre la publicada en esta página.
          </p>

          <h2>8. Legislación aplicable y jurisdicción</h2>
          <p>
            El presente aviso legal se rige por la legislación española. Para
            la resolución de cualquier conflicto derivado del acceso o uso del
            sitio web, las partes se someten a los juzgados y tribunales del
            domicilio del titular, salvo que la normativa aplicable establezca
            otra cosa por la condición de consumidor del usuario.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para cualquier consulta relacionada con este aviso legal, puede
            contactar a través de{" "}
            <Link href="/contacto">la página de contacto</Link> o escribiendo a{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>
            .
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            ← Volver a la portada
          </Link>
        </div>
      </article>
    </main>
  );
}
