import { transactionsApi } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import FormCard from '../components/FormCard';
import TransactionForm from '../components/forms/TransactionForm';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import TransactionList, { TransactionSummary } from '../components/TransactionList';
import { useApiData } from '../hooks/useApiData';
import { useCrudPage } from '../hooks/useCrudPage';

const labels = {
  created: 'Transakcja została dodana.',
  updated: 'Zmiany w transakcji zostały zapisane.',
  deleted: 'Transakcja została usunięta.',
};

function TransactionsPage() {
  const { data: transactions, loading, error, reload } = useApiData(transactionsApi.list);
  const crud = useCrudPage(transactionsApi, reload, labels);
  const categories = [...new Set((transactions ?? []).map((t) => t.category))].sort();

  return (
    <section>
      <PageHeader title="Transakcje" refreshing={loading && transactions}>
        {!crud.form && (
          <button type="button" className="btn btn-primary" onClick={crud.openCreate} disabled={!transactions}>
            Dodaj transakcję
          </button>
        )}
      </PageHeader>

      {crud.form && (
        <FormCard title={crud.form.item ? 'Edycja transakcji' : 'Nowa transakcja'}>
          <TransactionForm
            key={crud.form.item?.id ?? 'new'}
            transaction={crud.form.item}
            categories={categories}
            onSubmit={crud.save}
            onCancel={crud.closeForm}
          />
        </FormCard>
      )}

      <PageState loading={loading} error={error} hasData={Boolean(transactions)} onRetry={reload} />
      {transactions && (
        <>
          <TransactionSummary transactions={transactions} />
          <TransactionList transactions={transactions} onEdit={crud.openEdit} onDelete={crud.askDelete} />
        </>
      )}

      {crud.toDelete && (
        <ConfirmDialog
          title="Usunąć transakcję?"
          message={`„${crud.toDelete.description}” z dnia ${crud.toDelete.date} zostanie trwale usunięta.`}
          onConfirm={crud.confirmDelete}
          onCancel={crud.cancelDelete}
        />
      )}
    </section>
  );
}

export default TransactionsPage;
