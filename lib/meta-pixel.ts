export const META_PIXEL_ID = "1676852253417182";

// Meta Pixel does not accept JOD, so values are sent in USD using the fixed JOD peg (1 USD = 0.709 JOD).
const JOD_TO_USD = 1 / 0.709;

type Fbq = (...args: unknown[]) => void;

export function jodToUsd(value: number) {
  return Number((value * JOD_TO_USD).toFixed(2));
}

export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (!fbq) return;
  try {
    if (params) fbq("track", event, params);
    else fbq("track", event);
  } catch {}
}

export function trackProductEvent(event: "ViewContent" | "AddToCart", product: { id: string; name: string; price: number }, qty = 1) {
  trackPixel(event, {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: "product",
    value: jodToUsd(Number(product.price || 0) * qty),
    currency: "USD",
  });
}
