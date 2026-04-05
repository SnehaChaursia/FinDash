import type { Transaction } from "../types/finance";

const tx = (partial: Omit<Transaction, "id"> & { id?: string }): Transaction => ({
  id: partial.id ?? cryptoRandomId(),
  date: partial.date,
  description: partial.description,
  category: partial.category,
  type: partial.type,
  amount: partial.amount,
});

// Simple deterministic-ish ID fallback for environments without `crypto.randomUUID`.
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

export const mockTransactions: Transaction[] = [
  // 2025-12
  tx({
    date: "2025-12-01",
    description: "Salary (Dec)",
    category: "Income",
    type: "income",
    amount: 5200,
  }),
  tx({
    date: "2025-12-03",
    description: "Freelance project payout",
    category: "Freelance",
    type: "income",
    amount: 900,
  }),
  tx({
    date: "2025-12-04",
    description: "Rent",
    category: "Housing",
    type: "expense",
    amount: 1650,
  }),
  tx({
    date: "2025-12-08",
    description: "Groceries",
    category: "Groceries",
    type: "expense",
    amount: 320,
  }),
  tx({
    date: "2025-12-10",
    description: "Utilities",
    category: "Utilities",
    type: "expense",
    amount: 140,
  }),
  tx({
    date: "2025-12-14",
    description: "Dining out",
    category: "Dining",
    type: "expense",
    amount: 95,
  }),
  tx({
    date: "2025-12-18",
    description: "Monthly transit pass",
    category: "Transport",
    type: "expense",
    amount: 70,
  }),
  tx({
    date: "2025-12-21",
    description: "Gym membership",
    category: "Health",
    type: "expense",
    amount: 55,
  }),
  tx({
    date: "2025-12-26",
    description: "Streaming subscription",
    category: "Subscriptions",
    type: "expense",
    amount: 20,
  }),

  // 2026-01
  tx({ date: "2026-01-01", description: "Salary (Jan)", category: "Income", type: "income", amount: 5200 }),
  tx({ date: "2026-01-07", description: "Freelance project payout", category: "Freelance", type: "income", amount: 600 }),
  tx({ date: "2026-01-10", description: "Rent", category: "Housing", type: "expense", amount: 1650 }),
  tx({ date: "2026-01-12", description: "Groceries", category: "Groceries", type: "expense", amount: 360 }),
  tx({ date: "2026-01-15", description: "Utilities", category: "Utilities", type: "expense", amount: 160 }),
  tx({ date: "2026-01-18", description: "Dining out", category: "Dining", type: "expense", amount: 120 }),
  tx({ date: "2026-01-19", description: "Pharmacy", category: "Health", type: "expense", amount: 45 }),
  tx({ date: "2026-01-22", description: "Ride share", category: "Transport", type: "expense", amount: 65 }),
  tx({ date: "2026-01-25", description: "Streaming subscription", category: "Subscriptions", type: "expense", amount: 20 }),
  tx({ date: "2026-01-28", description: "Online course", category: "Education", type: "expense", amount: 80 }),

  // 2026-02
  tx({ date: "2026-02-01", description: "Salary (Feb)", category: "Income", type: "income", amount: 5200 }),
  tx({ date: "2026-02-06", description: "Freelance project payout", category: "Freelance", type: "income", amount: 750 }),
  tx({ date: "2026-02-09", description: "Rent", category: "Housing", type: "expense", amount: 1650 }),
  tx({ date: "2026-02-11", description: "Groceries", category: "Groceries", type: "expense", amount: 410 }),
  tx({ date: "2026-02-13", description: "Utilities", category: "Utilities", type: "expense", amount: 155 }),
  tx({ date: "2026-02-16", description: "Dining out", category: "Dining", type: "expense", amount: 140 }),
  tx({ date: "2026-02-20", description: "Concert tickets", category: "Entertainment", type: "expense", amount: 120 }),
  tx({ date: "2026-02-22", description: "Monthly transit pass", category: "Transport", type: "expense", amount: 80 }),
  tx({ date: "2026-02-24", description: "Gym membership", category: "Health", type: "expense", amount: 55 }),
  tx({ date: "2026-02-26", description: "Streaming subscription", category: "Subscriptions", type: "expense", amount: 20 }),
  tx({ date: "2026-02-27", description: "Book purchase", category: "Education", type: "expense", amount: 35 }),

  // 2026-03
  tx({ date: "2026-03-01", description: "Salary (Mar)", category: "Income", type: "income", amount: 5200 }),
  tx({ date: "2026-03-05", description: "Freelance project payout", category: "Freelance", type: "income", amount: 1000 }),
  tx({ date: "2026-03-08", description: "Rent", category: "Housing", type: "expense", amount: 1650 }),
  tx({ date: "2026-03-10", description: "Groceries", category: "Groceries", type: "expense", amount: 430 }),
  tx({ date: "2026-03-12", description: "Utilities", category: "Utilities", type: "expense", amount: 170 }),
  tx({ date: "2026-03-15", description: "Dining out", category: "Dining", type: "expense", amount: 160 }),
  tx({ date: "2026-03-17", description: "Ride share", category: "Transport", type: "expense", amount: 110 }),
  tx({ date: "2026-03-19", description: "Streaming subscription", category: "Subscriptions", type: "expense", amount: 20 }),
  tx({ date: "2026-03-22", description: "Gym membership", category: "Health", type: "expense", amount: 55 }),
  tx({ date: "2026-03-25", description: "Online course", category: "Education", type: "expense", amount: 120 }),
  tx({ date: "2026-03-27", description: "Streaming subscription", category: "Subscriptions", type: "expense", amount: 12 }),

  // 2026-04 (partial)
  tx({ date: "2026-04-01", description: "Salary (Apr)", category: "Income", type: "income", amount: 5200 }),
  tx({ date: "2026-04-03", description: "Freelance project payout", category: "Freelance", type: "income", amount: 450 }),
  tx({ date: "2026-04-05", description: "Rent", category: "Housing", type: "expense", amount: 1650 }),
  tx({ date: "2026-04-08", description: "Groceries", category: "Groceries", type: "expense", amount: 390 }),
  tx({ date: "2026-04-10", description: "Utilities", category: "Utilities", type: "expense", amount: 150 }),
  tx({ date: "2026-04-12", description: "Dining out", category: "Dining", type: "expense", amount: 135 }),
  tx({ date: "2026-04-15", description: "Entertainment night", category: "Entertainment", type: "expense", amount: 70 }),
  tx({ date: "2026-04-17", description: "Monthly transit pass", category: "Transport", type: "expense", amount: 90 }),
  tx({ date: "2026-04-20", description: "Pharmacy", category: "Health", type: "expense", amount: 65 }),
  tx({ date: "2026-04-22", description: "Streaming subscription", category: "Subscriptions", type: "expense", amount: 20 }),
  tx({ date: "2026-04-25", description: "Book purchase", category: "Education", type: "expense", amount: 40 }),
];

