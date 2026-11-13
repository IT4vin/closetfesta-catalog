import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Heart,
  MessageCircle,
  ArrowRight,
  Star,
  Sparkles,
  Calendar,
  Ruler,
  PartyPopper,
  Scissors,
  WashingMachine,
  CreditCard,
  Award,
  ShieldCheck,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import heroCivil from "@/assets/home/banner-casamento-civil.webp";
import heroVestidos from "@/assets/home/banner-vestidos-festa.webp";
import colVestidos from "@/assets/home/col-vestidos.jpeg";
import colTernos from "@/assets/home/col-ternos.jpg";
import colNoivas from "@/assets/home/col-noivas.jpeg";
import colMadrinhas from "@/assets/home/col-madrinhas.jpg";
import colCurtos from "@/assets/home/featured-3.jpg";
import colLongos from "@/assets/home/col-longos.jpeg";
import colSmoking from "@/assets/home/col-ternos.jpg";
import feat1 from "@/assets/home/featured-1.jpeg";
import feat2 from "@/assets/home/featured-2.jpeg";
import feat4 from "@/assets/home/featured-4.jpg";
import { getWhatsAppHref } from "@/components/WhatsAppFloat";
import { CatalogImage } from "@/components/CatalogImage";
import { ProductImageNotice } from "@/components/ProductImageNotice";
import { LuxeSiteLayout } from "@/components/luxe/LuxeSiteLayout";
import { formatSizeRange, pickFeaturedProducts, productColorHex } from "@/lib/featuredProducts";
import { isGenericVestidosCategory, productDisplayName } from "@/lib/productDisplay";
import { useSearch } from "@/contexts/SearchContext";
import {
  buildCatalogUrl,
  HOME_CATEGORY_FILTERS,
  HOME_COLLECTION_FILTERS,
} from "@/lib/catalogNavigation";

const CATEGORIES = [
  { label: "Vestidos", img: colVestidos },
  { label: "Madrinhas", img: colMadrinhas },
  { label: "Noivas", img: colNoivas },
  { label: "Formandas", img: colLongos },
  { label: "Ternos", img: colTernos },
  { label: "Smoking", img: colSmoking },
  { label: "Infantil", img: colCurtos },
  { label: "Acessórios", img: feat2 },
];

const COLLECTIONS = [
  { title: "Vestidos de Festa", desc: "Peças icônicas para brilhar", img: colVestidos },
  { title: "Vestidos Longos", desc: "Elegância em movimento", img: colLongos },
  { title: "Vestidos Curtos", desc: "Sofisticação descontraída", img: colCurtos },
  { title: "Ternos", desc: "Alfaiataria refinada", img: colTernos },
  { title: "Smokings", desc: "Ocasiões inesquecíveis", img: colSmoking },
  { title: "Noivas", desc: "O dia mais especial", img: colNoivas },
];

const STEPS = [
  { icon: Sparkles, title: "Escolha o traje", desc: "Navegue pela nossa curadoria exclusiva de peças premium." },
  { icon: Calendar, title: "Agende sua prova", desc: "Reserve seu horário e receba atendimento personalizado." },
  { icon: Ruler, title: "Faça os ajustes", desc: "Ajustes inclusos para um caimento impecável em você." },
  { icon: PartyPopper, title: "Aproveite seu evento", desc: "Viva o momento com confiança e elegância." },
];

const FEATURES = [
  { icon: Award, title: "Atendimento Exclusivo", desc: "Consultoria de estilo personalizada." },
  { icon: Scissors, title: "Ajustes Inclusos", desc: "Caimento perfeito, sem custo extra." },
  { icon: WashingMachine, title: "Higienização Profissional", desc: "Todas as peças impecáveis." },
  { icon: CreditCard, title: "Parcelamento", desc: "Facilite em várias parcelas." },
  { icon: MessageCircle, title: "WhatsApp", desc: "Atendimento rápido e humano." },
  { icon: ShieldCheck, title: "Trajes Premium", desc: "Curadoria exclusiva de marcas." },
];

const INSTA = [colLongos, feat1, colNoivas, colCurtos, feat4, colTernos, feat2, colMadrinhas];

const whatsappHref = getWhatsAppHref();

const HERO_SLIDES = [
  {
    src: heroCivil,
    alt: "Casamento civil: casal com trajes claros. Pacotes a partir de R$ 299,99.",
    label: "Casamento civil",
  },
  {
    src: heroVestidos,
    alt: "Vestidos de festa em tons rosé e dourado. Pacotes a partir de R$ 190,00.",
    label: "Vestidos de festa",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Marina Ribeiro",
    role: "Madrinha de casamento",
    stars: 5,
    text: "Atendimento impecável. O vestido caiu como uma segunda pele — recebi elogios a noite toda.",
  },
  {
    name: "Ana Beatriz",
    role: "Formanda 2025",
    stars: 5,
    text: "Escolhi meu vestido dos sonhos por uma fração do preço. Os ajustes ficaram perfeitos.",
  },
  {
    name: "Rafael Menezes",
    role: "Noivo",
    stars: 5,
    text: "O smoking transformou meu casamento. Elegância sem esforço, exatamente o que eu queria.",
  },
];

const LuxeHomePage = () => {
  const { catalogProducts, catalogLoading } = useSearch();
  const [favs, setFavs] = useState<Record<number, boolean>>({});
  const [carousel, setCarousel] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex(current => (current + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const featuredProducts = useMemo(
    () => pickFeaturedProducts(catalogProducts, 6),
    [catalogProducts],
  );

  useEffect(() => {
    setCarousel(0);
  }, [featuredProducts.length]);

  const perView = 3;
  const maxCarousel = Math.max(0, featuredProducts.length - perView);

  return (
    <LuxeSiteLayout>
      <section className="relative overflow-hidden" aria-label="Coleções e acesso ao catálogo">
        <div className="mx-auto grid min-h-[calc(100svh-6rem)] max-w-7xl content-start grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] items-stretch gap-x-2 gap-y-7 px-3 pb-9 pt-12 sm:gap-x-4 sm:px-6 sm:pt-14 md:min-h-0 md:grid-cols-2 md:content-normal md:items-center md:gap-x-16 md:gap-y-0 md:px-8 md:py-20">
          {/* No celular: texto à esquerda, banner à direita e ações embaixo dos dois. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="col-start-1 row-start-1 flex h-full min-w-0 flex-col items-start gap-3 py-2 md:block md:h-auto md:self-end md:py-0"
          >
            <div className="min-w-0 w-full">
              <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-warm-gray sm:text-xs md:text-[11px] md:tracking-[0.4em]">
                Nova Coleção
              </span>
              <h1 className="mt-3 break-words font-display text-[clamp(1.65rem,7.8vw,2.3rem)] leading-[1.06] tracking-tight text-marsala sm:text-[2.5rem] md:mt-5 md:text-[64px] md:leading-[1.02]">
              Elegância para <br className="hidden md:block" />
              <em className="font-normal italic">momentos</em>{" "}
              <br className="hidden md:block" />
                inesquecíveis.
              </h1>
            </div>
            <p className="mt-auto max-w-md pt-4 text-[13px] leading-relaxed text-warm-gray sm:text-sm md:mt-6 md:pt-0 md:text-base">
              <span className="md:hidden">
                Vestidos, ternos e trajes especiais para celebrar cada momento.
              </span>
              <span className="hidden md:inline">
                Alugue vestidos, ternos e trajes exclusivos para casamentos, formaturas, festas e eventos especiais.
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="relative col-start-2 row-start-1 w-full max-w-[215px] justify-self-end sm:max-w-[275px] md:col-start-2 md:row-span-2 md:row-start-1 md:mx-auto md:max-w-[360px] md:justify-self-center lg:max-w-[380px]"
          >
            <div
              role="region"
              aria-label="Destaques do catálogo Closet Festa"
              aria-roledescription="carrossel"
              className="relative overflow-hidden rounded-[18px] border border-marsala/20 bg-[#510C17] shadow-[0_18px_36px_-7px_rgba(71,19,33,0.48),0_7px_14px_-5px_rgba(71,19,33,0.34)] ring-1 ring-white/40 sm:rounded-[24px] md:rounded-[28px]"
            >
              <div className="relative aspect-[9/16]">
                {HERO_SLIDES.map((slide, index) => (
                  <img
                    key={slide.label}
                    src={slide.src}
                    alt={slide.alt}
                    width={861}
                    height={1536}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    aria-hidden={heroIndex !== index}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${heroIndex === index ? "z-10 opacity-100" : "z-0 opacity-0"}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-2 md:mt-3" role="group" aria-label="Selecionar imagem do banner">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  aria-label={`Exibir banner ${slide.label}`}
                  aria-pressed={heroIndex === index}
                  onClick={() => setHeroIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${heroIndex === index ? "w-7 bg-marsala" : "w-2.5 bg-marsala/25 hover:bg-marsala/60"}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Botões aparecem na primeira dobra no celular, sem precisar passar pelo banner. */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:col-start-1 md:mt-8"
          >
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:flex md:flex-wrap md:items-center md:gap-4">
              <Link
                to="/catalogo"
                className="group inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-marsala px-3 py-3 text-center text-xs font-semibold text-primary-foreground shadow-[0_10px_30px_-10px_rgba(122,46,58,0.6)] transition hover:bg-marsala-dark hover:shadow-[0_18px_40px_-12px_rgba(122,46,58,0.7)] sm:text-sm md:px-7 md:py-4"
              >
                Ver catálogo
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center rounded-full border border-marsala/30 px-3 py-3 text-center text-xs font-medium text-marsala transition hover:border-marsala hover:bg-marsala/5 sm:text-sm md:px-6 md:py-4"
              >
                Agendar prova
              </a>
            </div>
            <ul className="mt-9 hidden flex-wrap gap-x-8 gap-y-3 text-sm text-marsala/85 md:flex">
              {["Atendimento Personalizado", "Ajustes Inclusos", "Peças Exclusivas"].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-marsala/10 text-marsala" aria-hidden="true">
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  to={buildCatalogUrl(HOME_CATEGORY_FILTERS[c.label] ?? {})}
                  className="group flex flex-col items-center gap-3 text-center"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-full border border-border bg-secondary transition duration-500 group-hover:scale-105 group-hover:shadow-[0_16px_40px_-16px_rgba(122,46,58,0.35)]">
                    <img
                      src={c.img}
                      alt={c.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-marsala md:text-xs">
                    {c.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="colecoes" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-warm-gray">Coleções</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-marsala md:text-5xl">
              Descubra a peça <em className="font-normal italic">perfeita</em> para o seu momento.
            </h2>
          </div>
          <Link to="/catalogo" className="group inline-flex items-center gap-2 text-sm font-medium text-marsala">
            Ver todas as coleções
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card ${
                i === 0 || i === 3 ? "md:col-span-2 md:row-span-1" : ""
              }`}
            >
              <Link
                to={buildCatalogUrl(HOME_COLLECTION_FILTERS[c.title] ?? {})}
                className="block"
              >
                <div className={`relative overflow-hidden ${i === 0 || i === 3 ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="marsala-gradient absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-primary-foreground/80">{c.desc}</p>
                    <h3 className="mt-2 font-display text-2xl text-primary-foreground md:text-3xl">{c.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-4 py-2 text-xs font-medium text-marsala shadow-md transition group-hover:gap-3">
                      Explorar <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] uppercase tracking-[0.4em] text-warm-gray">Como Funciona</span>
            <h2 className="mt-4 font-display text-4xl text-marsala md:text-5xl">
              Uma experiência <em className="italic font-normal">sob medida</em>.
            </h2>
            <p className="mt-4 text-warm-gray">
              Do primeiro clique ao brilho no evento — cuidamos de cada detalhe.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative rounded-2xl border border-border bg-background p-8 transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(122,46,58,0.35)]"
              >
                <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-warm-gray">
                  0{i + 1}
                </div>
                <div className="mt-6 grid h-14 w-14 place-items-center rounded-full bg-marsala/10 text-marsala transition group-hover:bg-marsala group-hover:text-primary-foreground">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-marsala">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-warm-gray">Destaques</span>
            <h2 className="mt-4 font-display text-4xl text-marsala md:text-5xl">Os mais alugados</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCarousel((v) => Math.max(0, v - 1))}
              className="grid h-11 w-11 place-items-center rounded-full border border-marsala/25 text-marsala transition hover:bg-marsala hover:text-primary-foreground disabled:opacity-40"
              disabled={carousel === 0 || featuredProducts.length <= perView}
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCarousel((v) => Math.min(maxCarousel, v + 1))}
              className="grid h-11 w-11 place-items-center rounded-full border border-marsala/25 text-marsala transition hover:bg-marsala hover:text-primary-foreground disabled:opacity-40"
              disabled={carousel >= maxCarousel || featuredProducts.length <= perView}
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ProductImageNotice className="mt-6" />

        <div className="mt-12 overflow-hidden">
          {catalogLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="aspect-[4/5] bg-secondary" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-1/3 rounded bg-secondary" />
                    <div className="h-5 w-2/3 rounded bg-secondary" />
                    <div className="h-10 rounded-full bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
              <p className="font-display text-lg text-marsala">Catálogo em breve</p>
              <p className="mt-2 text-sm text-warm-gray">Enquanto isso, fale conosco pelo WhatsApp.</p>
              <Link
                to="/catalogo"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-marsala px-5 py-3 text-xs font-medium text-primary-foreground"
              >
                Ver catálogo <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <motion.div
              animate={{ x: `calc(-${carousel} * (100% / 3) - ${carousel * 1.5}rem)` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-6"
            >
              {featuredProducts.map((p) => {
                const catLabel = isGenericVestidosCategory(p.categoriaTipo)
                  ? p.tipos[0] ?? "Vestidos"
                  : p.categoriaTipo;
                return (
                  <div
                    key={p.slug}
                    className="w-full shrink-0 sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)]"
                  >
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card">
                      <Link to={`/produto/${p.slug}`} className="block">
                        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                          <CatalogImage
                            src={p.imagem}
                            alt={productDisplayName(p.nome)}
                            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
                          />
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setFavs((f) => ({ ...f, [p.id]: !f[p.id] }))}
                        aria-label="Favoritar"
                        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-marsala backdrop-blur transition hover:scale-110"
                      >
                        <Heart className={`h-4 w-4 ${favs[p.id] ? "fill-marsala" : ""}`} />
                      </button>
                      <div className="p-6">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-warm-gray">{catLabel}</p>
                        <Link to={`/produto/${p.slug}`}>
                          <h3 className="mt-2 font-display text-xl text-marsala transition hover:text-marsala-dark">
                            {productDisplayName(p.nome)}
                          </h3>
                        </Link>
                        <div className="mt-3 flex items-center gap-4 text-xs text-warm-gray">
                          <span className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-black/10"
                              style={{ backgroundColor: productColorHex(p.cor) }}
                            />{" "}
                            {p.cor}
                          </span>
                          <span>Tam. {formatSizeRange(p.tamanhos)}</span>
                        </div>
                        <Link
                          to={`/produto/${p.slug}`}
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-marsala px-5 py-3 text-xs font-medium tracking-wide text-primary-foreground transition hover:bg-marsala-dark"
                        >
                          Ver peça <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-marsala p-8 text-primary-foreground md:p-12">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary-foreground/70">
              Coleção Especial
            </span>
            <h3 className="mt-4 font-display text-3xl md:text-4xl">Casamentos 2026</h3>
            <p className="mt-3 max-w-sm text-sm text-primary-foreground/80">
              Curadoria exclusiva para noivas, madrinhas e padrinhos.
            </p>
            <Link
              to={buildCatalogUrl({ q: "noiva" })}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-3 text-xs font-medium text-marsala"
            >
              Explorar coleção <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl" />
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12">
            <span className="text-[10px] uppercase tracking-[0.4em] text-warm-gray">Novidades</span>
            <h3 className="mt-4 font-display text-3xl text-marsala md:text-4xl">Recém Chegados</h3>
            <p className="mt-3 max-w-sm text-sm text-warm-gray">Peças exclusivas acabam de entrar no closet.</p>
            <Link
              to="/catalogo"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-marsala/30 px-5 py-3 text-xs font-medium text-marsala hover:bg-marsala/5"
            >
              Ver novidades <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] uppercase tracking-[0.4em] text-warm-gray">Diferenciais</span>
          <h2 className="mt-4 font-display text-4xl text-marsala md:text-5xl">
            Feito para <em className="italic font-normal">encantar</em>.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex items-start gap-5 rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(122,46,58,0.25)]"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-marsala/10 text-marsala transition group-hover:bg-marsala group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg text-marsala">{f.title}</h3>
                <p className="mt-1 text-sm text-warm-gray">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.4em] text-warm-gray">Depoimentos</span>
            <h2 className="mt-4 font-display text-4xl text-marsala md:text-5xl">
              Quem veste, <em className="italic font-normal">recomenda</em>.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-background p-8"
              >
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-marsala text-marsala" />
                  ))}
                </div>
                <p className="mt-5 font-display text-lg italic leading-relaxed text-marsala">“{t.text}”</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-marsala/10 font-display text-marsala">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-marsala">{t.name}</p>
                    <p className="text-xs text-warm-gray">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-warm-gray">@closetfesta</span>
            <h2 className="mt-4 font-display text-4xl text-marsala md:text-5xl">
              Inspiração no <em className="italic font-normal">Instagram</em>
            </h2>
          </div>
          <a
            href="https://instagram.com/closetfesta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-marsala/30 px-5 py-3 text-sm font-medium text-marsala transition hover:bg-marsala/5"
          >
            <Instagram className="h-4 w-4" /> Ver Instagram
          </a>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INSTA.map((img, i) => (
            <a
              href="https://instagram.com/closetfesta"
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary"
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 grid place-items-center bg-marsala/0 opacity-0 transition group-hover:bg-marsala/50 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-primary-foreground" />
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-marsala px-6 py-14 text-primary-foreground md:px-16 md:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="text-[11px] uppercase tracking-[0.4em] text-primary-foreground/70">Newsletter</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl">
              Receba novidades da <em className="italic font-normal">Closet Festa</em>
            </h2>
            <p className="mt-4 text-sm text-primary-foreground/80">
              Cadastre-se e receba lançamentos, ofertas exclusivas e inspirações direto no seu e-mail.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 flex flex-col gap-3 sm:mx-auto sm:max-w-md sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Digite seu e-mail"
                className="flex-1 rounded-full bg-primary-foreground/95 px-5 py-3.5 text-sm text-marsala placeholder:text-marsala/50 outline-none focus:ring-2 focus:ring-primary-foreground/60"
              />
              <button
                type="submit"
                className="rounded-full bg-primary-foreground px-6 py-3.5 text-sm font-medium text-marsala transition hover:bg-primary-foreground/90"
              >
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </section>
    </LuxeSiteLayout>
  );
};

export default LuxeHomePage;
