import { shiftMonth } from '../../domain/dates';
import { inMonth, savingsRate, totals } from '../../domain/transactions';
import { currency, formatMonth } from '../../utils/format';
import StatCard from '../ui/StatCard';

function changeHint(current, previous) {
  if (previous === 0) return 'brak danych z poprzedniego miesiąca';
  const change = Math.round(((current - previous) / previous) * 100);
  return `${change > 0 ? '+' : ''}${change}% vs poprzedni miesiąc`;
}

function KpiRow({ transactions, month }) {
  const current = totals(inMonth(transactions, month));
  const previous = totals(inMonth(transactions, shiftMonth(month, -1)));

  return (
    <div className="row g-3 mb-4">
      <div className="col-6 col-lg-3">
        <StatCard label="Przychody" value={currency.format(current.income)} hint={changeHint(current.income, previous.income)} tone="success" icon="↗" />
      </div>
      <div className="col-6 col-lg-3">
        <StatCard label="Wydatki" value={currency.format(current.expenses)} hint={changeHint(current.expenses, previous.expenses)} tone="danger" icon="↘" />
      </div>
      <div className="col-6 col-lg-3">
        <StatCard label="Saldo" value={currency.format(current.balance)} tone={current.balance < 0 ? 'danger' : 'primary'} icon="=" hint={formatMonth(month)} />
      </div>
      <div className="col-6 col-lg-3">
        <StatCard label="Stopa oszczędności" value={`${savingsRate(current)}%`} tone="info" icon="%" hint="część przychodów, która została" />
      </div>
    </div>
  );
}

export default KpiRow;
