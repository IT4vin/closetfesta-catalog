import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { LuxeSiteFooter } from "@/components/luxe/LuxeSiteFooter";
import { LuxeSiteHeader } from "@/components/luxe/LuxeSiteHeader";
import { LuxeWhatsAppFloat } from "@/components/luxe/LuxeWhatsAppFloat";

export function LuxeSiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isCatalogPage = pathname === "/catalogo";

  return (
    <div className="min-h-screen bg-background text-marsala">
      <LuxeSiteHeader />
      <main className="pt-24 md:pt-28">{children}</main>
      <div className={isCatalogPage ? "bg-marsala pb-28" : undefined}>
        <LuxeSiteFooter />
      </div>
      {isCatalogPage ? <BottomNav /> : <LuxeWhatsAppFloat />}
    </div>
  );
}
