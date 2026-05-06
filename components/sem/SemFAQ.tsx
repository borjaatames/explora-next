'use client';

import { useState } from 'react';
import type { SemFAQ as SemFAQItem } from '@/lib/sem/types';

type Props = {
  titulo: string;
  items: SemFAQItem[];
};

export default function SemFAQ({ titulo, items }: Props) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-playfair text-xl font-medium text-stone-900 sm:text-2xl">
          {titulo}
        </h2>

        <ul className="mt-6 space-y-2">
          {items.map((faq) => (
            <FAQItem
              key={faq.pregunta}
              pregunta={faq.pregunta}
              respuesta={faq.respuesta}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FAQItem({
  pregunta,
  respuesta,
}: {
  pregunta: string;
  respuesta: string;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <li className="overflow-hidden rounded-md border border-stone-200 border-l-4 border-l-amber-400 bg-white">
      <button
        type="button"
        onClick={() => setAbierto((s) => !s)}
        aria-expanded={abierto}
        className="flex w-full items-center justify-between gap-4 p-4 text-left focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
      >
        <span className="text-sm font-medium text-stone-900 sm:text-base">
          {pregunta}
        </span>
        <ChevronIcon abierto={abierto} />
      </button>

      {abierto && (
        <div className="border-t border-stone-200 p-4 text-sm leading-relaxed text-stone-700 sm:text-base">
          {respuesta}
        </div>
      )}
    </li>
  );
}

function ChevronIcon({ abierto }: { abierto: boolean }) {
  return (
    <svg
      className={`h-5 w-5 flex-shrink-0 text-amber-700 transition-transform duration-200 ${
        abierto ? 'rotate-180' : ''
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
