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
