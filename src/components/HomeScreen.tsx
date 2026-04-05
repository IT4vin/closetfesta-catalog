import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, Search, SlidersHorizontal, Heart, ArrowRight } from "lucide-react";
import { products, colorMap } from "@/data/products";
import bannerPromo from "@/assets/banner-promo.jpg";
import SideDrawer from "@/components/SideDrawer";
import BottomNav from "@/components/BottomNav";
import { useCart } from "@/contexts/CartContext";

const categories = Object.entries(colorMap);

const HomeScreen = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
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

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#9C2F45" }}>
      {/* Drawer content — always rendered behind the main content */}
      <div className="absolute inset-y-0 left-0 w-[78%] max-w-xs z-10">
        <SideDrawer onClose={() => setDrawerOpen(false)} onNavigate={handleDrawerNav} />
      </div>

      {/* Main content — slides right to reveal drawer */}
      <div
        className={`relative z-20 flex flex-col min-h-screen bg-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          drawerOpen
            ? "translate-x-[78%] scale-[0.92] rounded-2xl shadow-2xl"
            : ""
        }`}
        style={{ transformOrigin: "center center" }}
      >
        {/* Dark overlay on displaced content */}
        <div
          className={`absolute inset-0 bg-black/30 z-[55] rounded-2xl transition-opacity duration-300 ${
            drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        <div className="flex-1 pb-24">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display text-lg font-semibold text-foreground tracking-wide">Closet Festa</h1>
            <button
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

          {/* Search */}
          <div className="px-5 mt-2">
            <div className="flex items-center gap-3 bg-secondary rounded-2xl px-4 py-3 shadow-card">
              <Search className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground text-sm font-body flex-1">Buscar vestidos...</span>
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Banner */}
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
                <button className="mt-3 flex items-center gap-2 bg-background text-foreground font-body font-bold text-sm px-5 py-2.5 rounded-full w-fit shadow-button transition-transform hover:scale-105">
                  Comprar Agora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6 px-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-semibold text-foreground">Categorias</h3>
              <button className="text-primary text-sm font-semibold font-body">Ver todas</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(([name, color]) => (
                <div
                  key={name}
                  className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2.5 shadow-card shrink-0 cursor-pointer transition-transform hover:scale-105"
                >
                  <span className="w-4 h-4 rounded-full shrink-0 border border-border" style={{ backgroundColor: color }} />
                  <span className="text-sm font-body font-medium text-foreground whitespace-nowrap">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Arrivals */}
          <div className="mt-6 px-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-semibold text-foreground">Novos Chegados</h3>
              <button className="text-primary text-sm font-semibold font-body">Ver todos</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-secondary rounded-2xl overflow-hidden shadow-card cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-1"
                  onClick={() => navigate(`/produto/${p.id}`)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    <button
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
                    <p className="font-body text-xs text-muted-foreground line-clamp-1">{p.category}</p>
                    <p className="font-body text-sm font-semibold text-foreground mt-0.5 line-clamp-1">{p.name}</p>
                    <p className="font-display text-base font-bold text-primary mt-1">
                      R$ {p.price.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default HomeScreen;
