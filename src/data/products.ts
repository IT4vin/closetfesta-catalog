import dressMarsala from "@/assets/dress-marsala.jpg";
import dressChampagne from "@/assets/dress-champagne.jpg";
import dressWhite from "@/assets/dress-white.jpg";
import dressRose from "@/assets/dress-rose.jpg";
import dressLavanda from "@/assets/dress-lavanda.jpg";
import dressOlive from "@/assets/dress-olive.jpg";
import dressSerenity from "@/assets/dress-serenity.jpg";
import dressTerracota from "@/assets/dress-terracota.jpg";

/** Cores principais da vitrine (ordem oficial Closet Festa). */
export const CORES_CATEGORIA = [
  "Branco",
  "Champanhe",
  "Bege",
  "Rosa Blush",
  "Lavanda",
  "Azul Serenity",
  "Verde Oliva",
  "Verde Sálvia",
  "Verde Esmeralda",
  "Terracota",
  "Marsala",
  "Borgonha",
  "Vermelho",
  "Fúcsia",
  "Azul Royal",
  "Amarelo Manteiga",
  "Jade",
  "Azul Suave",
] as const;

export const TIPOS_CATEGORIA = [
  "Vestidos de Noiva",
  "Vestidos de Madrinha",
  "Vestidos de Debutante",
  "Vestidos para Festa",
  "Vestidos Longos",
  "Vestidos com Fenda",
  "Vestidos Evase",
  "Vestidos Sereia",
] as const;

export type CorCategoria = (typeof CORES_CATEGORIA)[number];
export type TipoCategoria = (typeof TIPOS_CATEGORIA)[number];

export interface Product {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  cor: CorCategoria;
  categoriaTipo: string;
  slug: string;
  coresDisponiveis: CorCategoria[];
  tamanhos: string[];
  descricao: string;
  tipos: TipoCategoria[];
}

export const colorMap: Record<CorCategoria, string> = {
  Branco: "#FFFFFF",
  Champanhe: "#F5E8C7",
  Bege: "#EDE0D4",
  "Rosa Blush": "#E8B4B8",
  Lavanda: "#C8A2C8",
  "Azul Serenity": "#A5C8E1",
  "Verde Oliva": "#8A9A5B",
  "Verde Sálvia": "#A8B5A2",
  "Verde Esmeralda": "#046B4C",
  Terracota: "#C46A4E",
  Marsala: "#9C2F45",
  Borgonha: "#6B1D2F",
  Vermelho: "#C8102E",
  Fúcsia: "#C41E6E",
  "Azul Royal": "#003087",
  "Amarelo Manteiga": "#F4D03F",
  Jade: "#00A36C",
  "Azul Suave": "#7A9EB0",
};

export const products: Product[] = [
  {
    id: 1,
    nome: "Vestido Madrinha Marsala Petra",
    preco: 1490,
    imagem: dressMarsala,
    cor: "Marsala",
    categoriaTipo: "Vestidos de Madrinha",
    slug: "vestido-madrinha-marsala-petra",
    coresDisponiveis: ["Marsala", "Rosa Blush", "Champanhe", "Branco"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em chiffon com decote V profundo e drapeado na cintura. Caimento fluido e elegante, perfeito para madrinhas que desejam sofisticação e conforto.",
    tipos: ["Vestidos de Madrinha", "Vestidos Longos", "Vestidos Sereia"],
  },
  {
    id: 2,
    nome: "Vestido Noiva Encanto Rendado",
    preco: 4890,
    imagem: dressWhite,
    cor: "Branco",
    categoriaTipo: "Vestidos de Noiva",
    slug: "vestido-noiva-encanto-rendado",
    coresDisponiveis: ["Branco", "Champanhe"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido de noiva em renda francesa com detalhes em pedraria. Saia ampla em tule e corpete estruturado. Um sonho para o grande dia.",
    tipos: ["Vestidos de Noiva", "Vestidos Longos", "Vestidos Evase"],
  },
  {
    id: 3,
    nome: "Vestido Festa Champagne Glow",
    preco: 2890,
    imagem: dressChampagne,
    cor: "Champanhe",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-champagne-glow",
    coresDisponiveis: ["Champanhe", "Rosa Blush", "Branco"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido tomara-que-caia em cetim acetinado champagne. Elegância atemporal com caimento impecável para festas de gala.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos Sereia"],
  },
  {
    id: 4,
    nome: "Vestido Madrinha Rose Valentina",
    preco: 1690,
    imagem: dressRose,
    cor: "Rosa Blush",
    categoriaTipo: "Vestidos de Madrinha",
    slug: "vestido-madrinha-rose-valentina",
    coresDisponiveis: ["Rosa Blush", "Lavanda", "Champanhe"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em tule delicado com alças finas e costas abertas. Romântico e sofisticado em rosa blush.",
    tipos: ["Vestidos de Madrinha", "Vestidos Longos", "Vestidos Evase"],
  },
  {
    id: 5,
    nome: "Vestido Debutante Lavanda Sonho",
    preco: 2290,
    imagem: dressLavanda,
    cor: "Lavanda",
    categoriaTipo: "Vestidos de Debutante",
    slug: "vestido-debutante-lavanda-sonho",
    coresDisponiveis: ["Lavanda", "Rosa Blush", "Branco"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido de debutante em tule lavanda com decote princesa. Volume perfeito e detalhes que fazem os 15 anos inesquecíveis.",
    tipos: ["Vestidos de Debutante", "Vestidos Longos", "Vestidos Evase"],
  },
  {
    id: 6,
    nome: "Vestido Festa Verde Oliva Serena",
    preco: 1890,
    imagem: dressOlive,
    cor: "Verde Oliva",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-verde-oliva-serena",
    coresDisponiveis: ["Verde Oliva", "Marsala", "Champanhe"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em cetim verde oliva com decote profundo e fenda lateral discreta. Sofisticação moderna para festas e eventos especiais.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos com Fenda", "Vestidos Sereia"],
  },
  {
    id: 7,
    nome: "Vestido Madrinha Serenity Aurora",
    preco: 1590,
    imagem: dressSerenity,
    cor: "Azul Serenity",
    categoriaTipo: "Vestidos de Madrinha",
    slug: "vestido-madrinha-serenity-aurora",
    coresDisponiveis: ["Azul Serenity", "Lavanda", "Rosa Blush"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em chiffon azul serenity com costas elegantes. Leveza e sofisticação para cerimônias ao ar livre.",
    tipos: ["Vestidos de Madrinha", "Vestidos Longos"],
  },
  {
    id: 8,
    nome: "Vestido Festa Terracota Luna",
    preco: 1790,
    imagem: dressTerracota,
    cor: "Terracota",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-terracota-luna",
    coresDisponiveis: ["Terracota", "Marsala", "Champanhe"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em tecido fluido terracota com caimento sofisticado. Silhueta sereia que valoriza o corpo.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos Sereia"],
  },
  {
    id: 9,
    nome: "Vestido Madrinha Bege Linen Grace",
    preco: 1740,
    imagem: dressChampagne,
    cor: "Bege",
    categoriaTipo: "Vestidos de Madrinha",
    slug: "vestido-madrinha-bege-linen-grace",
    coresDisponiveis: ["Bege", "Champanhe", "Azul Suave"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em tecido acetinado bege com corte evasê e mangas leves. Sofisticação neutra para casamentos ao entardecer.",
    tipos: ["Vestidos de Madrinha", "Vestidos Longos", "Vestidos Evase"],
  },
  {
    id: 10,
    nome: "Vestido Festa Borgonha Velvet",
    preco: 1990,
    imagem: dressMarsala,
    cor: "Borgonha",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-borgonha-velvet",
    coresDisponiveis: ["Borgonha", "Marsala", "Vermelho"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em veludo borgonha com decote assimétrico e fenda frontal. Presença marcante para galas e formaturas.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos com Fenda", "Vestidos Sereia"],
  },
  {
    id: 11,
    nome: "Vestido Festa Esmeralda Riviera",
    preco: 2140,
    imagem: dressOlive,
    cor: "Verde Esmeralda",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-esmeralda-riviera",
    coresDisponiveis: ["Verde Esmeralda", "Jade", "Champanhe"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido sereia em malha acetinada verde esmeralda com fenda estratégica. Brilho sofisticado para noites especiais.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos com Fenda", "Vestidos Sereia"],
  },
  {
    id: 12,
    nome: "Vestido Madrinha Fúcsia Aurora",
    preco: 1620,
    imagem: dressRose,
    cor: "Fúcsia",
    categoriaTipo: "Vestidos de Madrinha",
    slug: "vestido-madrinha-fucsia-aurora",
    coresDisponiveis: ["Fúcsia", "Rosa Blush", "Marsala"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em crepe fúcsia com decote quadrado e saia evasê leve. Energia vibrante para cerimônias contemporâneas.",
    tipos: ["Vestidos de Madrinha", "Vestidos Longos", "Vestidos Evase"],
  },
  {
    id: 13,
    nome: "Vestido Debutante Azul Royal Celeste",
    preco: 2390,
    imagem: dressSerenity,
    cor: "Azul Royal",
    categoriaTipo: "Vestidos de Debutante",
    slug: "vestido-debutante-azul-royal-celeste",
    coresDisponiveis: ["Azul Royal", "Azul Serenity", "Branco"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido de debutante em tule estruturado azul royal com brilho sutil. Silhueta sereia com cauda leve para a valsa.",
    tipos: ["Vestidos de Debutante", "Vestidos Longos", "Vestidos Sereia"],
  },
  {
    id: 14,
    nome: "Vestido Festa Amarelo Manteiga Soleil",
    preco: 1850,
    imagem: dressChampagne,
    cor: "Amarelo Manteiga",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-amarelo-manteiga-soleil",
    coresDisponiveis: ["Amarelo Manteiga", "Champanhe", "Bege"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido evasê em cetim amarelo manteiga com decote coração. Luz solar em forma de vestido para eventos diurnos.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos Evase"],
  },
  {
    id: 15,
    nome: "Vestido Festa Jade Bamboo",
    preco: 1920,
    imagem: dressOlive,
    cor: "Jade",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-jade-bamboo",
    coresDisponiveis: ["Jade", "Verde Esmeralda", "Champanhe"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em crepe jade com alças finas e recorte nas costas. Frescor elegante inspirado na natureza.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos Sereia"],
  },
  {
    id: 16,
    nome: "Vestido Madrinha Verde Sálvia Clara",
    preco: 1680,
    imagem: dressOlive,
    cor: "Verde Sálvia",
    categoriaTipo: "Vestidos de Madrinha",
    slug: "vestido-madrinha-verde-salvia-clara",
    coresDisponiveis: ["Verde Sálvia", "Verde Oliva", "Bege"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em musseline verde sálvia com mangas bufantes leves. Romantismo orgânico para cerimônias campestres.",
    tipos: ["Vestidos de Madrinha", "Vestidos Longos", "Vestidos Evase"],
  },
  {
    id: 17,
    nome: "Vestido Festa Vermelho Rubi Gala",
    preco: 2050,
    imagem: dressMarsala,
    cor: "Vermelho",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-vermelho-rubi-gala",
    coresDisponiveis: ["Vermelho", "Borgonha", "Marsala"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido sereia em cetim vermelho rubi com decote profundo. Impacto clássico para red carpets e festas à noite.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos Sereia"],
  },
  {
    id: 18,
    nome: "Vestido Festa Azul Suave Brisa",
    preco: 1710,
    imagem: dressSerenity,
    cor: "Azul Suave",
    categoriaTipo: "Vestidos para Festa",
    slug: "vestido-festa-azul-suave-brisa",
    coresDisponiveis: ["Azul Suave", "Azul Serenity", "Branco"],
    tamanhos: ["P", "M", "G", "GG"],
    descricao:
      "Vestido longo em tule azul suave com saia evasê fluida. Brisa oceânica para casamentos à beira-mar.",
    tipos: ["Vestidos para Festa", "Vestidos Longos", "Vestidos Evase"],
  },
];

export function findProductByRouteParam(param: string | undefined): Product | undefined {
  if (!param) return undefined;
  const bySlug = products.find((p) => p.slug === param);
  if (bySlug) return bySlug;
  const id = Number(param);
  if (!Number.isNaN(id)) return products.find((p) => p.id === id);
  return undefined;
}
