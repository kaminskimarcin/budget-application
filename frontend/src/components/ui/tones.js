import { BUDGET_STATUS } from '../../domain/budgets';
import { GOAL_STATUS } from '../../domain/goals';

export const BUDGET_TONES = {
  [BUDGET_STATUS.OK]: { tone: 'success', label: 'W normie' },
  [BUDGET_STATUS.WARNING]: { tone: 'warning', label: 'Blisko limitu' },
  [BUDGET_STATUS.EXCEEDED]: { tone: 'danger', label: 'Przekroczony' },
};

export const GOAL_TONES = {
  [GOAL_STATUS.DONE]: { tone: 'success', label: 'Osiągnięty' },
  [GOAL_STATUS.OVERDUE]: { tone: 'danger', label: 'Po terminie' },
  [GOAL_STATUS.ACTIVE]: { tone: 'primary', label: 'W trakcie' },
};
