import { beforeEach, describe, expect, it, vi } from "vitest";
import { findProductByRouteParam, getProductsByIds, loadSearchIndex, refreshCatalog } from "@/data/catalog/loader";

const liveProduct = {
  id:10001,supabaseId:"15f7e40c-4411-4c09-b2d3-34401ca23800",
  codigo:"010001",nome:"Vestido atualizado no gestor",preco:490,
  imagem:"https://roqcwdlsuawrdbmnwbvv.supabase.co/storage/v1/object/sign/product-images/catalog/010001/01.webp?token=demo",
  imagens:["https://example.org/vestido-frente.webp","https://example.org/vestido-costas.webp"],
  cor:"Marsala",categoriaTipo:"vestidos",slug:"vestidos-marsala-010001",
  coresDisponiveis:["Marsala"],tamanhos:["M"],descricao:"",tipos:["vestidos"],
};

beforeEach(() => {
 vi.stubGlobal("fetch", vi.fn(async()=>({
  ok:true,status:200,json:async()=>({
    source:"closetfesta-administrativo",version:1,total:1,products:[liveProduct],
  }),
 })));
});

describe("catálogo público conectado ao Supabase de gestão", () => {
 it("consulta API ao invés de importar dados gerados do GitHub", async () => {
  const products=await refreshCatalog();
  expect(products[0]?.nome).toBe("Vestido atualizado no gestor");
  expect(products[0]?.imagens?.length).toBe(2);
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/functions/v1/closet-public-catalog"),
    expect.objectContaining({method:"GET",cache:"no-store"})
  );
 });
 it("mantém SKU/slug e identificador de carrinho para links e favoritos existentes", async () => {
  await refreshCatalog();
  expect((await getProductsByIds([10001])).map(p=>p.codigo)).toEqual(["010001"]);
  expect((await findProductByRouteParam("vestidos-marsala-010001"))?.id).toBe(10001);
  expect((await findProductByRouteParam("010001"))?.preco).toBe(490);
 });
 it("rejeita respostas adulteradas e duplicação de códigos", async () => {
  vi.stubGlobal("fetch",vi.fn(async()=>({ok:true,status:200,json:async()=>({products:[liveProduct,liveProduct]})})));
  await expect(refreshCatalog()).rejects.toThrow(/duplicados/);
 });
 it("não usa o catálogo antigo quando a API real falha", async () => {
  vi.stubGlobal("fetch",vi.fn(async()=>({ok:false,status:503,json:async()=>({error:"offline"})})));
  await expect(refreshCatalog()).rejects.toThrow(/503/);
 });
 it("oferece atualização forçada depois que o administrativo altera preços", async () => {
  const newer={...liveProduct,preco:690,nome:"Novo nome"};
  vi.stubGlobal("fetch",vi.fn(async()=>({ok:true,status:200,json:async()=>({products:[newer]})})));
  const updated=await refreshCatalog();
  expect(updated[0]?.preco).toBe(690);
  expect((await loadSearchIndex())[0]?.nome).toBe("Novo nome");
 });
});
