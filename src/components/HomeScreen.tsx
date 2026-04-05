import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  Heart,
  ArrowRight,
  Crown,
  Cake,
  PartyPopper,
  ArrowDownWideNarrow,
  Columns2,
  Flower2,
  Waves,
} from "lucide-react";
import {
  CORES_CATEGORIA,
  TIPOS_CATEGORIA,
  colorMap,
  type CorCategoria,
  type TipoCategoria,
} from "@/data/products";
import bannerPromo from "@/assets/banner-promo.jpg";
import logoUrl from "@/assets/logo.svg?url";
import SideDrawer from "@/components/SideDrawer";
import BottomNav from "@/components/BottomNav";
import ClosetSearchBar from "@/components/ClosetSearchBar";
import HighlightedText from "@/components/HighlightedText";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";

const tipoIcons: Record<TipoCategoria, typeof Crown> = {
  "Vestidos de Noiva": Crown,
  "Vestidos de Madrinha": Heart,
  "Vestidos de Debutante": Cake,
  "Vestidos para Festa": PartyPopper,
  "Vestidos Longos": ArrowDownWideNarrow,
  "Vestidos com Fenda": Columns2,
  "Vestidos Evase": Flower2,
  "Vestidos Sereia": Waves,
};

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
    typeCategoryFilter,
    setColorCategoryFilter,
    setTypeCategoryFilter,
    clearCategoryFilters,
    clearAllFilters,
    hasActiveCategoryFilter,
  } = useSearch();

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const onPickTipo = (t: TipoCategoria) => {
    setTypeCategoryFilter(typeCategoryFilter === t ? null : t);
  };

  const showEmpty =
    filteredProducts.length === 0 && (hasActiveSearch || hasActiveCategoryFilter);

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

        <div className="flex-1 pb-24">
          <div className="flex items-center justify-between px-5 pb-1 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-1.5 sm:pt-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-11 h-11 shrink-0 rounded-xl bg-secondary flex items-center justify-center shadow-card"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex min-w-0 flex-1 items-center justify-center px-2">
              <img
                src={logoUrl}
                alt="Closet Festa"
                width={1792}
                height={1792}
                className="h-28 w-auto sm:h-32 max-w-[calc(100vw-7rem)] object-contain object-center drop-shadow-sm"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/carrinho")}
              className="w-11 h-11 shrink-0 rounded-xl bg-secondary flex items-center justify-center shadow-card relative"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          <div className="px-5 mt-1 sm:mt-1.5">
            <ClosetSearchBar />
          </div>

          <div className="px-5 mt-5">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-primary">
              <img src={bannerPromo} alt="Promoção Closet Festa" className="w-full h-44 object-cover opacity-40" />
              <div className="absolute inset-0 flex flex-col justify-center px-5">
                <span className="inline-block bg-background/90 text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-2">
                  Oferta Limitada
                </span>
                <h2 className="font-display text-primary-foreground text-lg font-bold leading-tight">
                  Primeira Compra com<br />Desconto Especial
                </h2>
                <button
                  type="button"
                  className="mt-3 flex items-center gap-2 bg-background text-foreground font-body font-bold text-sm px-5 py-2.5 rounded-full w-fit shadow-button transition-transform hover:scale-105"
                >
                  Comprar Agora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 px-5">
            <div className="flex items-center justify-between mb-3 gap-2">
              <h3 className="font-display text-base font-semibold text-foreground">Cores</h3>
              <div className="flex items-center gap-2 shrink-0">
                {hasActiveCategoryFilter && (
                  <button
                    type="button"
                    onClick={clearCategoryFilters}
                    className="text-[#9C2F45] text-xs font-semibold font-body underline-offset-2 hover:underline"
                  >
                    Limpar filtro
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearCategoryFilters}
                  className="text-primary text-sm font-semibold font-body"
                >
                  Ver todas
                </button>
              </div>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
              {CORES_CATEGORIA.map((nomeCor) => {
                const selected = colorCategoryFilter === nomeCor;
                const hex = colorMap[nomeCor];
                return (
                  <button
                    key={nomeCor}
                    type="button"
                    onClick={() => onPickColor(nomeCor)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-card shrink-0 transition-all duration-200",
                      "bg-[#F5F0EB] hover:shadow-[0_8px_24px_-8px_rgba(156,47,69,0.2)]",
                      selected &&
                        "ring-2 ring-[#9C2F45] ring-offset-2 ring-offset-background bg-white shadow-[0_12px_32px_-10px_rgba(156,47,69,0.35)]",
                    )}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: hex }}
                    />
                    <span
                      className={cn(
                        "text-sm font-body font-medium whitespace-nowrap",
                        selected ? "text-[#9C2F45] font-semibold" : "text-foreground",
                      )}
                    >
                      {nomeCor}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 px-5">
            <h3 className="font-display text-base font-semibold text-foreground mb-3">Estilo</h3>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
              {TIPOS_CATEGORIA.map((tipo) => {
                const Icon = tipoIcons[tipo];
                const selected = typeCategoryFilter === tipo;
                return (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => onPickTipo(tipo)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-card shrink-0 transition-all duration-200",
                      "bg-[#F5F0EB] hover:shadow-[0_8px_24px_-8px_rgba(156,47,69,0.2)]",
                      selected &&
                        "ring-2 ring-[#9C2F45] ring-offset-2 ring-offset-background bg-white shadow-[0_12px_32px_-10px_rgba(156,47,69,0.35)]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm",
                        selected ? "text-[#9C2F45]" : "text-foreground/70",
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span
                      className={cn(
                        "text-xs font-body font-medium whitespace-nowrap max-w-[140px] text-left leading-tight",
                        selected ? "text-[#9C2F45] font-semibold" : "text-foreground",
                      )}
                    >
                      {tipo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 px-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-semibold text-foreground">Novos Chegados</h3>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-primary text-sm font-semibold font-body"
              >
                Ver todos
              </button>
            </div>
            <div
              key={`${colorCategoryFilter ?? ""}-${typeCategoryFilter ?? ""}-${searchQuery}`}
              className="grid grid-cols-2 gap-4 animate-fade-in"
            >
              {showEmpty ? (
                <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-[#E8DFD6] bg-[#FFFCFA] px-6 py-14 text-center shadow-[0_12px_40px_-16px_rgba(156,47,69,0.2)]">
                  <p className="font-display text-base font-semibold text-foreground">
                    Nenhum vestido encontrado para esta busca
                  </p>
                  <p className="mt-2 max-w-xs font-body text-sm text-muted-foreground">
                    Combine cores, estilo e busca — ou limpe os filtros para ver todo o catálogo.
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
                    className="bg-secondary rounded-2xl overflow-hidden shadow-card cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
                    onClick={() => navigate(`/produto/${p.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/produto/${p.slug}`);
                      }
                    }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover" loading="lazy" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFav(p.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-card"
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(p.id) ? "fill-primary text-primary" : "text-foreground"}`} />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="font-body text-xs text-muted-foreground line-clamp-1">
                        <HighlightedText text={p.categoriaTipo} query={searchQuery} />
                      </p>
                      <p className="font-body text-sm font-semibold text-foreground mt-0.5 line-clamp-2">
                        <HighlightedText text={p.nome} query={searchQuery} />
                      </p>
                      <p className="font-display text-base font-bold text-primary mt-1">
                        R$ {p.preco.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default HomeScreen;
