import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad | ExploraSpain",
  description:
    "Información sobre el tratamiento de datos personales en ExploraSpain conforme al RGPD y la LOPDGDD.",
  robots: {
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  alternates: {
    canonical: "https://exploraspain.com/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
            Política de Privacidad
          </h1>
          <p className="text-sky-50">
            Última actualización: 24 de abril de 2026
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
          <p className="text-xl leading-relaxed text-slate-700">
            En ExploraSpain nos tomamos en serio tu privacidad. Esta política
            explica qué datos tratamos, con qué finalidad, y qué derechos
            tienes, conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley
            Orgánica 3/2018 de Protección de Datos (LOPDGDD).
          </p>

          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>
              <strong>Responsable</strong>: SKYWARD PARTNERS, S.L.
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
          </ul>

          <h2>2. Qué datos tratamos</h2>
          <p>
            En función de tu interacción con el sitio web, podemos tratar los
            siguientes datos:
          </p>
          <ul>
            <li>
              <strong>Datos de contacto</strong>: cuando nos escribes por
              correo electrónico, tratamos los datos que decidas proporcionar
              voluntariamente (nombre, email, contenido del mensaje).
            </li>
            <li>
              <strong>Datos de navegación</strong>: al visitar el sitio, se
              recogen datos técnicos como dirección IP, tipo de navegador,
              sistema operativo, páginas visitadas, tiempo de permanencia y
              referente, mediante cookies y herramientas de análisis, si las
              aceptas.
            </li>
          </ul>
          <p>
            <strong>
              El sitio web no dispone actualmente de registro de usuarios,
              formulario de compra ni suscripción a newsletter.
            </strong>{" "}
            Si estas funcionalidades se añaden en el futuro, esta política se
            actualizará en consecuencia.
          </p>

          <h2>3. Finalidad y base legal del tratamiento</h2>
          <ul>
            <li>
              <strong>Responder a tus consultas</strong>: cuando nos escribes,
              usamos tu email y los datos del mensaje únicamente para
              responderte. Base legal: consentimiento del usuario al enviar el
              mensaje.
            </li>
            <li>
              <strong>Análisis de uso del sitio</strong>: para entender cómo se
              usa el sitio y mejorar el contenido. Base legal: consentimiento
              otorgado a través del banner de cookies.
            </li>
            <li>
              <strong>Cumplimiento de obligaciones legales</strong>: para
              cumplir con la normativa aplicable cuando proceda. Base legal:
              obligación legal.
            </li>
          </ul>

          <h2>4. Plazo de conservación</h2>
          <p>
            Los datos de contacto se conservan durante el tiempo necesario para
            gestionar tu consulta y, posteriormente, durante el plazo legal
            aplicable para atender posibles responsabilidades.
          </p>
          <p>
            Los datos de navegación se conservan durante el plazo establecido
            en la política de cookies para cada herramienta.
          </p>

          <h2>5. Destinatarios y transferencias internacionales</h2>
          <p>
            Tus datos no se comunican a terceros salvo obligación legal. No
            obstante, el sitio web utiliza servicios de proveedores que pueden
            tener acceso a datos de navegación en calidad de encargados del
            tratamiento:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong> (EE.UU.): alojamiento del sitio web.
              Transferencia amparada por las cláusulas contractuales tipo de la
              Comisión Europea.
            </li>
            <li>
              <strong>Google LLC</strong> (EE.UU.): analítica web, en caso de
              que aceptes las cookies de análisis. Transferencia amparada por
              el marco Data Privacy Framework.
            </li>
            <li>
              <strong>Plataformas de afiliación</strong> (Viator, GetYourGuide
              u otras): al hacer clic en un enlace de afiliación, serás
              redirigido a su sitio web, que aplicará su propia política de
              privacidad.
            </li>
          </ul>

          <h2>6. Tus derechos</h2>
          <p>
            Como titular de los datos, tienes los siguientes derechos,
            reconocidos por el RGPD y la LOPDGDD:
          </p>
          <ul>
            <li>
              <strong>Acceso</strong>: saber qué datos tratamos sobre ti.
            </li>
            <li>
              <strong>Rectificación</strong>: corregir datos inexactos o
              incompletos.
            </li>
            <li>
              <strong>Supresión</strong> («derecho al olvido»): solicitar que
              eliminemos tus datos cuando ya no sean necesarios.
            </li>
            <li>
              <strong>Oposición</strong>: oponerte a determinados tratamientos.
            </li>
            <li>
              <strong>Limitación</strong>: pedir que restrinjamos el
              tratamiento en ciertos casos.
            </li>
            <li>
              <strong>Portabilidad</strong>: recibir tus datos en un formato
              estructurado y transferirlos a otro responsable.
            </li>
            <li>
              <strong>Retirar el consentimiento</strong> en cualquier momento,
              sin que ello afecte a la licitud del tratamiento previo.
            </li>
          </ul>
          <p>
            Para ejercer estos derechos, escríbenos a{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            indicando el derecho que deseas ejercer y, si es necesario,
            acreditando tu identidad.
          </p>
          <p>
            Si consideras que el tratamiento de tus datos no se ajusta a la
            normativa, puedes presentar una reclamación ante la{" "}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agencia Española de Protección de Datos (AEPD)
            </a>
            .
          </p>

          <h2>7. Medidas de seguridad</h2>
          <p>
            Aplicamos las medidas técnicas y organizativas razonables para
            proteger tus datos frente a accesos no autorizados, pérdida o
            destrucción. El sitio web utiliza conexión cifrada (HTTPS) y los
            servicios contratados cuentan con medidas de seguridad estándar del
            sector.
          </p>

          <h2>8. Modificaciones de esta política</h2>
          <p>
            Esta política puede actualizarse para reflejar cambios
            legislativos, operativos o de servicio. La versión vigente será
            siempre la publicada en esta página, con la fecha de última
            actualización indicada al inicio.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para cualquier consulta sobre privacidad, escríbenos a{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            o a través de la{" "}
            <Link href="/contacto">página de contacto</Link>.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sky-600 hover:text-sky-700 font-semibold"
          >
            ← Volver a la portada
          </Link>
        </div>
      </article>
    </main>
  );
}
