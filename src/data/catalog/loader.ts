import type { Product } from "./product";
import { catalogChunks, idToChunkId, slugToChunkId } from "./manifest.generated";

const chunkCache = new Map<string, Product[]>();
let searchIndexCache: Product[] | null = null;
let searchIndexLoad: Promise<Product[]> | null = null;

/** Carrega o índice de busca (async chunk — fora do bundle principal). */
export function loadSearchIndex(): Promise<Product[]> {
  if (searchIndexCache) return Promise.resolve(searchIndexCache);
  if (!searchIndexLoad) {
    searchIndexLoad = import("./search-index.generated").then((m) => {
      searchIndexCache = m.searchIndex;
      return m.searchIndex;
    });
  }
  return searchIndexLoad;
}

/** Pré-carrega chunk por cor (útil ao filtrar categoria). */
export async function preloadChunkByCor(cor: string): Promise<void> {
  const meta = catalogChunks.find((c) => c.cor === cor);
  if (meta) await loadChunk(meta.id);
}

const chunkModules = import.meta.glob<{ products: Product[] }>("./chunks/*.generated.ts");

async function loadChunk(chunkId: string): Promise<Product[]> {
  const cached = chunkCache.get(chunkId);
  if (cached) return cached;

  const key = `./chunks/${chunkId}.generated.ts`;
  const loader = chunkModules[key];
  if (!loader) return [];
  const mod = await loader();
  const list = mod.products;
  chunkCache.set(chunkId, list);
  return list;
}

export async function findProductByRouteParam(param: string | undefined): Promise<Product | undefined> {
  if (!param) return undefined;

  const index = await loadSearchIndex();
  const bySlug = index.find((p) => p.slug === param);
  if (bySlug) return bySlug;

  const id = Number(param);
  if (!Number.isNaN(id)) {
    const byId = index.find((p) => p.id === id);
    if (byId) return byId;
  }

  const chunkId = slugToChunkId[param] ?? (!Number.isNaN(Number(param)) ? idToChunkId[Number(param)] : undefined);
  if (chunkId) {
    const chunk = await loadChunk(chunkId);
    return chunk.find((p) => p.slug === param || p.id === Number(param));
  }

  return undefined;
}

export async function getProductsByIds(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const index = await loadSearchIndex();
  const idSet = new Set(ids);
  return index.filter((p) => idSet.has(p.id));
}

export function getCatalogChunkMeta() {
  return catalogChunks;
}
