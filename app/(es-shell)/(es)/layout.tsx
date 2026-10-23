/**
 * Capa sin UI bajo el layout raíz ES. Existe solo para que
 * `not-found.tsx` quede DENTRO de `(es-shell)/layout.tsx` (con <html lang="es">,
 * navbar y footer): un not-found al mismo nivel que un layout raíz se
 * renderiza sin ese layout.
 */
export default function EsSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
