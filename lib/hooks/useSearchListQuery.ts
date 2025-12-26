// "use client";

// import * as React from "react";
// import { useQuery } from "@tanstack/react-query";

// function useDebouncedValue<T>(value: T, delay = 300) {
//   const [v, setV] = React.useState(value);

//   React.useEffect(() => {
//     const t = setTimeout(() => setV(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);

//   return v;
// }

// export type UseSearchListQueryOptions<T> = {
//   enabled: boolean;
//   q: string;
//   limit?: number;

//   queryKeyBase: string;
//   fetcher: (args: { q: string; limit: number }) => Promise<T[]>;

//   /**
//    * Opsional: transform/filter hasil sebelum dipakai UI
//    * contoh: filter partner yang is_active=true
//    */
//   select?: (items: T[]) => T[];

//   staleTime?: number;
//   debounceMs?: number;
// };

// export function useSearchListQuery<T>(opts: UseSearchListQueryOptions<T>) {
//   const limit = opts.limit ?? 50;
//   const debounceMs = opts.debounceMs ?? 300;
//   const staleTime = opts.staleTime ?? 30_000;

//   const debouncedQ = useDebouncedValue(opts.q, debounceMs);

//   const query = useQuery({
//     queryKey: [opts.queryKeyBase, { q: debouncedQ, limit }],
//     queryFn: () => opts.fetcher({ q: debouncedQ, limit }),
//     enabled: opts.enabled,
//     staleTime,
//   });

//   const items = React.useMemo(() => {
//     const raw = query.data ?? [];
//     return opts.select ? opts.select(raw) : raw;
//   }, [query.data, opts]);

//   return { query, items };
// }
