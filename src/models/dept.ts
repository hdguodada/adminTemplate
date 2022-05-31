import { useCallback, useState } from 'react';
import { getDeps } from '@/services/account';

export default () => {
  const [dep, setDep] = useState<Account.Deps[]>([]);
  const queryDep = useCallback(async (params?: { [key: string]: any }) => {
    const r = await getDeps(params);
    setDep(r.data);
    return r;
  }, []);

  return {
    dep,
    queryDep,
  };
};
