import { describe, expect, it } from "vitest";
import type { Product } from "@/data/catalog/product";
import { dedupeProductsByCodigo, pickFeaturedProducts } from "@/lib/featuredProducts";

const base = (over: Partial<Product>): Product => ({
  id: 1,
  codigo: "010001",
  nome: "vestidos 010001",
  preco: 100,
  imagem: "/a.jpg",
  cor: "Marsala",
  categoriaTipo: "vestidos",
  slug: "vestidos-marsala-010001",
  coresDisponiveis: ["Marsala"],
  tamanhos: ["P", "G"],
  descricao: "",
  tipos: ["vestidos"],
  ...over,
});

describe("featuredProducts", () => {
  it("dedupeProductsByCodigo mantém uma entrada por código", () => {
    const list = [
      base({ id: 1, codigo: "010001", imagem: "/1.jpg" }),
      base({ id: 1, codigo: "010001", imagem: "/2.jpg" }),
      base({ id: 2, codigo: "010002" }),
    ];
    expect(dedupeProductsByCodigo(list)).toHaveLength(2);
  });

  it("pickFeaturedProducts prioriza cores diferentes", () => {
    const list = [
      base({ id: 1, codigo: "1", cor: "Marsala", slug: "a" }),
      base({ id: 2, codigo: "2", cor: "Marsala", slug: "b" }),
      base({ id: 3, codigo: "3", cor: "Preto", slug: "c" }),
      base({ id: 4, codigo: "4", cor: "Branco", slug: "d" }),
    ];
    const picked = pickFeaturedProducts(list, 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked.map((p) => p.cor)).size).toBe(3);
  });
});
