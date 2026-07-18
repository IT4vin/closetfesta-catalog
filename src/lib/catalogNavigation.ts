import { CORES_CATEGORIA, TIPOS_CATEGORIA, type CorCategoria, type TipoCategoria } from "@/data/catalogMeta";

export type CatalogFilterParams = {
  q?: string;
  cor?: CorCategoria;
  tipo?: TipoCategoria;
  /** Pasta de topo em produtos/ (ex.: vestidos, ternos). */
  categoria?: string;
};

export function buildCatalogUrl(params: CatalogFilterParams = {}): string {
  const sp = new URLSearchParams();
  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (params.cor) sp.set("cor", params.cor);
  if (params.tipo) sp.set("tipo", params.tipo);
  if (params.categoria?.trim()) sp.set("categoria", params.categoria.trim());
  const qs = sp.toString();
  return qs ? `/catalogo?${qs}` : "/catalogo";
}

export function parseCatalogSearchParams(searchParams: URLSearchParams): CatalogFilterParams {
  const q = searchParams.get("q")?.trim() || undefined;
  const corRaw = searchParams.get("cor");
  const tipoRaw = searchParams.get("tipo");
  const categoria = searchParams.get("categoria")?.trim() || undefined;

  const cor =
    corRaw && (CORES_CATEGORIA as readonly string[]).includes(corRaw)
      ? (corRaw as CorCategoria)
      : undefined;
  const tipo =
    tipoRaw && (TIPOS_CATEGORIA as readonly string[]).includes(tipoRaw)
      ? (tipoRaw as TipoCategoria)
      : undefined;

  return { q, cor, tipo, categoria };
}

/** Filtros das categorias circulares da home. */
export const HOME_CATEGORY_FILTERS: Record<string, CatalogFilterParams> = {
  Vestidos: { categoria: "vestidos" },
  Madrinhas: { q: "madrinha" },
  Noivas: { q: "noiva" },
  Formandas: { q: "debutante" },
  Ternos: { categoria: "ternos" },
  Smoking: { categoria: "ternos", q: "smoking" },
  Infantil: { q: "infantil" },
  Acessórios: { q: "acessorio" },
};

/** Filtros das coleções em destaque na home. */
export const HOME_COLLECTION_FILTERS: Record<string, CatalogFilterParams> = {
  "Vestidos de Festa": { categoria: "vestidos" },
  "Vestidos Longos": { q: "longo" },
  "Vestidos Curtos": { q: "curto" },
  Ternos: { categoria: "ternos" },
  Smokings: { categoria: "ternos", q: "smoking" },
  Noivas: { q: "noiva" },
};

/** Itens do menu principal → destino. */
export const HOME_NAV_LINKS: Record<string, string | CatalogFilterParams> = {
  Início: "/",
  Vestidos: { categoria: "vestidos" },
  Ternos: { categoria: "ternos" },
  Noivas: { q: "noiva" },
  Madrinhas: { q: "madrinha" },
  Debutantes: { q: "debutante" },
  Acessórios: { q: "acessorio" },
  Contato: "whatsapp",
};

export function resolveHomeNavHref(item: string): string {
  const target = HOME_NAV_LINKS[item];
  if (!target) return buildCatalogUrl();
  if (target === "whatsapp") return "#contato";
  if (typeof target === "string") return target;
  return buildCatalogUrl(target);
}
