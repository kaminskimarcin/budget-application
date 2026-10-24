import { useEffect, useState } from 'react';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import TransactionsPage from './pages/TransactionsPage';

// Prosty routing oparty na hashu (#/budzety), bez dodatkowych zależności.
const pages = [
  { path: '#/transakcje', label: 'Transakcje', component: TransactionsPage },
  { path: '#/budzety', label: 'Budżety', component: BudgetsPage },
  { path: '#/cele', label: 'Cele', component: GoalsPage },
];

function currentPath() {
  return pages.some((page) => page.path === window.location.hash) ? window.location.hash : pages[0].path;
}

function App() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onHashChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const ActivePage = pages.find((page) => page.path === path).component;

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand fw-semibold">Budget Application</span>
          <ul className="navbar-nav me-auto">
            {pages.map((page) => (
              <li className="nav-item" key={page.path}>
                <a className={`nav-link ${page.path === path ? 'active' : ''}`} href={page.path}>
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="navbar-text d-none d-md-inline">Budget Companions · domowy budżet</span>
        </div>
      </nav>
      <main className="container pb-5">
        <ActivePage />
      </main>
    </>
  );
}

export default App;
