import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HomeScreen from "@/components/HomeScreen";
import { useSearch } from "@/contexts/SearchContext";
import { parseCatalogSearchParams } from "@/lib/catalogNavigation";

const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const { applyCatalogFilters } = useSearch();

  useEffect(() => {
    applyCatalogFilters(parseCatalogSearchParams(searchParams));
  }, [searchParams, applyCatalogFilters]);

  return <HomeScreen />;
};

export default CatalogPage;
