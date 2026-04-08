/**
 * Metadados fixos do catálogo (cores, tipos e mapa de cores).
 * Produtos em si vêm de `catalog.generated.ts` (gerado a partir da pasta `produtos/`).
 */

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

