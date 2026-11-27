import { percent } from '../utils/format';
import { daysBetween } from './dates';

export const GOAL_STATUS = {
  DONE: 'done',
  OVERDUE: 'overdue',
  ACTIVE: 'active',
};

const AVERAGE_DAYS_IN_MONTH = 30.44;

export function goalForecast(goal, todayIso) {
  const progress = percent(goal.savedAmount, goal.targetAmount);
  const missing = Math.max(goal.targetAmount - goal.savedAmount, 0);
  const daysLeft = daysBetween(todayIso, goal.deadline);

  if (missing === 0) return { progress, missing, daysLeft, monthlyNeeded: 0, status: GOAL_STATUS.DONE };
  if (daysLeft < 0) return { progress, missing, daysLeft, monthlyNeeded: missing, status: GOAL_STATUS.OVERDUE };

  const monthsLeft = Math.max(daysLeft / AVERAGE_DAYS_IN_MONTH, 1);
  return {
    progress,
    missing,
    daysLeft,
    monthlyNeeded: Math.ceil((missing / monthsLeft) * 100) / 100,
    status: GOAL_STATUS.ACTIVE,
  };
}

export function goalsSummary(goals) {
  const saved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const target = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  return { saved, target, progress: percent(saved, target) };
}
