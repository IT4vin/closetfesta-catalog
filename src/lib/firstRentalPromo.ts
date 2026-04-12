/** Cupom de 15% válido para o primeiro aluguel (conforme promoção do site). */
export const FIRST_RENTAL_COUPON_CODE = "EUQUERO15";
export const FIRST_RENTAL_DISCOUNT_RATE = 0.15;

export function isFirstRentalCouponCode(input: string): boolean {
  return input.trim().toUpperCase() === FIRST_RENTAL_COUPON_CODE;
}

/** Mensagem do botão "Alugar agora" na home — cupom + primeiro aluguel. */
export const WHATSAPP_FIRST_RENTAL_PROMO_MESSAGE = `Olá, Closet!

Vi no site a promoção de 15% de desconto no meu primeiro aluguel com o cupom EUQUERO15.

Quero saber como usar esse benefício e tirar dúvidas sobre disponibilidade das peças. Podemos conversar?

Obrigada(o)!`;
