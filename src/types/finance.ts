export type TransactionType = "income" | "expense";
export type UserRole = "viewer" | "admin";

export type SortKey = "date" | "amount";
export type SortDirection = "asc" | "desc";

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  category: string;
  type: TransactionType;
  amount: number; // positive number; sign is derived from `type`
}

export interface TransactionFilters {
  search: string;
  category: string; // "All" means no category filter
  type: "All" | TransactionType;
}

export interface TransactionSort {
  key: SortKey;
  direction: SortDirection;
}

export interface FinanceUiState {
  isFormOpen: boolean;
  editingId: string | null;
}

