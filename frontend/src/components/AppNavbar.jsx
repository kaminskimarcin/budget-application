import { useState } from 'react';

function AppNavbar({ routes, activePath, theme, onToggleTheme, version }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <nav className="navbar navbar-expand-md app-navbar sticky-top mb-4" data-bs-theme="dark">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2 fw-semibold" href={routes[0].path}>
          <img src="/favicon.svg" alt="" width="28" height="28" />
          Budget Application
        </a>
        <button
          type="button"
          className="navbar-toggler"
          aria-controls="main-nav"
          aria-expanded={expanded}
          aria-label="Przełącz nawigację"
          onClick={() => setExpanded((value) => !value)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div id="main-nav" className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto gap-md-1">
            {routes.map((route) => (
              <li className="nav-item" key={route.path}>
                <a
                  className={`nav-link d-flex align-items-center gap-2 ${route.path === activePath ? 'active' : ''}`}
                  aria-current={route.path === activePath ? 'page' : undefined}
                  href={route.path}
                  onClick={() => setExpanded(false)}
                >
                  <span aria-hidden="true">{route.icon}</span>
                  {route.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-3 py-2 py-md-0">
            <span className="navbar-text small d-none d-lg-inline">wersja {version}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
            >
              {theme === 'dark' ? '☀️ Jasny' : '🌙 Ciemny'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
