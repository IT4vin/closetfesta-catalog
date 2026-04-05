import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const FavoritesScreen = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [favIds, setFavIds] = useState<Set<number>>(new Set(products.slice(0, 4).map((p) => p.id)));

  const removeFav = (id: number) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast("Removido dos favoritos");
  };

  const favProducts = products.filter((p) => favIds.has(p.id));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-card">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center font-display text-lg font-bold text-foreground pr-10">Favoritos</h1>
      </div>

      {favProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <p className="font-display text-lg font-semibold text-foreground mb-1">Nenhum favorito ainda</p>
          <p className="font-body text-sm text-muted-foreground text-center">Explore nossos vestidos e salve os que mais amou</p>
        </div>
      ) : (
        <div className="px-5 space-y-3 pb-8">
          {favProducts.map((p) => (
            <div key={p.id} className="flex gap-3 p-3 rounded-2xl bg-secondary/60 shadow-card">
              <div
                className="w-20 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm cursor-pointer"
                onClick={() => navigate(`/produto/${p.id}`)}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <p className="font-body text-xs text-muted-foreground">{p.category}</p>
                  <p className="font-display text-sm font-semibold text-foreground leading-tight truncate">{p.name}</p>
                </div>
                <p className="font-display text-base font-bold text-primary">R$ {p.price.toLocaleString("pt-BR")}</p>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <button onClick={() => removeFav(p.id)} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-primary text-primary" />
                </button>
                <button
                  onClick={() => {
                    addItem({ productId: p.id, size: "M", color: p.colors[0] });
                    toast.success("Adicionado ao carrinho!");
                  }}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesScreen;
