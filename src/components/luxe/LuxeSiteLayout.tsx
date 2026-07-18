import type { ReactNode } from "react";
import { LuxeSiteFooter } from "@/components/luxe/LuxeSiteFooter";
import { LuxeSiteHeader } from "@/components/luxe/LuxeSiteHeader";
import { LuxeWhatsAppFloat } from "@/components/luxe/LuxeWhatsAppFloat";

export function LuxeSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-marsala">
      <LuxeSiteHeader />
      <main className="pt-24 md:pt-28">{children}</main>
      <LuxeSiteFooter />
      <LuxeWhatsAppFloat />
    </div>
  );
}
