import type { Product } from "@/data/products";

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
    p.name,
    p.category,
    p.dressType,
    ...p.colors,
    p.description,
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

export function filterProductsByQuery(list: Product[], rawQuery: string): Product[] {
  const tokens = tokenizeQuery(rawQuery);
  if (tokens.length === 0) return list;
  return list.filter((p) => productMatchesQuery(p, rawQuery));
}
