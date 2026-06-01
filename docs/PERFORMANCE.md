# Relatório de performance do catálogo

Comparação da arquitetura **antes** (monólito `catalog.generated.ts` + grade completa no DOM) e **depois** (chunks por cor, search-index assíncrono, virtualização, rotas lazy).

## Resumo executivo

| Métrica | Antes | Depois | Impacto esperado |
|--------|-------|--------|------------------|
| Catálogo no bundle inicial | ~595 produtos embutidos no grafo do app | Apenas `loader` + `manifest` (~KB) | **TTI e parse JS menores** na primeira visita |
| Carregamento do índice | Síncrono com o app | `import()` dinâmico de `search-index.generated.ts` | **Main thread livre** até interação; chunk separado |
| Chunks por cor | N/A | 27 arquivos sob `catalog/chunks/` | **Prefetch** ao filtrar cor; cache em memória |
| Nós `<img>` na home (sem filtro) | ~595 | ~8–12 visíveis + lazy no restante do lote (24 por página) | **Menos layout/paint e memória DOM** |
| Rotas (`/carrinho`, `/favoritos`, etc.) | Import estático | `React.lazy` + `Suspense` | **JS da rota só ao navegar** |
| Carrinho / favoritos | Importavam `products` inteiro | `getProductsByIds` + `CatalogImage` lazy | **Sem catálogo no chunk da tela** |

## Tamanhos dos artefatos de dados (fonte)

Medição em disco dos arquivos TypeScript gerados (aprox. o que o bundler serializa):

| Artefato | Tamanho (bytes) | Observação |
|----------|-----------------|------------|
| `catalog.generated.ts` (legado) | **289 KB** | Carregado no grafo principal antes |
| `search-index.generated.ts` | **289 KB** | Carregado **sob demanda** (chunk separado) |
| Soma dos `chunks/*.generated.ts` (26 cores) | **291 KB** | **Um chunk por cor**; carregado só com prefetch/filtro |
| `manifest.generated.ts` | **32 KB** | Mapa slug/id → chunk; permanece no bundle mínimo |

> Após `npm install` e `npm run build`, execute `npm run perf:measure` para listar chunks reais em `dist/`.

## Melhorias implementadas

### 1. Catálogo particionado (`scripts/generate-catalog.mjs`)

- Gera `src/data/catalog/search-index.generated.ts` (todos os produtos para busca e grade).
- Gera `src/data/catalog/chunks/<cor>.generated.ts` (um módulo por pasta de cor).
- Gera `manifest.generated.ts` com `slugToChunkId` e `idToChunkId`.
- Mantém `catalog.generated.ts` apenas como legado/ferramentas.

**Impacto:** o Vite não precisa incluir 595 produtos no entry; o índice vira um chunk nomeado `catalog-search-index`.

### 2. Loader assíncrono (`src/data/catalog/loader.ts`)

- `loadSearchIndex()` com cache e import dinâmico.
- `preloadChunkByCor()` ao selecionar filtro de cor.
- `findProductByRouteParam()` e `getProductsByIds()` sem import estático do catálogo completo.

### 3. Virtualização + scroll infinito

- **`react-window`** (`FixedSizeGrid`): 2 colunas, só células visíveis no DOM (~6–10 cards).
- **`CATALOG_PAGE_SIZE` (24)** + incremento ao rolar (`SearchContext` + `onItemsRendered`).

**Impacto:** INP melhor em scroll; menos nós DOM; menos decodificação simultânea de imagens.

### 4. Code splitting de rotas (`src/App.tsx`)

- Todas as páginas principais com `lazy()` e `Suspense` + `RouteFallback`.

**Impacto:** primeira carga não baixa JS de carrinho, favoritos, pedidos, etc.

### 5. `CatalogImage` e lazy nas telas secundárias

- Componente único com `loading="lazy"`, `decoding="async"`, `fetchPriority` configurável.
- Detalhe usa `priority` na imagem LCP; carrinho/favoritos/pedidos usam lazy.

### 6. Core Web Vitals (expectativa)

| Vital | Antes | Depois |
|-------|-------|--------|
| **LCP** | Atrasado por JS grande + muitas imagens acima da dobra competindo | Logo/banner prioritários; grade virtualizada reduz contenção |
| **INP** | Scroll pesado com centenas de nós | Virtualização + lotes de 24 itens |
| **CLS** | Muitos cards montando imagens | Skeleton na grade; `aspect-[3/4]` mantido nos cards |

## Como validar localmente

```bash
npm install
npm run catalog:generate
npm run build
npm run perf:measure
npm run preview
```

No DevTools → **Network**: na primeira visita à `/`, não deve aparecer o chunk `catalog-search-index` até o `SearchProvider` montar; ao rolar a grade, novas imagens `/produtos/...` sobem gradualmente.

## Próximos passos (opcional)

- Persistir favoritos em `localStorage` sem depender de IDs mock.
- Comprimir ainda mais o search-index (campos só para busca + `imagem`).
- Service Worker / cache HTTP para imagens em `/produtos/`.
- `React.memo` nos cards se profiling mostrar re-renders do `SearchContext`.
