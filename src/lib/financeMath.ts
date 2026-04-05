import type { Transaction } from "../types/finance";
import { format, parseISO } from "date-fns";

export interface Totals {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
}

export function getTotals(transactions: Transaction[]): Totals {
  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    incomeTotal,
    expenseTotal,
    balance: incomeTotal - expenseTotal,
  };
}

export interface MonthlySeriesPoint {
  monthKey: string; // YYYY-MM
  monthLabel: string; // e.g. "Jan 2026"
  income: number;
  expenses: number;
  net: number; // income - expenses
  cumulativeBalance: number; // sum of net up to this month
}

function monthKeyFromDate(dateIso: string) {
  const d = parseISO(dateIso);
  // Format ensures stable ordering and grouping keys.
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthlyNetSeries(transactions: Transaction[]): MonthlySeriesPoint[] {
  const grouped = new Map<
    string,
    { monthKey: string; income: number; expenses: number; monthLabel: string }
  >();

  for (const t of transactions) {
    const monthKey = monthKeyFromDate(t.date);
    if (!grouped.has(monthKey)) {
      const d = parseISO(t.date);
      grouped.set(monthKey, {
        monthKey,
        income: 0,
        expenses: 0,
        monthLabel: format(d, "MMM yyyy"),
      });
    }

    const bucket = grouped.get(monthKey)!;
    if (t.type === "income") bucket.income += t.amount;
    if (t.type === "expense") bucket.expenses += t.amount;
  }

  const sortedKeys = Array.from(grouped.keys()).sort();
  let cumulative = 0;
  return sortedKeys.map((key) => {
    const b = grouped.get(key)!;
    const net = b.income - b.expenses;
    cumulative += net;
    return {
      monthKey: b.monthKey,
      monthLabel: b.monthLabel,
      income: b.income,
      expenses: b.expenses,
      net,
      cumulativeBalance: cumulative,
    };
  });
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export function getSpendingByCategory(transactions: Transaction[], topN = 6) {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }

  const sorted = Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  if (!topN || sorted.length <= topN) return sorted;
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const otherTotal = rest.reduce((sum, x) => sum + x.total, 0);
  return otherTotal > 0 ? [...top, { category: "Other", total: otherTotal }] : top;
}

export interface Insights {
  highestSpendingCategory: string | null;
  highestCategorySharePct: number | null;
  monthlyComparisonLabel: string;
  monthlyNetDelta: number | null; // last - previous
  observation: string;
}

export function getInsights(transactions: Transaction[]): Insights {
  const monthly = getMonthlyNetSeries(transactions);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const spending = getSpendingByCategory(transactions, 100);
  const highest = spending[0] ?? null;
  const highestSharePct =
    highest && expenseTotal > 0 ? (highest.total / expenseTotal) * 100 : null;

  const last = monthly[monthly.length - 1];
  const prev = monthly.length >= 2 ? monthly[monthly.length - 2] : null;
  const monthlyNetDelta = last && prev ? last.net - prev.net : null;

  let monthlyComparisonLabel = "Not enough months for comparison";
  if (last && prev) {
    monthlyComparisonLabel = `${prev.monthLabel} vs ${last.monthLabel}`;
  }

  const topPart = highest
    ? `Your top spending category is ${highest.category}, accounting for ${highestSharePct?.toFixed(
        1,
      )}% of expenses.`
    : "No expense transactions available yet.";

  const deltaPart =
    monthlyNetDelta == null
      ? "Add more transactions to unlock a monthly comparison insight."
      : `Net change from previous month is ${monthlyNetDelta >= 0 ? "+" : ""}${monthlyNetDelta.toFixed(
          0,
        )}.`;

  const observation =
    expenseTotal === 0
      ? "No expenses recorded. Add expense transactions to see spending patterns and insights."
      : `${topPart} ${deltaPart}`;

  return {
    highestSpendingCategory: highest?.category ?? null,
    highestCategorySharePct: highestSharePct ?? null,
    monthlyComparisonLabel,
    monthlyNetDelta,
    observation,
  };
}

export function getAllTransactionCategories(transactions: Transaction[]): string[] {
  const set = new Set<string>();
  for (const t of transactions) set.add(t.category);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

