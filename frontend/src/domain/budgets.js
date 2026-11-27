import { percent } from '../utils/format';
import { inMonth, isExpense } from './transactions';

export const BUDGET_STATUS = {
  OK: 'ok',
  WARNING: 'warning',
  EXCEEDED: 'exceeded',
};

export function budgetStatus(usage) {
  if (usage > 100) return BUDGET_STATUS.EXCEEDED;
  if (usage >= 80) return BUDGET_STATUS.WARNING;
  return BUDGET_STATUS.OK;
}

export function budgetUsage(budgets, transactions, monthKey) {
  const expenses = inMonth(transactions, monthKey).filter(isExpense);
  return budgets.map((budget) => {
    const spent = expenses.filter((t) => t.category === budget.category).reduce((sum, t) => sum - t.amount, 0);
    const usage = percent(spent, budget.limit);
    return { ...budget, spent, remaining: budget.limit - spent, usage, status: budgetStatus(usage) };
  });
}

export function budgetTotals(usages) {
  const limit = usages.reduce((sum, b) => sum + b.limit, 0);
  const spent = usages.reduce((sum, b) => sum + b.spent, 0);
  const usage = percent(spent, limit);
  return { limit, spent, usage, status: budgetStatus(usage) };
}
