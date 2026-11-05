import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { LuxeSiteLayout } from "@/components/luxe/LuxeSiteLayout";
import { ProductImageNotice } from "@/components/ProductImageNotice";
import { LuxeProductCard } from "@/components/luxe/LuxeProductCard";
import { LuxeCatalogPagination } from "@/components/luxe/LuxeCatalogPagination";
import { CatalogComingSoon } from "@/components/luxe/CatalogComingSoon";
import { useSearch } from "@/contexts/SearchContext";
import { CORES_CATEGORIA, colorMap, type CorCategoria } from "@/data/catalogMeta";
import {
  buildCatalogUrl,
  parseCatalogSearchParams,
  type CatalogFilterParams,
} from "@/lib/catalogNavigation";
import {
  CATALOG_GRID_PAGE_SIZE,
  CATALOG_SORT_OPTIONS,
  getCatalogPageMeta,
  getTotalPages,
  paginateProducts,
  parseCatalogPage,
  parseCatalogSort,
  shouldShowComingSoon,
  sortCatalogProducts,
  type CatalogSort,
} from "@/lib/catalogCategoryMeta";
import { cn } from "@/lib/utils";

const LuxeCatalogScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlParams = useMemo(() => parseCatalogSearchParams(searchParams), [searchParams]);

  const {
    applyCatalogFilters,
    catalogProducts,
    catalogLoading,
    catalogError,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    colorCategoryFilter,
    setColorCategoryFilter,
    clearCategoryFilters,
    clearAllFilters,
    hasActiveCategoryFilter,
    hasActiveSearch,
  } = useSearch();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const sort = parseCatalogSort(urlParams.ordenar ?? "recent");
  const page = parseCatalogPage(String(urlParams.pagina ?? 1));

  useEffect(() => {
    applyCatalogFilters({
      q: urlParams.q,
      cor: urlParams.cor,
      tipo: urlParams.tipo,
      categoria: urlParams.categoria,
    });
  }, [urlParams.q, urlParams.cor, urlParams.tipo, urlParams.categoria, applyCatalogFilters]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const meta = useMemo(() => getCatalogPageMeta(urlParams), [urlParams]);
  const comingSoon = !catalogLoading && shouldShowComingSoon(urlParams, catalogProducts);

  const sortedProducts = useMemo(
    () => sortCatalogProducts(filteredProducts, sort),
    [filteredProducts, sort],
  );

  const totalPages = getTotalPages(sortedProducts.length, CATALOG_GRID_PAGE_SIZE);
  const safePage = Math.min(page, totalPages);
  const pageProducts = paginateProducts(sortedProducts, safePage, CATALOG_GRID_PAGE_SIZE);

  const updateUrl = useCallback(
    (patch: Partial<CatalogFilterParams>) => {
      const next: CatalogFilterParams = {
        ...urlParams,
        ...patch,
      };
      if (patch.pagina === undefined && (patch.q !== undefined || patch.cor !== undefined || patch.ordenar !== undefined || patch.categoria !== undefined)) {
        next.pagina = 1;
      }
      navigate(buildCatalogUrl(next), { replace: true });
    },
    [navigate, urlParams],
  );

  const submitSearch = (e?: FormEvent) => {
    e?.preventDefault();
    setSearchQuery(localSearch);
    updateUrl({ q: localSearch.trim() || undefined, pagina: 1 });
  };

  const onPickColor = (cor: CorCategoria) => {
    const next = colorCategoryFilter === cor ? null : cor;
    setColorCategoryFilter(next);
    updateUrl({ cor: next ?? undefined, pagina: 1 });
  };

  const onSortChange = (value: CatalogSort) => {
    updateUrl({ ordenar: value === "recent" ? undefined : value, pagina: 1 });
  };

  const onPageChange = (nextPage: number) => {
    updateUrl({ pagina: nextPage <= 1 ? undefined : nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (comingSoon) {
    return <CatalogComingSoon meta={meta} />;
  }

  const showEmpty =
    !catalogLoading && sortedProducts.length === 0 && (hasActiveSearch || hasActiveCategoryFilter);

  return (
    <LuxeSiteLayout>
      {/* Banner */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <div className="relative aspect-[21/9] min-h-[200px] md:aspect-[21/7]">
              <img
                src={meta.bannerImage}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="marsala-gradient absolute inset-0 opacity-90" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] uppercase tracking-[0.4em] text-primary-foreground/80"
                >
                  Coleção
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="mt-2 font-display text-3xl text-primary-foreground md:text-5xl"
                >
                  {meta.title}
                </motion.h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-warm-gray">
          <Link to="/" className="transition hover:text-marsala">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link to="/catalogo" className="transition hover:text-marsala">
            Catálogo
          </Link>
          {meta.breadcrumbLabel !== "Catálogo" && (
            <>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <span className="font-medium text-marsala">{meta.breadcrumbLabel}</span>
            </>
          )}
        </nav>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-warm-gray">{meta.description}</p>
        <ProductImageNotice className="mt-5" />

        {/* Search + Sort toolbar */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form onSubmit={submitSearch} className="relative flex-1 lg:max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-warm-gray" aria-hidden />
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Buscar vestidos, cores ou códigos..."
              className="w-full rounded-full border border-border bg-card py-3.5 pl-12 pr-12 text-sm text-marsala outline-none transition focus:border-marsala/40 focus:shadow-[0_8px_30px_-12px_rgba(122,46,58,0.25)]"
              aria-label="Buscar no catálogo"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  setSearchQuery("");
                  updateUrl({ q: undefined, pagina: 1 });
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-marsala"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-3">
            <SlidersHorizontal className="hidden h-4 w-4 text-warm-gray sm:block" aria-hidden />
            <label htmlFor="catalog-sort" className="sr-only">
              Ordenar por
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as CatalogSort)}
              className="rounded-full border border-marsala/20 bg-card px-4 py-3 text-sm font-medium text-marsala outline-none transition hover:border-marsala/40 focus:border-marsala/50"
            >
              {CATALOG_SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Color filters */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg text-marsala">Filtrar por cor</h2>
            {hasActiveCategoryFilter && (
              <button
                type="button"
                onClick={() => {
                  clearCategoryFilters();
                  updateUrl({ cor: undefined, categoria: urlParams.categoria, q: urlParams.q, pagina: 1 });
                }}
                className="text-xs font-medium text-marsala underline-offset-2 hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
          <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {CORES_CATEGORIA.map((nomeCor) => {
              const selected = colorCategoryFilter === nomeCor;
              return (
                <button
                  key={nomeCor}
                  type="button"
                  onClick={() => onPickColor(nomeCor)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition duration-300",
                    selected
                      ? "border-marsala bg-marsala text-primary-foreground shadow-[0_8px_24px_-8px_rgba(122,46,58,0.4)]"
                      : "border-border bg-background text-marsala hover:border-marsala/30 hover:bg-marsala/5",
                  )}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                    style={{ backgroundColor: colorMap[nomeCor] }}
                  />
                  {nomeCor}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        {!catalogLoading && sortedProducts.length > 0 && (
          <p className="mt-8 text-sm text-warm-gray">
            {sortedProducts.length} {sortedProducts.length === 1 ? "peça encontrada" : "peças encontradas"}
          </p>
        )}

        {catalogError && (
          <p className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {catalogError}
          </p>
        )}

        {/* Grid */}
        {catalogLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[4/5] bg-secondary" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-1/3 rounded bg-secondary" />
                  <div className="h-5 w-2/3 rounded bg-secondary" />
                  <div className="h-10 rounded-full bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : showEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-3xl border border-border bg-card px-6 py-16 text-center md:py-20"
          >
            <h2 className="font-display text-2xl text-marsala">Nenhuma peça encontrada</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-warm-gray">
              Tente ajustar os filtros ou limpar a busca para ver mais opções do catálogo.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setLocalSearch("");
                  navigate("/catalogo");
                }}
                className="rounded-full bg-marsala px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-marsala-dark"
              >
                Limpar tudo
              </button>
              <Link
                to={buildCatalogUrl({ categoria: "vestidos" })}
                className="rounded-full border border-marsala/30 px-6 py-3 text-sm font-medium text-marsala transition hover:bg-marsala/5"
              >
                Ver vestidos
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageProducts.map((product, i) => (
                <LuxeProductCard
                  key={product.slug}
                  product={product}
                  index={i}
                  isFavorite={!!favorites[product.id]}
                  onToggleFavorite={() =>
                    setFavorites((f) => ({ ...f, [product.id]: !f[product.id] }))
                  }
                />
              ))}
            </div>
            <LuxeCatalogPagination page={safePage} totalPages={totalPages} onPageChange={onPageChange} />
          </>
        )}
      </div>
    </LuxeSiteLayout>
  );
};

export default LuxeCatalogScreen;
