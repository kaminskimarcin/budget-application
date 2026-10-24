export const currency = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

export const percent = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);
