import { useCallback } from 'react';
import { budgetsApi, transactionsApi } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import FormCard from '../components/FormCard';
import BudgetForm from '../components/forms/BudgetForm';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import { useApiData } from '../hooks/useApiData';
import { useCrudPage } from '../hooks/useCrudPage';
import { currency, percent } from '../utils/format';

const labels = {
  created: 'Budżet został dodany.',
  updated: 'Limit budżetu został zaktualizowany.',
  deleted: 'Budżet został usunięty.',
};

function progressColor(usage) {
  if (usage > 100) return 'bg-danger';
  if (usage >= 80) return 'bg-warning';
  return 'bg-success';
}

function BudgetsPage() {
  const loadData = useCallback(() => Promise.all([budgetsApi.list(), transactionsApi.list()]), []);
  const { data, loading, error, reload } = useApiData(loadData);
  const crud = useCrudPage(budgetsApi, reload, labels);

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
  const otherCategories = budgets.filter((b) => b.id !== crud.form?.item?.id).map((b) => b.category);

  return (
    <section>
      <PageHeader title="Budżety" refreshing={loading && data}>
        {!crud.form && (
          <button type="button" className="btn btn-primary" onClick={crud.openCreate} disabled={!data}>
            Dodaj budżet
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
      {data && budgets.length === 0 && <div className="alert alert-secondary">Brak budżetów.</div>}
      {data && budgets.length > 0 && (
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
                  <div className="card-footer bg-transparent d-flex justify-content-end gap-1">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => crud.openEdit(budget)}>
                      Edytuj
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => crud.askDelete(budget)}>
                      Usuń
                    </button>
                  </div>
                </div>
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
