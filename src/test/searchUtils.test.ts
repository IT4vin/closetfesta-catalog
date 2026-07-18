import { describe, expect, it } from "vitest";
import type { Product } from "@/data/catalog/product";
import { filterProductsByCategoryAndQuery } from "@/lib/searchUtils";

const product = (over: Partial<Product>): Product => ({
  id: 1,
  codigo: "010001",
  nome: "vestidos madrinha especial",
  preco: 100,
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

describe("filterProductsByCategoryAndQuery", () => {
  const list = [
    product({ id: 1, categoriaTipo: "vestidos", nome: "vestidos longo 1" }),
    product({ id: 2, categoriaTipo: "ternos", nome: "terno azul" }),
  ];

  it("filtra por categoriaTipo (pasta produtos/)", () => {
    const out = filterProductsByCategoryAndQuery(list, "", null, null, "vestidos");
    expect(out).toHaveLength(1);
    expect(out[0]?.categoriaTipo).toBe("vestidos");
  });

  it("combina categoria e busca textual", () => {
    const out = filterProductsByCategoryAndQuery(list, "madrinha", null, null, "vestidos");
    expect(out).toHaveLength(1);
  });
});
