"use client";

import Link from "next/link";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { schedulesService } from "@/lib/services/schedules.service";
import type { ScheduleListItem } from "@/lib/types/schedules";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatRupiah, hhmm } from "@/lib/utils/format";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function StatusBadge({ status }: { status: string }) {
  // sederhana aja
  const variant =
    status === "Tes Sedang Berlangsung"
      ? "destructive"
      : status === "Tes Telah Selesai"
      ? "secondary"
      : "default";

  return <Badge variant={variant as "default" | "secondary" | "destructive"}>{status}</Badge>;
}

export function SchedulesTable() {
  const q = useQuery({
    queryKey: [API_ENDPOINTS.SCHEDULES.BASE],
    queryFn: () => schedulesService.list(),
  });

  const rows: ScheduleListItem[] = q.data ?? [];

  if (q.isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (q.isError) return <p className="text-sm text-destructive">Gagal load schedules</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jam Mulai</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Paket Soal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Detail</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-sm text-muted-foreground">
                Tidak ada jadwal
              </TableCell>
            </TableRow>
          ) : (
            rows.map((it, idx) => (
              <TableRow key={it.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{it.date}</TableCell>
                <TableCell>{hhmm(it.start_time)}</TableCell>
                <TableCell>{formatRupiah(it.price)}</TableCell>
                <TableCell>{it.is_partner ? "Ya" : "-"}</TableCell>
                <TableCell>{it.capacity}</TableCell>
                <TableCell>{it.package?.name ?? "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={it.status} />
                </TableCell>
                <TableCell className="text-right">
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
  );
}
