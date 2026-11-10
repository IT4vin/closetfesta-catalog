# Performance do catálogo — arquitetura atual

O site usa **uma única fonte de produtos**: o Supabase do sistema administrativo Closet Festa, acessado pela função pública de leitura `closet-public-catalog`.

## Limpeza realizada

- A branch atual deixou de conter as 1.189 fotos duplicadas em `produtos/` e `public/produtos/`, que somavam cerca de 2.40 GB.
- Foram removidos o gerador anterior `scripts/generate-catalog.mjs`, os módulos gerados (índice, manifest e chunks) e os ganchos de `prebuild`/`predev`.
- O site mantém apenas seus banners, fotos editoriais em `src/assets/`, logos e ícones, além da camada de visualização.
- `src/data/catalog/loader.ts` consulta a função do Supabase e compartilha os produtos com busca, filtros, detalhes, carrinho e favoritos.
- A busca recarrega o catálogo ao abrir, ao voltar à aba e periodicamente. A API mantém cache temporário de leitura.
- A função disponibiliza links temporários às imagens no bucket privado `product-images`.

## Validação

O workflow `.github/workflows/catalog-supabase.yml` verifica a ausência dos arquivos locais, executa TypeScript, os testes automatizados, compila o site e consulta a API real do Supabase.

**Nota sobre o espaço no GitHub:** remover arquivos da branch não reduz imediatamente o armazenamento dos blobs em commits antigos. Não houve reescrita forçada do histórico, preservando a integridade das referências existentes.
