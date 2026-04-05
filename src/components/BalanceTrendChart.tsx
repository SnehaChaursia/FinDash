import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinanceStore } from "../store/financeStore";
import { getMonthlyNetSeries } from "../lib/financeMath";
import { formatCurrency } from "../lib/format";
import EmptyState from "./EmptyState";

export default function BalanceTrendChart() {
  const transactions = useFinanceStore((s) => s.transactions);
  const darkMode = useFinanceStore((s) => s.darkMode);
  const series = getMonthlyNetSeries(transactions);
  const tickFill = darkMode ? "#94a3b8" : "#64748b";
  const gridStroke = darkMode ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.35)";

  if (series.length === 0) {
    return (
      <EmptyState
        title="No balance trend data"
        description="Add transactions to see your balance over time."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">Balance trend</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Cumulative net by month</div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: tickFill }} axisLine={{ stroke: gridStroke }} />
            <YAxis
              tick={{ fontSize: 12, fill: tickFill }}
              tickFormatter={(v) => `$${v}`}
              axisLine={{ stroke: gridStroke }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                color: darkMode ? "#f1f5f9" : "#0f172a",
              }}
              formatter={(value) =>
                typeof value === "number" ? formatCurrency(value) : "—"
              }
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="cumulativeBalance"
              name="Balance"
              stroke="#00b386"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#00b386", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

