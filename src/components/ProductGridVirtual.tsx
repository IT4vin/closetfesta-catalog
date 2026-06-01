import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FixedSizeGrid as Grid, type GridChildComponentProps } from "react-window";
import { Heart } from "lucide-react";
import type { Product } from "@/data/catalog/product";
import { CatalogImage } from "@/components/CatalogImage";
import HighlightedText from "@/components/HighlightedText";
import { isGenericVestidosCategory, productDisplayName } from "@/lib/productDisplay";

const COLUMN_COUNT = 2;
const ROW_HEIGHT = 312;
const GRID_GAP = 16;

type GridItemData = {
  products: Product[];
  searchQuery: string;
  favorites: Set<number>;
  onToggleFav: (id: number) => void;
  onNavigateProduct: (slug: string) => void;
};

type ProductGridVirtualProps = {
  products: Product[];
  searchQuery: string;
  favorites: Set<number>;
  onToggleFav: (id: number) => void;
  visibleLimit: number;
  onLoadMore: () => void;
  hasMore: boolean;
  catalogLoading?: boolean;
};

function ProductCard({
  product,
  searchQuery,
  isFav,
  onToggleFav,
  onNavigate,
}: {
  product: Product;
  searchQuery: string;
  isFav: boolean;
  onToggleFav: () => void;
  onNavigate: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className="h-full cursor-pointer overflow-hidden rounded-2xl bg-secondary shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
      onClick={onNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate();
        }
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <CatalogImage
          src={product.imagem}
          alt={productDisplayName(product.nome)}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-card backdrop-blur-sm"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        {!isGenericVestidosCategory(product.categoriaTipo) && (
          <p className="line-clamp-1 font-body text-xs text-muted-foreground">
            <HighlightedText text={product.categoriaTipo} query={searchQuery} />
          </p>
        )}
        <p className="line-clamp-2 font-body text-sm font-semibold text-foreground">
          <HighlightedText text={productDisplayName(product.nome)} query={searchQuery} />
        </p>
        <p className="mt-1 font-display text-base font-bold text-primary">
          R$ {product.preco.toLocaleString("pt-BR")}
        </p>
      </div>
    </div>
  );
}

function Cell({ columnIndex, rowIndex, style, data }: GridChildComponentProps<GridItemData>) {
  const index = rowIndex * COLUMN_COUNT + columnIndex;
  const product = data.products[index];
  if (!product) return null;

  const padStyle = {
    ...style,
    left: Number(style.left) + (columnIndex > 0 ? GRID_GAP / 2 : 0),
    top: Number(style.top) + (rowIndex > 0 ? GRID_GAP / 2 : 0),
    width: Number(style.width) - GRID_GAP / 2,
    height: Number(style.height) - GRID_GAP / 2,
  };

  return (
    <div style={padStyle}>
      <ProductCard
        product={product}
        searchQuery={data.searchQuery}
        isFav={data.favorites.has(product.id)}
        onToggleFav={() => data.onToggleFav(product.id)}
        onNavigate={() => data.onNavigateProduct(product.slug)}
      />
    </div>
  );
}

const ProductGridVirtual = ({
  products,
  searchQuery,
  favorites,
  onToggleFav,
  visibleLimit,
  onLoadMore,
  hasMore,
  catalogLoading,
}: ProductGridVirtualProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(520);

  const visibleProducts = useMemo(() => products.slice(0, visibleLimit), [products, visibleLimit]);
  const rowCount = Math.ceil(visibleProducts.length / COLUMN_COUNT) || 1;
  const columnWidth = width > 0 ? Math.floor((width - GRID_GAP) / COLUMN_COUNT) : 0;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setWidth(el.clientWidth);
      const vh = window.innerHeight;
      setGridHeight(Math.max(400, Math.min(Math.round(vh * 0.62), 720)));
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    setGridHeight(Math.max(400, Math.min(Math.round(window.innerHeight * 0.62), 720)));
    return () => ro.disconnect();
  }, []);

  const itemData = useMemo<GridItemData>(
    () => ({
      products: visibleProducts,
      searchQuery,
      favorites,
      onToggleFav,
      onNavigateProduct: (slug) => navigate(`/produto/${slug}`),
    }),
    [visibleProducts, searchQuery, favorites, onToggleFav, navigate],
  );

  const handleItemsRendered = useCallback(
    ({ visibleRowStopIndex }: { visibleRowStopIndex: number }) => {
      if (!hasMore) return;
      const lastVisible = (visibleRowStopIndex + 1) * COLUMN_COUNT;
      if (lastVisible >= visibleProducts.length - COLUMN_COUNT) {
        onLoadMore();
      }
    },
    [hasMore, visibleProducts.length, onLoadMore],
  );

  if (catalogLoading) {
    return (
      <div className="col-span-2 flex flex-col gap-4 py-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] animate-pulse rounded-2xl bg-secondary" />
            <div className="aspect-[3/4] animate-pulse rounded-2xl bg-secondary" />
          </div>
        ))}
      </div>
    );
  }

  if (visibleProducts.length === 0) return null;

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 && columnWidth > 0 && (
        <Grid
          columnCount={COLUMN_COUNT}
          columnWidth={columnWidth}
          height={gridHeight}
          rowCount={rowCount}
          rowHeight={ROW_HEIGHT}
          width={width}
          itemData={itemData}
          onItemsRendered={handleItemsRendered}
          overscanRowCount={2}
          className="scrollbar-hide"
        >
          {Cell}
        </Grid>
      )}
      {hasMore && (
        <p className="mt-4 text-center font-body text-xs text-muted-foreground">
          Role para carregar mais vestidos…
        </p>
      )}
    </div>
  );
};

export default ProductGridVirtual;
