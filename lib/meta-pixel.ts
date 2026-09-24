// Meta Pixel does not accept JOD as a currency ("Invalid parameter format for currency"),
// so store prices (always JOD) are converted to USD at the fixed peg before being sent.
const JOD_TO_USD = 1.41;

type PixelProduct = { id: string; price: number };

export function trackPixelEvent(event: "ViewContent" | "AddToCart", product: PixelProduct, qty = 1) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const value = Number((product.price * qty * JOD_TO_USD).toFixed(2));
  if (!Number.isFinite(value)) return;
  window.fbq("track", event, {
    content_ids: [String(product.id)],
    content_type: "product",
    value,
    currency: "USD",
  });
}
