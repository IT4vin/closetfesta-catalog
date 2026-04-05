import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { findProductByRouteParam, products, colorMap, type CorCategoria } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import ClosetSearchBar from "@/components/ClosetSearchBar";

const ProductDetailScreen = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();
  const { setColorCategoryFilter } = useSearch();
  const product = findProductByRouteParam(slug) ?? products[0];
  const [selectedColor, setSelectedColor] = useState<CorCategoria>(product.cor);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setSelectedColor(product.cor);
    setQty(1);
  }, [product.id, product.cor]);

  const handleAddToCart = () => {
    addItem({ productId: product.id, size: selectedSize, color: selectedColor }, qty);
    toast.success("Adicionado ao carrinho!", { description: `${product.nome} — Tam. ${selectedSize}` });
  };

  const goShopByColor = (c: CorCategoria) => {
    setColorCategoryFilter(c);
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="flex-1 pb-48">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">Detalhes</h1>
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

        <div className="px-5 pb-2">
          <ClosetSearchBar />
        </div>

        <div className="px-5 mt-2">
          <div className="rounded-2xl overflow-hidden shadow-elevated bg-secondary transition-shadow duration-300">
            <img src={product.imagem} alt={product.nome} className="w-full aspect-[3/4] object-cover" />
          </div>
        </div>

        <div className="px-5 mt-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-body text-muted-foreground">{product.categoriaTipo}</p>
              <h2 className="font-display text-xl font-bold text-foreground mt-1">{product.nome}</h2>
            </div>
            <button
              type="button"
              onClick={() => setFav(!fav)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-card mt-1 shrink-0"
            >
              <Heart className={`w-5 h-5 ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="font-display text-primary font-bold text-sm">CF</span>
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-foreground">Closet Festa</p>
              <p className="font-body text-xs text-muted-foreground">Loja Oficial ✦</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-1">Cores disponíveis</p>
            <p className="font-body text-xs text-muted-foreground mb-3">
              Toque na cor para ver mais vestidos neste tom na loja.
            </p>
            <div className="flex flex-wrap gap-3">
              {product.coresDisponiveis.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => goShopByColor(c)}
                  className="group relative h-11 w-11 rounded-full border-2 border-border shadow-[0_4px_14px_-4px_rgba(0,0,0,0.15)] transition-all duration-200 hover:scale-110 hover:shadow-[0_8px_24px_-6px_rgba(156,47,69,0.35)] hover:ring-2 hover:ring-[#9C2F45]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C2F45]"
                  style={{ backgroundColor: colorMap[c] || "#ccc" }}
                  title={`Ver vestidos em ${c}`}
                  aria-label={`Filtrar loja pela cor ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-2">Cor do seu pedido</p>
            <div className="relative">
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value as CorCategoria)}
                className="w-full appearance-none rounded-2xl border border-border bg-secondary px-4 py-3 font-body text-sm font-medium text-foreground shadow-card outline-none transition-shadow focus:ring-2 focus:ring-[#9C2F45]/30"
              >
                {product.coresDisponiveis.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-2">Selecione o tamanho</p>
            <div className="flex flex-wrap gap-3">
              {product.tamanhos.map((s) => (
                <button
                  key={s}
                  type="button"
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

          <div className="mt-5 flex items-center justify-between">
            <p className="font-body text-sm font-semibold text-foreground">Quantidade</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-card"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <span className="font-body font-bold text-foreground w-6 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shadow-card"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-2">Descrição</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.descricao}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-24 left-0 right-0 z-40 border-t border-border bg-background/95 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="font-body text-xs text-muted-foreground">Preço total</p>
            <p className="font-display text-2xl font-bold text-foreground">
              R$ {(product.preco * qty).toLocaleString("pt-BR")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-body text-sm font-bold text-primary-foreground shadow-button transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProductDetailScreen;
