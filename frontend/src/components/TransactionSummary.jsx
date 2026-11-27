import { savingsRate, totals } from '../domain/transactions';
import { currency } from '../utils/format';
import StatCard from './ui/StatCard';

function TransactionSummary({ transactions }) {
  const summary = totals(transactions);
  const cards = [
    { label: 'Przychody', value: currency.format(summary.income), tone: 'success', icon: '↗' },
    { label: 'Wydatki', value: currency.format(summary.expenses), tone: 'danger', icon: '↘' },
    {
      label: 'Saldo',
      value: currency.format(summary.balance),
      tone: summary.balance < 0 ? 'danger' : 'primary',
      icon: '=',
      hint: summary.income > 0 ? `Oszczędzasz ${savingsRate(summary)}% przychodów` : undefined,
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div className="col-12 col-md-4" key={card.label}>
          <StatCard {...card} />
        </div>
      ))}
    </div>
  );
}

export default TransactionSummary;
