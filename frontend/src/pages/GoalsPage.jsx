import { goalsApi } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import FormCard from '../components/FormCard';
import GoalForm from '../components/forms/GoalForm';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import { useApiData } from '../hooks/useApiData';
import { useCrudPage } from '../hooks/useCrudPage';
import { currency, percent } from '../utils/format';

const labels = {
  created: 'Cel oszczędnościowy został dodany.',
  updated: 'Cel został zaktualizowany.',
  deleted: 'Cel został usunięty.',
};

function GoalsPage() {
  const { data: goals, loading, error, reload } = useApiData(goalsApi.list);
  const crud = useCrudPage(goalsApi, reload, labels);

  return (
    <section>
      <PageHeader title="Cele oszczędnościowe" refreshing={loading && goals}>
        {!crud.form && (
          <button type="button" className="btn btn-primary" onClick={crud.openCreate} disabled={!goals}>
            Dodaj cel
          </button>
        )}
      </PageHeader>

      {crud.form && (
        <FormCard title={crud.form.item ? `Edycja celu: ${crud.form.item.name}` : 'Nowy cel'}>
          <GoalForm
            key={crud.form.item?.id ?? 'new'}
            goal={crud.form.item}
            onSubmit={crud.save}
            onCancel={crud.closeForm}
          />
        </FormCard>
      )}

      <PageState loading={loading} error={error} hasData={Boolean(goals)} onRetry={reload} />
      {goals && goals.length === 0 && <div className="alert alert-secondary">Brak celów oszczędnościowych.</div>}
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
                  <div className="card-footer bg-transparent d-flex justify-content-end gap-1">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => crud.openEdit(goal)}>
                      Edytuj
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => crud.askDelete(goal)}>
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {crud.toDelete && (
        <ConfirmDialog
          title="Usunąć cel?"
          message={`Cel „${crud.toDelete.name}” zostanie trwale usunięty.`}
          onConfirm={crud.confirmDelete}
          onCancel={crud.cancelDelete}
        />
      )}
    </section>
  );
}

export default GoalsPage;
