import { useMemo, useState } from 'react';
import { transactionsApi } from '../api/client';
import ConfirmDialog from '../components/ConfirmDialog';
import FormCard from '../components/FormCard';
import TransactionForm from '../components/forms/TransactionForm';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import TransactionFilters from '../components/TransactionFilters';
import TransactionList from '../components/TransactionList';
import TransactionSummary from '../components/TransactionSummary';
import EmptyState from '../components/ui/EmptyState';
import { downloadCsv, toCsv } from '../domain/csv';
import { today } from '../domain/dates';
import { EMPTY_QUERY, applyQuery } from '../domain/transactionQuery';
import { useApiData } from '../hooks/useApiData';
import { useCrudPage } from '../hooks/useCrudPage';
import { formatDate } from '../utils/format';

const labels = {
  created: 'Transakcja została dodana.',
  updated: 'Zmiany w transakcji zostały zapisane.',
  deleted: 'Transakcja została usunięta.',
};

const PAGE_SIZE = 15;

const CSV_COLUMNS = [
  { label: 'Data', value: (t) => t.date },
  { label: 'Opis', value: (t) => t.description },
  { label: 'Kategoria', value: (t) => t.category },
  { label: 'Typ', value: (t) => (t.type === 'INCOME' ? 'Przychód' : 'Wydatek') },
  { label: 'Kwota', value: (t) => t.amount.toFixed(2).replace('.', ',') },
];

function TransactionsPage() {
  const { data: transactions, loading, error, reload } = useApiData(transactionsApi.list);
  const crud = useCrudPage(transactionsApi, reload, labels);
  const [query, setQuery] = useState(EMPTY_QUERY);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const all = useMemo(() => transactions ?? [], [transactions]);
  const categories = useMemo(() => [...new Set(all.map((t) => t.category))].sort((a, b) => a.localeCompare(b, 'pl')), [all]);
  const visible = useMemo(() => applyQuery(all, query), [all, query]);

  const shown = visible.slice(0, limit);

  const changeQuery = (nextQuery) => {
    setQuery(nextQuery);
    setLimit(PAGE_SIZE);
  };

  const exportCsv = () => downloadCsv(`transakcje-${today()}.csv`, toCsv(CSV_COLUMNS, visible));

  return (
    <section>
      <PageHeader title="Transakcje" subtitle="Historia przychodów i wydatków" refreshing={loading && transactions}>
        <button type="button" className="btn btn-outline-secondary" onClick={exportCsv} disabled={visible.length === 0}>
          Eksport CSV
        </button>
        {!crud.form && (
          <button type="button" className="btn btn-primary" onClick={crud.openCreate} disabled={!transactions}>
            + Dodaj transakcję
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
      {transactions && all.length === 0 && (
        <EmptyState title="Brak transakcji">Dodaj pierwszą przyciskiem „Dodaj transakcję”.</EmptyState>
      )}
      {transactions && all.length > 0 && (
        <>
          <TransactionSummary transactions={visible} />
          <TransactionFilters
            query={query}
            categories={categories}
            onChange={changeQuery}
            resultCount={visible.length}
            totalCount={all.length}
          />
          {visible.length > 0 ? (
            <>
              <TransactionList transactions={shown} onEdit={crud.openEdit} onDelete={crud.askDelete} />
              {shown.length < visible.length && (
                <div className="text-center mt-3">
                  <button type="button" className="btn btn-outline-primary" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
                    Pokaż więcej ({visible.length - shown.length})
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState icon="🔍" title="Brak wyników">
              Żadna transakcja nie pasuje do wybranych filtrów.
            </EmptyState>
          )}
        </>
      )}

      {crud.toDelete && (
        <ConfirmDialog
          title="Usunąć transakcję?"
          message={`„${crud.toDelete.description}” z dnia ${formatDate(crud.toDelete.date)} zostanie trwale usunięta.`}
          onConfirm={crud.confirmDelete}
          onCancel={crud.cancelDelete}
        />
      )}
    </section>
  );
}

export default TransactionsPage;
