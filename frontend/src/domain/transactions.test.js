import { describe, expect, it } from 'vitest';
import {
  availableMonths,
  expensesByCategory,
  latestActiveMonth,
  monthlyTotals,
  recentTransactions,
  savingsRate,
  totals,
} from './transactions';

const transactions = [
  { id: 1, date: '2026-10-01', description: 'Wynagrodzenie', category: 'Przychód', amount: 6000, type: 'INCOME' },
  { id: 2, date: '2026-10-02', description: 'Czynsz', category: 'Mieszkanie', amount: -2000, type: 'EXPENSE' },
  { id: 3, date: '2026-10-05', description: 'Zakupy', category: 'Jedzenie', amount: -300, type: 'EXPENSE' },
  { id: 4, date: '2026-09-15', description: 'Kino', category: 'Rozrywka', amount: -50, type: 'EXPENSE' },
  { id: 5, date: '2026-10-05', description: 'Obiad', category: 'Jedzenie', amount: -100, type: 'EXPENSE' },
];

describe('totals', () => {
  it('liczy przychody, wydatki i saldo', () => {
    expect(totals(transactions)).toEqual({ income: 6000, expenses: 2450, balance: 3550 });
  });

  it('zwraca zera dla pustej listy', () => {
    expect(totals([])).toEqual({ income: 0, expenses: 0, balance: 0 });
  });
});

describe('savingsRate', () => {
  it('liczy procent zaoszczędzonych przychodów', () => {
    expect(savingsRate({ income: 5000, balance: 1000 })).toBe(20);
  });

  it('zwraca 0 bez przychodów', () => {
    expect(savingsRate({ income: 0, balance: -100 })).toBe(0);
  });
});

describe('miesiące', () => {
  it('wybiera bieżący miesiąc, gdy ma transakcje', () => {
    expect(latestActiveMonth(transactions, '2026-10')).toBe('2026-10');
  });

  it('wybiera ostatni miesiąc z danymi, gdy bieżący jest pusty', () => {
    expect(latestActiveMonth(transactions, '2026-11')).toBe('2026-10');
  });

  it('listuje miesiące malejąco razem z bieżącym', () => {
    expect(availableMonths(transactions, '2026-11')).toEqual(['2026-11', '2026-10', '2026-09']);
  });

  it('buduje historię miesięczną z pustymi miesiącami', () => {
    const history = monthlyTotals(transactions, '2026-10', 3);
    expect(history.map((m) => m.month)).toEqual(['2026-08', '2026-09', '2026-10']);
    expect(history[0]).toMatchObject({ income: 0, expenses: 0 });
    expect(history[2]).toMatchObject({ income: 6000, expenses: 2400 });
  });
});

describe('expensesByCategory', () => {
  it('sumuje wydatki w kategoriach malejąco', () => {
    expect(expensesByCategory(transactions, 5, 'Pozostałe')).toEqual([
      { category: 'Mieszkanie', value: 2000 },
      { category: 'Jedzenie', value: 400 },
      { category: 'Rozrywka', value: 50 },
    ]);
  });

  it('łączy nadmiarowe kategorie w pozostałe', () => {
    expect(expensesByCategory(transactions, 2, 'Pozostałe')).toEqual([
      { category: 'Mieszkanie', value: 2000 },
      { category: 'Pozostałe', value: 450 },
    ]);
  });
});

describe('recentTransactions', () => {
  it('zwraca najnowsze transakcje', () => {
    expect(recentTransactions(transactions, 2).map((t) => t.id)).toEqual([5, 3]);
  });
});
