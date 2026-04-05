import { useState } from "react";
import { Menu, ShoppingBag, Search, SlidersHorizontal, Heart, Home, Grid3X3, User, ArrowRight } from "lucide-react";
import { products, colorMap } from "@/data/products";
import bannerPromo from "@/assets/banner-promo.jpg";

interface HomeScreenProps {
  onSelectProduct: (id: number) => void;
}

const categories = Object.entries(colorMap);

const HomeScreen = ({ onSelectProduct }: HomeScreenProps) => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFav = (id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="relative flex flex-col h-full bg-background overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground tracking-wide">Closet Festa</h1>
          <button className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card relative">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">2</span>
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
                <span
                  className="w-4 h-4 rounded-full shrink-0 border border-border"
                  style={{ backgroundColor: color }}
                />
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
            {products.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className="bg-secondary rounded-2xl overflow-hidden shadow-card cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => onSelectProduct(p.id)}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
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

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-6 py-3">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-button">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-[10px] font-body font-bold text-primary">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-[10px] font-body text-muted-foreground">Categorias</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-[10px] font-body text-muted-foreground">Favoritos</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-[10px] font-body text-muted-foreground">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
