import AppNavbar from './components/AppNavbar';
import { useHashRoute } from './hooks/useHashRoute';
import { useTheme } from './hooks/useTheme';
import BudgetsPage from './pages/BudgetsPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import TransactionsPage from './pages/TransactionsPage';

const routes = [
  { path: '#/pulpit', label: 'Pulpit', icon: '📊', component: DashboardPage },
  { path: '#/transakcje', label: 'Transakcje', icon: '💳', component: TransactionsPage },
  { path: '#/budzety', label: 'Budżety', icon: '🎯', component: BudgetsPage },
  { path: '#/cele', label: 'Cele', icon: '🏆', component: GoalsPage },
];

const appVersion = (import.meta.env.VITE_APP_VERSION || 'local').slice(0, 7);
const currentYear = new Date().getFullYear();

function App() {
  const route = useHashRoute(routes);
  const { theme, toggleTheme } = useTheme();
  const ActivePage = route.component;

  return (
    <>
      <AppNavbar routes={routes} activePath={route.path} theme={theme} onToggleTheme={toggleTheme} version={appVersion} />
      <main className="container pb-5">
        <ActivePage key={route.path} />
      </main>
      <footer className="container pb-4 small text-body-secondary text-center">
        Budget Companions · {currentYear}
      </footer>
    </>
  );
}

export default App;
