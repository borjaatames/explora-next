import { generarLlmsTxt } from "@/lib/llms";

/** /llms.txt: índice para asistentes de IA. Se genera en cada build. */
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(generarLlmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
