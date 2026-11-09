import { describe, expect, it } from "vitest";
import { buildCatalogUrl, parseCatalogSearchParams } from "@/lib/catalogNavigation";

describe("catalogNavigation", () => {
  it("buildCatalogUrl monta query string", () => {
    const url = new URL(buildCatalogUrl({ categoria: "vestidos", q: "noiva" }), "https://closet.test");
    expect(url.pathname).toBe("/catalogo");
    expect(url.searchParams.get("categoria")).toBe("vestidos");
    expect(url.searchParams.get("q")).toBe("noiva");
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
