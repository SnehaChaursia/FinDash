# Financial Dashboard

A simple responsive financial dashboard (mock data) for exploring transactions, spending patterns, and basic insights. Includes a simulated role switch (Viewer vs Admin) to demonstrate role-based UI behavior.

<a href="https://vercel.com/snehachaursias-projects/fin-dash/DTHy6ZgTtDJi6eoWvGaZus3JCWN3" target="_blank">Live Demo</a>

## Features

### Dashboard overview
- Summary cards: **Total Balance**, **Income**, **Expenses**
- Time-based visualization: **Balance Trend** (cumulative net by month)
- Categorical visualization: **Spending Breakdown** (top expense categories)

### Transactions
- Transaction list with:
  - `Date`, `Description`, `Category`, `Type`, `Amount`
  - Simple filtering: **search**, **category**, **type**
  - Sorting: **date** or **amount** (asc/desc)
- Role-based actions:
  - **Viewer**: read-only (can filter/sort/search); **Export CSV** and **Export JSON** of all transactions
  - **Admin**: can **add**, **edit**, and **delete** transactions via a modal; same exports as viewer

### Insights
- Highest spending category (and share of total expenses)
- Monthly comparison (net change between last two months)
- Generated observation text based on the mock dataset

### State management
- Uses **Zustand** for application state:
  - transactions + filters/sort
  - selected role (simulated)
  - dark mode toggle
- Transactions and role are persisted to `localStorage` via Zustand `persist`.

### UX / Edge cases
- Graceful empty states for charts, insights, and transaction search results.
- Responsive layout using Tailwind grid/flex breakpoints.
- Dark mode support (toggle in the header).

## Setup

### Requirements
- Node.js 18+

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Open the shown URL (usually `http://localhost:5173`).

### Build

```bash
npm run build
```

## Project structure (key files)

- `src/store/financeStore.ts`: Zustand store + role simulation + filtering/sorting helpers
- `src/data/mockTransactions.ts`: seeded mock dataset
- `src/lib/financeMath.ts`: pure functions for totals, monthly trend, category breakdown, and insights
- `src/components/*`: UI components (charts, table, insights, modal, toggles)
- `src/App.tsx`: page layout and wiring

