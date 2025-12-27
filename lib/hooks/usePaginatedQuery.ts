"use client"

import * as React from "react"
import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query"

type ParamsObject = Record<string, unknown>

export function usePaginatedQuery<TData, TParams extends ParamsObject>(args: {
  queryKey: QueryKey
  queryFn: (params: TParams) => Promise<TData>
  initialParams: TParams
}) {
  const [params, setParams] = React.useState<TParams>(args.initialParams)

  const query = useQuery<TData>({
    queryKey: [...args.queryKey, params],
    queryFn: () => args.queryFn(params),
    placeholderData: keepPreviousData,
  })

  return { query, params, setParams }
}
