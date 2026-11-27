export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Najnowsze' },
  { value: 'date-asc', label: 'Najstarsze' },
  { value: 'amount-desc', label: 'Kwota malejąco' },
  { value: 'amount-asc', label: 'Kwota rosnąco' },
];

export const EMPTY_QUERY = {
  search: '',
  type: 'ALL',
  category: '',
  from: '',
  to: '',
  sort: 'date-desc',
};

const comparators = {
  'date-desc': (a, b) => b.date.localeCompare(a.date) || b.id - a.id,
  'date-asc': (a, b) => a.date.localeCompare(b.date) || a.id - b.id,
  'amount-desc': (a, b) => Math.abs(b.amount) - Math.abs(a.amount),
  'amount-asc': (a, b) => Math.abs(a.amount) - Math.abs(b.amount),
};

const normalize = (text) => text.trim().toLocaleLowerCase('pl-PL');

function matches(transaction, query) {
  const phrase = normalize(query.search);
  if (phrase && !normalize(`${transaction.description} ${transaction.category}`).includes(phrase)) return false;
  if (query.type !== 'ALL' && transaction.type !== query.type) return false;
  if (query.category && transaction.category !== query.category) return false;
  if (query.from && transaction.date < query.from) return false;
  if (query.to && transaction.date > query.to) return false;
  return true;
}

export function applyQuery(transactions, query) {
  return transactions.filter((t) => matches(t, query)).sort(comparators[query.sort] ?? comparators['date-desc']);
}

export function isFiltered(query) {
  return Object.keys(EMPTY_QUERY).some((key) => key !== 'sort' && query[key] !== EMPTY_QUERY[key]);
}
