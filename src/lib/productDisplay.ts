/** Categoria genérica do catálogo gerado (não exibida na vitrine). */
export function isGenericVestidosCategory(categoriaTipo: string): boolean {
  return /^vestidos$/i.test(categoriaTipo.trim());
}

/**
 * Nome exibido na vitrine: remove prefixo "Vestido(s) " só quando o restante começa com dígito
 * (ex.: "Vestido 010001" → "010001"), para não alterar nomes comerciais descritivos.
 */
export function productDisplayName(nome: string): string {
  const t = nome.trim();
  const stripped = t.replace(/^vestidos?\s+(?=\d)/i, "").trim();
  return stripped || t;
}
