"use client"

import * as React from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { API_ENDPOINTS } from "@/lib/api/endpoints"
import { partnersService } from "@/lib/services/partners.service"
import type { PartnerListItem } from "@/lib/types/partners"

function useDebouncedValue<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay)
    return () => window.clearTimeout(t)
  }, [value, delay])
  return v
}

export function usePartnersQuery(opts: {
  enabled: boolean
  q: string
  limit?: number
}) {
  const debouncedQ = useDebouncedValue(opts.q, 300)

  const params = React.useMemo(
    () => ({
      q: debouncedQ.trim() ? debouncedQ.trim() : undefined,
      limit: opts.limit ?? 50,
    }),
    [debouncedQ, opts.limit]
  )

  const qPartners = useQuery<PartnerListItem[]>({
    queryKey: [API_ENDPOINTS.PARTNERS.BASE, params],
    queryFn: () => partnersService.list(params),
    enabled: opts.enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })

  const partners = React.useMemo(
    () => (qPartners.data ?? []).filter((p) => p.is_active !== false),
    [qPartners.data]
  )

  return { qPartners, partners }
}
