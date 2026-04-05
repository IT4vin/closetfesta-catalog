import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";
import ClosetSearchBar from "@/components/ClosetSearchBar";

const CartScreen = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");

  const subtotal = items.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.productId);
    return sum + (p?.preco || 0) * item.qty;
  }, 0);

  const shipping = subtotal > 500 ? 0 : 49.9;
  const total = subtotal + shipping;

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className={`flex-1 ${items.length > 0 ? "pb-44" : "pb-24"}`}>
        {/* Header */}
        <div className="flex items-center px-5 pt-5 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="flex-1 text-center font-display text-lg font-bold text-foreground pr-10">
            Carrinho
          </h1>
        </div>

        <div className="px-5 pb-2">
          <ClosetSearchBar />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="font-display text-lg font-semibold text-foreground mb-1">Carrinho vazio</p>
            <p className="font-body text-sm text-muted-foreground text-center">
              Adicione vestidos incríveis ao seu carrinho
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="px-5 space-y-3 mt-2">
              {items.map((item, idx) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div
                    key={`${item.productId}-${idx}`}
                    className="flex gap-3 p-3 rounded-2xl bg-secondary/60 shadow-card"
                  >
                    {/* Image */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                      <img
                        src={product.imagem}
                        alt={product.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground leading-tight truncate">
                          {product.nome}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          Tamanho {item.size}
                        </p>
                      </div>
                      <p className="font-display text-base font-bold text-primary">
                        R$ {(product.preco * item.qty).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        onClick={() => removeItem(idx)}
                        className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(idx, -1)}
                          className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shadow-sm border border-border"
                        >
                          <Minus className="w-3 h-3 text-foreground" />
                        </button>
                        <span className="font-body text-sm font-bold text-foreground w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(idx, 1)}
                          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code */}
            <div className="px-5 mt-5">
              <div className="flex gap-2 p-1.5 rounded-2xl bg-secondary/80 shadow-card">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Código promocional"
                  className="flex-1 bg-transparent px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-body text-sm font-semibold shadow-button transition-transform active:scale-95">
                  Aplicar
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="px-5 mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                <span className="font-body text-sm font-semibold text-foreground">
                  R$ {subtotal.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="border-t border-border/50" />
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Frete</span>
                <span className="font-body text-sm font-semibold text-foreground">
                  {shipping === 0 ? "Grátis" : `R$ ${shipping.toLocaleString("pt-BR")}`}
                </span>
              </div>
              <div className="border-t border-border/50" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-display text-base font-bold text-foreground">
                  Total{" "}
                  <span className="text-xs font-body text-muted-foreground font-normal">
                    ({items.reduce((s, i) => s + i.qty, 0)} itens)
                  </span>
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  R$ {total.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-40 border-t border-border bg-background/95 px-5 py-4 backdrop-blur-md">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-display text-base font-bold text-white shadow-button transition-transform hover:scale-[1.02] active:scale-95">
            <ShoppingBag className="h-5 w-5" />
            Finalizar Compra
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default CartScreen;
