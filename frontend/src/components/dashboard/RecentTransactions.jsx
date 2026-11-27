import { recentTransactions } from '../../domain/transactions';
import { currency, formatDate } from '../../utils/format';

const RECENT_COUNT = 5;

function RecentTransactions({ transactions }) {
  return (
    <ul className="list-group list-group-flush">
      {recentTransactions(transactions, RECENT_COUNT).map((t) => (
        <li key={t.id} className="list-group-item px-0 d-flex align-items-center gap-3">
          <span className={`tx-icon ${t.amount > 0 ? 'tx-income' : 'tx-expense'}`} aria-hidden="true">
            {t.amount > 0 ? '↗' : '↘'}
          </span>
          <div className="flex-grow-1 min-w-0">
            <div className="fw-medium text-truncate">{t.description}</div>
            <div className="small text-body-secondary">
              {formatDate(t.date)} · {t.category}
            </div>
          </div>
          <span className={`fw-semibold text-nowrap ${t.amount > 0 ? 'text-success' : 'text-danger'}`}>
            {t.amount > 0 ? '+' : ''}
            {currency.format(t.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default RecentTransactions;
