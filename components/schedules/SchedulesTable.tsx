"use client";

import Link from "next/link";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { schedulesService } from "@/lib/services/schedules.service";
import type { ScheduleListItem } from "@/lib/types/schedules";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatRupiah, hhmm } from "@/lib/utils/format";
import { StatusBadge } from "@/lib/utils/status";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ================= TABLE ================= */

export function SchedulesTable() {
  const q = useQuery({
    queryKey: [API_ENDPOINTS.SCHEDULES.BASE],
    queryFn: () => schedulesService.list(),
  });

  const rows: ScheduleListItem[] = q.data ?? [];
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-15">No</TableHead>
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
          {rows.map((it, idx) => (
            <TableRow key={it.id}>
              <TableCell>{idx + 1}</TableCell>

              <TableCell>{it.date}</TableCell>

              <TableCell>{hhmm(it.start_time)}</TableCell>

              <TableCell>{formatRupiah(it.price)}</TableCell>

              {/* ✅ PARTNER: nama atau "-" */}
              <TableCell>{it.partner?.name ?? "-"}</TableCell>

              <TableCell>{it.capacity}</TableCell>

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
                  <Link href={`/dashboard/admin/schedules/${it.id}`}>
                    Detail
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
