"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { partnersService } from "@/lib/services/partners.service";
import type { PartnerListItem } from "@/lib/types/partners";

function useDebouncedValue<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function usePartnersQuery(opts: {
  enabled: boolean;
  q: string;
  limit?: number;
}) {
  const debouncedQ = useDebouncedValue(opts.q, 300);

  const qPartners = useQuery({
    queryKey: [API_ENDPOINTS.PARTNERS.BASE, { q: debouncedQ, limit: opts.limit ?? 50 }],
    queryFn: () => partnersService.list({ q: debouncedQ, limit: opts.limit ?? 50 }),
    enabled: opts.enabled,
    staleTime: 30_000,
  });

  const partners: PartnerListItem[] = React.useMemo(() => {
    const raw = qPartners.data ?? [];
    return raw.filter((p) => p.is_active !== false);
  }, [qPartners.data]);

  return { qPartners, partners };
}
