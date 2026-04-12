/**
 * Metadados fixos do catálogo (cores, tipos e mapa de cores).
 * Produtos em si vêm de `catalog.generated.ts` (gerado a partir da pasta `produtos/`).
 *
 * CORES_CATEGORIA deve coincidir com os nomes das pastas em `produtos/vestidos/<cor>/`
 * (cada subpasta é uma cor). Ao adicionar pastas novas, inclua o nome e um hex em colorMap.
 *
 * Ordem: tonalidade do mais claro ao mais escuro (luminância relativa WCAG do hex em colorMap).
 */

export const CORES_CATEGORIA = [
  "Branco",
  "Champanhe",
  "claro",
  "Bege",
  "Nude",
  "Lima",
  "Pink",
  "Tiffany",
  "Prata",
  "Menta",
  "Serenity",
  "Amarelo",
  "Rose",
  "Lavanda",
  "Mostarda",
  "Dourado",
  "Coral",
  "Cinza",
  "Terracota",
  "Verde",
  "Oliva",
  "Azul",
  "Cadete",
  "Fucsia",
  "Roxo",
  "Vermelho",
  "Esmeralda",
  "Marsala",
  "Grafite",
  "Marrom",
  "Bordô",
  "Marinho",
  "Petroleo",
  "Royal",
  "Preto",
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
  Amarelo: "#E6B800",
  Azul: "#2563EB",
  Bege: "#EDE0D4",
  "Bordô": "#6B1D2F",
  Branco: "#FFFFFF",
  Cadete: "#5F6F7A",
  Champanhe: "#F5E8C7",
  Cinza: "#9CA3AF",
  claro: "#E8E8E8",
  Coral: "#FF7F6B",
  Dourado: "#C9A227",
  Esmeralda: "#046B4C",
  Fucsia: "#C41E6E",
  Grafite: "#4B5563",
  Lavanda: "#C8A2C8",
  Lima: "#B8D96A",
  Marinho: "#1E3A5F",
  Marrom: "#6B4423",
  Marsala: "#9C2F45",
  Menta: "#98D4BB",
  Mostarda: "#D4A017",
  Nude: "#E8D5C4",
  Oliva: "#6B7C3F",
  Petroleo: "#1E3D4A",
  Pink: "#FFB6C1",
  Prata: "#C8C8C8",
  Preto: "#1A1A1A",
  Rose: "#E8A0A8",
  Roxo: "#7C3AED",
  Royal: "#003087",
  Serenity: "#A5C8E1",
  Terracota: "#C46A4E",
  Tiffany: "#81D8D4",
  Verde: "#228B22",
  Vermelho: "#C8102E",
};
