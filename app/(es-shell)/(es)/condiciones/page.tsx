import type { Metadata } from "next";
import Link from "next/link";

// Aprobadas por Borja el 30-10-2026.
export const metadata: Metadata = {
  title: "Condiciones de reserva",
  description:
    "Condiciones de las reservas directas en ExploraSpain: precio, pago, confirmación, cancelación, reembolsos, cambios y reclamaciones.",
  robots: {
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  alternates: {
    canonical: "https://www.exploraspain.com/condiciones",
    languages: {
      es: "https://www.exploraspain.com/condiciones",
      en: "https://www.exploraspain.com/en/booking-terms",
      "x-default": "https://www.exploraspain.com/condiciones",
    },
  },
};

export default function CondicionesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-2">Condiciones de reserva</h1>
          <p className="text-anil-50">Última actualización: 30 de octubre de 2026</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-fraunces prose-headings:text-piedra-900 prose-a:text-anil-600">
          <h2>1. Quién vende y quién presta el servicio</h2>
          <p>
            En las actividades marcadas como <strong>reserva directa</strong> (con calendario y pago en
            exploraspain.com), la reserva la gestiona <strong>SKYWARD PARTNERS, S.L.</strong> (NIF B26629576,
            Calle Castelló 117, 28006 Madrid), titular de ExploraSpain. La actividad la presta el{" "}
            <strong>operador local</strong> indicado en la confirmación, que es responsable de su ejecución.
          </p>
          <p>
            En el resto de actividades, la reserva se completa en GetYourGuide y se rige por sus condiciones.
            ExploraSpain actúa como afiliado.
          </p>

          <h2>2. Precio y pago</h2>
          <ul>
            <li>Los precios se muestran en euros, con impuestos incluidos.</li>
            <li>
              Algunas actividades se venden <strong>por grupo</strong> y otras <strong>por persona</strong>; la ficha y el
              calendario indican cuál es el caso y el total antes de pagar.
            </li>
            <li>
              El pago se hace con tarjeta en la pasarela segura de Bókun. ExploraSpain no ve ni guarda los datos de
              tu tarjeta.
            </li>
          </ul>

          <h2>3. Confirmación</h2>
          <p>
            Tras el pago recibirás un email de confirmación con los datos de la actividad, el punto de encuentro o
            la recogida y el contacto del operador. Si no lo recibes en unos minutos, revisa la carpeta de correo no
            deseado o escríbenos.
          </p>

          <h2>4. Cancelación por tu parte</h2>
          <ul>
            <li>
              Cada actividad tiene su propia política, que se muestra en la ficha y en el calendario antes de pagar.
              En la mayoría, la <strong>cancelación es gratuita hasta 24 horas antes</strong> del inicio, con
              reembolso íntegro; dentro de ese plazo no hay reembolso.
            </li>
            <li>
              Para cancelar, usa el enlace del email de confirmación o escríbenos por{" "}
              <Link href="/contacto">el formulario de contacto</Link> o WhatsApp indicando tu número de reserva.
            </li>
          </ul>

          <h2>5. Reembolsos</h2>
          <p>
            Cuando proceda, el reembolso se hace al mismo medio de pago en un plazo máximo de 14 días naturales.
            El tiempo que tarde en aparecer en tu cuenta depende de tu banco.
          </p>

          <h2>6. Derecho de desistimiento</h2>
          <p>
            Las actividades de ocio con fecha y hora determinadas están excluidas del derecho de desistimiento de
            14 días (artículo 103, letra l, del texto refundido de la Ley General para la Defensa de los
            Consumidores y Usuarios). Puedes cancelar según la política de cada actividad (apartado 4).
          </p>

          <h2>7. Cambios y cancelaciones del operador</h2>
          <ul>
            <li>
              Si el operador cancela la actividad (por ejemplo, por mal tiempo, cierre del monumento o falta de
              mínimo de participantes), te ofreceremos <strong>otra fecha o el reembolso íntegro</strong>, a tu
              elección.
            </li>
            <li>
              Si hay un cambio importante (hora, punto de encuentro, idioma), te avisaremos en cuanto lo sepamos y
              podrás cancelar sin coste si no te encaja.
            </li>
          </ul>

          <h2>8. Cambios de fecha a petición tuya</h2>
          <p>
            Escríbenos con la mayor antelación posible. Intentaremos el cambio con el operador según su
            disponibilidad; si no es posible, se aplica la política de cancelación de la actividad.
          </p>

          <h2>9. Puntualidad y no presentación</h2>
          <p>
            Si no te presentas o llegas tarde y la actividad ya ha salido, no hay reembolso. En las actividades con
            recogida, ten en cuenta que el conductor espera un tiempo limitado.
          </p>

          <h2>10. Datos de los viajeros</h2>
          <p>
            Algunas entradas son nominativas (por ejemplo, el Real Alcázar de Sevilla o la Alhambra) y piden el
            nombre y el documento de cada persona al reservar. Los datos se tratan según nuestra{" "}
            <Link href="/privacidad">política de privacidad</Link>.
          </p>

          <h2>11. Reclamaciones</h2>
          <p>
            Para cualquier problema escríbenos a <a href="mailto:contacto@exploraspain.com">contacto@exploraspain.com</a>{" "}
            y te responderemos lo antes posible. Estas condiciones se rigen por la legislación española; si eres
            consumidor, puedes reclamar ante los tribunales de tu domicilio.
          </p>
        </div>
      </article>
    </main>
  );
}
