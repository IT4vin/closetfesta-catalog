import type { CartItem } from "@/contexts/CartContext";
import type { Product } from "@/data/catalog.generated";

function formatEventDateBr(iso: string): string {
  const t = iso.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return t || "(não informada)";
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** Monta o texto enviado ao WhatsApp ao finalizar a reserva no carrinho. */
export function buildReservationWhatsAppMessage(
  items: CartItem[],
  eventDateIso: string,
  productList: Product[],
): string {
  const subtotal = items.reduce((sum, item) => {
    const p = productList.find((pr) => pr.id === item.productId);
    return sum + (p?.preco ?? 0) * item.qty;
  }, 0);

  const lines: string[] = [
    "Olá, Closet!",
    "",
    "Quero finalizar o aluguel da minha reserva com os itens abaixo.",
    "",
    `Data do evento: ${formatEventDateBr(eventDateIso)}`,
    "",
    "Itens:",
  ];

  let n = 1;
  for (const item of items) {
    const p = productList.find((pr) => pr.id === item.productId);
    if (!p) continue;
    lines.push(
      `${n}. ${p.nome} (cód. ${p.codigo}) — Tam. ${item.size} — Cor: ${item.color} — Qtd: ${item.qty} — R$ ${(p.preco * item.qty).toLocaleString("pt-BR")}`,
    );
    n += 1;
  }

  lines.push("");
  lines.push(`Subtotal: R$ ${subtotal.toLocaleString("pt-BR")}`);
  return lines.join("\n");
}
