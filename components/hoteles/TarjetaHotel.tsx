import Image from "next/image";
import Link from "next/link";
import type { Hotel } from "@/lib/hoteles";
import { urlFotoHotel } from "@/lib/hoteles";
import Estrellas from "@/components/hoteles/Estrellas";
import type { TextosHoteles } from "@/components/hoteles/textos";

type Props = { hotel: Hotel; t: TextosHoteles };

export default function TarjetaHotel({ hotel, t }: Props) {
  const foto = hotel.fotos[0];
  const etiquetas = hotel.etiquetas.slice(0, 2);
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-piedra-200 bg-white transition-all hover:border-anil-400 hover:shadow-md sm:flex-row">
      <Link href={hotel.url} className="relative block aspect-[16/9] shrink-0 sm:aspect-auto sm:w-56" tabIndex={-1} aria-hidden="true">
        {foto ? (
          <Image src={urlFotoHotel(foto.src)} alt="" fill sizes="(min-width: 640px) 224px, 100vw" className="object-cover" />
        ) : (
          <span className="block h-full w-full bg-piedra-100" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 text-sm text-piedra-600">
          <Estrellas n={hotel.estrellas} etiqueta={t.estrellas(hotel.estrellas)} />
          <span>{hotel.lugar}</span>
        </div>
        <h3 className="font-fraunces text-xl font-bold text-piedra-900 transition-colors group-hover:text-anil-700">
          <Link href={hotel.url} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2 rounded">
            {hotel.nombre}
          </Link>
        </h3>
        <p className="mt-2 text-piedra-700 leading-relaxed">{hotel.resumen}</p>
        {etiquetas.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {etiquetas.map((e) => (
              <li key={e} className="rounded bg-anil-50 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-anil-700">
                {t.etiquetas[e]}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3 text-sm text-piedra-600">
          <span className="font-semibold text-piedra-900">{t.idealPara}:</span> {hotel.idealPara}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 sm:mt-auto sm:pt-4">
          <Link
            href={hotel.url}
            className="inline-flex items-center justify-center rounded-lg bg-anil-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-anil-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anil-500 focus-visible:ring-offset-2"
          >
            {t.verFicha}
          </Link>
          <a
            href={hotel.urlReserva}
            target="_blank"
            rel="sponsored nofollow noopener"
            data-reserva="listado"
            className="text-sm font-semibold text-anil-600 transition-colors hover:text-anil-700"
          >
            {t.verPrecios} →
          </a>
        </div>
      </div>
    </article>
  );
}
