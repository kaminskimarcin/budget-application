import { lastMonths, monthOf } from './dates';

const sum = (items, pick) => items.reduce((total, item) => total + pick(item), 0);

export const isIncome = (transaction) => transaction.amount > 0;
export const isExpense = (transaction) => transaction.amount < 0;

export function totals(transactions) {
  const income = sum(transactions.filter(isIncome), (t) => t.amount);
  const expenses = sum(transactions.filter(isExpense), (t) => -t.amount);
  return { income, expenses, balance: income - expenses };
}

export function savingsRate({ income, balance }) {
  return income > 0 ? Math.round((balance / income) * 100) : 0;
}

export function inMonth(transactions, monthKey) {
  return transactions.filter((t) => monthOf(t.date) === monthKey);
}

export function availableMonths(transactions, currentMonth) {
  return [...new Set([currentMonth, ...transactions.map((t) => monthOf(t.date))])].sort().reverse();
}

export function latestActiveMonth(transactions, currentMonth) {
  if (transactions.some((t) => monthOf(t.date) === currentMonth)) return currentMonth;
  return transactions.map((t) => monthOf(t.date)).sort().at(-1) ?? currentMonth;
}

export function monthlyTotals(transactions, endMonth, count) {
  return lastMonths(endMonth, count).map((month) => ({ month, ...totals(inMonth(transactions, month)) }));
}

export function expensesByCategory(transactions, maxCategories, otherLabel) {
  const byCategory = new Map();
  transactions.filter(isExpense).forEach((t) => {
    byCategory.set(t.category, (byCategory.get(t.category) ?? 0) - t.amount);
  });
  const sorted = [...byCategory.entries()]
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
  if (sorted.length <= maxCategories) return sorted;
  const top = sorted.slice(0, maxCategories - 1);
  const rest = sum(sorted.slice(maxCategories - 1), (item) => item.value);
  return [...top, { category: otherLabel, value: rest }];
}

export function recentTransactions(transactions, count) {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, count);
}
