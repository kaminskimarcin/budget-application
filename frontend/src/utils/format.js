export const currency = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

export const compactCurrency = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const percent = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);

const dateFormatter = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });
const monthFormatter = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' });
const shortMonthFormatter = new Intl.DateTimeFormat('pl-PL', { month: 'short' });

const parseDate = (isoDate) => new Date(`${isoDate}T00:00:00`);
const parseMonth = (monthKey) => new Date(`${monthKey}-01T00:00:00`);

export const formatDate = (isoDate) => dateFormatter.format(parseDate(isoDate));

export const formatMonth = (monthKey) => {
  const label = monthFormatter.format(parseMonth(monthKey));
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const formatShortMonth = (monthKey) => shortMonthFormatter.format(parseMonth(monthKey)).replace('.', '');
