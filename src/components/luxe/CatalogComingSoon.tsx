import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { LuxeSiteLayout } from "@/components/luxe/LuxeSiteLayout";
import { buildCatalogUrl } from "@/lib/catalogNavigation";
import type { CatalogPageMeta } from "@/lib/catalogCategoryMeta";
import heroImg from "@/assets/home/hero.jpg";

type CatalogComingSoonProps = {
  meta: CatalogPageMeta;
};

export function CatalogComingSoon({ meta }: CatalogComingSoonProps) {
  return (
    <LuxeSiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mb-10 max-w-sm"
        >
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-border bg-accent shadow-[0_30px_80px_-30px_rgba(92,31,43,0.35)]">
            <img
              src={meta.bannerImage || heroImg}
              alt=""
              className="h-full w-full object-cover opacity-90"
            />
            <div className="marsala-gradient absolute inset-0" />
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center rounded-full bg-marsala text-primary-foreground shadow-lg"
          >
            <Sparkles className="h-7 w-7" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <span className="text-[11px] uppercase tracking-[0.4em] text-warm-gray">{meta.breadcrumbLabel}</span>
          <h1 className="mt-4 font-display text-4xl text-marsala md:text-5xl">Em breve</h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-warm-gray">
            Estamos preparando uma coleção incrível para esta categoria. Em breve você encontrará
            diversas opções exclusivas disponíveis para aluguel.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-marsala px-7 py-4 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(122,46,58,0.6)] transition hover:bg-marsala-dark"
            >
              Voltar para Home
            </Link>
            <Link
              to={buildCatalogUrl({ categoria: "vestidos" })}
              className="inline-flex items-center gap-2 rounded-full border border-marsala/25 px-7 py-4 text-sm font-medium text-marsala transition hover:border-marsala hover:bg-marsala/5"
            >
              Ver outras categorias
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </LuxeSiteLayout>
  );
}
