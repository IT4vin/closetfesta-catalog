import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "@/data/catalog/product";
import { CatalogImage } from "@/components/CatalogImage";
import { formatSizeRange, productColorHex } from "@/lib/featuredProducts";
import { isGenericVestidosCategory, productDisplayName } from "@/lib/productDisplay";

type LuxeProductCardProps = {
  product: Product;
  index?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

export function LuxeProductCard({
  product,
  index = 0,
  isFavorite = false,
  onToggleFavorite,
}: LuxeProductCardProps) {
  const catLabel = isGenericVestidosCategory(product.categoriaTipo)
    ? (product.tipos[0] ?? "Vestidos")
    : product.categoriaTipo;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(122,46,58,0.35)]"
    >
      <Link to={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <CatalogImage
            src={product.imagem}
            alt={productDisplayName(product.nome)}
            className="h-full w-full object-cover transition-transform duration-[900ms] lg:object-contain group-hover:scale-[1.05]"
          />
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label="Favoritar"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-marsala backdrop-blur transition hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-marsala" : ""}`} />
        </button>
      )}

      <div className="p-5 lg:p-4 xl:p-5">
        <p className="text-[10px] uppercase tracking-[0.3em] text-warm-gray">{catLabel}</p>
        <Link to={`/produto/${product.slug}`}>
          <h3 className="mt-2 font-display text-lg text-marsala transition hover:text-marsala-dark md:text-xl">
            {productDisplayName(product.nome)}
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-gray">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: productColorHex(product.cor) }}
            />
            {product.cor}
          </span>
          <span>Tam. {formatSizeRange(product.tamanhos)}</span>
        </div>
        <Link
          to={`/produto/${product.slug}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-marsala px-5 py-3 text-xs font-medium tracking-wide text-primary-foreground transition hover:bg-marsala-dark"
        >
          Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
