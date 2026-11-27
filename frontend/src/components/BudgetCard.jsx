import { currency } from '../utils/format';
import ProgressBar from './ui/ProgressBar';
import { BUDGET_TONES } from './ui/tones';

function BudgetCard({ budget, onEdit, onDelete }) {
  const { tone, label } = BUDGET_TONES[budget.status];

  return (
    <div className={`card h-100 accent-card accent-${tone}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className="h6 fw-semibold mb-0">{budget.category}</h3>
          <span className={`badge rounded-pill text-bg-${tone}`}>{label}</span>
        </div>
        <div className="d-flex align-items-baseline gap-1 mb-2">
          <span className="fs-5 fw-bold">{currency.format(budget.spent)}</span>
          <span className="small text-body-secondary">z {currency.format(budget.limit)}</span>
        </div>
        <ProgressBar value={budget.usage} tone={tone} label={`Wykorzystanie budżetu ${budget.category}`} />
        <div className="d-flex justify-content-between small mt-2">
          <span className="text-body-secondary">{budget.usage}% limitu</span>
          <span className={budget.remaining < 0 ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>
            {budget.remaining < 0 ? 'Ponad limit ' : 'Zostało '}
            {currency.format(Math.abs(budget.remaining))}
          </span>
        </div>
      </div>
      <div className="card-footer bg-transparent d-flex justify-content-end gap-1">
        <button type="button" className="btn btn-sm btn-link text-decoration-none text-primary" onClick={() => onEdit(budget)}>
          Edytuj
        </button>
        <button type="button" className="btn btn-sm btn-link text-decoration-none text-danger" onClick={() => onDelete(budget)}>
          Usuń
        </button>
      </div>
    </div>
  );
}

export default BudgetCard;
