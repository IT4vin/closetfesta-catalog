import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildCatalogUrl } from "@/lib/catalogNavigation";
import { isGenericVestidosCategory, productDisplayName } from "@/lib/productDisplay";
import { useSearch } from "@/contexts/SearchContext";

type HomeHeaderSearchProps = {
  scrolled?: boolean;
};

const HomeHeaderSearch = ({ scrolled }: HomeHeaderSearchProps) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, clearSearch, filteredProducts, hasActiveSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!hasActiveSearch) return [];
    return filteredProducts.slice(0, 5);
  }, [filteredProducts, hasActiveSearch]);

  const goToCatalog = useCallback(
    (q?: string) => {
      setOpen(false);
      navigate(buildCatalogUrl({ q: q ?? searchQuery }));
    },
    [navigate, searchQuery],
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const hasText = searchQuery.length > 0;
  const showPanel = open && (hasActiveSearch || hasText);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Pesquisar"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full p-2 text-marsala transition hover:bg-marsala/5"
      >
        {open ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          "absolute right-0 top-[calc(100%+0.75rem)] z-[70] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-warm-gray" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Buscar vestidos, cores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                goToCatalog();
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-sm text-marsala outline-none placeholder:text-warm-gray/70"
            aria-label="Buscar no catálogo"
          />
          {hasText && (
            <button
              type="button"
              onClick={() => {
                clearSearch();
                inputRef.current?.focus();
              }}
              className="rounded-full p-1 text-warm-gray hover:text-marsala"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {showPanel && (
          <div className="max-h-[min(280px,45vh)] overflow-y-auto">
            {suggestions.length > 0 ? (
              <ul className="divide-y divide-border py-1">
                {suggestions.map((p) => (
                  <li key={`${p.slug}-${p.imagem}`}>
                    <button
                      type="button"
                      className="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition hover:bg-marsala/5"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setOpen(false);
                        navigate(`/produto/${p.slug}`);
                      }}
                    >
                      <span className="line-clamp-2 text-sm font-medium text-marsala">
                        {productDisplayName(p.nome)}
                      </span>
                      <span className="text-xs text-warm-gray">
                        {!isGenericVestidosCategory(p.categoriaTipo) && (
                          <>
                            {p.categoriaTipo}
                            <span className="mx-1.5 text-border">·</span>
                          </>
                        )}
                        {p.cor}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              hasText && (
                <p className="px-4 py-3 text-sm text-warm-gray">Nenhum resultado — tente outra busca.</p>
              )
            )}
            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={() => goToCatalog()}
                className="w-full rounded-full bg-marsala px-4 py-2.5 text-xs font-medium text-primary-foreground transition hover:bg-marsala-dark"
              >
                {hasText ? "Ver resultados no catálogo" : "Abrir catálogo completo"}
              </button>
            </div>
          </div>
        )}
      </div>

      {!open && scrolled === false && (
        <span className="sr-only">Buscar no catálogo Closet Festa</span>
      )}
    </div>
  );
};

export default HomeHeaderSearch;
