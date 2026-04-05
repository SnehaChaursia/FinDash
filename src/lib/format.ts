import { format, parseISO } from "date-fns";

export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateIso: string) {
  const d = parseISO(dateIso);
  return format(d, "MMM d, yyyy");
}

export function formatMonthKeyLabel(monthKey: string) {
  const [y, m] = monthKey.split("-").map((x) => Number(x));
  if (!y || !m) return monthKey;
  const dt = new Date(y, m - 1, 1);
  return format(dt, "MMM yyyy");
}

