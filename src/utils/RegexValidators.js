export const ORDER_ID_RX = /^[A-Z]{2,4}-[0-9A-F]{8,12}$/;
export const AMOUNT_RX = /Amount:\s*\$[0-9]+(\.[0-9]{2})?/i;
export const MASKED_CARD_RX = /^\*{4}\s?\*{4}\s?\*{4}\s?\d{4}$/;
export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
