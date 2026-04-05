import dressMarsala from "@/assets/dress-marsala.jpg";
import dressChampagne from "@/assets/dress-champagne.jpg";
import dressWhite from "@/assets/dress-white.jpg";
import dressRose from "@/assets/dress-rose.jpg";
import dressLavanda from "@/assets/dress-lavanda.jpg";
import dressOlive from "@/assets/dress-olive.jpg";
import dressSerenity from "@/assets/dress-serenity.jpg";
import dressTerracota from "@/assets/dress-terracota.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Vestido Madrinha Marsala Petra",
    price: 1490,
    image: dressMarsala,
    category: "Madrinha",
    colors: ["Marsala", "Rose Blush", "Champagne", "Branco"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido longo em chiffon com decote V profundo e drapeado na cintura. Caimento fluido e elegante, perfeito para madrinhas que desejam sofisticação e conforto.",
  },
  {
    id: 2,
    name: "Vestido Noiva Encanto Rendado",
    price: 4890,
    image: dressWhite,
    category: "Noiva",
    colors: ["Branco", "Champagne"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido de noiva em renda francesa com detalhes em pedraria. Saia ampla em tule e corpete estruturado. Um sonho para o grande dia.",
  },
  {
    id: 3,
    name: "Vestido Festa Champagne Glow",
    price: 2890,
    image: dressChampagne,
    category: "Festa",
    colors: ["Champagne", "Rose Blush", "Branco"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido tomara-que-caia em cetim acetinado champagne. Elegância atemporal com caimento impecável para festas de gala.",
  },
  {
    id: 4,
    name: "Vestido Madrinha Rose Valentina",
    price: 1690,
    image: dressRose,
    category: "Madrinha",
    colors: ["Rose Blush", "Lavanda", "Champagne"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido longo em tule delicado com alças finas e costas abertas. Romântico e sofisticado em rose blush.",
  },
  {
    id: 5,
    name: "Vestido Debutante Lavanda Sonho",
    price: 2290,
    image: dressLavanda,
    category: "Debutante",
    colors: ["Lavanda", "Rose Blush", "Branco"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido de debutante em tule lavanda com decote princesa. Volume perfeito e detalhes que fazem os 15 anos inesquecíveis.",
  },
  {
    id: 6,
    name: "Vestido Festa Verde Oliva Serena",
    price: 1890,
    image: dressOlive,
    category: "Festa",
    colors: ["Verde Oliva", "Marsala", "Champagne"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido longo em cetim verde oliva com decote profundo. Sofisticação moderna para festas e eventos especiais.",
  },
  {
    id: 7,
    name: "Vestido Madrinha Serenity Aurora",
    price: 1590,
    image: dressSerenity,
    category: "Madrinha",
    colors: ["Azul Serenity", "Lavanda", "Rose Blush"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido longo em chiffon azul serenity com costas elegantes. Leveza e sofisticação para cerimônias ao ar livre.",
  },
  {
    id: 8,
    name: "Vestido Festa Terracota Luna",
    price: 1790,
    image: dressTerracota,
    category: "Festa",
    colors: ["Terracota", "Marsala", "Champagne"],
    sizes: ["P", "M", "G", "GG"],
    description: "Vestido longo em tecido fluido terracota com caimento sofisticado. Cor vibrante e elegante para festas inesquecíveis.",
  },
];

export const colorMap: Record<string, string> = {
  "Verde Oliva": "#6B8E23",
  "Azul Serenity": "#89CFF0",
  "Rose Blush": "#F4B4C6",
  "Marsala": "#9C2F45",
  "Branco": "#FFFFFF",
  "Champagne": "#D4A853",
  "Terracota": "#C45B28",
  "Lavanda": "#B57EDC",
};
