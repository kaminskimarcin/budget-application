import { currency, formatDate } from '../utils/format';

function TransactionRow({ transaction, onEdit, onDelete }) {
  const income = transaction.amount > 0;

  return (
    <tr>
      <td className="text-nowrap text-body-secondary small">{formatDate(transaction.date)}</td>
      <td>
        <div className="d-flex align-items-center gap-2">
          <span className={`tx-icon ${income ? 'tx-income' : 'tx-expense'}`} aria-hidden="true">
            {income ? '↗' : '↘'}
          </span>
          <span className="fw-medium">{transaction.description}</span>
        </div>
      </td>
      <td>
        <span className="badge rounded-pill category-badge">{transaction.category}</span>
      </td>
      <td className={`text-end text-nowrap fw-semibold ${income ? 'text-success' : 'text-danger'}`}>
        {income ? '+' : ''}
        {currency.format(transaction.amount)}
      </td>
      <td className="text-end text-nowrap">
        <button
          type="button"
          className="btn btn-sm btn-link text-decoration-none text-primary"
          aria-label={`Edytuj: ${transaction.description}`}
          onClick={() => onEdit(transaction)}
        >
          Edytuj
        </button>
        <button
          type="button"
          className="btn btn-sm btn-link text-decoration-none text-danger"
          aria-label={`Usuń: ${transaction.description}`}
          onClick={() => onDelete(transaction)}
        >
          Usuń
        </button>
      </td>
    </tr>
  );
}

function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="card overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 tx-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Opis</th>
              <th>Kategoria</th>
              <th className="text-end">Kwota</th>
              <th className="text-end">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionList;
