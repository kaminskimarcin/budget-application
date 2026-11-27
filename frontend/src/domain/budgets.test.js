import { describe, expect, it } from 'vitest';
import { BUDGET_STATUS, budgetStatus, budgetTotals, budgetUsage } from './budgets';

const budgets = [
  { id: 1, category: 'Jedzenie', limit: 500 },
  { id: 2, category: 'Transport', limit: 100 },
];

const transactions = [
  { id: 1, date: '2026-10-03', category: 'Jedzenie', amount: -450 },
  { id: 2, date: '2026-10-05', category: 'Transport', amount: -120 },
  { id: 3, date: '2026-09-20', category: 'Jedzenie', amount: -300 },
  { id: 4, date: '2026-10-10', category: 'Jedzenie', amount: 50 },
];

describe('budgetStatus', () => {
  it('rozróżnia normę, ostrzeżenie i przekroczenie', () => {
    expect(budgetStatus(79)).toBe(BUDGET_STATUS.OK);
    expect(budgetStatus(80)).toBe(BUDGET_STATUS.WARNING);
    expect(budgetStatus(101)).toBe(BUDGET_STATUS.EXCEEDED);
  });
});

describe('budgetUsage', () => {
  it('liczy tylko wydatki z wybranego miesiąca', () => {
    const [food, transport] = budgetUsage(budgets, transactions, '2026-10');
    expect(food).toMatchObject({ spent: 450, remaining: 50, usage: 90, status: BUDGET_STATUS.WARNING });
    expect(transport).toMatchObject({ spent: 120, remaining: -20, usage: 120, status: BUDGET_STATUS.EXCEEDED });
  });

  it('sumuje limity i wydatki', () => {
    expect(budgetTotals(budgetUsage(budgets, transactions, '2026-09'))).toEqual({
      limit: 600,
      spent: 300,
      usage: 50,
      status: BUDGET_STATUS.OK,
    });
  });
});
