import { useFinanceStore } from "../store/financeStore";
import { getInsights } from "../lib/financeMath";
import { formatCurrency } from "../lib/format";
import EmptyState from "./EmptyState";

export default function InsightsPanel() {
  const transactions = useFinanceStore((s) => s.transactions);
  const insights = getInsights(transactions);

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No insights yet"
        description="Once you add transactions, you'll see patterns and observations here."
      />
    );
  }

  const delta = insights.monthlyNetDelta;
  const deltaText =
    delta == null
      ? "—"
      : `${delta >= 0 ? "+" : ""}${formatCurrency(delta)}`;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Insights</div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-surface-muted/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Top spending category
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {insights.highestSpendingCategory ?? "—"}
          </div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {insights.highestCategorySharePct == null
              ? "—"
              : `${insights.highestCategorySharePct.toFixed(1)}% of expenses`}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-surface-muted/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Monthly comparison
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{insights.monthlyComparisonLabel}</div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            Net delta:{" "}
            <span
              className={
                delta != null && delta >= 0
                  ? "font-semibold text-brand-600 dark:text-brand-400"
                  : "font-semibold text-rose-600 dark:text-rose-400"
              }
            >
              {deltaText}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50/80 to-white p-4 dark:border-slate-600 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800 md:col-span-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-200">
            Observation
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-100">
            {insights.observation}
          </div>
        </div>
      </div>
    </div>
  );
}

