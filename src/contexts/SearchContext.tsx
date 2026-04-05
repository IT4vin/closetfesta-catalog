import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type CorCategoria, type Product, type TipoCategoria } from "@/data/products";
import { filterProductsByCategoryAndQuery, tokenizeQuery } from "@/lib/searchUtils";

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
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [colorCategoryFilter, setColorCategoryFilter] = useState<CorCategoria | null>(null);
  const [typeCategoryFilter, setTypeCategoryFilter] = useState<TipoCategoria | null>(null);

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

  const hasActiveSearch = useMemo(() => tokenizeQuery(searchQuery).length > 0, [searchQuery]);
  const hasActiveCategoryFilter = colorCategoryFilter !== null || typeCategoryFilter !== null;

  const filteredProducts = useMemo(
    () =>
      filterProductsByCategoryAndQuery(products, searchQuery, colorCategoryFilter, typeCategoryFilter),
    [searchQuery, colorCategoryFilter, typeCategoryFilter],
  );

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
