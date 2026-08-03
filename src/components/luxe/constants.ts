import colVestidos from "@/assets/home/col-vestidos.jpeg";
import colTernos from "@/assets/home/col-ternos.jpg";
import colNoivas from "@/assets/home/col-noivas.jpeg";
import colMadrinhas from "@/assets/home/col-madrinhas.jpg";
import colCurtos from "@/assets/home/featured-3.jpg";
import colLongos from "@/assets/home/col-longos.jpeg";
import colSmoking from "@/assets/home/col-ternos.jpg";
import feat2 from "@/assets/home/featured-2.jpeg";
import heroImg from "@/assets/home/hero.jpeg";

export const LUXE_NAV = [
  "Início",
  "Vestidos",
  "Ternos",
  "Noivas",
  "Madrinhas",
  "Debutantes",
  "Acessórios",
  "Contato",
] as const;

export const LUXE_NAV_LINK_CLASS =
  "relative text-sm font-medium text-marsala/85 transition hover:text-marsala after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-marsala after:transition-all after:duration-300 hover:after:w-full";

export const LUXE_CATEGORY_IMAGES: Record<string, string> = {
  vestidos: colVestidos,
  ternos: colTernos,
  noivas: colNoivas,
  madrinhas: colMadrinhas,
  debutantes: colLongos,
  smoking: colSmoking,
  infantil: colCurtos,
  acessorios: feat2,
  default: heroImg,
};
