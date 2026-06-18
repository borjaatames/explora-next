"use client";

import { useState, type FormEvent } from "react";
import type { Idioma } from "@/lib/i18n/types";

/**
 * Formulario de contacto. Envía a Web3Forms (https://web3forms.com): no
 * requiere backend propio ni guardar secretos sensibles en el repo — solo
 * una "access key" pública ligada al email de destino, en
 * NEXT_PUBLIC_WEB3FORMS_KEY.
 *
 * Si la clave no está configurada, se hace fallback al email (mailto) para
 * que la página nunca quede sin vía de contacto.
 *
 * Antispam: honeypot `botcheck` (campo oculto que solo rellenan los bots).
 */

const T = {
  es: {
    nombre: "Nombre",
    email: "Tu correo",
    mensaje: "Mensaje",
    enviar: "Enviar mensaje",
    enviando: "Enviando…",
    ok: "¡Gracias! Hemos recibido tu mensaje. Te responderemos en 2-3 días laborables.",
    error: "No se ha podido enviar. Inténtalo de nuevo o escríbenos a contacto@exploraspain.com.",
    subject: "Nuevo mensaje desde ExploraSpain",
    sinConfig: "Escríbenos directamente a:",
  },
  en: {
    nombre: "Name",
    email: "Your email",
    mensaje: "Message",
    enviar: "Send message",
    enviando: "Sending…",
    ok: "Thanks! We've received your message and will reply within 2-3 business days.",
    error: "Couldn't send. Please try again or email us at contacto@exploraspain.com.",
    subject: "New message from ExploraSpain",
    sinConfig: "Email us directly at:",
  },
} as const;

type Estado = "idle" | "sending" | "ok" | "error";

export default function ContactForm({ idioma }: { idioma: Idioma }) {
  const t = T[idioma === "en" ? "en" : "es"];
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  const [estado, setEstado] = useState<Estado>("idle");

  // Sin clave configurada: fallback a email para no dejar la página sin
  // vía de contacto.
  if (!accessKey) {
    return (
      <div>
        <p className="text-slate-700 mb-4">{t.sinConfig}</p>
        <a
          href="mailto:contacto@exploraspain.com"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          contacto@exploraspain.com
        </a>
      </div>
    );
  }

  if (estado === "ok") {
    return (
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 text-slate-800">
        {t.ok}
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.append("access_key", accessKey as string);
    fd.append("subject", t.subject);
    fd.append("from_name", "ExploraSpain");
    setEstado("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        form.reset();
        setEstado("ok");
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot antispam: oculto a humanos, lo rellenan los bots. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder={t.nombre} className={inputCls} />
        <input
          type="email"
          name="email"
          required
          placeholder={t.email}
          className={inputCls}
        />
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder={t.mensaje}
        className={inputCls}
      />

      <button
        type="submit"
        disabled={estado === "sending"}
        className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        {estado === "sending" ? t.enviando : t.enviar}
      </button>

      {estado === "error" && (
        <p className="text-sm text-rose-600">{t.error}</p>
      )}
    </form>
  );
}
