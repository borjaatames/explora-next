"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export type OpcionDestino = {
  nombre: string;
  url: string;
};

type Props = {
  opciones: ReadonlyArray<OpcionDestino>;
  urlTodos: string;
  etiqueta: string;
  placeholder: string;
  boton: string;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Buscador del hero de la home. Sugiere destinos con un <datalist> nativo
 * (accesible y sin dependencias) y navega a la página de actividades de la
 * ciudad elegida. Si el texto no coincide con ningún destino, lleva al
 * índice de ciudades para no dejar al usuario sin respuesta.
 */
export default function BuscadorDestino({
  opciones,
  urlTodos,
  etiqueta,
  placeholder,
  boton,
}: Props) {
  const router = useRouter();
  const [valor, setValor] = useState("");
  const idInput = useId();
  const idLista = useId();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = normalizar(valor);
    if (!q) {
      router.push(urlTodos);
      return;
    }
    const exacta = opciones.find((o) => normalizar(o.nombre) === q);
    const parcial = opciones.find((o) => normalizar(o.nombre).startsWith(q));
    router.push((exacta ?? parcial)?.url ?? urlTodos);
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="flex flex-col sm:flex-row gap-2 bg-white rounded-xl p-2 shadow-md w-full max-w-2xl"
    >
      <label
        htmlFor={idInput}
        className="flex-1 flex flex-col justify-center px-3 py-1.5 text-left"
      >
        <span className="text-xs font-semibold text-slate-500">{etiqueta}</span>
        <input
          id={idInput}
          list={idLista}
          type="text"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full border-0 p-0 py-0.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 bg-transparent"
        />
        <datalist id={idLista}>
          {opciones.map((o) => (
            <option key={o.url} value={o.nombre} />
          ))}
        </datalist>
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-7 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        {boton}
      </button>
    </form>
  );
}
