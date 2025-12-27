"use client"

import Link from "next/link"
import * as React from "react"
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { schedulesService } from "@/lib/services/schedules.service"
import type { PaginatedResponse, ScheduleListItem } from "@/lib/types/schedules"
import { API_ENDPOINTS } from "@/lib/api/endpoints"
import { formatRupiah, hhmm } from "@/lib/utils/format"
import { StatusBadge } from "@/lib/utils/status"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DateRangePicker } from "@/components/common/DateRangePicker"

type StatusOption = { label: string; value: string }

const STATUS_OPTIONS: StatusOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Tes Belum Dimulai", value: "belum-dimulai" },
  { label: "Tes Sedang Berlangsung", value: "sedang-berlangsung" },
  { label: "Tes Telah Selesai", value: "telah-selesai" },
]

function toYmd(d?: Date | null) {
  if (!d) return undefined
  return format(d, "yyyy-MM-dd")
}

function buildPages(page: number, lastPage: number) {
  const total = lastPage
  const current = page
  const windowSize = 1

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1) as Array<number | "ellipsis">

  const start = Math.max(2, current - windowSize)
  const end = Math.min(total - 1, current + windowSize)

  const result: Array<number | "ellipsis"> = [1]
  if (start > 2) result.push("ellipsis")
  for (let p = start; p <= end; p++) result.push(p)
  if (end < total - 1) result.push("ellipsis")
  result.push(total)

  return result
}

export function SchedulesTable() {
  const [qText, setQText] = React.useState("")
  const [status, setStatus] = React.useState("")
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)
  const [perPage, setPerPage] = React.useState(10)
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    setPage(1)
  }, [status, range, perPage])

  const params = React.useMemo(() => {
    const q = qText.trim() || undefined
    const date_from = toYmd(range?.from) || undefined
    const date_to = toYmd(range?.to) || undefined
    const s = status || undefined
    return {
      q,
      status: s,
      date_from,
      date_to,
      per_page: perPage,
      page,
    }
  }, [qText, status, range, perPage, page])

  const query = useQuery<PaginatedResponse<ScheduleListItem>>({
    queryKey: [API_ENDPOINTS.SCHEDULES.BASE, params],
    queryFn: () => schedulesService.list(params),
    placeholderData: keepPreviousData,
  })

  const exportMutation = useMutation({
    mutationFn: () =>
      schedulesService.exportExcel({
        q: params.q,
        status: params.status,
        date_from: params.date_from,
        date_to: params.date_to,
      }),
    onSuccess: (res) => {
      if (res?.download_url) window.open(res.download_url, "_blank", "noopener,noreferrer")
    },
  })

  const res = query.data
  const rows = res?.data ?? []
  const lastPage = res?.last_page ?? 1
  const canPrev = page > 1
  const canNext = page < lastPage
  const pages = buildPages(page, lastPage)
  const busy = query.isFetching || exportMutation.isPending

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <Input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Cari mitra (partner)"
            className="lg:w-[260px]"
          />

          <select
            className="h-9 rounded-md border bg-background px-3 text-sm lg:w-[220px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <DateRangePicker value={range} onChange={setRange} />

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Per halaman</span>
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => {
              setQText("")
              setStatus("")
              setRange(undefined)
              setPerPage(10)
              setPage(1)
            }}
          >
            Reset
          </Button>

          <Button
            type="button"
            disabled={busy}
            onClick={() => exportMutation.mutate()}
          >
            Export Excel
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">No</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jam Mulai</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Kapasitas</TableHead>
              <TableHead>Paket Soal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  {query.isLoading ? "Memuat..." : "Data tidak ditemukan"}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((it, idx) => (
                <TableRow key={it.id}>
                  <TableCell>{(page - 1) * perPage + (idx + 1)}</TableCell>
                  <TableCell>{it.date}</TableCell>
                  <TableCell>{hhmm(it.start_time)}</TableCell>
                  <TableCell>{formatRupiah(it.price)}</TableCell>
                  <TableCell>{it.partner?.name ?? "-"}</TableCell>
                  <TableCell>
                    {it.current_participants}/{it.capacity}
                  </TableCell>
                  <TableCell>
                    {it.packages.length === 0 ? (
                      "-"
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {it.packages.map((pkg) => (
                          <Badge key={pkg.id} variant="outline">
                            {pkg.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={it.status} />
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/admin/schedules/${it.id}`}>Detail</Link>
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
              Menampilkan <span className="font-medium text-foreground">{res.from ?? 0}</span>–
              <span className="font-medium text-foreground">{res.to ?? 0}</span> dari{" "}
              <span className="font-medium text-foreground">{res.total ?? 0}</span>
            </>
          ) : (
            <span />
          )}
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (!canPrev || busy) return
                  setPage((p) => Math.max(1, p - 1))
                }}
                className={!canPrev || busy ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>

            {pages.map((p, i) => {
              if (p === "ellipsis") {
                return (
                  <PaginationItem key={`el-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault()
                      if (busy) return
                      setPage(p)
                    }}
                  >
                    {String(p)}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (!canNext || busy) return
                  setPage((p) => p + 1)
                }}
                className={!canNext || busy ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
