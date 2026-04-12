import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, Heart, Sparkles } from "lucide-react";
import { CORES_CATEGORIA, colorMap, type CorCategoria } from "@/data/catalog";
import lojaBanner from "@loja-imagem/loja-imagem.svg";
import logoUrl from "@/assets/logo.svg?url";
import SideDrawer from "@/components/SideDrawer";
import BottomNav from "@/components/BottomNav";
import ClosetSearchBar from "@/components/ClosetSearchBar";
import HighlightedText from "@/components/HighlightedText";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";



const MARSALA = "#9C2F45";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const {
    filteredProducts,
    hasActiveSearch,
    searchQuery,
    clearSearch,
    colorCategoryFilter,
    setColorCategoryFilter,
    clearCategoryFilters,
    clearAllFilters,
    hasActiveCategoryFilter,
  } = useSearch();

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRef = useRef<HTMLElement>(null);

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDrawerNav = (path: string) => {
    setDrawerOpen(false);
    setTimeout(() => navigate(path), 300);
  };

  const onPickColor = (c: CorCategoria) => {
    setColorCategoryFilter(colorCategoryFilter === c ? null : c);
  };

  const showEmpty =
    filteredProducts.length === 0 && (hasActiveSearch || hasActiveCategoryFilter);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    ro.observe(el);
    setHeaderHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: MARSALA }}>
      <div className="absolute inset-y-0 left-0 w-[78%] max-w-xs z-10">
        <SideDrawer onClose={() => setDrawerOpen(false)} onNavigate={handleDrawerNav} />
      </div>

      <div
        className={cn(
          "relative z-20 flex flex-col min-h-screen bg-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          drawerOpen && "translate-x-[78%] scale-[0.92] rounded-2xl shadow-2xl",
        )}
        style={{ transformOrigin: "center center" }}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/30 z-[55] rounded-2xl transition-opacity duration-300",
            drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          )}
          onClick={() => setDrawerOpen(false)}
        />

        <header
          ref={headerRef}
          className="fixed left-0 right-0 top-0 z-50 bg-background/95 backdrop-blur-md pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:pb-3.5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center justify-between px-5 pb-1 sm:pb-1.5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary shadow-card"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center px-2">
              <img
                src={logoUrl}
                alt="Closet Festa"
                width={1792}
                height={1792}
                className="h-28 w-auto max-w-[calc(100vw-7rem)] object-contain object-center drop-shadow-sm sm:h-32"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/carrinho")}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary shadow-card"
            >
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          <div className="mt-1 px-5 sm:mt-1.5">
            <ClosetSearchBar />
          </div>
        </header>

        {/* Reserva espaço do header fixo para o conteúdo não “pular” por baixo */}
        <div
          className="shrink-0"
          style={{ height: headerHeight }}
          aria-hidden
        />

        <div className="flex-1 pb-24">
          <div className="relative bg-background">
            <div className="px-5 pt-2">
              <div className="overflow-hidden rounded-2xl shadow-elevated">
                <img
                  src={lojaBanner}
                  alt="Closet Festa"
                  className="h-44 w-full object-cover"
                />
              </div>
            </div>

            <div className="mt-6 px-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-foreground">Cores</h3>
                <div className="flex shrink-0 items-center gap-2">
                  {hasActiveCategoryFilter && (
                    <button
                      type="button"
                      onClick={clearCategoryFilters}
                      className="font-body text-xs font-semibold text-[#9C2F45] underline-offset-2 hover:underline"
                    >
                      Limpar filtro
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={clearCategoryFilters}
                    className="font-body text-sm font-semibold text-primary"
                  >
                    Ver todas
                  </button>
                </div>
              </div>
              <div className="scrollbar-hide flex gap-2.5 overflow-x-auto pb-2">
                {CORES_CATEGORIA.map((nomeCor) => {
                  const selected = colorCategoryFilter === nomeCor;
                  const hex = colorMap[nomeCor];
                  return (
                    <button
                      key={nomeCor}
                      type="button"
                      onClick={() => onPickColor(nomeCor)}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-card transition-all duration-200",
                        "bg-[#F5F0EB] hover:shadow-[0_8px_24px_-8px_rgba(156,47,69,0.2)]",
                        selected &&
                          "bg-white shadow-[0_12px_32px_-10px_rgba(156,47,69,0.35)] ring-2 ring-[#9C2F45] ring-offset-2 ring-offset-background",
                      )}
                    >
                      <span
                        className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: hex }}
                      />
                      <span
                        className={cn(
                          "whitespace-nowrap font-body text-sm font-medium",
                          selected ? "font-semibold text-[#9C2F45]" : "text-foreground",
                        )}
                      >
                        {nomeCor}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative bg-background">
            <div className="mt-6 px-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-foreground">Novos Chegados</h3>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="font-body text-sm font-semibold text-primary"
                >
                  Ver todos
                </button>
              </div>
              <div
                key={`${colorCategoryFilter ?? ""}-${searchQuery}`}
                className="grid animate-fade-in grid-cols-2 gap-4"
              >
                {showEmpty ? (
                  <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-[#E8DFD6] bg-[#FFFCFA] px-6 py-14 text-center shadow-[0_12px_40px_-16px_rgba(156,47,69,0.2)]">
                    <p className="font-display text-base font-semibold text-foreground">
                      Nenhum vestido encontrado para esta busca
                    </p>
                    <p className="mt-2 max-w-xs font-body text-sm text-muted-foreground">
                      Combine cor e busca — ou limpe os filtros para ver todo o catálogo.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {hasActiveCategoryFilter && (
                        <button
                          type="button"
                          onClick={clearCategoryFilters}
                          className="rounded-full border-2 border-[#9C2F45] bg-transparent px-5 py-2.5 font-body text-sm font-semibold text-[#9C2F45] transition-transform active:scale-[0.98]"
                        >
                          Limpar filtro
                        </button>
                      )}
                      {hasActiveSearch && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="rounded-full border-2 border-[#9C2F45]/40 px-5 py-2.5 font-body text-sm font-semibold text-foreground transition-transform active:scale-[0.98]"
                        >
                          Limpar busca
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="rounded-full bg-[#9C2F45] px-6 py-2.5 font-body text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(156,47,69,0.45)] transition-transform active:scale-[0.98]"
                      >
                        Limpar tudo
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer overflow-hidden rounded-2xl bg-secondary shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                      onClick={() => navigate(`/produto/${p.slug}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/produto/${p.slug}`);
                        }
                      }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFav(p.id);
                          }}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-card backdrop-blur-sm"
                        >
                          <Heart
                            className={`h-4 w-4 ${favorites.has(p.id) ? "fill-primary text-primary" : "text-foreground"}`}
                          />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 font-body text-xs text-muted-foreground">
                          <HighlightedText text={p.categoriaTipo} query={searchQuery} />
                        </p>
                        <p className="mt-0.5 line-clamp-2 font-body text-sm font-semibold text-foreground">
                          <HighlightedText text={p.nome} query={searchQuery} />
                        </p>
                        <p className="mt-1 font-display text-base font-bold text-primary">
                          R$ {p.preco.toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <section
            className="relative mt-10 px-5 pb-8"
            aria-labelledby="ofertas-ilimitadas-heading"
          >
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#9C2F45] via-[#B84A62] to-[#7A2436] p-6 text-primary-foreground shadow-elevated">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                      Próxima parada
                    </p>
                    <h2 id="ofertas-ilimitadas-heading" className="font-display text-xl font-bold leading-tight">
                      Ofertas Ilimitadas
                    </h2>
                    <p className="mt-1 max-w-md font-body text-sm text-white/90">
                      Novas peças e condições especiais em breve. Continue rolando para explorar o restante do site.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="shrink-0 rounded-full bg-white px-6 py-3 font-body text-sm font-bold text-[#9C2F45] shadow-button transition-transform hover:scale-[1.02]"
                >
                  Explorar catálogo
                </button>
              </div>
            </div>
          </section>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default HomeScreen;
