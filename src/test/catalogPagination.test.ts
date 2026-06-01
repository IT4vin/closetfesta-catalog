import { describe, expect, it } from "vitest";
import { getVisibleCatalogLimit, CATALOG_PAGE_SIZE } from "@/lib/catalogPagination";

describe("catalogPagination", () => {
  it("limita ao total disponível", () => {
    expect(getVisibleCatalogLimit(10, 24)).toBe(10);
    expect(getVisibleCatalogLimit(100, CATALOG_PAGE_SIZE)).toBe(CATALOG_PAGE_SIZE);
  });
});
