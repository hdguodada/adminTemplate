import { useCallback, useState } from 'react';
import { getRoles } from '@/services/account';

export default () => {
  const [roles, setRoles] = useState<Account.Role[]>([]);
  const queryRoles = useCallback(async (params?: { [key: string]: any }) => {
    const r = await getRoles(params);
    setRoles(r.data);
    return r;
  }, []);

  return {
    roles,
    queryRoles,
  };
};
