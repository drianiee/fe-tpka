"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { questionPackagesService } from "@/lib/services/questionPackages.service";
import type { QuestionPackage } from "@/lib/types/question-packages";

function useDebouncedValue<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function useQuestionPackagesQuery(opts: {
  enabled: boolean;
  q: string;
  limit?: number;
}) {
  const debouncedQ = useDebouncedValue(opts.q, 300);

  const qPkgs = useQuery({
    queryKey: [
      API_ENDPOINTS.QUESTION_PACKAGES.BASE,
      { q: debouncedQ, limit: opts.limit ?? 50 },
    ],
    queryFn: () =>
      questionPackagesService.list({ q: debouncedQ, limit: opts.limit ?? 50 }),
    enabled: opts.enabled,
    staleTime: 30_000,
  });

  const packages: QuestionPackage[] = qPkgs.data ?? [];
  return { qPkgs, packages };
}
