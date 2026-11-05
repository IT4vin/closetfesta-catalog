import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { findProductByRouteParam, colorMap, type CorCategoria } from "@/data/catalog";
import type { Product } from "@/data/catalog/product";
import { useCart } from "@/contexts/CartContext";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import { isGenericVestidosCategory, productDisplayName } from "@/lib/productDisplay";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import ClosetSearchBar from "@/components/ClosetSearchBar";
import { CatalogImage } from "@/components/CatalogImage";
import { ProductImageNotice } from "@/components/ProductImageNotice";

type FlyParticle = { id: number; sx: number; sy: number; ex: number; ey: number };

function ReservationFlyDot({
  sx,
  sy,
  ex,
  ey,
  onDone,
}: {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  onDone: () => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const dx = ex - sx;
    const dy = ey - sy;
    const anim = el.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.4)`, opacity: 0.2 },
      ],
      { duration: 520, easing: "cubic-bezier(0.33, 1, 0.68, 1)" },
    );
    anim.finished.then(() => onDoneRef.current()).catch(() => {});
    return () => anim.cancel();
  }, [sx, sy, ex, ey]);

  return (
    <div
      ref={elRef}
      className="pointer-events-none fixed z-[60] h-4 w-4 rounded-full bg-primary shadow-[0_2px_8px_rgba(156,47,69,0.45)] motion-reduce:hidden"
      style={{ left: sx, top: sy }}
      aria-hidden
    />
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto mt-4 w-full max-w-6xl space-y-5 px-5 lg:px-8">
      <div className="aspect-[3/4] w-full max-w-[480px] rounded-2xl bg-secondary lg:aspect-[4/5]" />
      <div className="h-6 w-2/3 rounded-lg bg-secondary" />
      <div className="h-4 w-1/2 rounded-lg bg-secondary" />
    </div>
  );
}

const ProductDetailScreen = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, totalItems, reservationFeedbackGeneration } = useCart();
  const { setColorCategoryFilter } = useSearch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<CorCategoria>("Branco");
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const addReservationBtnRef = useRef<HTMLButtonElement>(null);
  const prevFeedbackGen = useRef<number | null>(null);
  const [headerBasketBumpKey, setHeaderBasketBumpKey] = useState(0);
  const [flyParticle, setFlyParticle] = useState<FlyParticle | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    findProductByRouteParam(slug)
      .then((p) => {
        if (!cancelled) {
          setProduct(p ?? null);
          if (p) setSelectedColor(p.cor as CorCategoria);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.cor as CorCategoria);
    setQty(1);
  }, [product?.id, product?.cor, product]);

  useEffect(() => {
    if (prevFeedbackGen.current === null) {
      prevFeedbackGen.current = reservationFeedbackGeneration;
      return;
    }
    if (reservationFeedbackGeneration > prevFeedbackGen.current) {
      setHeaderBasketBumpKey((k) => k + 1);
    }
    prevFeedbackGen.current = reservationFeedbackGeneration;
  }, [reservationFeedbackGeneration]);

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-background">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">Detalhes</h1>
          <div className="w-11" />
        </div>
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6">
        <p className="font-display text-lg font-semibold text-foreground">Produto não encontrado</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full bg-primary px-6 py-2.5 font-body text-sm font-semibold text-primary-foreground"
        >
          Voltar ao catálogo
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ productId: product.id, size: selectedSize, color: selectedColor }, qty);
    toast.success("Adicionado à reserva!", {
      description: `${productDisplayName(product.nome)} — Tam. ${selectedSize}`,
    });

    const skipMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skipMotion) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const from = addReservationBtnRef.current?.getBoundingClientRect();
        const target = document.querySelector<HTMLElement>("[data-reservation-nav-target]");
        const to = target?.getBoundingClientRect();
        if (!from || !to) return;
        setFlyParticle({
          id: performance.now(),
          sx: from.left + from.width / 2,
          sy: from.top + from.height / 2,
          ex: to.left + to.width / 2,
          ey: to.top + to.height / 2,
        });
      });
    });
  };

  const goShopByColor = (c: CorCategoria) => {
    setColorCategoryFilter(c);
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="mx-auto w-full max-w-6xl flex-1 pb-48 lg:pb-28">
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
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-secondary shadow-card"
          >
            <span
              key={headerBasketBumpKey}
              className={cn(
                "relative inline-flex",
                headerBasketBumpKey > 0 && "motion-safe:animate-reservation-bump",
              )}
            >
              <ShoppingBag className="h-5 w-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </span>
          </button>
        </div>

        <div className="px-5 pb-2 lg:max-w-3xl lg:px-8">
          <ClosetSearchBar />
        </div>

        <div className="mt-2 lg:mt-6 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10 lg:px-8">
          <div className="lg:sticky lg:top-8">
            <div className="px-5 lg:px-0">
              <div className="mx-auto max-w-[480px] overflow-hidden rounded-2xl bg-secondary shadow-elevated transition-shadow duration-300">
                <CatalogImage
                  src={product.imagem}
                  alt={productDisplayName(product.nome)}
                  className="block aspect-[3/4] w-full object-cover lg:h-[min(70vh,600px)] lg:aspect-auto lg:object-contain"
                  priority
                />
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-[480px] px-5 lg:px-0">
              <ProductImageNotice />
            </div>
          </div>

          <div className="mx-auto mt-5 w-full min-w-0 max-w-2xl px-5 lg:mt-0 lg:max-w-none lg:px-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              {!isGenericVestidosCategory(product.categoriaTipo) && (
                <p className="font-body text-sm text-muted-foreground">{product.categoriaTipo}</p>
              )}
              <h2
                className={cn(
                  "font-display text-xl font-bold text-foreground",
                  !isGenericVestidosCategory(product.categoriaTipo) && "mt-1",
                )}
              >
                {productDisplayName(product.nome)}
              </h2>
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
              <p className="font-body text-xs text-muted-foreground">Aluguel oficial ✦</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-1">Cores disponíveis</p>
            <p className="font-body text-xs text-muted-foreground mb-3">
              Toque na cor para ver mais vestidos neste tom no catálogo de aluguel.
            </p>
            <div className="flex flex-wrap gap-3">
              {product.coresDisponiveis.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => goShopByColor(c as CorCategoria)}
                  className="group relative h-11 w-11 rounded-full border-2 border-border shadow-[0_4px_14px_-4px_rgba(0,0,0,0.15)] transition-all duration-200 hover:scale-110 hover:shadow-[0_8px_24px_-6px_rgba(156,47,69,0.35)] hover:ring-2 hover:ring-[#9C2F45]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C2F45]"
                  style={{ backgroundColor: colorMap[c as CorCategoria] || "#ccc" }}
                  title={`Ver vestidos em ${c}`}
                  aria-label={`Filtrar catálogo pela cor ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="font-body text-sm font-semibold text-foreground mb-2">Cor do aluguel</p>
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
          <div className="fixed bottom-24 left-0 right-0 z-40 px-5 py-4 lg:static lg:mt-7 lg:px-0 lg:py-0">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-card backdrop-blur-lg lg:max-w-none lg:border lg:border-border lg:bg-secondary/60 lg:px-5 lg:py-5">
          <div>
            <p className="font-body text-xs text-muted-foreground">Total do aluguel</p>
            <p className="font-display text-2xl font-bold text-foreground">
              R$ {(product.preco * qty).toLocaleString("pt-BR")}
            </p>
          </div>
          <button
            ref={addReservationBtnRef}
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-body text-sm font-bold text-primary-foreground shadow-button transition-transform hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="h-5 w-5" />
            Adicionar à reserva
          </button>
        </div>
      </div>
        </div>
      </div>
    </div>

      {flyParticle && (
        <ReservationFlyDot
          key={flyParticle.id}
          sx={flyParticle.sx}
          sy={flyParticle.sy}
          ex={flyParticle.ex}
          ey={flyParticle.ey}
          onDone={() => setFlyParticle(null)}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default ProductDetailScreen;
