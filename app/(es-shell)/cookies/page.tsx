import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies | ExploraSpain",
  description:
    "Información sobre el uso de cookies en ExploraSpain, tipos de cookies utilizadas y cómo gestionarlas.",
  robots: {
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  alternates: {
    canonical: "https://exploraspain.com/cookies",
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-sky-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">
            Política de Cookies
          </h1>
          <p className="text-sky-50">
            Última actualización: 24 de abril de 2026
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-slate-900 prose-a:text-sky-600">
          <h2>1. Qué son las cookies</h2>
          <p>
            Una cookie es un pequeño fichero de texto que un sitio web guarda
            en tu navegador cuando lo visitas. Las cookies permiten que el
            sitio recuerde información sobre tu visita, como el idioma
            preferido o datos de navegación, lo que puede mejorar la
            experiencia de uso y ayudar al titular a entender cómo se utiliza
            el sitio.
          </p>
          <p>
            Esta política explica qué cookies utiliza{" "}
            <strong>exploraspain.com</strong>, con qué finalidad, y cómo puedes
            gestionarlas, conforme al artículo 22.2 de la Ley 34/2002 (LSSI-CE)
            y la Guía sobre el uso de cookies de la{" "}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agencia Española de Protección de Datos
            </a>
            .
          </p>

          <h2>2. Tipos de cookies según su finalidad</h2>
          <ul>
            <li>
              <strong>Cookies técnicas (estrictamente necesarias)</strong>:
              permiten el funcionamiento básico del sitio web (navegación,
              acceso a secciones, seguridad). No requieren consentimiento.
            </li>
            <li>
              <strong>Cookies de análisis o medición</strong>: permiten
              analizar el comportamiento de los usuarios de forma agregada
              (páginas visitadas, tiempo de permanencia, etc.) para mejorar el
              sitio. Requieren consentimiento.
            </li>
            <li>
              <strong>Cookies de publicidad comportamental</strong>: permiten
              mostrar anuncios personalizados en función del perfil del
              usuario. Requieren consentimiento. Actualmente{" "}
              <strong>
                este sitio no utiliza cookies de publicidad comportamental
              </strong>
              .
            </li>
          </ul>

          <h2>3. Cookies utilizadas en este sitio</h2>
          <p>
            A continuación se detallan las cookies que este sitio web utiliza
            actualmente:
          </p>

          <div className="not-prose my-8 overflow-x-auto">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Cookie
                  </th>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Tipo
                  </th>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Finalidad
                  </th>
                  <th className="text-left p-3 font-semibold text-slate-900 border-b border-slate-200">
                    Duración
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-3 font-mono text-xs">__vercel_live_token</td>
                  <td className="p-3">Técnica</td>
                  <td className="p-3">
                    Gestión del despliegue y funcionamiento del sitio (Vercel).
                  </td>
                  <td className="p-3">Sesión</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">
                    exploraspain_cookie_consent
                  </td>
                  <td className="p-3">Técnica</td>
                  <td className="p-3">
                    Recordar tu decisión sobre el uso de cookies en este sitio.
                  </td>
                  <td className="p-3">12 meses</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-slate-600 italic">
            Esta tabla se actualizará cuando se incorporen herramientas
            adicionales de analítica o medición. Cuando se active Google
            Analytics 4, se añadirán las cookies correspondientes (_ga, _ga_*)
            y se solicitará el consentimiento previo antes de su activación.
          </p>

          <h2>4. Cookies de terceros en enlaces salientes</h2>
          <p>
            El sitio contiene enlaces a plataformas externas (Viator,
            GetYourGuide u otras). Al hacer clic en estos enlaces, serás
            redirigido a sus sitios web, que utilizan sus propias cookies y
            aplican sus propias políticas de privacidad y cookies. El titular
            de este sitio no controla ni se hace responsable del uso que dichas
            plataformas hagan de las cookies en sus propios dominios.
          </p>

          <h2>5. Cómo gestionar las cookies</h2>
          <p>
            Puedes aceptar, rechazar o personalizar el uso de cookies en este
            sitio a través del banner de consentimiento que aparece en tu
            primera visita. Podrás modificar tu elección en cualquier momento.
          </p>
          <p>
            Además, puedes configurar tu navegador para aceptar, rechazar o
            eliminar las cookies. Consulta las instrucciones en tu navegador:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/es-es/microsoft-edge"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
          <p>
            Ten en cuenta que desactivar algunas cookies puede afectar al
            funcionamiento del sitio web.
          </p>

          <h2>6. Actualizaciones de la política</h2>
          <p>
            Esta política de cookies puede actualizarse si cambian las cookies
            utilizadas o la normativa aplicable. La versión vigente será
            siempre la publicada en esta página, con la fecha de última
            actualización al inicio.
          </p>

          <h2>7. Más información</h2>
          <p>
            Para consultas sobre esta política de cookies, escríbenos a{" "}
            <a href="mailto:contacto@exploraspain.com">
              contacto@exploraspain.com
            </a>{" "}
            o a través de la{" "}
            <Link href="/contacto">página de contacto</Link>.
          </p>
          <p>
            Para más información sobre el tratamiento de tus datos personales,
            consulta la{" "}
            <Link href="/privacidad">Política de Privacidad</Link>.
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
