import { useCallback } from 'react';
import { budgetsApi, transactionsApi } from '../api/client';
import BudgetCard from '../components/BudgetCard';
import ConfirmDialog from '../components/ConfirmDialog';
import FormCard from '../components/FormCard';
import BudgetForm from '../components/forms/BudgetForm';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import EmptyState from '../components/ui/EmptyState';
import MonthSelect from '../components/ui/MonthSelect';
import ProgressBar from '../components/ui/ProgressBar';
import { BUDGET_TONES } from '../components/ui/tones';
import { budgetTotals, budgetUsage } from '../domain/budgets';
import { useApiData } from '../hooks/useApiData';
import { useCrudPage } from '../hooks/useCrudPage';
import { useMonthSelection } from '../hooks/useMonthSelection';
import { currency, formatMonth } from '../utils/format';

const labels = {
  created: 'Budżet został dodany.',
  updated: 'Limit budżetu został zaktualizowany.',
  deleted: 'Budżet został usunięty.',
};

const NO_DATA = [[], []];

function BudgetsPage() {
  const loadData = useCallback(() => Promise.all([budgetsApi.list(), transactionsApi.list()]), []);
  const { data, loading, error, reload } = useApiData(loadData);
  const crud = useCrudPage(budgetsApi, reload, labels);
  const [budgetList, transactions] = data ?? NO_DATA;
  const { months, month, setMonth } = useMonthSelection(transactions);

  const budgets = budgetUsage(budgetList, transactions, month).sort((a, b) => b.usage - a.usage);
  const summary = budgetTotals(budgets);
  const otherCategories = budgets.filter((b) => b.id !== crud.form?.item?.id).map((b) => b.category);
  const exceededCount = budgets.filter((b) => b.remaining < 0).length;

  return (
    <section>
      <PageHeader title="Budżety" subtitle="Miesięczne limity wydatków w kategoriach" refreshing={loading && data}>
        {data && <MonthSelect months={months} value={month} onChange={setMonth} />}
        {!crud.form && (
          <button type="button" className="btn btn-primary" onClick={crud.openCreate} disabled={!data}>
            + Dodaj budżet
          </button>
        )}
      </PageHeader>

      {crud.form && (
        <FormCard title={crud.form.item ? `Edycja budżetu: ${crud.form.item.category}` : 'Nowy budżet'}>
          <BudgetForm
            key={crud.form.item?.id ?? 'new'}
            budget={crud.form.item}
            existingCategories={otherCategories}
            onSubmit={crud.save}
            onCancel={crud.closeForm}
          />
        </FormCard>
      )}

      <PageState loading={loading} error={error} hasData={Boolean(data)} onRetry={reload} />
      {data && budgets.length === 0 && (
        <EmptyState icon="🎯" title="Brak budżetów">Ustal limit dla kategorii, aby kontrolować wydatki.</EmptyState>
      )}
      {data && budgets.length > 0 && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-2">
                <span className="fw-semibold">Wykorzystanie budżetu · {formatMonth(month)}</span>
                <span>
                  <strong>{currency.format(summary.spent)}</strong>
                  <span className="text-body-secondary"> / {currency.format(summary.limit)}</span>
                </span>
              </div>
              <ProgressBar
                value={summary.usage}
                tone={BUDGET_TONES[summary.status].tone}
                height="1.25rem"
                showValue
                label="Łączne wykorzystanie budżetu"
              />
              <div className="small text-body-secondary mt-2">
                {exceededCount > 0
                  ? `Przekroczone limity: ${exceededCount} z ${budgets.length}.`
                  : 'Wszystkie kategorie mieszczą się w limitach.'}
              </div>
            </div>
          </div>

          <div className="row g-3">
            {budgets.map((budget) => (
              <div className="col-12 col-md-6 col-xl-4" key={budget.id}>
                <BudgetCard budget={budget} onEdit={crud.openEdit} onDelete={crud.askDelete} />
              </div>
            ))}
          </div>
        </>
      )}

      {crud.toDelete && (
        <ConfirmDialog
          title="Usunąć budżet?"
          message={`Budżet dla kategorii „${crud.toDelete.category}” zostanie usunięty. Transakcje z tej kategorii pozostaną.`}
          onConfirm={crud.confirmDelete}
          onCancel={crud.cancelDelete}
        />
      )}
    </section>
  );
}

export default BudgetsPage;
