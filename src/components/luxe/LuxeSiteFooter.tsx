import { Link } from "react-router-dom";
import { Instagram, Facebook, Music2, MessageCircle } from "lucide-react";
import { getWhatsAppHref } from "@/components/WhatsAppFloat";
import { buildCatalogUrl } from "@/lib/catalogNavigation";

const whatsappHref = getWhatsAppHref();

const FOOTER_COLLECTIONS = [
  { label: "Vestidos", href: buildCatalogUrl({ categoria: "vestidos" }) },
  { label: "Noivas", href: buildCatalogUrl({ q: "noiva" }) },
  { label: "Ternos", href: buildCatalogUrl({ categoria: "ternos" }) },
  { label: "Acessórios", href: buildCatalogUrl({ q: "acessorio" }) },
];

export function LuxeSiteFooter() {
  return (
    <footer id="contato" className="bg-marsala text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="font-display text-2xl">
              Closet <span className="italic">Festa</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
              Aluguel de trajes premium para casamentos, formaturas e momentos inesquecíveis.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Music2, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href={i === 3 ? whatsappHref : "https://instagram.com/closetfesta"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-primary-foreground/20 transition hover:bg-primary-foreground hover:text-marsala"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Institucional", items: ["Sobre nós", "Nossa loja", "Trabalhe conosco", "Blog"] },
            { title: "Coleções", items: FOOTER_COLLECTIONS },
            {
              title: "Contato",
              items: [
                { label: "WhatsApp", href: whatsappHref, external: true },
                { label: "Catálogo", href: "/catalogo" },
                { label: "Favoritos", href: "/favoritos" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-lg">{col.title}</h4>
              <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
                {col.title === "Coleções" || col.title === "Contato"
                  ? (col.items as { label: string; href: string; external?: boolean }[]).map((it) => (
                      <li key={it.label}>
                        {it.external ? (
                          <a
                            href={it.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition hover:text-primary-foreground"
                          >
                            {it.label}
                          </a>
                        ) : (
                          <Link to={it.href} className="transition hover:text-primary-foreground">
                            {it.label}
                          </Link>
                        )}
                      </li>
                    ))
                  : (col.items as string[]).map((it) => (
                      <li key={it}>
                        <span className="cursor-default">{it}</span>
                      </li>
                    ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-primary-foreground/15 pt-8 text-xs text-primary-foreground/60 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Closet Festa. Todos os direitos reservados.</p>
          <p>Elegância para momentos inesquecíveis.</p>
        </div>
      </div>
    </footer>
  );
}
