type Props = { n: number; etiqueta: string; className?: string };

export default function Estrellas({ n, etiqueta, className = "text-azafran-500" }: Props) {
  return (
    <span className={className} role="img" aria-label={etiqueta}>
      {"★".repeat(n)}
    </span>
  );
}
