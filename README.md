# Closet Festa — catálogo

Aplicação web do catálogo de aluguel (Vite, React, TypeScript).

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run test` — testes (Vitest)

## Integração com o sistema de gestão (fonte única de produtos)

O catálogo lê os **mesmos produtos** do Supabase do sistema [Closet Festa Administrativo](https://github.com/IT4vin/closetfesta), projeto `roqcwdlsuawrdbmnwbvv`. Os produtos **não** são lidos dos arquivos de imagens no GitHub para montar a vitrine.

- A fonte de leitura é `src/data/catalog/loader.ts`, que consulta `https://roqcwdlsuawrdbmnwbvv.supabase.co/functions/v1/closet-public-catalog`.
- A função está versionada em `supabase/functions/closet-public-catalog/index.ts` e implantada no **mesmo** projeto Supabase do sistema administrativo.
- Criar, editar, desativar e excluir produtos, atualizar preços, cores, tamanhos e fotos no administrativo altera o que o catálogo exibe após sua próxima consulta. A atualização acontece ao abrir, ao retornar para a aba e a cada 2 minutos, com cache de até 2 minutos na API.
- Apenas produtos **ativos e não excluídos** são retornados. Não exibir uma peça no catálogo pode ser resolvido desativando-a no sistema de gestão; os arquivos antigos do GitHub não são usados como fallback.
- Fotos estão na bucket privada `product-images`; a função emite URLs temporárias para clientes, sem tornar a bucket pública.
- A API pública devolve exclusivamente atributos da vitrine. **Clientes, contratos, credenciais, custos de compra e detalhes internos do estoque não são divulgados.** A chave service_role é usada apenas na função do servidor e nunca no navegador.
- O catálogo é uma vitrine de **aluguel**, não de venda. Estar publicado não garante disponibilidade na data de um evento; a reserva é confirmada pela equipe.
- Preservamos os IDs numéricos dos SKUs já existentes (`010001` equivale ao ID `10001`) e, quando SKU/cor/categoria não mudam, as rotas antigas, como `/produto/vestidos-branco-010001`.
- As imagens duplicadas de `produtos/` e `public/produtos/`, os arquivos `*.generated.ts` e o gerador antigo foram **excluídos da versão atual**. As fotos usadas no catálogo permanecem no Supabase. As referências antigas ainda podem existir no histórico Git até uma limpeza separada do histórico.

### Publicação

O catálogo está configurado para Vercel (`vercel.json`); cada push para o branch principal gera uma nova publicação **se o projeto Vercel estiver ligado ao GitHub**.

A rotina `.github/workflows/catalog-supabase.yml` valida a compilação, os testes e a resposta HTTP real da API pública usando apenas dados de vitrine.

### Operação e manutenção

1. Faça a alteração em **Sistema de Gestão → Produtos**, não no catálogo do GitHub.
2. Confira que o produto está ativo e possui foto cadastrada.
3. Abra/recarregue o catálogo público; o conteúdo será atualizado sem precisar de novo build.
4. Se o produto não aparecer, confira o estado da função `closet-public-catalog` no Supabase e a rotina de verificação do GitHub Actions.


### Limpeza do catálogo antigo (novembro de 2026)

- Excluídas as 1.189 cópias JPEG/PNG/WebP versionadas, antes distribuídas entre `produtos/` e `public/produtos/` (aproximadamente 2.40 GB somados).
- Removido `scripts/generate-catalog.mjs`, que recriava as pastas de imagens e o catálogo estático; desativados `predev`, `prebuild` e `catalog:generate` do `package.json`.
- Excluídos os índices e chunks gerados que duplicavam nomes, fotos e preços antigos.
- Preservados `src/assets/` (imagens de ambientação/banner), favicon, logos, páginas, rotas, carrinho, filtros, favoritos e o endpoint no Supabase.
- **Atenção:** exclusão de arquivos na branch atual reduz o checkout e o contexto do build, mas NÃO apaga automaticamente os blobs dos commits antigos. Reescrever o histórico demandaria ação específica com cuidado para não invalidar clones e deploys existentes.
