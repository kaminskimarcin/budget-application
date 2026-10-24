import { useCallback } from 'react';
import { getBudgets, getTransactions } from '../api/transactionsApi';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import { useApiData } from '../hooks/useApiData';
import { currency, percent } from '../utils/format';

function progressColor(usage) {
  if (usage > 100) return 'bg-danger';
  if (usage >= 80) return 'bg-warning';
  return 'bg-success';
}

function BudgetsPage() {
  const loadData = useCallback(
    () => Promise.all([getBudgets(), getTransactions()]),
    [],
  );
  const { data, loading, error } = useApiData(loadData);

  const budgets = data
    ? data[0].map((budget) => {
        const spent = -data[1]
          .filter((t) => t.category === budget.category && t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0);
        return { ...budget, spent, usage: percent(spent, budget.limit) };
      })
    : [];
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <section>
      <PageHeader title="Budżety – październik 2026" />
      <PageState loading={loading} error={error} />
      {data && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold">Wykorzystanie budżetu miesięcznego</span>
                <span>
                  {currency.format(totalSpent)} / {currency.format(totalLimit)}
                </span>
              </div>
              <div className="progress" role="progressbar" style={{ height: '1.25rem' }}>
                <div
                  className={`progress-bar ${progressColor(percent(totalSpent, totalLimit))}`}
                  style={{ width: `${Math.min(percent(totalSpent, totalLimit), 100)}%` }}
                >
                  {percent(totalSpent, totalLimit)}%
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            {budgets.map((budget) => (
              <div className="col-12 col-md-6 col-lg-4" key={budget.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h3 className="h6 mb-0">{budget.category}</h3>
                      {budget.usage > 100 && <span className="badge text-bg-danger">Przekroczony</span>}
                      {budget.usage >= 80 && budget.usage <= 100 && (
                        <span className="badge text-bg-warning">Blisko limitu</span>
                      )}
                    </div>
                    <div className="progress mb-2" role="progressbar">
                      <div
                        className={`progress-bar ${progressColor(budget.usage)}`}
                        style={{ width: `${Math.min(budget.usage, 100)}%` }}
                      />
                    </div>
                    <div className="d-flex justify-content-between small text-body-secondary">
                      <span>Wydano {currency.format(budget.spent)}</span>
                      <span>Limit {currency.format(budget.limit)}</span>
                    </div>
                    <div className="small mt-1">
                      Pozostało:{' '}
                      <strong className={budget.limit - budget.spent < 0 ? 'text-danger' : 'text-success'}>
                        {currency.format(budget.limit - budget.spent)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default BudgetsPage;
