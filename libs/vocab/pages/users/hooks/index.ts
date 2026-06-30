import { useEffect, useState } from 'react';
import { getUsers } from '@/core/api/users';
import { enumData } from '@/core/enums/enumData';
import type { GetUsersDto } from '@/core/api/users/dtos';


export function useUsers(body?: GetUsersDto) {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(new Date().getTime());
  

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, total } = await getUsers({
          pageSize: enumData.PageRequest.PAGE_SIZE,
          pageIndex: enumData.PageRequest.PAGE_INDEX,
          ...(body?.type && { type: body.type }),
          ...(body?.username && { username: body.username }),
          ...(body?.email && { email: body.email }),
          ...(body?.phone && { phone: body.phone }),
          ...(body?.name && { name: body.name }),
        });
        setData(data);
        setTotal(total);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Load users failed');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refresh]);

  return { data, total, loading, error, setRefresh };
}