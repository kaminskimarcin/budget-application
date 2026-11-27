import { useMemo, useState } from 'react';
import { monthOf, today } from '../domain/dates';
import { availableMonths, latestActiveMonth } from '../domain/transactions';

export function useMonthSelection(transactions) {
  const [selected, setSelected] = useState(null);
  const currentMonth = monthOf(today());

  const months = useMemo(() => availableMonths(transactions, currentMonth), [transactions, currentMonth]);
  const month = selected ?? latestActiveMonth(transactions, currentMonth);

  return { months, month, setMonth: setSelected };
}
