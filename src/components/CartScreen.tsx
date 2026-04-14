import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { products } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";
import ClosetSearchBar from "@/components/ClosetSearchBar";
import { getWhatsAppHref, getWhatsAppHrefWithText } from "@/components/WhatsAppFloat";
import { buildReservationWhatsAppMessage } from "@/lib/cartWhatsAppMessage";
import {
  FIRST_RENTAL_COUPON_CODE,
  FIRST_RENTAL_DISCOUNT_RATE,
  isFirstRentalCouponCode,
} from "@/lib/firstRentalPromo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CartScreen = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [promoFeedback, setPromoFeedback] = useState<"ok" | "err" | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [eventDate, setEventDate] = useState("");

  const subtotal = items.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.productId);
    return sum + (p?.preco || 0) * item.qty;
  }, 0);

  const discountAmount = couponApplied
    ? Math.round(subtotal * FIRST_RENTAL_DISCOUNT_RATE * 100) / 100
    : 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shipping = subtotalAfterDiscount > 500 ? 0 : 49.9;
  const total = subtotalAfterDiscount + shipping;

  const applyPromo = () => {
    const raw = promoCode.trim();
    if (!raw) {
      setCouponApplied(false);
      setPromoFeedback(null);
      return;
    }
    if (isFirstRentalCouponCode(raw)) {
      setCouponApplied(true);
      setPromoFeedback("ok");
    } else {
      setCouponApplied(false);
      setPromoFeedback("err");
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setPromoCode("");
    setPromoFeedback(null);
  };

  const openCheckoutDialog = () => {
    setEventDate("");
    setCheckoutOpen(true);
  };

  const finalizeToWhatsApp = () => {
    if (!eventDate.trim() || items.length === 0) return;
    const text = buildReservationWhatsAppMessage(items, eventDate, products, {
      couponApplied,
      discountAmount,
      totalWithShipping: total,
    });
    window.open(getWhatsAppHrefWithText(text), "_blank", "noopener,noreferrer");
    setCheckoutOpen(false);
  };

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
            Reserva
          </h1>
        </div>

        <div className="px-5 pb-2">
          <ClosetSearchBar />
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <p className="font-display text-lg font-semibold text-foreground mb-1">Reserva vazia</p>
            <p className="font-body text-sm text-muted-foreground text-center">
              Adicione vestidos incríveis à sua reserva de aluguel
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
              <p className="mb-2 font-body text-[11px] text-muted-foreground">
                Primeiro aluguel: use{" "}
                <span className="font-semibold text-foreground">{FIRST_RENTAL_COUPON_CODE}</span> para 15% de
                desconto.
              </p>
              <div className="flex gap-2 p-1.5 rounded-2xl bg-secondary/80 shadow-card">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPromoCode(v);
                    setPromoFeedback(null);
                    if (couponApplied && !isFirstRentalCouponCode(v)) {
                      setCouponApplied(false);
                    }
                  }}
                  placeholder="Digite o cupom"
                  autoCapitalize="characters"
                  spellCheck={false}
                  className="flex-1 bg-transparent px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-body text-sm font-semibold shadow-button transition-transform active:scale-95"
                >
                  Aplicar
                </button>
              </div>
              {promoFeedback === "ok" && (
                <p className="mt-2 font-body text-xs text-emerald-700">
                  Cupom {FIRST_RENTAL_COUPON_CODE} aplicado: 15% no seu primeiro aluguel.{" "}
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    Remover
                  </button>
                </p>
              )}
              {promoFeedback === "err" && (
                <p className="mt-2 font-body text-xs text-destructive">
                  Cupom não encontrado. Use {FIRST_RENTAL_COUPON_CODE} para o primeiro aluguel.
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="px-5 mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                <span className="font-body text-sm font-semibold text-foreground">
                  R$ {subtotal.toLocaleString("pt-BR")}
                </span>
              </div>
              {couponApplied && discountAmount > 0 && (
                <div className="flex justify-between items-center text-primary">
                  <span className="font-body text-sm">
                    Desconto {FIRST_RENTAL_COUPON_CODE} (15% — primeiro aluguel)
                  </span>
                  <span className="font-body text-sm font-semibold">
                    - R$ {discountAmount.toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
              <div className="border-t border-border/50" />
              <div className="flex justify-between items-start gap-3">
                <span className="shrink-0 font-body text-sm text-muted-foreground">Frete</span>
                <span className="max-w-[min(100%,14rem)] text-right font-body text-sm font-semibold leading-snug text-foreground">
                  {shipping === 0 ? (
                    <>
                      Consulte disponibilidade para o seu evento no{" "}
                      <a
                        href={getWhatsAppHref()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary/90"
                      >
                        WhatsApp
                      </a>
                      .
                    </>
                  ) : (
                    `R$ ${shipping.toLocaleString("pt-BR")}`
                  )}
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
       <div className="fixed bottom-24 left-0 right-0 z-40 px-5 py-4">
       <div className="mx-auto max-w-lg">
         <button
           type="button"
           onClick={openCheckoutDialog}
           className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-base font-bold text-white"
         >
            <ShoppingBag className="h-5 w-5" />
            Finalizar aluguel
          </button>
        </div>
        </div>
      )}

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="z-[60] max-w-[min(100vw-2rem,22rem)] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Data do evento</DialogTitle>
            <DialogDescription className="text-left font-body text-sm">
              Informe quando será o evento para enviarmos sua reserva pelo WhatsApp com os itens do carrinho.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-1">
            <Label htmlFor="checkout-event-date" className="font-body">
              Data do evento
            </Label>
            <input
              id="checkout-event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 font-body text-sm text-foreground shadow-sm outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-[#9C2F45]/30"
              required
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setCheckoutOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={!eventDate.trim()}
              onClick={finalizeToWhatsApp}
            >
              Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default CartScreen;
