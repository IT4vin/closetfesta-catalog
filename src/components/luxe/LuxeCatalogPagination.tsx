import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LuxeCatalogPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function LuxeCatalogPagination({ page, totalPages, onPageChange }: LuxeCatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <nav
      className="mt-14 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginação do catálogo"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="grid h-11 w-11 place-items-center rounded-full border border-marsala/25 text-marsala transition hover:bg-marsala hover:text-primary-foreground disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-warm-gray">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-medium transition",
              p === page
                ? "bg-marsala text-primary-foreground shadow-[0_8px_24px_-8px_rgba(122,46,58,0.5)]"
                : "border border-marsala/20 text-marsala hover:bg-marsala/5",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
        className="grid h-11 w-11 place-items-center rounded-full border border-marsala/25 text-marsala transition hover:bg-marsala hover:text-primary-foreground disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
