import type { CorCategoria, Product, TipoCategoria } from "@/data/products";

/** Lowercase ASCII-ish: removes diacritics for case- and accent-insensitive matching. */
export function normalizeSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

export function tokenizeQuery(raw: string): string[] {
  return normalizeSearch(raw)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function productSearchBlob(p: Product): string {
  const parts = [
    p.nome,
    p.categoriaTipo,
    p.cor,
    ...p.coresDisponiveis,
    ...p.tipos,
    p.descricao,
  ];
  return normalizeSearch(parts.join(" "));
}

/** Every query token must appear somewhere in the product's searchable fields (AND). */
export function productMatchesQuery(p: Product, rawQuery: string): boolean {
  const tokens = tokenizeQuery(rawQuery);
  if (tokens.length === 0) return true;
  const blob = productSearchBlob(p);
  return tokens.every((t) => blob.includes(t));
}

export function filterProductsByCategoryAndQuery(
  list: Product[],
  rawQuery: string,
  colorFilter: CorCategoria | null,
  typeFilter: TipoCategoria | null,
): Product[] {
  let next = list;
  if (colorFilter) {
    next = next.filter((p) => p.cor === colorFilter || p.coresDisponiveis.includes(colorFilter));
  }
  if (typeFilter) {
    next = next.filter((p) => p.tipos.includes(typeFilter));
  }
  return filterProductsByQuery(next, rawQuery);
}

export function filterProductsByQuery(list: Product[], rawQuery: string): Product[] {
  const tokens = tokenizeQuery(rawQuery);
  if (tokens.length === 0) return list;
  return list.filter((p) => productMatchesQuery(p, rawQuery));
}
