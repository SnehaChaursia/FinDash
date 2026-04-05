import type { Transaction } from "../types/finance";

export function transactionsToCsv(transactions: Transaction[]): string {
  const headers = ["id", "date", "description", "category", "type", "amount"] as const;
  const escape = (val: string) => {
    if (/[",\n\r]/.test(val)) return `"${val.replace(/"/g, '""')}"`;
    return val;
  };
  const rows = transactions.map((t) =>
    headers.map((h) => escape(String(t[h]))).join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function transactionsToJson(transactions: Transaction[]): string {
  return JSON.stringify(transactions, null, 2);
}

export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
