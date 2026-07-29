import { useEffect, useState } from 'react';
import { api } from './api';
import { TOURNAMENTS as DEFAULT_TOURNAMENTS } from '../data/tournaments';

export function useTournaments() {
  const [tournaments, setTournaments] = useState(DEFAULT_TOURNAMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.getTournaments()
      .then((data) => {
        if (!cancelled && Array.isArray(data.tournaments) && data.tournaments.length) {
          setTournaments(data.tournaments);
        }
      })
      .catch(() => {
        /* API offline — keep defaults */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { tournaments, loading };
}
