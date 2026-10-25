import { describe, expect, it } from 'vitest';
import { parseAmount, validateBudget, validateGoal, validateTransaction } from './validation';

const validTransaction = {
  date: '2026-10-20',
  description: 'Zakupy spożywcze',
  category: 'Jedzenie',
  amount: '120,50',
  type: 'EXPENSE',
};

describe('validateTransaction', () => {
  it('przepuszcza poprawne dane', () => {
    expect(validateTransaction(validTransaction)).toEqual({});
  });

  it('wymaga opisu, kategorii i kwoty', () => {
    const errors = validateTransaction({ ...validTransaction, description: ' ', category: '', amount: '' });
    expect(Object.keys(errors)).toEqual(['description', 'category', 'amount']);
  });

  it('odrzuca kwotę, która nie jest liczbą lub ma za dużo miejsc po przecinku', () => {
    expect(validateTransaction({ ...validTransaction, amount: 'abc' }).amount).toBeDefined();
    expect(validateTransaction({ ...validTransaction, amount: '10.123' }).amount).toBeDefined();
    expect(validateTransaction({ ...validTransaction, amount: '0' }).amount).toBeDefined();
  });

  it('odrzuca niepoprawną datę i datę z przyszłości', () => {
    expect(validateTransaction({ ...validTransaction, date: '2026-02-30' }).date).toBeDefined();
    expect(validateTransaction({ ...validTransaction, date: '2999-01-01' }).date).toBeDefined();
  });

  it('odrzuca zbyt długi opis', () => {
    expect(validateTransaction({ ...validTransaction, description: 'x'.repeat(256) }).description).toBeDefined();
  });
});

describe('validateBudget', () => {
  it('wykrywa duplikat kategorii bez względu na wielkość liter', () => {
    expect(validateBudget({ category: 'jedzenie', limit: '500' }, ['Jedzenie']).category).toBeDefined();
  });

  it('wymaga dodatniego limitu', () => {
    expect(validateBudget({ category: 'Zdrowie', limit: '-5' }).limit).toBeDefined();
    expect(validateBudget({ category: 'Zdrowie', limit: '400' })).toEqual({});
  });
});

describe('validateGoal', () => {
  it('pozwala na zerową odłożoną kwotę, ale wymaga terminu', () => {
    const errors = validateGoal({ name: 'Rower', targetAmount: '3000', savedAmount: '0', deadline: '' });
    expect(Object.keys(errors)).toEqual(['deadline']);
  });
});

describe('parseAmount', () => {
  it('obsługuje przecinek dziesiętny', () => {
    expect(parseAmount('120,50')).toBe(120.5);
  });
});
