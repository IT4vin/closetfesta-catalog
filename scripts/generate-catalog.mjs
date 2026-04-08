import fs from "node:fs/promises";
import path from "node:path";

const REPO_ROOT = path.resolve(process.cwd());
const INPUT_DIR = path.join(REPO_ROOT, "produtos");
const OUTPUT_PUBLIC_DIR = path.join(REPO_ROOT, "public", "produtos");
const OUTPUT_TS = path.join(REPO_ROOT, "src", "data", "catalog.generated.ts");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function normalizeSlugPart(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseBRLFromFilename(name) {
  // Expected patterns:
  // "010002 - R$ 1.140,00"
  // "010004 - R$ 960,00"
  const m = name.match(/R\$\s*([0-9.]+),([0-9]{2})/i);
  if (!m) return null;
  const intPart = m[1].replace(/\./g, "");
  const fracPart = m[2];
  const n = Number(`${intPart}.${fracPart}`);
  return Number.isFinite(n) ? n : null;
}

function parseCodeFromFilename(name) {
  // "010002 - R$ 1.140,00" => 010002
  const m = name.match(/^\s*([0-9]+)\s*-/);
  if (!m) return null;
  return m[1];
}

function parseNameFromFilename(name, codigo) {
  // Supports:
  // "010002 - R$ 1.140,00"                 => null (falls back to "<tipo> <codigo>")
  // "010002 - Petra - R$ 1.140,00"         => "Petra"
  // "010002 - Petra Longo - R$ 1.140,00"   => "Petra Longo"
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

function escapeTsString(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

async function main() {
  // Clean output public dir (keep it deterministic)
  await ensureDir(OUTPUT_PUBLIC_DIR);
  await fs.rm(OUTPUT_PUBLIC_DIR, { recursive: true, force: true });
  await ensureDir(OUTPUT_PUBLIC_DIR);

  let inputExists = true;
  try {
    const st = await fs.stat(INPUT_DIR);
    inputExists = st.isDirectory();
  } catch {
    inputExists = false;
  }

  if (!inputExists) {
    const empty = `// AUTO-GENERATED. DO NOT EDIT.
export type CorCategoria = string;
export type TipoCategoria = string;

export interface Product {
  id: number;
  codigo: string;
  nome: string;
  preco: number;
  imagem: string;
  cor: CorCategoria;
  categoriaTipo: string;
  slug: string;
  coresDisponiveis: CorCategoria[];
  tamanhos: string[];
  descricao: string;
  tipos: TipoCategoria[];
}

export const CORES_CATEGORIA: CorCategoria[] = [];
export const TIPOS_CATEGORIA: TipoCategoria[] = [];
export const colorMap: Record<string, string> = {};
export const products: Product[] = [];

export function findProductByRouteParam(param: string | undefined): Product | undefined {
  if (!param) return undefined;
  const bySlug = products.find((p) => p.slug === param);
  if (bySlug) return bySlug;
  const id = Number(param);
  if (!Number.isNaN(id)) return products.find((p) => p.id === id);
  return undefined;
}
`;
    await ensureDir(path.dirname(OUTPUT_TS));
    await fs.writeFile(OUTPUT_TS, empty, "utf8");
    return;
  }

  const allFiles = await listFilesRecursive(INPUT_DIR);
  const imageFiles = allFiles.filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));

  /** @type {Array<any>} */
  const products = [];
  const colorsSet = new Set();
  const typesSet = new Set();

  for (const abs of imageFiles) {
    const rel = path.relative(INPUT_DIR, abs);
    const parts = rel.split(path.sep);
    if (parts.length < 3) continue; // must be <tipo>/<cor>/<file>

    const tipoFolder = parts[0];
    const corFolder = parts[1];
    const fileName = parts.slice(2).join("/"); // keep any extra nesting inside color if ever used

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

    // Copy image preserving structure
    const publicRel = path.join(tipoFolder, corFolder, fileName);
    const publicAbs = path.join(OUTPUT_PUBLIC_DIR, publicRel);
    await copyFileEnsuringDir(abs, publicAbs);

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

    colorsSet.add(cor);
    typesSet.add(tipo);
  }

  products.sort((a, b) => a.id - b.id);

  const CORES_CATEGORIA = Array.from(colorsSet).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const TIPOS_CATEGORIA = Array.from(typesSet).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const out = `// AUTO-GENERATED. DO NOT EDIT.
export type CorCategoria = string;
export type TipoCategoria = string;

export interface Product {
  id: number;
  codigo: string;
  nome: string;
  preco: number;
  imagem: string;
  cor: CorCategoria;
  categoriaTipo: string;
  slug: string;
  coresDisponiveis: CorCategoria[];
  tamanhos: string[];
  descricao: string;
  tipos: TipoCategoria[];
}

export const CORES_CATEGORIA: CorCategoria[] = ${JSON.stringify(CORES_CATEGORIA, null, 2)};
export const TIPOS_CATEGORIA: TipoCategoria[] = ${JSON.stringify(TIPOS_CATEGORIA, null, 2)};

// Pode ser preenchido depois (hex por cor); por enquanto o app usa fallback quando não existe.
export const colorMap: Record<string, string> = {};

export const products: Product[] = ${JSON.stringify(products, null, 2).replaceAll('"', '"')};

export function findProductByRouteParam(param: string | undefined): Product | undefined {
  if (!param) return undefined;
  const bySlug = products.find((p) => p.slug === param);
  if (bySlug) return bySlug;
  const id = Number(param);
  if (!Number.isNaN(id)) return products.find((p) => p.id === id);
  return undefined;
}
`;

  await ensureDir(path.dirname(OUTPUT_TS));
  await fs.writeFile(OUTPUT_TS, out, "utf8");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

