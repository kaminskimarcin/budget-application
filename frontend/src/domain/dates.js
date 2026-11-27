const DAY_MS = 24 * 60 * 60 * 1000;

export function today() {
  return new Date().toLocaleDateString('sv-SE');
}

export function monthOf(isoDate) {
  return isoDate.slice(0, 7);
}

export function shiftMonth(monthKey, offset) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function lastMonths(endMonthKey, count) {
  return Array.from({ length: count }, (_, index) => shiftMonth(endMonthKey, index - count + 1));
}

export function daysBetween(fromIso, toIso) {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / DAY_MS);
}
