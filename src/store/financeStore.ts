import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTransactions } from "../data/mockTransactions";
import type {
  FinanceUiState,
  Transaction,
  TransactionFilters,
  TransactionSort,
  TransactionType,
  UserRole,
} from "../types/finance";

const defaultFilters: TransactionFilters = {
  search: "",
  category: "All",
  type: "All",
};

const defaultSort: TransactionSort = {
  key: "date",
  direction: "desc",
};

export interface FinanceState {
  role: UserRole;
  transactions: Transaction[];
  filters: TransactionFilters;
  sort: TransactionSort;
  ui: FinanceUiState;
  darkMode: boolean;

  setRole: (role: UserRole) => void;
  setFilters: (next: Partial<TransactionFilters>) => void;
  setSort: (next: Partial<TransactionSort>) => void;
  resetFilters: () => void;
  toggleDarkMode: () => void;

  startAddTransaction: () => void;
  startEditTransaction: (id: string) => void;
  closeTransactionForm: () => void;

  addTransaction: (data: Omit<Transaction, "id"> & { id?: string }) => void;
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, "id">>) => void;
  deleteTransaction: (id: string) => void;
}

function cryptoRandomId() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = crypto;
    if (c?.randomUUID) return c.randomUUID();
  } catch {
    // ignore
  }
  return `tx_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function getFilteredSortedTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
  sort: TransactionSort,
) {
  const search = filters.search.trim().toLowerCase();
  let out = transactions.filter((t) => {
    const matchesSearch =
      !search ||
      t.description.toLowerCase().includes(search) ||
      t.category.toLowerCase().includes(search);
    const matchesCategory = filters.category === "All" || t.category === filters.category;
    const matchesType = filters.type === "All" || t.type === (filters.type as TransactionType);
    return matchesSearch && matchesCategory && matchesType;
  });

  out = out.slice().sort((a, b) => {
    let diff = 0;
    if (sort.key === "date") diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sort.key === "amount") diff = a.amount - b.amount;

    return sort.direction === "asc" ? diff : -diff;
  });

  return out;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      role: "viewer",
      transactions: mockTransactions,
      filters: defaultFilters,
      sort: defaultSort,
      ui: { isFormOpen: false, editingId: null },
      darkMode: false,

      setRole: (role) => set({ role }),
      setFilters: (next) => set((s) => ({ filters: { ...s.filters, ...next } })),
      setSort: (next) => set((s) => ({ sort: { ...s.sort, ...next } })),
      resetFilters: () => set({ filters: defaultFilters }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      startAddTransaction: () => set({ ui: { isFormOpen: true, editingId: null } }),
      startEditTransaction: (id) => set({ ui: { isFormOpen: true, editingId: id } }),
      closeTransactionForm: () => set({ ui: { isFormOpen: false, editingId: null } }),

      addTransaction: (data) =>
        set((s) => {
          // Admin-only behavior is handled in the UI, but we keep this safe in state too.
          if (s.role !== "admin") return s;
          const id = data.id ?? cryptoRandomId();
          const tx: Transaction = {
            id,
            date: data.date,
            description: data.description,
            category: data.category,
            type: data.type,
            amount: data.amount,
          };
          return { transactions: [tx, ...s.transactions] };
        }),

      updateTransaction: (id, patch) =>
        set((s) => {
          if (s.role !== "admin") return s;
          return {
            transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          };
        }),

      deleteTransaction: (id) =>
        set((s) => {
          if (s.role !== "admin") return s;
          return { transactions: s.transactions.filter((t) => t.id !== id) };
        }),
    }),
    {
      name: "finance-dashboard:v1",
      version: 1,
      partialize: (state) => ({
        role: state.role,
        transactions: state.transactions,
        darkMode: state.darkMode,
      }),
    },
  ),
);

