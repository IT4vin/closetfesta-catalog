/**
 * Mede tamanhos dos artefatos em dist/ após `npm run build`.
 * Uso: npm run build && node scripts/measure-bundle.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const DIST = path.resolve(process.cwd(), "dist");

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  try {
    await fs.access(DIST);
  } catch {
    console.error("Pasta dist/ não encontrada. Execute: npm run build");
    process.exitCode = 1;
    return;
  }

  const files = await walk(DIST);
  const assets = await Promise.all(
    files
      .filter((f) => /\.(js|css)$/.test(f))
      .map(async (f) => {
        const st = await fs.stat(f);
        return { rel: path.relative(DIST, f).replace(/\\/g, "/"), bytes: st.size };
      }),
  );

  assets.sort((a, b) => b.bytes - a.bytes);

  const total = assets.reduce((s, a) => s + a.bytes, 0);
  console.log("\n=== Bundle dist/ (JS + CSS) ===\n");
  for (const a of assets) {
    console.log(`${formatKb(a.bytes).padStart(10)}  ${a.rel}`);
  }
  console.log(`\n${"—".repeat(42)}`);
  console.log(`${formatKb(total).padStart(10)}  TOTAL\n`);

  const catalogMain = assets.filter((a) => a.rel.includes("catalog"));
  const index = assets.find((a) => /assets\/index-/.test(a.rel));
  if (index) {
    console.log(`Chunk principal (index): ${formatKb(index.bytes)}`);
  }
  if (catalogMain.length) {
    console.log(`Chunks de catálogo: ${catalogMain.length} arquivo(s), ${formatKb(catalogMain.reduce((s, a) => s + a.bytes, 0))}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
