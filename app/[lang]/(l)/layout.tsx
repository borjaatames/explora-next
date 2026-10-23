/**
 * Capa sin UI bajo el layout raíz de idioma. Existe solo para que
 * `not-found.tsx` quede DENTRO de `[lang]/layout.tsx` (con <html lang> del idioma,
 * navbar y footer): un not-found al mismo nivel que un layout raíz se
 * renderiza sin ese layout.
 */
export default function LangSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
