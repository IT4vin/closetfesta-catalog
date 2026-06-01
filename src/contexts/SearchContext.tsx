import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadSearchIndex, preloadChunkByCor } from "@/data/catalog/loader";
import type { CorCategoria, TipoCategoria } from "@/data/catalogMeta";
import type { Product } from "@/data/catalog/product";
import { filterProductsByCategoryAndQuery } from "@/lib/searchUtils";
import { CATALOG_PAGE_INCREMENT, CATALOG_PAGE_SIZE, getVisibleCatalogLimit } from "@/lib/catalogPagination";

export type SearchContextValue = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;
  colorCategoryFilter: CorCategoria | null;
  typeCategoryFilter: TipoCategoria | null;
  setColorCategoryFilter: (c: CorCategoria | null) => void;
  setTypeCategoryFilter: (t: TipoCategoria | null) => void;
  clearCategoryFilters: () => void;
  clearAllFilters: () => void;
  hasActiveSearch: boolean;
  hasActiveCategoryFilter: boolean;
  filteredProducts: Product[];
  catalogLoading: boolean;
  catalogError: string | null;
  /** Limite atual do scroll infinito na grade. */
  visibleLimit: number;
  loadMoreProducts: () => void;
  hasMoreProducts: boolean;
  resetVisibleLimit: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [colorCategoryFilter, setColorCategoryFilter] = useState<CorCategoria | null>(null);
  const [typeCategoryFilter, setTypeCategoryFilter] = useState<TipoCategoria | null>(null);
  const [searchIndex, setSearchIndex] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [visibleLimit, setVisibleLimit] = useState(CATALOG_PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    loadSearchIndex()
      .then((index) => {
        if (!cancelled) {
          setSearchIndex(index);
          setCatalogError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setCatalogError("Não foi possível carregar o catálogo.");
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (colorCategoryFilter) {
      void preloadChunkByCor(colorCategoryFilter);
    }
  }, [colorCategoryFilter]);

  const clearSearch = useCallback(() => setSearchQuery(""), []);
  const clearCategoryFilters = useCallback(() => {
    setColorCategoryFilter(null);
    setTypeCategoryFilter(null);
  }, []);
  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setColorCategoryFilter(null);
    setTypeCategoryFilter(null);
  }, []);

  const resetVisibleLimit = useCallback(() => {
    setVisibleLimit(CATALOG_PAGE_SIZE);
  }, []);

  const hasActiveSearch = useMemo(
    () =>
      searchQuery
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean).length > 0,
    [searchQuery],
  );
  const hasActiveCategoryFilter = colorCategoryFilter !== null || typeCategoryFilter !== null;

  const filteredProducts = useMemo(
    () =>
      filterProductsByCategoryAndQuery(searchIndex, searchQuery, colorCategoryFilter, typeCategoryFilter),
    [searchIndex, searchQuery, colorCategoryFilter, typeCategoryFilter],
  );

  useEffect(() => {
    resetVisibleLimit();
  }, [searchQuery, colorCategoryFilter, typeCategoryFilter, resetVisibleLimit]);

  const effectiveVisibleLimit = getVisibleCatalogLimit(filteredProducts.length, visibleLimit);
  const hasMoreProducts = effectiveVisibleLimit < filteredProducts.length;

  const loadMoreProducts = useCallback(() => {
    setVisibleLimit((prev) =>
      getVisibleCatalogLimit(filteredProducts.length, prev + CATALOG_PAGE_INCREMENT),
    );
  }, [filteredProducts.length]);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      clearSearch,
      colorCategoryFilter,
      typeCategoryFilter,
      setColorCategoryFilter,
      setTypeCategoryFilter,
      clearCategoryFilters,
      clearAllFilters,
      hasActiveSearch,
      hasActiveCategoryFilter,
      filteredProducts,
      catalogLoading,
      catalogError,
      visibleLimit: effectiveVisibleLimit,
      loadMoreProducts,
      hasMoreProducts,
      resetVisibleLimit,
    }),
    [
      searchQuery,
      clearSearch,
      colorCategoryFilter,
      typeCategoryFilter,
      clearCategoryFilters,
      clearAllFilters,
      hasActiveSearch,
      hasActiveCategoryFilter,
      filteredProducts,
      catalogLoading,
      catalogError,
      effectiveVisibleLimit,
      loadMoreProducts,
      hasMoreProducts,
      resetVisibleLimit,
    ],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch deve ser usado dentro de SearchProvider");
  }
  return ctx;
}
