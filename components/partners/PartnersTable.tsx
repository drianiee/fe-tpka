"use client";

import Link from "next/link";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { partnersService } from "@/lib/services/partners.service";
import type { PartnerListItem } from "@/lib/types/partners";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { StatusBadge } from "@/lib/utils/status";
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

export function PartnersTable() {
  const q = useQuery({
    queryKey: [API_ENDPOINTS.PARTNERS.BASE],
    queryFn: () => partnersService.list(),
  });

  const rows: PartnerListItem[] = q.data ?? [];
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-15">No</TableHead>
            <TableHead>ID Mitra</TableHead>
            <TableHead>Nama Mitra</TableHead>
            <TableHead>Nama PIC</TableHead>
            <TableHead>Email PIC</TableHead>
            <TableHead>Nomor PIC</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Detail</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((it, idx) => (
            <TableRow key={it.id}>
              <TableCell>{idx + 1}</TableCell>

              <TableCell>{it.code}</TableCell>

              <TableCell>{it.name}</TableCell>

              <TableCell>{it.contact_name}</TableCell>

              <TableCell>{it.contact_email}</TableCell>
              <TableCell>{it.contact_phone}</TableCell>
              <TableCell>
                <StatusBadge status={it.is_active} />
              </TableCell>

              <TableCell>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/admin/partners/${it.id}`}>
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
