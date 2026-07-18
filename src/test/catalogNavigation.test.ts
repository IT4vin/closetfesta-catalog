import { describe, expect, it } from "vitest";
import { buildCatalogUrl, parseCatalogSearchParams } from "@/lib/catalogNavigation";

describe("catalogNavigation", () => {
  it("buildCatalogUrl monta query string", () => {
    expect(buildCatalogUrl({ categoria: "vestidos", q: "noiva" })).toBe(
      "/catalogo?categoria=vestidos&q=noiva",
    );
  });

  it("parseCatalogSearchParams valida cor e tipo", () => {
    const params = parseCatalogSearchParams(
      new URLSearchParams("q=longo&cor=Marsala&categoria=vestidos&tipo=invalido"),
    );
    expect(params.q).toBe("longo");
    expect(params.cor).toBe("Marsala");
    expect(params.categoria).toBe("vestidos");
    expect(params.tipo).toBeUndefined();
  });
});
