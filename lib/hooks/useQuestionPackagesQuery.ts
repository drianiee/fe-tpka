// lib/hooks/useQuestionPackagesQuery.ts
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { questionPackagesService } from "@/lib/services/questionPackages.service";
import type { PaginatedResponse } from "@/lib/types/pagination";
import type {
  QuestionPackage,
  ListQuestionPackagesParams,
} from "@/lib/types/question-packages";

function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return v;
}

export type UseQuestionPackagesQueryOpts = {
  enabled?: boolean;
  q: string;
  is_active?: boolean;
  per_page?: number; // ✅ optional
  page?: number;     // ✅ optional
};

export function useQuestionPackagesQuery(opts: UseQuestionPackagesQueryOpts) {
  const debouncedQ = useDebouncedValue(opts.q, 300);

  const params = React.useMemo<ListQuestionPackagesParams>(
    () => ({
      q: debouncedQ.trim() || undefined,
      is_active: opts.is_active,
      per_page: opts.per_page ?? 50, // ✅ default
      page: opts.page ?? 1,          // ✅ default
    }),
    [debouncedQ, opts.is_active, opts.per_page, opts.page]
  );

  const qPkgs = useQuery<PaginatedResponse<QuestionPackage>>({
    queryKey: [API_ENDPOINTS.QUESTION_PACKAGES.BASE, params],
    queryFn: () => questionPackagesService.list(params),
    enabled: opts.enabled ?? true,
    staleTime: 20_000,
  });

  // ✅ ini yang kamu butuhin di dialog: array package
  const packages = React.useMemo<QuestionPackage[]>(() => {
    return qPkgs.data?.data ?? [];
  }, [qPkgs.data]);

  return { qPkgs, packages, params };
}
