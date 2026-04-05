import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/contexts/SearchContext";

type ClosetSearchBarProps = {
  className?: string;
};

const ClosetSearchBar = ({ className }: ClosetSearchBarProps) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, clearSearch, filteredProducts, hasActiveSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!hasActiveSearch) return [];
    return filteredProducts.slice(0, 6);
  }, [filteredProducts, hasActiveSearch]);

  const showPanel = open && hasActiveSearch && suggestions.length > 0;

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

  const pickSuggestion = useCallback(
    (slug: string, label: string) => {
      setSearchQuery(label);
      setOpen(false);
      inputRef.current?.blur();
      navigate(`/produto/${slug}`);
    },
    [setSearchQuery, navigate],
  );

  const hasText = searchQuery.length > 0;

  return (
    <div ref={rootRef} className={cn("relative z-[60]", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-transparent bg-[#F5F0EB] px-3 py-2.5 shadow-card transition-[box-shadow,border-color] duration-200",
          open && "border-[#9C2F45]/25 shadow-[0_12px_40px_-12px_rgba(156,47,69,0.35),0_4px_16px_-4px_rgba(0,0,0,0.08)]",
        )}
      >
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Buscar vestidos, cores ou estilos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className="min-w-0 flex-1 bg-transparent font-body text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Buscar vestidos, cores ou estilos"
          aria-expanded={showPanel}
          aria-controls="closet-search-suggestions"
          aria-autocomplete="list"
        />
        {hasText && (
          <button
            type="button"
            onClick={() => {
              clearSearch();
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/80 hover:text-[#9C2F45]"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>
        )}
      </div>

      <div
        id="closet-search-suggestions"
        role="listbox"
        aria-label="Sugestões de busca"
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-2xl border border-[#E8DFD6] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18),0_8px_24px_-8px_rgba(156,47,69,0.12)] transition-all duration-200 ease-out",
          showPanel
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <ul className="max-h-[min(320px,50vh)] divide-y divide-[#F0E8E0] py-1">
          {suggestions.map((p) => (
            <li key={p.id} role="option">
              <button
                type="button"
                className="flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-[#9C2F45]/[0.07]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickSuggestion(p.slug, p.nome)}
              >
                <span className="font-body text-sm font-semibold text-foreground line-clamp-2">{p.nome}</span>
                <span className="font-body text-xs text-muted-foreground">
                  {p.categoriaTipo}
                  <span className="mx-1.5 text-[#D4C4B8]">·</span>
                  {p.coresDisponiveis.slice(0, 3).join(", ")}
                  {p.coresDisponiveis.length > 3 ? "…" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClosetSearchBar;
