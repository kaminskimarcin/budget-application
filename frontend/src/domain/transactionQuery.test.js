import { describe, expect, it } from 'vitest';
import { EMPTY_QUERY, applyQuery, isFiltered } from './transactionQuery';

const transactions = [
  { id: 1, date: '2026-10-01', description: 'Wynagrodzenie', category: 'Przychód', amount: 6000, type: 'INCOME' },
  { id: 2, date: '2026-10-03', description: 'Zakupy Biedronka', category: 'Jedzenie', amount: -184.2, type: 'EXPENSE' },
  { id: 3, date: '2026-10-12', description: 'Kino', category: 'Rozrywka', amount: -58, type: 'EXPENSE' },
  { id: 4, date: '2026-10-15', description: 'Zakupy Lidl', category: 'Jedzenie', amount: -236.75, type: 'EXPENSE' },
];

const ids = (items) => items.map((t) => t.id);

describe('applyQuery', () => {
  it('domyślnie sortuje od najnowszych', () => {
    expect(ids(applyQuery(transactions, EMPTY_QUERY))).toEqual([4, 3, 2, 1]);
  });

  it('wyszukuje bez względu na wielkość liter w opisie i kategorii', () => {
    expect(ids(applyQuery(transactions, { ...EMPTY_QUERY, search: 'zakupy' }))).toEqual([4, 2]);
    expect(ids(applyQuery(transactions, { ...EMPTY_QUERY, search: 'ROZRYWKA' }))).toEqual([3]);
  });

  it('filtruje po typie i kategorii', () => {
    expect(ids(applyQuery(transactions, { ...EMPTY_QUERY, type: 'INCOME' }))).toEqual([1]);
    expect(ids(applyQuery(transactions, { ...EMPTY_QUERY, category: 'Jedzenie' }))).toEqual([4, 2]);
  });

  it('filtruje po zakresie dat włącznie', () => {
    expect(ids(applyQuery(transactions, { ...EMPTY_QUERY, from: '2026-10-03', to: '2026-10-12' }))).toEqual([3, 2]);
  });

  it('sortuje po kwocie bezwzględnej', () => {
    expect(ids(applyQuery(transactions, { ...EMPTY_QUERY, sort: 'amount-desc' }))).toEqual([1, 4, 2, 3]);
    expect(ids(applyQuery(transactions, { ...EMPTY_QUERY, sort: 'amount-asc' }))).toEqual([3, 2, 4, 1]);
  });
});

describe('isFiltered', () => {
  it('ignoruje samą zmianę sortowania', () => {
    expect(isFiltered({ ...EMPTY_QUERY, sort: 'amount-asc' })).toBe(false);
    expect(isFiltered({ ...EMPTY_QUERY, search: 'kino' })).toBe(true);
  });
});
