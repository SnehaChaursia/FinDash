import { useEffect, useMemo, useState } from "react";
import { useFinanceStore } from "../store/financeStore";
import type { Transaction, TransactionType } from "../types/finance";

function toInputDateValue(dateIso: string) {
  // Ensure yyyy-mm-dd format for <input type="date" />.
  return dateIso.slice(0, 10);
}

export default function TransactionFormModal() {
  const role = useFinanceStore((s) => s.role);
  const isFormOpen = useFinanceStore((s) => s.ui.isFormOpen);
  const editingId = useFinanceStore((s) => s.ui.editingId);
  const transactions = useFinanceStore((s) => s.transactions);

  const closeTransactionForm = useFinanceStore((s) => s.closeTransactionForm);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);

  const editingTx = useMemo(
    () => transactions.find((t) => t.id === editingId) ?? null,
    [transactions, editingId],
  );

  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFormOpen) return;

    if (editingTx) {
      setDate(toInputDateValue(editingTx.date));
      setDescription(editingTx.description);
      setCategory(editingTx.category);
      setType(editingTx.type);
      setAmount(String(editingTx.amount));
    } else {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);
      setDescription("");
      setCategory("");
      setType("expense");
      setAmount("");
    }

    setError(null);
  }, [isFormOpen, editingTx]);

  if (!isFormOpen) return null;
  if (role !== "admin") return null;

  const canSubmit = date && description.trim() && category.trim() && amount && Number(amount) > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericAmount = Number(amount);
    if (!date) return setError("Date is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError("Amount must be > 0.");

    const payload = {
      date,
      description: description.trim(),
      category: category.trim(),
      type,
      amount: numericAmount,
    };

    if (editingTx) {
      updateTransaction(editingTx.id, payload);
    } else {
      addTransaction(payload as Omit<Transaction, "id">);
    }

    closeTransactionForm();
  };

  const fieldClass =
    "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-card-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {editingTx ? "Edit transaction" : "Add transaction"}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Only admins can add or edit entries.
            </div>
          </div>
          <button
            type="button"
            onClick={closeTransactionForm}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-card-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Description</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Groceries"
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Category</span>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Groceries"
              className={fieldClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className={fieldClass}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>Amount</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 120"
                step="0.01"
                min="0"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeTransactionForm}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-card-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingTx ? "Save changes" : "Add transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

