export const META_PIXEL_ID = "1676852253417182";

// Meta Pixel rejects JOD as an event currency ("Invalid currency" in Events
// Manager), so prices are converted to USD using the fixed JOD/USD peg.
const JOD_TO_USD = 1.41;

type PixelParams = Record<string, unknown> & { valueJOD?: number };

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPixel(event: string, params: PixelParams = {}, eventId?: string) {
  if (typeof window === "undefined" || !window.fbq) return;
  const { valueJOD, ...rest } = params;
  const payload: Record<string, unknown> = { ...rest };
  if (typeof valueJOD === "number" && Number.isFinite(valueJOD)) {
    payload.value = Number((valueJOD * JOD_TO_USD).toFixed(2));
    payload.currency = "USD";
  }
  try {
    if (eventId) window.fbq("track", event, payload, { eventID: eventId });
    else window.fbq("track", event, payload);
  } catch {}
}
