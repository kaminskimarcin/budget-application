import { GOAL_STATUS } from '../domain/goals';
import { currency, formatDate } from '../utils/format';
import ProgressBar from './ui/ProgressBar';
import { GOAL_TONES } from './ui/tones';

function deadlineText(forecast) {
  if (forecast.status === GOAL_STATUS.DONE) return 'Cel zrealizowany 🎉';
  if (forecast.status === GOAL_STATUS.OVERDUE) return `Termin minął ${Math.abs(forecast.daysLeft)} dni temu`;
  if (forecast.daysLeft === 0) return 'Termin mija dzisiaj';
  return `Zostało ${forecast.daysLeft} dni`;
}

function GoalCard({ goal, onEdit, onDelete }) {
  const { forecast } = goal;
  const { tone, label } = GOAL_TONES[forecast.status];

  return (
    <div className={`card h-100 accent-card accent-${tone}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h3 className="h5 fw-semibold mb-0">{goal.name}</h3>
            <div className="small text-body-secondary">do {formatDate(goal.deadline)}</div>
          </div>
          <span className={`badge rounded-pill text-bg-${tone}`}>{label}</span>
        </div>
        <div className="d-flex align-items-baseline gap-1 mb-2">
          <span className="fs-4 fw-bold">{currency.format(goal.savedAmount)}</span>
          <span className="small text-body-secondary">z {currency.format(goal.targetAmount)}</span>
        </div>
        <ProgressBar value={forecast.progress} tone={tone} height="1rem" showValue label={`Postęp celu ${goal.name}`} />
        <div className="row g-2 small mt-2">
          <div className="col-6">
            <div className="text-body-secondary">Brakuje</div>
            <div className="fw-semibold">{currency.format(forecast.missing)}</div>
          </div>
          <div className="col-6 text-end">
            <div className="text-body-secondary">{deadlineText(forecast)}</div>
            {forecast.status === GOAL_STATUS.ACTIVE && (
              <div className="fw-semibold">{currency.format(forecast.monthlyNeeded)} / mies.</div>
            )}
          </div>
        </div>
      </div>
      <div className="card-footer bg-transparent d-flex justify-content-end gap-1">
        <button type="button" className="btn btn-sm btn-link text-decoration-none text-primary" onClick={() => onEdit(goal)}>
          Edytuj
        </button>
        <button type="button" className="btn btn-sm btn-link text-decoration-none text-danger" onClick={() => onDelete(goal)}>
          Usuń
        </button>
      </div>
    </div>
  );
}

export default GoalCard;
