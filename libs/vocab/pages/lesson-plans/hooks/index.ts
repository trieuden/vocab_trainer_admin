import { useEffect, useState } from 'react';
import { getLessonPlans } from '@/core/api/lesson_plans';
import { enumData } from '@/core/enums/enumData';
import type { GetLessonPlansDto } from '@/core/api/lesson_plans/dtos';

export function useLessonPlans(body?: GetLessonPlansDto) {
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
        const { data, total } = await getLessonPlans({
          pageSize: enumData.PageRequest.PAGE_SIZE,
          pageIndex: enumData.PageRequest.PAGE_INDEX,
          ...(body?.name && { name: body.name }),
          ...(body?.level && { level: body.level }),
        });
        setData(data);
        setTotal(total);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Load lesson plans failed');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [refresh]);

  return { data, total, loading, error, setRefresh };
}
