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
import Image from "next/image";                    // ← Import adicionado
import {
  CORES_CATEGORIA,
  TIPOS_CATEGORIA,
  colorMap,
  type CorCategoria,
  type TipoCategoria,
} from "@/data/products";
import bannerPromo from "@/assets/banner-promo.jpg";
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
          {/* ==================== HEADER ==================== */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            {/* LOGO SVG - Substituído aqui */}
            <div className="flex items-center">
              <Image
                src="/logo/logo.svg"
                alt="Closet Festa"
                width={160}
                height={45}
                className="h-9 w-auto"
                priority
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/carrinho")}
              className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card relative"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Resto do código permanece igual */}
          <div className="px-5 mt-2">
            <ClosetSearchBar />
          </div>

          {/* ... (todo o restante do seu código continua igual) ... */}
          {/* Banner, Categorias, Novos Chegados, etc. */}
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default HomeScreen;