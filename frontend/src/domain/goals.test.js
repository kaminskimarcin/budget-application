import { describe, expect, it } from 'vitest';
import { GOAL_STATUS, goalForecast, goalsSummary } from './goals';

describe('goalForecast', () => {
  it('oznacza osiągnięty cel', () => {
    const forecast = goalForecast({ targetAmount: 1000, savedAmount: 1000, deadline: '2026-12-01' }, '2026-11-01');
    expect(forecast).toMatchObject({ status: GOAL_STATUS.DONE, missing: 0, progress: 100, monthlyNeeded: 0 });
  });

  it('oznacza cel po terminie', () => {
    const forecast = goalForecast({ targetAmount: 1000, savedAmount: 200, deadline: '2026-10-01' }, '2026-11-01');
    expect(forecast).toMatchObject({ status: GOAL_STATUS.OVERDUE, missing: 800, daysLeft: -31 });
  });

  it('liczy miesięczną kwotę potrzebną do terminu', () => {
    const forecast = goalForecast({ targetAmount: 7000, savedAmount: 1000, deadline: '2027-05-01' }, '2026-11-01');
    expect(forecast.status).toBe(GOAL_STATUS.ACTIVE);
    expect(forecast.daysLeft).toBe(181);
    expect(forecast.monthlyNeeded).toBeCloseTo(1009.07, 1);
  });

  it('przy krótkim terminie wymaga całej brakującej kwoty', () => {
    const forecast = goalForecast({ targetAmount: 500, savedAmount: 100, deadline: '2026-11-10' }, '2026-11-01');
    expect(forecast.monthlyNeeded).toBe(400);
  });
});

describe('goalsSummary', () => {
  it('sumuje odłożone i docelowe kwoty', () => {
    expect(
      goalsSummary([
        { targetAmount: 1000, savedAmount: 500 },
        { targetAmount: 3000, savedAmount: 500 },
      ]),
    ).toEqual({ saved: 1000, target: 4000, progress: 25 });
  });
});
