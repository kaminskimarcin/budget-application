import { useEffect, useState } from 'react';

export function useApiData(loader) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loader()
      .then(setData)
      .catch((err) => setError(err.message));
  }, [loader]);

  return { data, error, loading: data === null && error === null };
}
