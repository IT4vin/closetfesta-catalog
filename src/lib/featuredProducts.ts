import type { Product } from "@/data/catalog/product";
import { colorMap, type CorCategoria } from "@/data/catalogMeta";

/** Uma imagem por código de produto (evita duplicatas do catálogo gerado). */
export function dedupeProductsByCodigo(products: Product[]): Product[] {
  const byCodigo = new Map<string, Product>();
  for (const p of products) {
    if (!byCodigo.has(p.codigo)) byCodigo.set(p.codigo, p);
  }
  return [...byCodigo.values()];
}

/**
 * Seleciona produtos variados por cor para a vitrine da home.
 * Prioriza cores diferentes; completa com o restante se necessário.
 */
export function pickFeaturedProducts(products: Product[], count = 6): Product[] {
  const unique = dedupeProductsByCodigo(products);
  if (unique.length <= count) return unique;

  const pools = new Map<string, Product[]>();
  for (const p of unique) {
    const key = p.cor;
    if (!pools.has(key)) pools.set(key, []);
    pools.get(key)!.push(p);
  }

  const colors = [...pools.keys()].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const picked: Product[] = [];
  let round = 0;

  while (picked.length < count && pools.size > 0) {
    const color = colors[round % colors.length];
    const pool = pools.get(color);
    if (pool?.length) {
      picked.push(pool.shift()!);
      if (pool.length === 0) pools.delete(color);
    }
    round += 1;
    if (round > count * Math.max(colors.length, 1) * 2) break;
  }

  if (picked.length < count) {
    const pickedCodes = new Set(picked.map((p) => p.codigo));
    for (const p of unique) {
      if (picked.length >= count) break;
      if (!pickedCodes.has(p.codigo)) {
        picked.push(p);
        pickedCodes.add(p.codigo);
      }
    }
  }

  return picked.slice(0, count);
}

export function productColorHex(cor: string): string {
  return colorMap[cor as CorCategoria] ?? "#9C2F45";
}

export function formatSizeRange(tamanhos: string[]): string {
  if (tamanhos.length === 0) return "Consulte";
  if (tamanhos.length === 1) return tamanhos[0]!;
  return `${tamanhos[0]}–${tamanhos[tamanhos.length - 1]}`;
}
