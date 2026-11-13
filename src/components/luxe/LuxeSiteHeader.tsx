import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Menu, ShoppingBag, X } from "lucide-react";
import HomeHeaderSearch from "@/components/HomeHeaderSearch";
import closetLogoUrl from "@/assets/logo.svg?url";
import { useCart } from "@/contexts/CartContext";
import { getWhatsAppHref } from "@/components/WhatsAppFloat";
import { LUXE_NAV, LUXE_NAV_LINK_CLASS } from "@/components/luxe/constants";
import { LuxeNavLink } from "@/components/luxe/LuxeNavLink";

const whatsappHref = getWhatsAppHref();

export function LuxeSiteHeader() {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8 md:py-5">
        <Link to="/" className="flex min-w-0 flex-1 items-center gap-2 leading-none lg:flex-none" aria-label="Closet Festa — início">
          <img src={closetLogoUrl} alt="" aria-hidden="true"
            className="h-16 w-16 shrink-0 object-contain sm:h-[72px] sm:w-[72px]"
            width={72} height={72} loading="eager" />
          <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.14em] text-warm-gray sm:text-[10px]">
            Aluguel de Trajes
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LUXE_NAV.map((item) => (
            <LuxeNavLink key={item} item={item} className={LUXE_NAV_LINK_CLASS} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2 md:gap-4">
          <HomeHeaderSearch scrolled={scrolled} />
          <Link
            to="/carrinho"
            aria-label={totalItems > 0 ? `Abrir minha reserva (${totalItems} trajes)` : "Abrir minha reserva"}
            className="relative rounded-full p-2 text-marsala transition hover:bg-marsala/5"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            {totalItems > 0 && (
              <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-marsala px-1 text-[10px] font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="rounded-full p-2 text-marsala transition hover:bg-marsala/5"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hidden rounded-full p-2 text-marsala transition hover:bg-marsala/5 sm:block"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 text-marsala transition hover:bg-marsala/5 lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 md:px-8">
            {LUXE_NAV.map((item) => (
              <LuxeNavLink
                key={item}
                item={item}
                className="py-3 text-sm font-medium text-marsala"
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
