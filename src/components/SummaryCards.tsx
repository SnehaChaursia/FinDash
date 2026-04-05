import { useFinanceStore } from "../store/financeStore";
import { getTotals } from "../lib/financeMath";
import { formatCurrency } from "../lib/format";

function StatCard({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: string;
  subtitle?: string;
  accent?: "default" | "brand";
}) {
  const isBrand = accent === "brand";

  return (
    <div
      className={[
        "rounded-2xl border p-5 shadow-card-sm transition-shadow hover:shadow-card dark:shadow-none",
        isBrand
          ? "border-brand-200/80 bg-gradient-to-br from-brand-50 to-white dark:border-brand-500/35 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800"
          : "border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900",
      ].join(" ")}
    >
      <div
        className={
          isBrand
            ? "text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-brand-200"
            : "text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
        }
      >
        {title}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
      {subtitle ? (
        <div
          className={
            isBrand
              ? "mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300"
              : "mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
          }
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

export default function SummaryCards() {
  const transactions = useFinanceStore((s) => s.transactions);
  const totals = getTotals(transactions);

  const hasAny = transactions.length > 0;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Balance"
        value={hasAny ? formatCurrency(totals.balance) : "—"}
        subtitle="Income minus expenses"
        accent="brand"
      />
      <StatCard title="Income" value={hasAny ? formatCurrency(totals.incomeTotal) : "—"} subtitle="All income" />
      <StatCard title="Expenses" value={hasAny ? formatCurrency(totals.expenseTotal) : "—"} subtitle="All expenses" />
    </div>
  );
}

