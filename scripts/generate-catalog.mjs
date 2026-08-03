import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd());
const INPUT_DIR = path.join(REPO_ROOT, "produtos");
const OUTPUT_PUBLIC_DIR = path.join(REPO_ROOT, "public", "produtos");
const OUTPUT_CATALOG_DIR = path.join(REPO_ROOT, "src", "data", "catalog");
const OUTPUT_CHUNKS_DIR = path.join(OUTPUT_CATALOG_DIR, "chunks");
/** @deprecated Mantido só para compatibilidade de ferramentas; use catalog/search-index + chunks. */
const OUTPUT_LEGACY_TS = path.join(REPO_ROOT, "src", "data", "catalog.generated.ts");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const PRODUCT_INTERFACE = `export interface Product {
  id: number;
  codigo: string;
  nome: string;
  preco: number;
  imagem: string;
  cor: string;
  categoriaTipo: string;
  slug: string;
  coresDisponiveis: string[];
  tamanhos: string[];
  descricao: string;
  tipos: string[];
}`;

function normalizeSlugPart(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeChunkId(cor) {
  return normalizeSlugPart(cor) || "outros";
}

function parseBRLFromFilename(name) {
  const m = name.match(/R\$\s*([0-9.]+),([0-9]{2})/i);
  if (!m) return null;
  const intPart = m[1].replace(/\./g, "");
  const fracPart = m[2];
  const n = Number(`${intPart}.${fracPart}`);
  return Number.isFinite(n) ? n : null;
}

function parseCodeFromFilename(name) {
  const m = name.match(/^\s*([0-9]+)\s*-/);
  if (!m) return null;
  return m[1];
}

function parseNameFromFilename(name, codigo) {
  const safe = name.replace(/\s+/g, " ").trim();
  const re = new RegExp(`^\\s*${codigo}\\s*-\\s*(.*?)\\s*-\\s*R\\$`, "i");
  const m = safe.match(re);
  const raw = m?.[1]?.trim();
  if (!raw) return null;
  return raw;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listFilesRecursive(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFilesRecursive(full)));
    } else {
      out.push(full);
    }
  }
  return out;
}

async function copyFileEnsuringDir(src, dst) {
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
}

function writeChunkModule(filePath, products) {
  return `// AUTO-GENERATED. DO NOT EDIT.
import type { Product } from "../product";

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;
}

async function writeEmptyCatalog() {
  const emptyChunk = writeChunkModule(path.join(OUTPUT_CHUNKS_DIR, "empty.generated.ts"), []);
  await ensureDir(OUTPUT_CHUNKS_DIR);
  await fs.writeFile(path.join(OUTPUT_CHUNKS_DIR, "empty.generated.ts"), emptyChunk, "utf8");

  const searchIndex = `// AUTO-GENERATED. DO NOT EDIT.
import type { Product } from "./product";

export const searchIndex: Product[] = [];
`;

  const manifest = `// AUTO-GENERATED. DO NOT EDIT.
export type CatalogChunkMeta = {
  id: string;
  cor: string;
  productCount: number;
};

export const catalogChunks: CatalogChunkMeta[] = [];

export const slugToChunkId: Record<string, string> = {};

export const idToChunkId: Record<number, string> = {};
`;

  await ensureDir(OUTPUT_CATALOG_DIR);
  await fs.writeFile(path.join(OUTPUT_CATALOG_DIR, "search-index.generated.ts"), searchIndex, "utf8");
  await fs.writeFile(path.join(OUTPUT_CATALOG_DIR, "manifest.generated.ts"), manifest, "utf8");

  const legacy = `// AUTO-GENERATED. DO NOT EDIT.
${PRODUCT_INTERFACE}

export const products: Product[] = [];

export function findProductByRouteParam(_param: string | undefined): Product | undefined {
  return undefined;
}
`;
  await fs.writeFile(OUTPUT_LEGACY_TS, legacy, "utf8");
}

async function main() {
  // Na Vercel, public/produtos e src/data/catalog/*.generated.ts já vêm do git.
  // Regenerar copiaria ~1 GB de imagens a cada deploy (lento e sem saída no log).
  if (process.env.VERCEL) {
    console.log(
      "[catalog:generate] Ambiente Vercel — usando catálogo e imagens já commitados, pulando regeneração.",
    );
    return;
  }

  let inputExists = true;
  try {
    const st = await fs.stat(INPUT_DIR);
    inputExists = st.isDirectory();
  } catch {
    inputExists = false;
  }

  // Na Vercel costuma existir só public/produtos (sem pasta produtos/ no repo).
  // Não apagar imagens já publicadas nem sobrescrever TS gerado commitado.
  if (!inputExists) {
    console.warn(
      "[catalog:generate] Pasta produtos/ não encontrada — mantendo public/produtos e arquivos em src/data/catalog/*.generated.ts",
    );
    return;
  }

  await ensureDir(OUTPUT_PUBLIC_DIR);
  await fs.rm(OUTPUT_PUBLIC_DIR, { recursive: true, force: true });
  await ensureDir(OUTPUT_PUBLIC_DIR);
  await ensureDir(OUTPUT_CATALOG_DIR);
  await fs.rm(OUTPUT_CHUNKS_DIR, { recursive: true, force: true });
  await ensureDir(OUTPUT_CHUNKS_DIR);

  console.log("[catalog:generate] Escaneando imagens em produtos/...");
  const allFiles = await listFilesRecursive(INPUT_DIR);
  const imageFiles = allFiles.filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));
  console.log(`[catalog:generate] ${imageFiles.length} imagens encontradas.`);

  /** @type {Array<any>} */
  const products = [];

  let copied = 0;
  for (const abs of imageFiles) {
    const rel = path.relative(INPUT_DIR, abs);
    const parts = rel.split(path.sep);
    if (parts.length < 3) continue;

    const tipoFolder = parts[0];
    const corFolder = parts[1];
    const fileName = parts.slice(2).join("/");

    const ext = path.extname(fileName);
    const base = path.basename(fileName, ext);

    const codigo = parseCodeFromFilename(base);
    const preco = parseBRLFromFilename(base);
    if (!codigo || preco == null) continue;

    const id = Number(codigo);
    if (!Number.isFinite(id)) continue;

    const tipo = tipoFolder.trim();
    const cor = corFolder.trim();
    const nomeExtra = parseNameFromFilename(base, codigo);

    const publicRel = path.join(tipoFolder, corFolder, fileName);
    const publicAbs = path.join(OUTPUT_PUBLIC_DIR, publicRel);
    await copyFileEnsuringDir(abs, publicAbs);
    copied++;
    if (copied % 100 === 0) {
      console.log(`[catalog:generate] Copiadas ${copied}/${imageFiles.length} imagens...`);
    }

    const imageUrl = `/produtos/${publicRel.split(path.sep).join("/")}`;
    const slug = [tipo, cor, codigo].map(normalizeSlugPart).filter(Boolean).join("-");

    products.push({
      id,
      codigo,
      nome: nomeExtra ? `${tipo} ${nomeExtra}` : `${tipo} ${codigo}`,
      preco,
      imagem: imageUrl,
      cor,
      categoriaTipo: tipo,
      slug,
      coresDisponiveis: [cor],
      tamanhos: ["P", "M", "G", "GG"],
      descricao: `Produto gerado automaticamente da pasta: ${tipo}/${cor}`,
      tipos: [tipo],
    });
  }

  products.sort((a, b) => a.id - b.id);

  /** @type {Map<string, any[]>} */
  const byCor = new Map();
  for (const p of products) {
    if (!byCor.has(p.cor)) byCor.set(p.cor, []);
    byCor.get(p.cor).push(p);
  }

  /** @type {import('./generate-catalog.mjs').CatalogChunkMeta[]} */
  const catalogChunks = [];
  const slugToChunkId = {};
  const idToChunkId = {};

  for (const [cor, list] of [...byCor.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))) {
    const chunkId = normalizeChunkId(cor);
    const chunkFile = `${chunkId}.generated.ts`;
    const chunkPath = path.join(OUTPUT_CHUNKS_DIR, chunkFile);
    await fs.writeFile(chunkPath, writeChunkModule(chunkPath, list), "utf8");

    catalogChunks.push({ id: chunkId, cor, productCount: list.length });

    for (const p of list) {
      slugToChunkId[p.slug] = chunkId;
      idToChunkId[p.id] = chunkId;
    }
  }

  const searchIndex = `// AUTO-GENERATED. DO NOT EDIT.
import type { Product } from "./product";

/** Índice leve para busca, filtros e grade virtual (carregado sob demanda). */
export const searchIndex: Product[] = ${JSON.stringify(products, null, 2)};
`;

  const manifest = `// AUTO-GENERATED. DO NOT EDIT.
export type CatalogChunkMeta = {
  id: string;
  cor: string;
  productCount: number;
};

export const catalogChunks: CatalogChunkMeta[] = ${JSON.stringify(catalogChunks, null, 2)};

export const slugToChunkId: Record<string, string> = ${JSON.stringify(slugToChunkId, null, 2)};

export const idToChunkId: Record<number, string> = ${JSON.stringify(idToChunkId, null, 2)};
`;

  await fs.writeFile(path.join(OUTPUT_CATALOG_DIR, "search-index.generated.ts"), searchIndex, "utf8");
  await fs.writeFile(path.join(OUTPUT_CATALOG_DIR, "manifest.generated.ts"), manifest, "utf8");

  const legacy = `// AUTO-GENERATED. DO NOT EDIT.
/** @deprecated Use \`@/data/catalog/loader\` e search-index com code splitting. */
${PRODUCT_INTERFACE}

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export function findProductByRouteParam(param: string | undefined): Product | undefined {
  if (!param) return undefined;
  const bySlug = products.find((p) => p.slug === param);
  if (bySlug) return bySlug;
  const id = Number(param);
  if (!Number.isNaN(id)) return products.find((p) => p.id === id);
  return undefined;
}
`;
  await fs.writeFile(OUTPUT_LEGACY_TS, legacy, "utf8");
  console.log(`[catalog:generate] Concluído: ${products.length} produtos, ${catalogChunks.length} chunks.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
