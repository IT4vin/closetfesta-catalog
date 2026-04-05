import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Share2 } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { buildFavoritesShareText } from "@/lib/favoritesShare";

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

  const handleShare = async () => {
    if (favProducts.length === 0) {
      toast.info("Adicione vestidos aos favoritos para compartilhar sua lista.");
      return;
    }

    const textoCompleto = buildFavoritesShareText(favProducts);
    const shareTitle = "Meus Favoritos - Closet Festa";

    const copyToClipboard = async () => {
      await navigator.clipboard.writeText(textoCompleto);
      toast.success("Texto copiado! Cole no WhatsApp ou outro app.");
    };

    try {
      if (typeof navigator.share === "function") {
        // WhatsApp/Telegram em vários Androids usam só `url` e descartam `text` se ambos forem enviados.
        const payload: ShareData = { title: shareTitle, text: textoCompleto };
        const can =
          typeof navigator.canShare !== "function" ? true : navigator.canShare(payload);

        if (can) {
          try {
            await navigator.share(payload);
            toast.success("Compartilhado!");
            return;
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return;
          }
        }
      }

      await copyToClipboard();
    } catch {
      toast.error("Não foi possível compartilhar ou copiar. Tente novamente.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F8F4F0] pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pb-4 pt-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-card"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="min-w-0 flex-1 text-center font-display text-lg font-bold tracking-tight text-foreground">
          Favoritos
        </h1>
        <button
          type="button"
          onClick={handleShare}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#9C2F45] px-3 py-2 text-white shadow-[0_4px_14px_-3px_rgba(156,47,69,0.45),0_2px_8px_-2px_rgba(0,0,0,0.08)] transition-transform active:scale-[0.98]"
          aria-label="Compartilhar lista de favoritos"
        >
          <Share2 className="h-4 w-4 shrink-0" strokeWidth={2.25} />
          <span className="font-body text-xs font-semibold sm:text-sm">Compartilhar</span>
        </button>
      </div>

      {favProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground/30" />
          <p className="mb-1 font-display text-lg font-semibold text-foreground">Nenhum favorito ainda</p>
          <p className="text-center font-body text-sm text-muted-foreground">
            Explore nossos vestidos e salve os que mais amou
          </p>
        </div>
      ) : (
        <div className="space-y-3 px-5 pb-8">
          {favProducts.map((p) => (
            <div
              key={p.id}
              className="flex gap-3 rounded-2xl border border-border/30 bg-white p-3 shadow-card"
            >
              <div
                className="h-24 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl shadow-sm"
                onClick={() => navigate(`/produto/${p.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/produto/${p.id}`);
                  }
                }}
              >
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="font-body text-xs text-muted-foreground">{p.category}</p>
                  <p className="line-clamp-2 font-display text-sm font-semibold leading-tight text-foreground">
                    {p.name}
                  </p>
                </div>
                <p className="font-display text-base font-bold text-[#9C2F45]">R$ {p.price.toLocaleString("pt-BR")}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={() => removeFav(p.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9C2F45]/10"
                  aria-label="Remover dos favoritos"
                >
                  <Heart className="h-4 w-4 fill-[#9C2F45] text-[#9C2F45]" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addItem({ productId: p.id, size: "M", color: p.colors[0] });
                    toast.success("Adicionado ao carrinho!");
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9C2F45] shadow-sm"
                  aria-label="Adicionar ao carrinho"
                >
                  <ShoppingCart className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default FavoritesScreen;
