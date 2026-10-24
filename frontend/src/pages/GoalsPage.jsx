import { getGoals } from '../api/transactionsApi';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import { useApiData } from '../hooks/useApiData';
import { currency, percent } from '../utils/format';

function GoalsPage() {
  const { data: goals, loading, error } = useApiData(getGoals);

  return (
    <section>
      <PageHeader title="Cele oszczędnościowe" />
      <PageState loading={loading} error={error} />
      {goals && (
        <div className="row g-3">
          {goals.map((goal) => {
            const progress = percent(goal.savedAmount, goal.targetAmount);
            const done = progress >= 100;
            return (
              <div className="col-12 col-md-6" key={goal.id}>
                <div className={`card shadow-sm h-100 ${done ? 'border-success' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h3 className="h5 mb-0">{goal.name}</h3>
                      <span className={`badge ${done ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {done ? 'Osiągnięty' : `do ${goal.deadline}`}
                      </span>
                    </div>
                    <div className="fs-5 fw-semibold">
                      {currency.format(goal.savedAmount)}{' '}
                      <span className="fs-6 fw-normal text-body-secondary">
                        z {currency.format(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="progress my-2" role="progressbar" style={{ height: '1.25rem' }}>
                      <div
                        className={`progress-bar ${done ? 'bg-success' : 'progress-bar-striped'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      >
                        {progress}%
                      </div>
                    </div>
                    {!done && (
                      <div className="small text-body-secondary">
                        Brakuje {currency.format(goal.targetAmount - goal.savedAmount)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default GoalsPage;
