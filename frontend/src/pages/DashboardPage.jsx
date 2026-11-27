import { useCallback } from 'react';
import { budgetsApi, goalsApi, transactionsApi } from '../api/client';
import CategoryDonut from '../components/charts/CategoryDonut';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import BudgetAlerts from '../components/dashboard/BudgetAlerts';
import GoalsOverview from '../components/dashboard/GoalsOverview';
import KpiRow from '../components/dashboard/KpiRow';
import Panel from '../components/dashboard/Panel';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import PageHeader from '../components/PageHeader';
import PageState from '../components/PageState';
import EmptyState from '../components/ui/EmptyState';
import MonthSelect from '../components/ui/MonthSelect';
import { budgetUsage } from '../domain/budgets';
import { expensesByCategory, inMonth, monthlyTotals } from '../domain/transactions';
import { useApiData } from '../hooks/useApiData';
import { useMonthSelection } from '../hooks/useMonthSelection';
import { formatMonth } from '../utils/format';

const HISTORY_MONTHS = 6;
const MAX_CATEGORIES = 6;
const OTHER_LABEL = 'Pozostałe';
const NO_DATA = [[], [], []];

function DashboardPage() {
  const loadData = useCallback(() => Promise.all([transactionsApi.list(), budgetsApi.list(), goalsApi.list()]), []);
  const { data, loading, error, reload } = useApiData(loadData);
  const [transactions, budgets, goals] = data ?? NO_DATA;
  const { months, month, setMonth } = useMonthSelection(transactions);

  const categories = expensesByCategory(inMonth(transactions, month), MAX_CATEGORIES, OTHER_LABEL);

  return (
    <section>
      <PageHeader title="Pulpit" subtitle="Podsumowanie Twoich finansów" refreshing={loading && data}>
        {data && <MonthSelect months={months} value={month} onChange={setMonth} />}
      </PageHeader>

      <PageState loading={loading} error={error} hasData={Boolean(data)} onRetry={reload} />
      {data && transactions.length === 0 && (
        <EmptyState icon="📊" title="Brak danych do podsumowania">
          Dodaj transakcje w zakładce <a href="#/transakcje">Transakcje</a>, a pulpit wypełni się automatycznie.
        </EmptyState>
      )}
      {data && transactions.length > 0 && (
        <>
          <KpiRow transactions={transactions} month={month} />
          <div className="row g-3 mb-3">
            <div className="col-12 col-xl-7">
              <Panel title={`Przychody i wydatki · ostatnie ${HISTORY_MONTHS} mies.`}>
                <MonthlyBarChart data={monthlyTotals(transactions, month, HISTORY_MONTHS)} />
              </Panel>
            </div>
            <div className="col-12 col-xl-5">
              <Panel title={`Wydatki wg kategorii · ${formatMonth(month)}`}>
                {categories.length > 0 ? (
                  <CategoryDonut data={categories} otherLabel={OTHER_LABEL} />
                ) : (
                  <p className="text-body-secondary small mb-0">Brak wydatków w tym miesiącu.</p>
                )}
              </Panel>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-12 col-lg-4">
              <Panel title="Ostatnie transakcje" action={<a href="#/transakcje" className="small text-decoration-none">Wszystkie →</a>}>
                <RecentTransactions transactions={transactions} />
              </Panel>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Panel title="Budżety do obserwacji" action={<a href="#/budzety" className="small text-decoration-none">Budżety →</a>}>
                <BudgetAlerts budgets={budgetUsage(budgets, transactions, month)} />
              </Panel>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <Panel title="Postęp celów" action={<a href="#/cele" className="small text-decoration-none">Cele →</a>}>
                <GoalsOverview goals={goals} />
              </Panel>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default DashboardPage;
