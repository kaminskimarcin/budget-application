import { getTransactions } from '../api/transactionsApi';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import TransactionList, { TransactionSummary } from '../components/TransactionList';
import { useApiData } from '../hooks/useApiData';

function TransactionsPage() {
  const { data: transactions, loading, error } = useApiData(getTransactions);

  return (
    <section>
      <PageHeader title="Transakcje – październik 2026" />
      <PageState loading={loading} error={error} />
      {transactions && (
        <>
          <TransactionSummary transactions={transactions} />
          <TransactionList transactions={transactions} />
        </>
      )}
    </section>
  );
}

export default TransactionsPage;
