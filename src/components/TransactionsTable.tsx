import { useMemo, useState } from "react";
import { useFinanceStore, getFilteredSortedTransactions } from "../store/financeStore";
import type { TransactionType } from "../types/finance";
import { formatCurrency, formatDate } from "../lib/format";
import { getAllTransactionCategories } from "../lib/financeMath";
import { downloadText, transactionsToCsv, transactionsToJson } from "../lib/exportImport";
import EmptyState from "./EmptyState";

function TypeBadge({ type }: { type: TransactionType }) {
  const isIncome = type === "income";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isIncome
          ? "bg-brand-50 text-brand-800 dark:bg-brand-800 dark:text-white dark:ring-1 dark:ring-brand-600/50"
          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-100 dark:ring-1 dark:ring-rose-800/60",
      ].join(" ")}
    >
      {isIncome ? "Income" : "Expense"}
    </span>
  );
}

const fieldClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-card-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

const secondaryBtnClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-card-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

export default function TransactionsTable() {
  const role = useFinanceStore((s) => s.role);
  const transactions = useFinanceStore((s) => s.transactions);
  const filters = useFinanceStore((s) => s.filters);
  const sort = useFinanceStore((s) => s.sort);

  const setFilters = useFinanceStore((s) => s.setFilters);
  const setSort = useFinanceStore((s) => s.setSort);
  const resetFilters = useFinanceStore((s) => s.resetFilters);

  const startAddTransaction = useFinanceStore((s) => s.startAddTransaction);
  const startEditTransaction = useFinanceStore((s) => s.startEditTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);

  const categories = useMemo(() => getAllTransactionCategories(transactions), [transactions]);

  const filtered = useMemo(
    () => getFilteredSortedTransactions(transactions, filters, sort),
    [transactions, filters, sort],
  );

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const hasResults = filtered.length > 0;

  const exportCsv = () => {
    const csv = transactionsToCsv(transactions);
    downloadText(`transactions-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
  };

  const exportJson = () => {
    const json = transactionsToJson(transactions);
    downloadText(`transactions-${new Date().toISOString().slice(0, 10)}.json`, json, "application/json;charset=utf-8");
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-card-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white">All activity</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Filter, sort, and review</div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={exportCsv} className={secondaryBtnClass}>
            Export CSV
          </button>
          <button type="button" onClick={exportJson} className={secondaryBtnClass}>
            Export JSON
          </button>
          {role === "admin" ? (
            <button
              type="button"
              onClick={startAddTransaction}
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 active:scale-[0.98]"
            >
              + Add transaction
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Search</span>
          <input
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Description or category"
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Category</span>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
            className={fieldClass}
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Type</span>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value as "All" | TransactionType })}
            className={fieldClass}
          >
            <option value="All">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>Sort</span>
          <div className="flex items-center gap-2">
            <select
              value={sort.key}
              onChange={(e) => setSort({ key: e.target.value as "date" | "amount" })}
              className={`w-full ${fieldClass}`}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <select
              value={sort.direction}
              onChange={(e) => setSort({ direction: e.target.value as "asc" | "desc" })}
              className={`w-28 ${fieldClass}`}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          Reset filters
        </button>
      </div>

      {!hasResults ? (
        <EmptyState
          title="No matching transactions"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-700">
          <div className="grid grid-cols-[1.1fr_1.4fr_1fr_0.7fr_1fr] gap-0 bg-surface-muted/80 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400 sm:grid-cols-[1.1fr_1.6fr_1fr_0.7fr_1fr_0.6fr]">
            <div>Date</div>
            <div>Description</div>
            <div>Category</div>
            <div>Type</div>
            <div className="text-right">Amount</div>
            <div className="hidden sm:block">Actions</div>
          </div>

          <div className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900/30">
            {filtered.map((t) => {
              const signed = t.type === "expense" ? -t.amount : t.amount;
              return (
                <div
                  key={t.id}
                  className="grid grid-cols-[1.1fr_1.4fr_1fr_0.7fr_1fr] items-center px-3 py-3 text-sm transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 sm:grid-cols-[1.1fr_1.6fr_1fr_0.7fr_1fr_0.6fr]"
                >
                  <div className="text-slate-600 dark:text-slate-300">{formatDate(t.date)}</div>
                  <div className="truncate font-medium text-slate-900 dark:text-white">{t.description}</div>
                  <div className="truncate text-slate-500 dark:text-slate-400">{t.category}</div>
                  <div>
                    <TypeBadge type={t.type} />
                  </div>
                  <div className="text-right font-semibold text-slate-900 dark:text-white">
                    {signed < 0 ? "-" : "+"}
                    {formatCurrency(Math.abs(signed))}
                  </div>

                  {role === "admin" ? (
                    <div className="hidden items-center justify-end gap-2 sm:flex">
                      {confirmDeleteId === t.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              deleteTransaction(t.id);
                              setConfirmDeleteId(null);
                            }}
                            className="rounded-lg bg-rose-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditTransaction(t.id)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 dark:border-slate-600 dark:bg-slate-900 dark:text-brand-400 dark:hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(t.id)}
                            className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-400"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

