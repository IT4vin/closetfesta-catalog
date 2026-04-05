import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/products";
import { filterProductsByQuery, tokenizeQuery } from "@/lib/searchUtils";

export type SearchContextValue = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  clearSearch: () => void;
  filteredProducts: Product[];
  hasActiveSearch: boolean;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const clearSearch = useCallback(() => setSearchQuery(""), []);

  const filteredProducts = useMemo(
    () => filterProductsByQuery(products, searchQuery),
    [searchQuery],
  );

  const hasActiveSearch = useMemo(() => tokenizeQuery(searchQuery).length > 0, [searchQuery]);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      clearSearch,
      filteredProducts,
      hasActiveSearch,
    }),
    [searchQuery, clearSearch, filteredProducts, hasActiveSearch],
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
