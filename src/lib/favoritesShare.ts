import type { Product } from "@/data/products";

const BASE = "https://closetfesta.com.br/produto";

/** Gera slug em kebab-case a partir do nome (URLs de compartilhamento). */
export function productSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatProductCode(id: number): string {
  return `#${String(id).padStart(5, "0")}`;
}

/**
 * Texto no formato solicitado: título, blocos (#código / nome + Link), frase final.
 */
export function buildFavoritesShareText(items: Product[]): string {
  const lines: string[] = ["Meus Favoritos - Closet Festa"];

  for (const p of items) {
    const code = formatProductCode(p.id);
    const slug = productSlug(p.name);
    lines.push(`${code} / ${p.name}`);
    lines.push(`Link: ${BASE}/${slug}`);
  }

  lines.push("Veja todos os meus favoritos na Closet Festa!");
  return lines.join("\n");
}
