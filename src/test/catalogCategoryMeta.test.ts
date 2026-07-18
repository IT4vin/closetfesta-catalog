import { describe, expect, it } from "vitest";
import type { Product } from "@/data/catalog/product";
import {
  getCatalogPageMeta,
  shouldShowComingSoon,
  sortCatalogProducts,
} from "@/lib/catalogCategoryMeta";

const vestido = (over: Partial<Product> = {}): Product => ({
  id: 1,
  codigo: "010001",
  nome: "vestidos 010001",
  preco: 500,
  imagem: "/a.jpg",
  cor: "Marsala",
  categoriaTipo: "vestidos",
  slug: "vestidos-marsala-010001",
  coresDisponiveis: ["Marsala"],
  tamanhos: ["P"],
  descricao: "",
  tipos: ["vestidos"],
  ...over,
});

describe("catalogCategoryMeta", () => {
  it("shouldShowComingSoon para ternos sem estoque", () => {
    const products = [vestido()];
    expect(shouldShowComingSoon({ categoria: "ternos" }, products)).toBe(true);
    expect(shouldShowComingSoon({ categoria: "vestidos" }, products)).toBe(false);
  });

  it("sortCatalogProducts ordena por preço", () => {
    const list = [vestido({ codigo: "2", preco: 800 }), vestido({ codigo: "1", preco: 200 })];
    const sorted = sortCatalogProducts(list, "price-asc");
    expect(sorted[0]?.preco).toBe(200);
  });

  it("getCatalogPageMeta retorna título da categoria", () => {
    const meta = getCatalogPageMeta({ categoria: "vestidos" });
    expect(meta.title).toBe("Vestidos");
    expect(meta.breadcrumbLabel).toBe("Vestidos");
  });
});
