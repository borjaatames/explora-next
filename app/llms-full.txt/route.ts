import { generarLlmsFullTxt } from "@/lib/llms";

/** /llms-full.txt: respuesta corta de cada guía, para asistentes de IA. */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(generarLlmsFullTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
