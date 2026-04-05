import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Barra inferior fixa — use dentro do painel que desliza com o drawer (Home)
 * ou na raiz da página. Com `position: fixed`, permanece na base da viewport
 * (ou do ancestral com transform, no caso do Home).
 */
const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const isCart = pathname === "/carrinho";
  const isFav = pathname === "/favoritos";
  const isProfile = pathname === "/perfil";

  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 px-6 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
      aria-label="Navegação principal"
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-sm items-center justify-around rounded-full bg-background px-3 py-2",
          "shadow-[0_6px_32px_-6px_rgba(0,0,0,0.13),0_2px_8px_-2px_rgba(0,0,0,0.06)]",
        )}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center gap-1.5 rounded-full py-1.5 pl-2 pr-4 transition-colors",
            isHome && "bg-primary/10",
          )}
        >
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              isHome
                ? "bg-[#9C2F45] text-white shadow-button"
                : "bg-transparent text-foreground/60",
            )}
          >
            <Home className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "font-body text-xs font-bold",
              isHome ? "text-[#9C2F45]" : "text-foreground/50",
            )}
          >
            Home
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/carrinho")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            isCart ? "bg-primary/10 text-primary" : "text-foreground/60",
          )}
          aria-current={isCart ? "page" : undefined}
        >
          <ShoppingBag className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/favoritos")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            isFav ? "bg-primary/10 text-primary" : "text-foreground/60",
          )}
          aria-current={isFav ? "page" : undefined}
        >
          <Heart className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate("/perfil")}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            isProfile ? "bg-primary/10 text-primary" : "text-foreground/60",
          )}
          aria-current={isProfile ? "page" : undefined}
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
