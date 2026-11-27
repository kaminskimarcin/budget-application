import { BUDGET_STATUS } from '../../domain/budgets';
import { currency } from '../../utils/format';
import ProgressBar from '../ui/ProgressBar';
import { BUDGET_TONES } from '../ui/tones';

function BudgetAlerts({ budgets }) {
  const watched = budgets.filter((b) => b.status !== BUDGET_STATUS.OK).sort((a, b) => b.usage - a.usage);
  if (watched.length === 0) {
    return <p className="text-body-secondary small mb-0">✅ Wszystkie budżety w normie.</p>;
  }
  return (
    <ul className="list-unstyled mb-0 d-grid gap-3">
      {watched.map((budget) => (
        <li key={budget.id}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="fw-semibold">{budget.category}</span>
            <span className={`text-${BUDGET_TONES[budget.status].tone}-emphasis`}>
              {currency.format(budget.spent)} / {currency.format(budget.limit)}
            </span>
          </div>
          <ProgressBar value={budget.usage} tone={BUDGET_TONES[budget.status].tone} label={budget.category} />
        </li>
      ))}
    </ul>
  );
}

export default BudgetAlerts;
