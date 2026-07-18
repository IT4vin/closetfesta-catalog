import type { Product } from "@/data/catalog/product";
import type { CatalogFilterParams } from "@/lib/catalogNavigation";
import { dedupeProductsByCodigo } from "@/lib/featuredProducts";
import { filterProductsByCategoryAndQuery, productMatchesQuery } from "@/lib/searchUtils";
import { LUXE_CATEGORY_IMAGES } from "@/components/luxe/constants";

export type CatalogSort = "recent" | "popular" | "price-asc" | "price-desc";

export const CATALOG_GRID_PAGE_SIZE = 12;

export const CATALOG_SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "recent", label: "Mais recentes" },
  { value: "popular", label: "Mais populares" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

/** Categorias futuras — exibem página "Em breve" quando não há estoque. */
const COMING_SOON_CATEGORIA = new Set(["ternos", "acessorios", "acessorio"]);
const COMING_SOON_QUERY = new Set(["acessorio", "acessorios"]);

export type CatalogPageMeta = {
  title: string;
  description: string;
  breadcrumbLabel: string;
  bannerImage: string;
};

function resolveBanner(params: CatalogFilterParams): string {
  if (params.categoria) {
    return LUXE_CATEGORY_IMAGES[params.categoria.toLowerCase()] ?? LUXE_CATEGORY_IMAGES.default;
  }
  const q = params.q?.toLowerCase();
  if (q === "noiva") return LUXE_CATEGORY_IMAGES.noivas ?? LUXE_CATEGORY_IMAGES.default;
  if (q === "madrinha") return LUXE_CATEGORY_IMAGES.madrinhas ?? LUXE_CATEGORY_IMAGES.default;
  if (q === "debutante") return LUXE_CATEGORY_IMAGES.debutantes ?? LUXE_CATEGORY_IMAGES.default;
  if (q === "longo") return LUXE_CATEGORY_IMAGES.debutantes ?? LUXE_CATEGORY_IMAGES.default;
  if (q === "curto") return LUXE_CATEGORY_IMAGES.infantil ?? LUXE_CATEGORY_IMAGES.default;
  if (q === "smoking") return LUXE_CATEGORY_IMAGES.smoking ?? LUXE_CATEGORY_IMAGES.default;
  if (q === "infantil") return LUXE_CATEGORY_IMAGES.infantil ?? LUXE_CATEGORY_IMAGES.default;
  if (q === "acessorio" || q === "acessorios") return LUXE_CATEGORY_IMAGES.acessorios ?? LUXE_CATEGORY_IMAGES.default;
  return LUXE_CATEGORY_IMAGES.default;
}

export function getCatalogPageMeta(params: CatalogFilterParams): CatalogPageMeta {
  if (params.categoria === "vestidos") {
    return {
      title: "Vestidos",
      breadcrumbLabel: "Vestidos",
      description:
        "Curadoria exclusiva de vestidos de festa, formatura e eventos especiais. Encontre o caimento perfeito para o seu momento.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.categoria === "ternos") {
    return {
      title: "Ternos",
      breadcrumbLabel: "Ternos",
      description: "Alfaiataria refinada para casamentos, formaturas e ocasiões formais.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "noiva") {
    return {
      title: "Noivas",
      breadcrumbLabel: "Noivas",
      description: "Peças deslumbrantes para o dia mais especial da sua vida.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "madrinha") {
    return {
      title: "Madrinhas",
      breadcrumbLabel: "Madrinhas",
      description: "Vestidos elegantes para madrinhas e convidadas de casamento.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "debutante") {
    return {
      title: "Debutantes",
      breadcrumbLabel: "Debutantes",
      description: "Trajes exclusivos para debutantes e formandas.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "longo") {
    return {
      title: "Vestidos Longos",
      breadcrumbLabel: "Vestidos Longos",
      description: "Elegância em movimento com vestidos longos para festas inesquecíveis.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "curto") {
    return {
      title: "Vestidos Curtos",
      breadcrumbLabel: "Vestidos Curtos",
      description: "Sofisticação descontraída com vestidos curtos para ocasiões especiais.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "smoking") {
    return {
      title: "Smokings",
      breadcrumbLabel: "Smokings",
      description: "Smokings clássicos para ocasiões formais e celebrações especiais.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "infantil") {
    return {
      title: "Infantil",
      breadcrumbLabel: "Infantil",
      description: "Trajes especiais para os pequenos brilharem em festas e eventos.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q === "acessorio" || params.q === "acessorios" || params.categoria === "acessorios") {
    return {
      title: "Acessórios",
      breadcrumbLabel: "Acessórios",
      description: "Complementos exclusivos para finalizar o seu look com elegância.",
      bannerImage: resolveBanner(params),
    };
  }
  if (params.cor) {
    return {
      title: `Cor ${params.cor}`,
      breadcrumbLabel: params.cor,
      description: `Explore nossa seleção de peças na cor ${params.cor}.`,
      bannerImage: resolveBanner(params),
    };
  }
  if (params.q) {
    return {
      title: `Busca: ${params.q}`,
      breadcrumbLabel: params.q,
      description: "Resultados da sua busca no catálogo Closet Festa.",
      bannerImage: resolveBanner(params),
    };
  }
  return {
    title: "Catálogo",
    breadcrumbLabel: "Catálogo",
    description:
      "Explore nossa curadoria completa de vestidos e trajes premium disponíveis para aluguel.",
    bannerImage: LUXE_CATEGORY_IMAGES.default,
  };
}

export function shouldShowComingSoon(params: CatalogFilterParams, allProducts: Product[]): boolean {
  if (params.categoria && COMING_SOON_CATEGORIA.has(params.categoria.toLowerCase())) {
    const cat = params.categoria.toLowerCase();
    const hasStock = allProducts.some((p) => p.categoriaTipo.toLowerCase() === cat);
    return !hasStock;
  }
  if (params.q && COMING_SOON_QUERY.has(params.q.toLowerCase()) && !params.categoria) {
    const hasStock = allProducts.some((p) => productMatchesQuery(p, params.q!));
    return !hasStock;
  }
  return false;
}

export function sortCatalogProducts(products: Product[], sort: CatalogSort): Product[] {
  const list = dedupeProductsByCodigo(products);
  const sorted = [...list];
  switch (sort) {
    case "recent":
      return sorted.sort((a, b) => Number(b.codigo) - Number(a.codigo));
    case "popular":
      return sorted.sort((a, b) => Number(a.codigo) - Number(b.codigo));
    case "price-asc":
      return sorted.sort((a, b) => a.preco - b.preco);
    case "price-desc":
      return sorted.sort((a, b) => b.preco - a.preco);
    default:
      return sorted;
  }
}

export function paginateProducts<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) return 1;
  return Math.ceil(totalItems / pageSize);
}

export function countCategoryStock(
  allProducts: Product[],
  params: CatalogFilterParams,
): number {
  return filterProductsByCategoryAndQuery(
    allProducts,
    params.q ?? "",
    params.cor ?? null,
    params.tipo ?? null,
    params.categoria ?? null,
  ).length;
}

export function parseCatalogSort(raw: string | null | undefined): CatalogSort {
  if (raw === "popular" || raw === "price-asc" || raw === "price-desc" || raw === "recent") {
    return raw;
  }
  return "recent";
}

export function parseCatalogPage(raw: string | null | undefined): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}
