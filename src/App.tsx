import { useEffect } from "react";
import { useFinanceStore } from "./store/financeStore";
import RoleSwitcher from "./components/RoleSwitcher";
import DarkModeToggle from "./components/DarkModeToggle";
import SummaryCards from "./components/SummaryCards";
import BalanceTrendChart from "./components/BalanceTrendChart";
import SpendingBreakdownChart from "./components/SpendingBreakdownChart";
import TransactionsTable from "./components/TransactionsTable";
import InsightsPanel from "./components/InsightsPanel";
import TransactionFormModal from "./components/TransactionFormModal";

export default function App() {
  const darkMode = useFinanceStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const role = useFinanceStore((s) => s.role);

  return (
    <div className="min-h-screen bg-surface text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-card-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-bold text-white shadow-sm">
              ₹
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                FinDash
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Simple money overview · Role:{" "}
                <span className="font-medium text-brand-600 dark:text-brand-400">{role}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <RoleSwitcher />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Your finances, at a glance
          </p>
          <h1 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Track spending, income, and patterns—without the clutter.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            A clean dashboard inspired by modern investing apps: clear numbers, gentle visuals, and
            room to explore your transactions.
          </p>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Overview</h2>
            <SummaryCards />
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Analytics</h2>
            <div className="grid gap-5 lg:grid-cols-2">
              <BalanceTrendChart />
              <SpendingBreakdownChart />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Insights</h2>
            <InsightsPanel />
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Transactions</h2>
            <TransactionsTable />
          </div>
        </section>
      </main>

      <TransactionFormModal />
    </div>
  );
}
