import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: { lang: string } };

export const dynamicParams = false;

export function generateStaticParams(): { lang: string }[] {
  return [{ lang: "en" }];
}

export const metadata: Metadata = {
  title: "Booking terms",
  description:
    "Terms for direct bookings on ExploraSpain: price, payment, confirmation, cancellation, refunds, changes and complaints.",
  robots: {
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  alternates: {
    canonical: "https://www.exploraspain.com/en/booking-terms",
    languages: {
      es: "https://www.exploraspain.com/condiciones",
      en: "https://www.exploraspain.com/en/booking-terms",
      "x-default": "https://www.exploraspain.com/condiciones",
    },
  },
};

export default function BookingTermsPage({ params }: Props) {
  if (params.lang !== "en") notFound();
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-anil-500 text-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-2">Booking terms</h1>
          <p className="text-anil-50">Last updated: 30 October 2026</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-fraunces prose-headings:text-piedra-900 prose-a:text-anil-600">
          <h2>1. Who sells and who provides the service</h2>
          <p>
            For activities marked as <strong>direct booking</strong> (with a calendar and payment on
            exploraspain.com), the booking is handled by <strong>SKYWARD PARTNERS, S.L.</strong> (tax ID B26629576,
            Calle Castelló 117, 28006 Madrid, Spain), owner of ExploraSpain. The activity is provided by the{" "}
            <strong>local operator</strong> named in your confirmation, who is responsible for running it.
          </p>
          <p>
            For all other activities, the booking is completed on GetYourGuide and is subject to its terms.
            ExploraSpain acts as an affiliate.
          </p>

          <h2>2. Price and payment</h2>
          <ul>
            <li>Prices are shown in euros, taxes included.</li>
            <li>
              Some activities are sold <strong>per group</strong> and others <strong>per person</strong>; the activity
              page and the calendar show which, and the total, before you pay.
            </li>
            <li>
              Payment is by card through Bókun&apos;s secure gateway. ExploraSpain never sees or stores your card
              details.
            </li>
          </ul>

          <h2>3. Confirmation</h2>
          <p>
            After payment you&apos;ll receive a confirmation email with the activity details, the meeting point or
            pickup and the operator&apos;s contact. If it doesn&apos;t arrive within a few minutes, check your spam
            folder or contact us.
          </p>

          <h2>4. Cancellation by you</h2>
          <ul>
            <li>
              Each activity has its own policy, shown on the activity page and in the calendar before you pay. For
              most, <strong>cancellation is free up to 24 hours before</strong> the start, with a full refund; within
              that period there is no refund.
            </li>
            <li>
              To cancel, use the link in your confirmation email or write to us through the{" "}
              <Link href="/en/contact">contact form</Link> or WhatsApp with your booking number.
            </li>
          </ul>

          <h2>5. Refunds</h2>
          <p>
            Where applicable, refunds are made to the same payment method within 14 calendar days at most. How
            long it takes to show in your account depends on your bank.
          </p>

          <h2>6. Right of withdrawal</h2>
          <p>
            Leisure activities for a specific date and time are excluded from the 14-day right of withdrawal
            (article 103(l) of the Spanish consolidated General Law for the Protection of Consumers and Users). You
            can cancel under each activity&apos;s policy (section 4).
          </p>

          <h2>7. Changes and cancellations by the operator</h2>
          <ul>
            <li>
              If the operator cancels the activity (for example due to bad weather, the monument closing or a
              minimum number of participants not being reached), we&apos;ll offer you{" "}
              <strong>another date or a full refund</strong>, as you prefer.
            </li>
            <li>
              If there&apos;s a significant change (time, meeting point, language), we&apos;ll let you know as soon as
              we know and you can cancel free of charge if it doesn&apos;t suit you.
            </li>
          </ul>

          <h2>8. Date changes at your request</h2>
          <p>
            Contact us as early as possible. We&apos;ll try to arrange the change with the operator subject to
            availability; if it isn&apos;t possible, the activity&apos;s cancellation policy applies.
          </p>

          <h2>9. Punctuality and no-shows</h2>
          <p>
            If you don&apos;t show up, or arrive late and the activity has already left, there is no refund. For
            activities with pickup, bear in mind the driver waits for a limited time.
          </p>

          <h2>10. Travellers&apos; details</h2>
          <p>
            Some tickets are issued in each visitor&apos;s name (for example, the Royal Alcázar of Seville or the
            Alhambra) and require each person&apos;s name and ID when booking. Data is handled under our{" "}
            <Link href="/en/privacy">privacy policy</Link>.
          </p>

          <h2>11. Complaints</h2>
          <p>
            For any problem, email <a href="mailto:contacto@exploraspain.com">contacto@exploraspain.com</a> and
            we&apos;ll reply as soon as possible. These terms are governed by Spanish law; if you are a consumer, you
            may bring a claim before the courts of your place of residence.
          </p>
        </div>
      </article>
    </main>
  );
}
