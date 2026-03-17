import { useEffect, useState } from "react";
import type { BaseEntity } from "../data/baseEntity";
import type { FilterCondition } from "../data/filterCondition";
import type { FilterResult } from "../data/filterResult";
import type { RequestResult } from "../data/requestResult";
import type BaseFilterableApiService from "../networking/baseFilterableApiService";

export default function useEntities<T extends BaseEntity>(
  service: BaseFilterableApiService<T>,
  filterMethod?: (
    pageNumber: number,
    rowsPerPage: number,
    condition?: FilterCondition | undefined
  ) => Promise<RequestResult<FilterResult<T>>> | undefined,
  deps: any[] = []
)
{
  const [entities, setEntities] = useState<FilterResult<T>>();
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() =>
  {
    filter();
  }, [currentPage, rowsPerPage, ...deps]);

  const filter = async (condition?: FilterCondition) =>
  {
    setLoading(true);

    let result;
    if (filterMethod)
    {
      result = await filterMethod(currentPage, rowsPerPage, condition);
    }
    else
    {
      result = await service.Filter(currentPage, rowsPerPage, condition);
    }

    setLoading(false);
    if (result?.data)
    {
      setEntities(result.data);
    }
  };

  const refreash = (newData?: T, deletedId?: number) =>
  {
    if (deletedId)
    {
      setEntities((prev) =>
      {
        if (!prev)
        {
          return prev;
        }
        return { ...prev, count: prev.count - 1, data: prev.data?.filter((b) => b.id !== deletedId) ?? undefined };
      });
    }
    else if (newData)
    {
      setEntities((prev) =>
      {
        if (!prev)
        {
          return prev;
        }

        const exists = prev.data?.find((b) => b.id === newData.id);

        if (exists)
        {
          return { ...prev, data: prev.data?.map((b) => b.id === newData.id ? newData : b) ?? undefined };
        }

        return { ...prev, count: prev.count + 1, data: [newData, ...(prev.data ?? [])] };
      });
    }
  };

  return { entities, refreash, filter, isLoading, currentPage, setCurrentPage, setRowsPerPage };
}
