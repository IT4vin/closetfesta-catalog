import { cn } from "@/lib/utils";

type CatalogImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Primeira imagem acima da dobra (LCP). */
  priority?: boolean;
};

/**
 * Imagem de catálogo com lazy loading, decoding assíncrono e dimensões implícitas via aspect no pai.
 */
export function CatalogImage({ src, alt, className, priority = false }: CatalogImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
