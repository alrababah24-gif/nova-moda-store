export function formatPrice(value: number | string) {
  const number = typeof value === "string" ? Number(value) : value;
  return `${Number.isFinite(number) ? number.toFixed(number % 1 ? 2 : 0) : "0"} د.أ`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizePhone(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getSizeStock(product: { size_stock?: Record<string, number>; sizes?: string[]; stock?: number }, size: string) {
  const direct = product.size_stock?.[size];
  if (typeof direct === "number" && Number.isFinite(direct)) return Math.max(0, Math.floor(direct));
  if ((product.sizes?.length || 0) === 1) return Math.max(0, Math.floor(Number(product.stock || 0)));
  return 0;
}
