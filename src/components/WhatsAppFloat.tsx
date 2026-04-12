/**
 * Botão WhatsApp ao lado da bottom nav — compacto, sem posição fixed.
 */
export const WHATSAPP_PHONE = "5521968586866";

export const WHATSAPP_MESSAGE = `Olá, Closet! Gostei de um modelo do catálogo e queria saber a disponibilidade dele 😊

Código do produto:
Meu nome:
Data do evento:`;

export const getWhatsAppHref = () =>
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}&type=phone_number&app_absent=0`;

/** Ícone + link; usado embutido na barra inferior. */
export function WhatsAppNavButton() {
  return (
    <div className="group relative flex flex-col items-end gap-1.5 font-[var(--font-body)]">
      <div
        className="pointer-events-none invisible absolute bottom-[calc(100%+6px)] right-0 z-10 max-w-[200px] translate-y-1 scale-95 rounded-2xl rounded-br-sm bg-white px-3 py-2 text-left text-xs leading-snug text-[#1a1a1a] opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-[opacity,transform,visibility] duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 motion-reduce:visible motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100"
        aria-hidden
      >
        <span className="mb-0.5 block font-semibold text-[#25D366]">Olá! 👋</span>
        Fale com a Closet pelo WhatsApp.
      </div>

      <a
        className="wa-float-btn-pulse flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white no-underline shadow-[0_3px_14px_rgba(37,211,102,0.4)] transition-[transform,box-shadow] duration-200 ease-out hover:scale-105 hover:shadow-[0_4px_18px_rgba(37,211,102,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        href={getWhatsAppHref()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
        title="WhatsApp"
      >
        <svg
          className="relative z-10 h-[22px] w-[22px]"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            fill="#fff"
            d="M16 2.933C8.814 2.933 2.933 8.814 2.933 16c0 2.31.618 4.474 1.694 6.343L2.4 29.067l6.923-1.815A13.01 13.01 0 0 0 16 29.067c7.186 0 13.067-5.881 13.067-13.067S23.186 2.933 16 2.933Z"
          />
          <path
            fill="#25D366"
            d="M16 5.067c-6.02 0-10.933 4.913-10.933 10.933 0 2.072.578 4.007 1.583 5.657l.197.316-.837 3.057 3.135-.823.308.183A10.878 10.878 0 0 0 16 26.933c6.02 0 10.933-4.913 10.933-10.933S22.02 5.067 16 5.067Z"
          />
          <path
            fill="#fff"
            d="M12.364 10.4c-.267-.6-.548-.612-.802-.623l-.682-.008c-.237 0-.622.089-.948.444-.326.356-1.244 1.215-1.244 2.962s1.273 3.436 1.451 3.673c.178.237 2.467 3.94 6.08 5.368 3.008 1.187 3.615.95 4.268.891.652-.059 2.104-.86 2.4-1.691.297-.831.297-1.544.208-1.692-.089-.148-.326-.237-.682-.415-.356-.178-2.104-1.038-2.43-1.156-.326-.118-.563-.178-.8.178-.237.356-.918 1.156-1.126 1.393-.208.237-.415.267-.771.089-.356-.178-1.503-.554-2.864-1.768-1.059-.944-1.774-2.11-1.982-2.466-.208-.356-.022-.548.156-.726.16-.16.356-.415.534-.622.178-.208.237-.356.356-.594.118-.237.059-.445-.03-.623-.088-.178-.776-1.933-1.092-2.618Z"
          />
        </svg>
      </a>
    </div>
  );
}
