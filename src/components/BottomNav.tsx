import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Heart, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppNavButton } from "@/components/WhatsAppFloat";
import { useCart } from "@/contexts/CartContext";

const MARSALA = "#9C2F45";

const TABS: readonly { path: string; label: string; Icon: LucideIcon }[] = [
  { path: "/", label: "Home", Icon: Home },
  { path: "/carrinho", label: "Reserva", Icon: ShoppingBag },
  { path: "/favoritos", label: "Favoritos", Icon: Heart },
  { path: "/perfil", label: "Perfil", Icon: User },
];

function indexForPath(pathname: string): number {
  return TABS.findIndex((t) => t.path === pathname);
}

/**
 * Barra inferior fixa — pílula branca com indicador marsala deslizante e rótulo só no item ativo.
 */
const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { totalItems, reservationFeedbackGeneration } = useCart();
  const prevFeedbackGen = useRef<number | null>(null);
  const [reservationIconBumpKey, setReservationIconBumpKey] = useState(0);

  const routeIndex = indexForPath(pathname);
  /** Mantido em sincronia com a rota; preserva última aba em rotas fora das tabs (ex.: produto). */
  const [activeTab, setActiveTab] = useState(() => (routeIndex >= 0 ? routeIndex : 0));

  useEffect(() => {
    if (routeIndex >= 0) setActiveTab(routeIndex);
  }, [routeIndex]);

  useEffect(() => {
    if (prevFeedbackGen.current === null) {
      prevFeedbackGen.current = reservationFeedbackGeneration;
      return;
    }
    if (reservationFeedbackGeneration > prevFeedbackGen.current) {
      setReservationIconBumpKey((k) => k + 1);
    }
    prevFeedbackGen.current = reservationFeedbackGeneration;
  }, [reservationFeedbackGeneration]);

  const showMarsalaPill = routeIndex >= 0;
  const slideIndex = showMarsalaPill ? routeIndex : activeTab;

  const handleNav = (index: number, path: string) => {
    setActiveTab(index);
    navigate(path);
  };

  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
      aria-label="Navegação principal"
    >
      <div className="pointer-events-none mx-auto flex w-full max-w-lg items-center justify-center gap-2">
        <div
          className={cn(
            "pointer-events-auto min-w-0 flex-1 max-w-sm overflow-hidden rounded-full bg-background px-2 py-2",
            "shadow-[0_6px_32px_-6px_rgba(0,0,0,0.13),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
          )}
        >
        <div className="relative flex items-stretch">
          <div className="pointer-events-none absolute inset-x-0 inset-y-1.5">
            <div
              className={cn(
                "h-full w-1/4 rounded-full shadow-button transition-[transform,opacity] duration-[280ms] ease-out motion-reduce:transition-none",
                showMarsalaPill ? "opacity-100" : "opacity-0",
              )}
              style={{
                backgroundColor: MARSALA,
                transform: `translateX(${slideIndex * 100}%)`,
                willChange: "transform",
              }}
              aria-hidden
            />
          </div>

          {TABS.map((tab, index) => {
            const isActive = pathname === tab.path;
            const isReservationTab = tab.path === "/carrinho";
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => handleNav(index, tab.path)}
                aria-label={tab.label}
                className={cn(
                  "relative z-10 flex min-h-[52px] flex-1 flex-col items-center justify-center rounded-full px-1 py-1",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[#9C2F45]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  key={isReservationTab ? reservationIconBumpKey : tab.path}
                  data-reservation-nav-target={isReservationTab ? "reservation" : undefined}
                  className={cn(
                    "relative inline-flex shrink-0",
                    isReservationTab && reservationIconBumpKey > 0 && "motion-safe:animate-reservation-bump",
                  )}
                >
                  <tab.Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-[280ms] ease-out motion-reduce:transition-none",
                      isActive ? "text-white" : "text-foreground/55",
                    )}
                    strokeWidth={isActive ? 2.25 : 2}
                    aria-hidden
                  />
                  {isReservationTab && totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {totalItems}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "pointer-events-none w-full overflow-hidden text-center font-body text-[10px] font-medium leading-tight",
                    "transition-[margin,max-height,opacity,transform] duration-[280ms] ease-out motion-reduce:transition-none",
                    isActive
                      ? "mt-1 max-h-5 translate-y-0 text-white opacity-100"
                      : "mt-0 max-h-0 translate-y-1.5 text-white opacity-0",
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
        </div>

        <div className="pointer-events-auto shrink-0 self-center pb-0.5">
          <WhatsAppNavButton />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
