import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { products, colorMap } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ProductDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);

  const handleAddToCart = () => {
    addItem({ productId: product.id, size: selectedSize, color: selectedColor }, qty);
    toast.success("Adicionado ao carrinho!", { description: `${product.name} — Tam. ${selectedSize}` });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <div className="flex-1 pb-28">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button onClick={() => navigate("/")} className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">Detalhes</h1>
          <button onClick={() => navigate("/carrinho")} className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card relative">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{totalItems}</span>
            )}
          </button>
        </div>

        {/* Product Image */}
        <div className="px-5 mt-2">
          <div className="rounded-2xl overflow-hidden shadow-elevated bg-secondary">
            <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover" />
          </div>
        </div>

        {/* Product Info */}
        <div className="px-5 mt-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-body text-muted-foreground">{product.category}</p>
              <h2 className="font-display text-xl font-bold text-foreground mt-1">{product.name}</h2>
            </div>
            <button onClick={() => setFav(!fav)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-card mt-1">
              <Heart className={`w-5 h-5 ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
          </div>

          {/* Store */}
          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="font-display text-primary font-bold text-sm">CF</span>
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-foreground">Closet Festa</p>
              <p className="font-body text-xs text-muted-foreground">Loja Oficial ✦</p>
            </div>
          </div>

          {/* Colors */}
          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-2">Selecione a cor</p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-9 h-9 rounded-full border-2 transition-all shadow-card ${selectedColor === c ? "border-primary scale-110" : "border-border"}`}
                  style={{ backgroundColor: colorMap[c] || "#ccc" }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-2">Selecione o tamanho</p>
            <div className="flex gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-12 rounded-xl font-body font-semibold text-sm transition-all shadow-card ${
                    selectedSize === s
                      ? "bg-primary text-primary-foreground shadow-button"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5 flex items-center justify-between">
            <p className="font-body text-sm font-semibold text-foreground">Quantidade</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-card">
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <span className="font-body font-bold text-foreground w-6 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-card">
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-2">Descrição</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border px-5 py-4 z-50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="font-body text-xs text-muted-foreground">Preço total</p>
            <p className="font-display text-2xl font-bold text-foreground">
              R$ {(product.price * qty).toLocaleString("pt-BR")}
            </p>
          </div>
          <button onClick={handleAddToCart} className="flex items-center gap-2 bg-primary text-primary-foreground font-body font-bold text-sm px-6 py-3.5 rounded-2xl shadow-button transition-transform hover:scale-105 active:scale-95">
            <ShoppingCart className="w-5 h-5" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailScreen;
