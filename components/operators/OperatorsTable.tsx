"use client";

import Link from "next/link";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  operatorsService,
  type ListOperatorsParams,
} from "@/lib/services/operators.service";
import type { OperatorListItem } from "@/lib/types/operators";
import type { PaginatedResponse } from "@/lib/types/pagination";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function ActiveBadge({ active }: { active?: boolean | null }) {
  if (active === false) return <Badge variant="secondary">Nonaktif</Badge>;
  return <Badge variant="default">Aktif</Badge>;
}

function buildPages(current: number, last: number) {
  const total = Math.max(1, last);
  const cur = Math.min(Math.max(1, current), total);
  const windowSize = 1;

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const start = Math.max(2, cur - windowSize);
  const end = Math.min(total - 1, cur + windowSize);

  const result: Array<number | "ellipsis"> = [1];
  if (start > 2) result.push("ellipsis");
  for (let p = start; p <= end; p++) result.push(p);
  if (end < total - 1) result.push("ellipsis");
  result.push(total);

  return result;
}

export function OperatorsTable() {
  const [qText, setQText] = React.useState("");
  const [perPage, setPerPage] = React.useState(20);
  const [page, setPage] = React.useState(1);

  const qDebounced = useDebouncedValue(qText, 350);

  React.useEffect(() => {
    setPage(1);
  }, [qDebounced, perPage]);

  const params: ListOperatorsParams = React.useMemo(
    () => ({
      q: qDebounced.trim() || undefined,
      per_page: perPage,
      page,
    }),
    [qDebounced, perPage, page]
  );

  const qOperators = useQuery<PaginatedResponse<OperatorListItem>>({
    queryKey: [API_ENDPOINTS.ADMIN.OPERATORS, params],
    queryFn: () => operatorsService.list(params),
  });

  const res = qOperators.data;
  const rows = res?.data ?? [];
  const lastPage = res?.last_page ?? 1;
  const canPrev = page > 1;
  const canNext = page < lastPage;
  const pages = React.useMemo(
    () => buildPages(page, lastPage),
    [page, lastPage]
  );

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    if (qDebounced.trim()) sp.set("q", qDebounced.trim());
    if (perPage !== 20) sp.set("per_page", String(perPage));
    if (p !== 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs
      ? `/dashboard/admin/operators?${qs}`
      : `/dashboard/admin/operators`;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full gap-2 md:max-w-md">
          <Input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Cari operator (nama / email)"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setQText("");
              setPage(1);
            }}
          >
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per halaman</span>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
          >
            {[10, 20, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-15">No</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  {qOperators.isLoading ? "Memuat..." : "Data tidak ditemukan"}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((it, idx) => (
                <TableRow key={it.id}>
                  <TableCell>{(page - 1) * perPage + (idx + 1)}</TableCell>
                  <TableCell>{it.id}</TableCell>
                  <TableCell>{it.name}</TableCell>
                  <TableCell>{it.email}</TableCell>
                  <TableCell>
                    <ActiveBadge active={it.is_active} />
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      {/* ganti route detail sesuai yang kamu buat */}
                      <Link href={`/dashboard/admin/operators/${it.id}`}>
                        Detail
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          {res ? (
            <>
              Menampilkan{" "}
              <span className="font-medium text-foreground">
                {res.from ?? 0}
              </span>
              –
              <span className="font-medium text-foreground">{res.to ?? 0}</span>{" "}
              dari{" "}
              <span className="font-medium text-foreground">
                {res.total ?? 0}
              </span>
            </>
          ) : (
            <span />
          )}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={hrefFor(Math.max(1, page - 1))}
                onClick={(e) => {
                  e.preventDefault();
                  if (!canPrev || qOperators.isFetching) return;
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={
                  !canPrev || qOperators.isFetching
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>

            {pages.map((p, i) =>
              p === "ellipsis" ? (
                <PaginationItem key={`el-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={hrefFor(p)}
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      if (qOperators.isFetching) return;
                      setPage(p);
                    }}
                  >
                    {String(p)}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href={hrefFor(Math.min(lastPage, page + 1))}
                onClick={(e) => {
                  e.preventDefault();
                  if (!canNext || qOperators.isFetching) return;
                  setPage((p) => Math.min(lastPage, p + 1));
                }}
                className={
                  !canNext || qOperators.isFetching
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
