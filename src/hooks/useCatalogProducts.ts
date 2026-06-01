import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/catalog/product";
import { getProductsByIds } from "@/data/catalog/loader";

/** Resolve produtos do carrinho/favoritos sem importar o catálogo no bundle inicial. */
export function useCatalogProducts(ids: number[]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(ids.length > 0);

  const idsKey = useMemo(() => [...ids].sort((a, b) => a - b).join(","), [ids]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProductsByIds(ids).then((list) => {
      if (!cancelled) {
        setProducts(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [idsKey, ids.length]);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  return { products, byId, loading };
}
