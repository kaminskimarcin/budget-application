import { useEffect, useState } from 'react';

function resolveRoute(routes) {
  return routes.find((route) => route.path === window.location.hash) ?? routes[0];
}

export function useHashRoute(routes) {
  const [route, setRoute] = useState(() => resolveRoute(routes));

  useEffect(() => {
    const onHashChange = () => {
      setRoute(resolveRoute(routes));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [routes]);

  return route;
}
