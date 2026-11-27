import { goalsApi } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import FormCard from '../components/FormCard';
import GoalCard from '../components/GoalCard';
import GoalForm from '../components/forms/GoalForm';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import EmptyState from '../components/ui/EmptyState';
import StatCard from '../components/ui/StatCard';
import { today } from '../domain/dates';
import { GOAL_STATUS, goalForecast, goalsSummary } from '../domain/goals';
import { useApiData } from '../hooks/useApiData';
import { useCrudPage } from '../hooks/useCrudPage';
import { currency } from '../utils/format';

const labels = {
  created: 'Cel oszczędnościowy został dodany.',
  updated: 'Cel został zaktualizowany.',
  deleted: 'Cel został usunięty.',
};

const STATUS_ORDER = [GOAL_STATUS.OVERDUE, GOAL_STATUS.ACTIVE, GOAL_STATUS.DONE];

function withForecast(goals) {
  const now = today();
  return goals
    .map((goal) => ({ ...goal, forecast: goalForecast(goal, now) }))
    .sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.forecast.status) - STATUS_ORDER.indexOf(b.forecast.status) ||
        a.deadline.localeCompare(b.deadline),
    );
}

function GoalsPage() {
  const { data, loading, error, reload } = useApiData(goalsApi.list);
  const crud = useCrudPage(goalsApi, reload, labels);
  const goals = withForecast(data ?? []);
  const summary = goalsSummary(goals);
  const doneCount = goals.filter((g) => g.forecast.status === GOAL_STATUS.DONE).length;
  const monthlyNeeded = goals.reduce(
    (sum, g) => sum + (g.forecast.status === GOAL_STATUS.ACTIVE ? g.forecast.monthlyNeeded : 0),
    0,
  );

  return (
    <section>
      <PageHeader title="Cele oszczędnościowe" subtitle="Postęp i prognoza odkładania pieniędzy" refreshing={loading && data}>
        {!crud.form && (
          <button type="button" className="btn btn-primary" onClick={crud.openCreate} disabled={!data}>
            + Dodaj cel
          </button>
        )}
      </PageHeader>

      {crud.form && (
        <FormCard title={crud.form.item ? `Edycja celu: ${crud.form.item.name}` : 'Nowy cel'}>
          <GoalForm key={crud.form.item?.id ?? 'new'} goal={crud.form.item} onSubmit={crud.save} onCancel={crud.closeForm} />
        </FormCard>
      )}

      <PageState loading={loading} error={error} hasData={Boolean(data)} onRetry={reload} />
      {data && goals.length === 0 && (
        <EmptyState icon="🏆" title="Brak celów oszczędnościowych">Dodaj cel, np. wakacje albo poduszkę finansową.</EmptyState>
      )}
      {data && goals.length > 0 && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <StatCard
                label="Odłożono łącznie"
                value={currency.format(summary.saved)}
                hint={`${summary.progress}% z ${currency.format(summary.target)}`}
                tone="success"
                icon="💰"
              />
            </div>
            <div className="col-6 col-md-4">
              <StatCard label="Osiągnięte cele" value={`${doneCount} / ${goals.length}`} tone="primary" icon="🏆" />
            </div>
            <div className="col-6 col-md-4">
              <StatCard
                label="Potrzeba miesięcznie"
                value={currency.format(monthlyNeeded)}
                hint="aby zdążyć z aktywnymi celami"
                tone="warning"
                icon="📅"
              />
            </div>
          </div>
          <div className="row g-3">
            {goals.map((goal) => (
              <div className="col-12 col-md-6 col-xl-4" key={goal.id}>
                <GoalCard goal={goal} onEdit={crud.openEdit} onDelete={crud.askDelete} />
              </div>
            ))}
          </div>
        </>
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
