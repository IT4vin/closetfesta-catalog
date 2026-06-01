/** Itens iniciais e incremento do scroll infinito na grade. */
export const CATALOG_PAGE_SIZE = 24;
export const CATALOG_PAGE_INCREMENT = 24;

export function getVisibleCatalogLimit(total: number, requestedLimit: number): number {
  if (total <= 0) return 0;
  return Math.min(requestedLimit, total);
}
