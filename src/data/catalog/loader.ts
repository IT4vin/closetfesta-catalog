import type { Product } from "./product";

/**
 * Fonte oficial: mesmo Supabase do sistema administrativo Closet Festa.
 * Essa URL publica apenas dados seguros da vitrine por uma Edge Function,
 * sem revelar a chave service_role, contratos, clientes ou custos internos.
 *
 * Não usar os arquivos *.generated.ts como fallback: eles não refletem
 * alterações, exclusões ou preços feitos no sistema de gestão.
 */
export const PUBLIC_CATALOG_API =
  import.meta.env.VITE_CLOSET_CATALOG_API_URL ||
  "https://roqcwdlsuawrdbmnwbvv.supabase.co/functions/v1/closet-public-catalog";

const MAX_STALE_MS = 2 * 60 * 1000;
let productCache: Product[] | null = null;
let cacheAt = 0;
let pending: Promise<Product[]> | null = null;

const checkProduct = (item: unknown): item is Product => {
  if (!item || typeof item !== "object") return false;
  const p = item as Partial<Product>;
  return typeof p.id === "number" && Number.isSafeInteger(p.id) &&
    typeof p.codigo === "string" && typeof p.slug === "string" &&
    typeof p.nome === "string" && typeof p.cor === "string" &&
    typeof p.categoriaTipo === "string" && typeof p.preco === "number" &&
    Array.isArray(p.tamanhos) && Array.isArray(p.tipos) &&
    Array.isArray(p.coresDisponiveis) && typeof p.imagem === "string";
};

/** Consulta produtos atuais (fotos, nome, cores, tamanhos, preço). */
export function loadSearchIndex(options: {force?: boolean} = {}): Promise<Product[]> {
  const now = Date.now();
  if (!options.force && productCache && now - cacheAt < MAX_STALE_MS) {
    return Promise.resolve(productCache);
  }
  if (pending) return pending;
  pending = (async () => {
    const response = await fetch(PUBLIC_CATALOG_API, {
      method: "GET",
      headers: {Accept: "application/json"},
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Catálogo indisponível (HTTP " + response.status + ").");
    const json: unknown = await response.json();
    if (!json || typeof json !== "object" ||
        !Array.isArray((json as {products?: unknown}).products)) {
      throw new Error("O servidor retornou um catálogo inválido.");
    }
    const rows = (json as {products: unknown[]}).products;
    if (!rows.every(checkProduct)) {
      throw new Error("A resposta do catálogo contém produtos inválidos.");
    }
    const unique = new Set(rows.map(p => (p as Product).codigo));
    if (unique.size !== rows.length) {
      throw new Error("O catálogo retornou códigos duplicados.");
    }
    productCache = rows as Product[];
    cacheAt = Date.now();
    return productCache;
  })().finally(() => { pending = null; });
  return pending;
}

/** Força nova consulta ao Supabase, inclusive após edição no administrativo. */
export function refreshCatalog(): Promise<Product[]> {
  return loadSearchIndex({force: true});
}

export async function preloadChunkByCor(_cor: string): Promise<void> {
  // A busca remota já retorna todos os produtos ativos, não há chunks estáticos.
  await loadSearchIndex();
}

/** Preserva links antigos de produto e aceita também SKU ou ID numérico. */
export async function findProductByRouteParam(param: string | undefined): Promise<Product | undefined> {
  if (!param) return undefined;
  const products = await loadSearchIndex();
  return products.find(p => p.slug === param || p.codigo === param ||
    String(p.id) === param || p.supabaseId === param);
}

/** Carrinho e favoritos consultam a mesma fonte oficial. */
export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  if (!ids.length) return [];
  const list = await loadSearchIndex();
  const set = new Set(ids);
  return list.filter(p => set.has(p.id));
}

/** Compatibilidade com chamadas existentes; as cores vêm agora do banco. */
export function getCatalogChunkMeta() {
  const list = productCache ?? [];
  const colors = new Map<string, number>();
  for (const p of list) colors.set(p.cor, (colors.get(p.cor) ?? 0) + 1);
  return [...colors].map(([cor, count]) => ({
    id: cor.toLowerCase(),
    cor,
    count,
  }));
}
