import { useState, useEffect } from 'react';
import client from '../api/client';

export function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    client.get(url)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return { data, loading, error };
}
