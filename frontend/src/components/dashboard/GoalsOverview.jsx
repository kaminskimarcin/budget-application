import { today } from '../../domain/dates';
import { GOAL_STATUS, goalForecast } from '../../domain/goals';
import ProgressBar from '../ui/ProgressBar';
import { GOAL_TONES } from '../ui/tones';

function GoalsOverview({ goals }) {
  const now = today();
  const active = goals
    .map((goal) => ({ ...goal, forecast: goalForecast(goal, now) }))
    .filter((goal) => goal.forecast.status !== GOAL_STATUS.DONE)
    .sort((a, b) => b.forecast.progress - a.forecast.progress);
  if (active.length === 0) {
    return <p className="text-body-secondary small mb-0">🎉 Wszystkie cele zrealizowane.</p>;
  }
  return (
    <ul className="list-unstyled mb-0 d-grid gap-3">
      {active.map((goal) => (
        <li key={goal.id}>
          <div className="d-flex justify-content-between small mb-1">
            <span className="fw-semibold text-truncate">{goal.name}</span>
            <span className="text-body-secondary">{goal.forecast.progress}%</span>
          </div>
          <ProgressBar value={goal.forecast.progress} tone={GOAL_TONES[goal.forecast.status].tone} label={goal.name} />
        </li>
      ))}
    </ul>
  );
}

export default GoalsOverview;
