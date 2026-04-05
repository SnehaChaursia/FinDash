import { useFinanceStore } from "../store/financeStore";

export default function RoleSwitcher() {
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-slate-500 sm:inline dark:text-slate-400">Role</span>
      <select
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-card-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        value={role}
        onChange={(e) => setRole(e.target.value as "viewer" | "admin")}
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </label>
  );
}

