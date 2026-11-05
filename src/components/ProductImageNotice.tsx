import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductImageNoticeProps = {
  className?: string;
};

/** Aviso único reutilizado em páginas que exibem imagens de trajes para aluguel. */
export function ProductImageNotice({ className }: ProductImageNoticeProps) {
  return (
    <aside
      role="note"
      aria-label="Informações sobre as imagens dos trajes"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-[#9C2F45]/20 bg-[#9C2F45]/[0.05] px-4 py-3 text-[#6F2836]",
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p className="font-body text-xs leading-relaxed sm:text-sm">
        <strong className="font-semibold">Imagens ilustrativas.</strong>{" "}
        Por se tratarem de trajes de aluguel, as peças podem apresentar pequenas diferenças em relação às fotos
        devido a ajustes, reparos e manutenção entre locações. Para confirmar os detalhes atuais de um traje,
        consulte nossa equipe.
      </p>
    </aside>
  );
}
