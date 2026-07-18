import { MessageCircle } from "lucide-react";
import { getWhatsAppHref } from "@/components/WhatsAppFloat";

export function LuxeWhatsAppFloat() {
  return (
    <a
      href={getWhatsAppHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale no WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-marsala text-primary-foreground shadow-[0_10px_30px_-8px_rgba(122,46,58,0.7)] transition hover:scale-110 hover:bg-marsala-dark md:h-16 md:w-16"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inset-0 animate-ping rounded-full bg-marsala/40" />
    </a>
  );
}
