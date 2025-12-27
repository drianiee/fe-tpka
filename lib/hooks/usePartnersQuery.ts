// lib/hooks/usePartnersQuery.ts
"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { partnersService } from "@/lib/services/partners.service"
import type { PartnerListItem } from "@/lib/types/partners"
import type { PaginatedResponse } from "@/lib/types/pagination"
import { API_ENDPOINTS } from "@/lib/api/endpoints"

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
  per_page?: number
  page?: number
}) {
  const debouncedQ = useDebouncedValue(opts.q, 300)

  const params = React.useMemo(
    () => ({
      q: debouncedQ.trim() || undefined,
      per_page: opts.per_page ?? 50,
      page: opts.page ?? 1,
    }),
    [debouncedQ, opts.per_page, opts.page]
  )

  const qPartners = useQuery<PaginatedResponse<PartnerListItem>>({
    queryKey: [API_ENDPOINTS.PARTNERS.BASE, params],
    queryFn: () => partnersService.list(params),
    enabled: opts.enabled,
    staleTime: 30_000,
  })

  const partners = React.useMemo<PartnerListItem[]>(() => {
    const raw = qPartners.data?.data ?? []
    return raw.filter((p: PartnerListItem) => p.is_active !== false)
  }, [qPartners.data])

  return { qPartners, partners }
}
