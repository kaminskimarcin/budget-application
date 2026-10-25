import { currency } from '../utils/format';

function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return <div className="alert alert-secondary">Brak transakcji. Dodaj pierwszą przyciskiem „Dodaj transakcję”.</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle mb-0">
          <thead className="table-primary">
            <tr>
              <th>Data</th>
              <th>Opis</th>
              <th>Kategoria</th>
              <th className="text-end">Kwota</th>
              <th className="text-end">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {[...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).map((transaction) => (
              <tr key={transaction.id}>
                <td className="text-nowrap">{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>
                  <span className="badge text-bg-light border">{transaction.category}</span>
                </td>
                <td className={`text-end text-nowrap ${transaction.amount < 0 ? 'text-danger' : 'text-success'}`}>
                  {currency.format(transaction.amount)}
                </td>
                <td className="text-end text-nowrap">
                  <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => onEdit(transaction)}>
                    Edytuj
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(transaction)}>
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TransactionSummary({ transactions }) {
  const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

  const cards = [
    { label: 'Przychody', value: income, className: 'text-success' },
    { label: 'Wydatki', value: expenses, className: 'text-danger' },
    { label: 'Saldo', value: income + expenses, className: '' },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div className="col-12 col-md-4" key={card.label}>
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="text-body-secondary small">{card.label}</div>
              <div className={`fs-4 fw-semibold ${card.className}`}>{currency.format(card.value)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
